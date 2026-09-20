-- ==============================================================================
-- Migration: 20260920110000_commercial_funnel_six_step_support.sql
-- Description: Hotfix de compatibilidade do Funil Comercial com Briefing de 6 Etapas
-- Phase: INT.2C-H2
-- Status: PREPARADA PARA REVISÃO E EXECUÇÃO MANUAL NO SUPABASE
--
-- Pré-requisito:
--   20260920100000_commercial_funnel_foundation.sql já aplicada.
--
-- Escopo:
--   1. ampliar funnel_events.step_number de 1..5 para 1..6;
--   2. preservar a assinatura e o hardening homologado de ingest_funnel_event;
--   3. suportar o briefing real:
--        1 profile
--        2 services
--        3 current_situation
--        4 objectives
--        5 business_info
--        6 contact
--   4. preservar idempotência: duplicatas únicas retornam false e NÃO renovam
--      last_activity_at;
--   5. não alterar RLS, policies, tabelas fora da constraint indicada,
--      ingest_funnel_session ou submit_funnel_lead.
--
-- Observação:
--   submit_funnel_lead ainda NÃO é utilizado pelo frontend nesta fase.
--   A harmonização do lead_created interno com step 6 será feita na INT.2D,
--   junto da integração transacional sessão -> Lead.
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Constraint de step_number: 1..6
-- ------------------------------------------------------------------------------

ALTER TABLE public.funnel_events
  DROP CONSTRAINT IF EXISTS funnel_events_step_number_check;

ALTER TABLE public.funnel_events
  ADD CONSTRAINT funnel_events_step_number_check
  CHECK (
    step_number IS NULL
    OR (step_number >= 1 AND step_number <= 6)
  );

-- ------------------------------------------------------------------------------
-- 2. RPC public.ingest_funnel_event
-- Mantém assinatura, SECURITY DEFINER, search_path, validações de UUID/path,
-- anti-PII, metadata tipada, idempotência e atualização condicional de atividade.
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.ingest_funnel_event(
  p_session_token text,
  p_event_type text,
  p_path text,
  p_step_number smallint DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_token text;
  v_event_type text;
  v_path text;
  v_session_id uuid;
  v_idempotency_key text := NULL;
  v_now timestamptz := clock_timestamp();
  v_key text;
  v_val jsonb;
  v_str_val text;
  v_event_inserted_id uuid;
  v_clean_metadata jsonb := '{}'::jsonb;
  v_from_step integer;
  v_to_step integer;
BEGIN
  -- 1. Validação e localização da sessão via token UUID canônico
  v_token := trim(COALESCE(p_session_token, ''));

  IF v_token = ''
     OR v_token !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
    RAISE EXCEPTION 'INVALID_SESSION_TOKEN_FORMAT';
  END IF;

  SELECT id
  INTO v_session_id
  FROM public.funnel_sessions
  WHERE session_token = v_token;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'SESSION_NOT_FOUND';
  END IF;

  -- 2. Validação do tipo de evento
  -- lead_created é exclusivamente interno/transacional.
  v_event_type := trim(COALESCE(p_event_type, ''));

  IF v_event_type = 'lead_created' THEN
    RAISE EXCEPTION 'EVENT_NOT_PUBLICLY_INGESTIBLE';
  END IF;

  IF v_event_type NOT IN (
    'landing_view',
    'briefing_cta_click',
    'briefing_view',
    'form_start',
    'form_step_completed',
    'form_submit',
    'whatsapp_click',
    'form_back',
    'form_error'
  ) THEN
    RAISE EXCEPTION 'INVALID_EVENT_TYPE';
  END IF;

  -- 3. Validação do path
  v_path := trim(COALESCE(p_path, ''));

  IF v_path = '' THEN
    RAISE EXCEPTION 'INVALID_PATH';
  END IF;

  IF char_length(v_path) > 500 THEN
    RAISE EXCEPTION 'PATH_EXCEEDS_MAX_LENGTH';
  END IF;

  -- 4. Coerência entre event_type e step_number
  IF v_event_type IN (
    'landing_view',
    'briefing_cta_click',
    'briefing_view',
    'whatsapp_click'
  ) THEN
    IF p_step_number IS NOT NULL THEN
      RAISE EXCEPTION 'STEP_NUMBER_MUST_BE_NULL_FOR_EVENT: %', v_event_type;
    END IF;

  ELSIF v_event_type = 'form_start' THEN
    IF p_step_number IS NOT NULL AND p_step_number <> 1 THEN
      RAISE EXCEPTION 'FORM_START_MUST_BE_STEP_1';
    END IF;

    p_step_number := 1;

  ELSIF v_event_type = 'form_step_completed' THEN
    IF p_step_number IS NULL
       OR p_step_number < 1
       OR p_step_number > 6 THEN
      RAISE EXCEPTION 'FORM_STEP_COMPLETED_STEP_MUST_BE_BETWEEN_1_AND_6';
    END IF;

  ELSIF v_event_type = 'form_submit' THEN
    IF p_step_number IS NULL OR p_step_number <> 6 THEN
      RAISE EXCEPTION 'STEP_NUMBER_MUST_BE_6_FOR_SUBMIT';
    END IF;

  ELSIF v_event_type IN ('form_back', 'form_error') THEN
    IF p_step_number IS NOT NULL
       AND (p_step_number < 1 OR p_step_number > 6) THEN
      RAISE EXCEPTION 'INVALID_STEP_NUMBER_FOR_FORM_ACTION';
    END IF;
  END IF;

  -- 5. Metadata deve ser objeto JSON plano.
  IF p_metadata IS NULL THEN
    p_metadata := '{}'::jsonb;
  END IF;

  IF jsonb_typeof(p_metadata) <> 'object' THEN
    RAISE EXCEPTION 'METADATA_MUST_BE_JSON_OBJECT';
  END IF;

  IF p_metadata <> '{}'::jsonb THEN
    FOR v_key, v_val IN
      SELECT *
      FROM jsonb_each(p_metadata)
    LOOP
      -- Anti-PII
      IF lower(v_key) IN (
        'name',
        'email',
        'whatsapp',
        'phone',
        'business_name',
        'professional_name',
        'notes',
        'message',
        'text',
        'contact_name',
        'segment_or_profession',
        'services_interest',
        'current_situation',
        'objectives',
        'website_or_instagram',
        'cpf',
        'cnpj',
        'password',
        'token',
        'secret',
        'card',
        'address'
      ) THEN
        RAISE EXCEPTION 'PII_KEYS_FORBIDDEN_IN_METADATA: %', v_key;
      END IF;

      -- Sem estruturas aninhadas
      IF jsonb_typeof(v_val) IN ('object', 'array') THEN
        RAISE EXCEPTION 'NESTED_STRUCTURES_FORBIDDEN_IN_METADATA: %', v_key;
      END IF;

      -- 5.A landing_view
      IF v_event_type = 'landing_view' THEN
        IF v_key NOT IN ('section') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_LANDING_VIEW: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string'
           OR char_length(v_val#>>'{}') > 100 THEN
          RAISE EXCEPTION 'INVALID_METADATA_VALUE_FOR_SECTION';
        END IF;

      -- 5.B briefing_cta_click
      ELSIF v_event_type = 'briefing_cta_click' THEN
        IF v_key NOT IN ('cta_location', 'service_context') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_CTA_CLICK: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string'
           OR char_length(v_val#>>'{}') > 100 THEN
          RAISE EXCEPTION 'INVALID_METADATA_VALUE_FOR_CTA_CLICK';
        END IF;

      -- 5.C briefing_view
      ELSIF v_event_type = 'briefing_view' THEN
        IF v_key NOT IN ('entry_mode') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_BRIEFING_VIEW: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string' THEN
          RAISE EXCEPTION 'INVALID_ENTRY_MODE_VALUE';
        END IF;

        v_str_val := v_val#>>'{}';

        IF v_str_val NOT IN ('direct', 'cta') THEN
          RAISE EXCEPTION 'INVALID_ENTRY_MODE_VALUE';
        END IF;

      -- 5.D form_start
      ELSIF v_event_type = 'form_start' THEN
        IF v_key NOT IN ('initial_field') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_FORM_START: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string'
           OR char_length(v_val#>>'{}') > 100 THEN
          RAISE EXCEPTION 'INVALID_METADATA_VALUE_FOR_FORM_START';
        END IF;

      -- 5.E form_step_completed
      ELSIF v_event_type = 'form_step_completed' THEN
        IF v_key NOT IN ('step_title') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_STEP_COMPLETED: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string'
           OR char_length(v_val#>>'{}') > 100 THEN
          RAISE EXCEPTION 'INVALID_METADATA_VALUE_FOR_STEP_COMPLETED';
        END IF;

      -- 5.F form_submit
      ELSIF v_event_type = 'form_submit' THEN
        IF v_key NOT IN ('validation_passed') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_FORM_SUBMIT: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'boolean' THEN
          RAISE EXCEPTION 'VALIDATION_PASSED_MUST_BE_BOOLEAN';
        END IF;

      -- 5.G whatsapp_click
      ELSIF v_event_type = 'whatsapp_click' THEN
        IF v_key NOT IN ('cta_location') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_WHATSAPP_CLICK: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'string'
           OR char_length(v_val#>>'{}') > 100 THEN
          RAISE EXCEPTION 'INVALID_METADATA_VALUE_FOR_WHATSAPP_CLICK';
        END IF;

      -- 5.H form_back
      ELSIF v_event_type = 'form_back' THEN
        IF v_key NOT IN ('from_step', 'to_step') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_FORM_BACK: %', v_key;
        END IF;

        IF jsonb_typeof(v_val) <> 'number' THEN
          RAISE EXCEPTION 'STEP_IN_FORM_BACK_MUST_BE_INTEGER';
        END IF;

        -- H4 preservado: rejeita frações em vez de convertê-las silenciosamente.
        IF (v_val#>>'{}') NOT IN ('1', '2', '3', '4', '5', '6') THEN
          RAISE EXCEPTION 'STEP_IN_FORM_BACK_MUST_BE_INTEGER_BETWEEN_1_AND_6';
        END IF;

      -- 5.I form_error
      ELSIF v_event_type = 'form_error' THEN
        IF v_key NOT IN ('error_category', 'field_name_context') THEN
          RAISE EXCEPTION 'INVALID_METADATA_KEY_FOR_FORM_ERROR: %', v_key;
        END IF;

        IF v_key = 'error_category' THEN
          IF jsonb_typeof(v_val) <> 'string' THEN
            RAISE EXCEPTION 'INVALID_ERROR_CATEGORY_VALUE';
          END IF;

          v_str_val := v_val#>>'{}';

          IF v_str_val NOT IN ('validation', 'network', 'server') THEN
            RAISE EXCEPTION 'INVALID_ERROR_CATEGORY_VALUE';
          END IF;

        ELSIF v_key = 'field_name_context' THEN
          IF jsonb_typeof(v_val) <> 'string'
             OR char_length(v_val#>>'{}') > 100 THEN
            RAISE EXCEPTION 'INVALID_FIELD_NAME_CONTEXT_VALUE';
          END IF;
        END IF;
      END IF;
    END LOOP;

    v_clean_metadata := p_metadata;
  END IF;

  -- 6. Validações obrigatórias/coerência de metadata por evento

  IF v_event_type = 'briefing_view' THEN
    IF NOT (v_clean_metadata ? 'entry_mode') THEN
      RAISE EXCEPTION 'ENTRY_MODE_REQUIRED';
    END IF;
  END IF;

  IF v_event_type = 'form_start' THEN
    IF NOT (v_clean_metadata ? 'initial_field') THEN
      RAISE EXCEPTION 'INITIAL_FIELD_REQUIRED';
    END IF;
  END IF;

  IF v_event_type = 'form_step_completed' THEN
    IF NOT (v_clean_metadata ? 'step_title') THEN
      RAISE EXCEPTION 'STEP_TITLE_REQUIRED';
    END IF;

    v_str_val := v_clean_metadata->>'step_title';

    IF NOT (
      (p_step_number = 1 AND v_str_val = 'profile')
      OR (p_step_number = 2 AND v_str_val = 'services')
      OR (p_step_number = 3 AND v_str_val = 'current_situation')
      OR (p_step_number = 4 AND v_str_val = 'objectives')
      OR (p_step_number = 5 AND v_str_val = 'business_info')
      OR (p_step_number = 6 AND v_str_val = 'contact')
    ) THEN
      RAISE EXCEPTION 'INVALID_STEP_TITLE_FOR_STEP';
    END IF;
  END IF;

  IF v_event_type = 'form_back' THEN
    IF NOT (
      v_clean_metadata ? 'from_step'
      AND v_clean_metadata ? 'to_step'
    ) THEN
      RAISE EXCEPTION 'FORM_BACK_STEPS_REQUIRED';
    END IF;

    v_from_step := (v_clean_metadata->>'from_step')::integer;
    v_to_step := (v_clean_metadata->>'to_step')::integer;

    IF NOT (
      (v_from_step = 2 AND v_to_step = 1)
      OR (v_from_step = 3 AND v_to_step = 2)
      OR (v_from_step = 4 AND v_to_step = 3)
      OR (v_from_step = 5 AND v_to_step = 4)
      OR (v_from_step = 6 AND v_to_step = 5)
    ) THEN
      RAISE EXCEPTION 'INVALID_FORM_BACK_TRANSITION';
    END IF;

    IF p_step_number IS NULL OR p_step_number <> v_to_step THEN
      RAISE EXCEPTION 'FORM_BACK_STEP_NUMBER_MUST_MATCH_TO_STEP';
    END IF;
  END IF;

  IF v_event_type = 'form_error' THEN
    IF p_step_number IS NULL THEN
      RAISE EXCEPTION 'FORM_ERROR_STEP_NUMBER_REQUIRED';
    END IF;

    IF NOT (v_clean_metadata ? 'error_category') THEN
      RAISE EXCEPTION 'ERROR_CATEGORY_REQUIRED';
    END IF;
  END IF;

  IF v_event_type = 'form_submit' THEN
    IF NOT (v_clean_metadata ? 'validation_passed') THEN
      RAISE EXCEPTION 'VALIDATION_PASSED_REQUIRED';
    END IF;

    IF jsonb_typeof(v_clean_metadata->'validation_passed') <> 'boolean'
       OR (v_clean_metadata->>'validation_passed')::boolean IS NOT TRUE THEN
      RAISE EXCEPTION 'VALIDATION_PASSED_MUST_BE_TRUE';
    END IF;
  END IF;

  -- 7. Idempotency keys derivadas no servidor
  IF v_event_type = 'landing_view' THEN
    v_idempotency_key := 'landing_view';

  ELSIF v_event_type = 'briefing_view' THEN
    v_idempotency_key := 'briefing_view';

  ELSIF v_event_type = 'form_start' THEN
    v_idempotency_key := 'form_start';

  ELSIF v_event_type = 'form_step_completed' THEN
    v_idempotency_key := 'step_' || p_step_number::text;

  ELSE
    -- Eventos repetíveis:
    -- briefing_cta_click, form_submit, whatsapp_click, form_back, form_error
    v_idempotency_key := NULL;
  END IF;

  -- 8. Inserção e atualização de atividade
  IF v_idempotency_key IS NOT NULL THEN
    INSERT INTO public.funnel_events (
      session_id,
      event_type,
      step_number,
      path,
      metadata,
      idempotency_key,
      created_at
    ) VALUES (
      v_session_id,
      v_event_type,
      p_step_number,
      v_path,
      v_clean_metadata,
      v_idempotency_key,
      v_now
    )
    ON CONFLICT (session_id, idempotency_key) DO NOTHING
    RETURNING id INTO v_event_inserted_id;

    -- Evento único duplicado: não renova atividade.
    IF v_event_inserted_id IS NULL THEN
      RETURN false;
    END IF;

    UPDATE public.funnel_sessions
    SET
      last_activity_at = v_now,
      updated_at = v_now
    WHERE id = v_session_id;

    RETURN true;
  END IF;

  -- Eventos repetíveis
  INSERT INTO public.funnel_events (
    session_id,
    event_type,
    step_number,
    path,
    metadata,
    idempotency_key,
    created_at
  ) VALUES (
    v_session_id,
    v_event_type,
    p_step_number,
    v_path,
    v_clean_metadata,
    NULL,
    v_now
  );

  UPDATE public.funnel_sessions
  SET
    last_activity_at = v_now,
    updated_at = v_now
  WHERE id = v_session_id;

  RETURN true;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. Permissões da RPC: preservar postura mínima
-- ------------------------------------------------------------------------------

REVOKE ALL
ON FUNCTION public.ingest_funnel_event(text, text, text, smallint, jsonb)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.ingest_funnel_event(text, text, text, smallint, jsonb)
TO anon, authenticated, service_role;

COMMENT ON FUNCTION public.ingest_funnel_event(text, text, text, smallint, jsonb)
IS 'Registra evento comportamental anônimo com allowlist estrita, metadata sem PII, idempotência server-side e suporte ao briefing comercial de 6 etapas.';

COMMIT;
