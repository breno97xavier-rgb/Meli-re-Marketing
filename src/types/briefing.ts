/**
 * Briefing Data Structure & Type Definitions
 */

export type LeadType = 'business' | 'self_employed';

export type PreferredContactMethod = 'whatsapp' | 'phone' | 'email';

export type CallPeriod = 'morning' | 'afternoon';

export interface BriefingState {
  // Step 0: Profile selection
  leadType: LeadType | null;

  // Step 1: Services / Needs
  servicesInterest: string[];

  // Step 2: Current operational situation
  currentSituation: string[];

  // Step 3: Main objectives
  objectives: string[];
  otherObjective?: string;

  // Step 4: Business or Professional Info
  businessName?: string;
  professionalName?: string;
  segmentOrProfession: string;
  websiteOrInstagram?: string;
  notes?: string;

  // Step 5: Contact Preference & Direct Info
  preferredContact: PreferredContactMethod | null;
  contactName: string;
  phone?: string;
  email?: string;
  preferredCallPeriod?: CallPeriod;

  // UTM tracking metadata
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

export const INITIAL_BRIEFING_STATE: BriefingState = {
  leadType: null,
  servicesInterest: [],
  currentSituation: [],
  objectives: [],
  otherObjective: '',
  businessName: '',
  professionalName: '',
  segmentOrProfession: '',
  websiteOrInstagram: '',
  notes: '',
  preferredContact: null,
  contactName: '',
  phone: '',
  email: '',
  preferredCallPeriod: undefined,
};
