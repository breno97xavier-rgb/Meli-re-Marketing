import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface MeliereOrganicElementProps {
  className?: string;
  scrollProgress?: number; // 0 to 1 during HeroIntro sequence
  interactive?: boolean;
}

/**
 * Melière Marketing — Abstract Organic Fluid Membrane Element
 * 
 * Conceptual design:
 * An abstract architectural vessel containing a living, viscous coral liquid mass (#F15A3C).
 * Asymmetric, non-periodic multi-harmonic viscosity calculation with inertia and mass.
 * Subtly reacts to mouse position (mass center displacement) on desktop.
 * Expands directly in fullscreen viewport resolution without rectangular bounding box clipping.
 */
export const MeliereOrganicElement: React.FC<MeliereOrganicElementProps> = ({
  className = '',
  scrollProgress = 0,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  // Mouse reaction state (smooth interpolation with viscosity dampening)
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Keep scroll progress accessible in render loop without re-triggering full effect
  const scrollProgressRef = useRef(scrollProgress);
  scrollProgressRef.current = scrollProgress;

  // Time accumulator
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const handleResize = () => {
      if (!canvas) return;
      // Use true viewport dimensions to guarantee no internal container clipping
      width = window.innerWidth;
      height = window.innerHeight;

      // Handle retina displays with capped dpr (max 2) for smooth 60fps performance
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    // Mouse tracking for subtle desktop mass shift
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || reducedMotion) return;
      if (width === 0 || height === 0) return;
      // Normalized from -1 to 1 relative to window center
      const x = (e.clientX / width - 0.5) * 2;
      const y = (e.clientY / height - 0.5) * 2;
      mouseTargetRef.current = {
        x: Math.max(-1, Math.min(1, x)),
        y: Math.max(-1, Math.min(1, y)),
      };
    };

    const handleMouseLeave = () => {
      mouseTargetRef.current = { x: 0, y: 0 };
    };

    if (interactive && !reducedMotion) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Non-periodic internal circulating mass vortexes with incommensurate frequencies
    const vortexes = [
      { radiusRatio: 0.42, speedX: 0.00063, speedY: 0.00047, phaseX: 0.1, phaseY: 1.4, weight: 1.0 },
      { radiusRatio: 0.31, speedX: -0.00085, speedY: 0.00071, phaseX: 2.3, phaseY: 0.7, weight: 0.8 },
      { radiusRatio: 0.24, speedX: 0.00049, speedY: -0.00092, phaseX: 4.1, phaseY: 3.5, weight: 0.65 },
      { radiusRatio: 0.19, speedX: -0.00115, speedY: 0.00058, phaseX: 1.8, phaseY: 5.1, weight: 0.5 },
    ];

    let lastTimestamp = performance.now();

    // Main animation loop
    const render = (now: number) => {
      const dt = Math.min(now - lastTimestamp, 32); // cap delta time for stability
      lastTimestamp = now;

      if (reducedMotion) {
        drawStaticState(ctx, width, height);
        return;
      }

      const p = scrollProgressRef.current;

      if (isVisibleRef.current && width > 0 && height > 0) {
        timeRef.current += dt;
        const t = timeRef.current;

        // Smooth viscosity inertia on mouse
        mouseCurrentRef.current.x +=
          (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.035;
        mouseCurrentRef.current.y +=
          (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.035;

        // Clear entire viewport canvas buffer with transparent alpha
        ctx.clearRect(0, 0, width, height);

        const centerX = width * 0.5 + mouseCurrentRef.current.x * (width * 0.025);
        const centerY = height * 0.5 + mouseCurrentRef.current.y * (height * 0.025);
        
        // Base radius at rest (state 1 and state 2)
        const minDim = Math.min(width, height);
        const initialBaseRadius = width < 640 ? minDim * 0.36 : Math.min(minDim * 0.34, 260);

        // Organic expansion curve during state 3 (p: 0.52 -> 0.80)
        const expandProgress = Math.min(1, Math.max(0, (p - 0.52) / 0.26));
        const smoothExpand = expandProgress * expandProgress * (3 - 2 * expandProgress); // smoothstep

        // Max radius necessary to cleanly engulf the entire viewport corners
        const maxRadiusNeeded = Math.hypot(width * 0.5, height * 0.5) * 1.35;
        const currentRadius = initialBaseRadius + (maxRadiusNeeded - initialBaseRadius) * smoothExpand;

        // 1. Outer subtle architectural membrane (fades out as expansion starts)
        drawMembrane(ctx, centerX, centerY, currentRadius, t, mouseCurrentRef.current, p, smoothExpand);

        // 2. Viscous asymmetric fluid coral mass (expands without boundary clipping)
        drawViscousMass(ctx, centerX, centerY, currentRadius, t, mouseCurrentRef.current, vortexes, p, smoothExpand);

        // 3. Subtle editorial coordinates & tension accents (fades out early on scroll)
        drawGeometricAccents(ctx, centerX, centerY, currentRadius, t, mouseCurrentRef.current, p);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive && !reducedMotion) {
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [interactive, reducedMotion]);

  // Static fallback for reduced-motion
  const drawStaticState = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    const cx = width * 0.5;
    const cy = height * 0.5;
    const minDim = Math.min(width, height);
    const r = width < 640 ? minDim * 0.36 : Math.min(minDim * 0.34, 260);

    // Outer membrane
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.05, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(237, 238, 238, 0.15)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Coral mass
    const grad = ctx.createRadialGradient(cx - r * 0.2, cy - r * 0.2, r * 0.05, cx, cy, r * 0.95);
    grad.addColorStop(0, '#FF7458');
    grad.addColorStop(0.4, '#F15A3C');
    grad.addColorStop(0.85, '#D64022');
    grad.addColorStop(1, 'rgba(195, 48, 20, 0.95)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  // Draw the subtle architectural membrane
  const drawMembrane = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    t: number,
    mouse: { x: number; y: number },
    scroll: number,
    smoothExpand: number
  ) => {
    const fadeMembrane = Math.max(0, 1 - smoothExpand * 3.0);
    if (fadeMembrane <= 0.01) return;

    ctx.save();

    const points = 36;
    ctx.beginPath();

    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      
      // Incommensurate wave frequencies to avoid rhythmic breathing loops
      const wave1 = Math.sin(angle * 2.7 + t * 0.00045) * (r * 0.035);
      const wave2 = Math.cos(angle * 3.4 - t * 0.00032) * (r * 0.025);
      const wave3 = Math.sin(angle * 1.3 + t * 0.00021) * (r * 0.04);
      const mouseDeform = (Math.cos(angle) * mouse.x + Math.sin(angle) * mouse.y) * (r * 0.04);

      const rad = r * 1.08 + wave1 + wave2 + wave3 + mouseDeform;
      const x = cx + Math.cos(angle) * rad;
      const y = cy + Math.sin(angle) * rad;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();

    // Subtle membrane outline
    const alpha = Math.max(0.02, (0.18 - scroll * 0.12) * fadeMembrane);
    ctx.strokeStyle = `rgba(237, 238, 238, ${alpha})`;
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // Interior subtle light dispersion
    const membraneGrad = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r * 1.15);
    membraneGrad.addColorStop(0, `rgba(241, 90, 60, ${0.06 * fadeMembrane})`);
    membraneGrad.addColorStop(0.8, `rgba(241, 90, 60, ${0.02 * fadeMembrane})`);
    membraneGrad.addColorStop(1, `rgba(237, 238, 238, ${0.03 * fadeMembrane})`);
    ctx.fillStyle = membraneGrad;
    ctx.fill();

    ctx.restore();
  };

  // Draw living, viscous coral liquid mass (asymmetric, fluid inertia, seamless expansion)
  const drawViscousMass = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    baseR: number,
    t: number,
    mouse: { x: number; y: number },
    vortexes: Array<{ radiusRatio: number; speedX: number; speedY: number; phaseX: number; phaseY: number; weight: number }>,
    scroll: number,
    smoothExpand: number
  ) => {
    ctx.save();

    // 24 control vertices for rich asymmetric organic curves
    const segments = 24;
    const vertexPositions: Array<{ x: number; y: number }> = [];

    const effectiveR = baseR;
    const stretchFactorX = 1 + smoothExpand * 0.22;
    const stretchFactorY = 1 + smoothExpand * 0.12;

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      // Incommensurate multi-harmonic frequencies for non-periodic viscous flow
      const h1 = Math.sin(angle * 2.2 + t * 0.00068 + mouse.x * 0.6) * 0.14;
      const h2 = Math.cos(angle * 3.1 - t * 0.00047 + mouse.y * 0.6) * 0.10;
      const h3 = Math.sin(angle * 4.7 + t * 0.00089) * 0.05;
      const h4 = Math.cos(angle * 1.6 + t * 0.00031) * 0.07;
      
      // Fluid sloshing and inertia
      const slosh = (Math.cos(angle) * mouse.x + Math.sin(angle) * mouse.y) * 0.12;

      const totalRadius = effectiveR * (1 + h1 + h2 + h3 + h4 + slosh);
      
      vertexPositions.push({
        x: cx + Math.cos(angle) * totalRadius * stretchFactorX,
        y: cy + Math.sin(angle) * totalRadius * stretchFactorY,
      });
    }

    // Build smooth closed quadratic bezier contour
    ctx.beginPath();
    const len = vertexPositions.length;
    for (let i = 0; i < len; i++) {
      const current = vertexPositions[i];
      const next = vertexPositions[(i + 1) % len];
      const xc = (current.x + next.x) / 2;
      const yc = (current.y + next.y) / 2;

      if (i === 0) {
        ctx.moveTo(xc, yc);
      } else {
        ctx.quadraticCurveTo(current.x, current.y, xc, yc);
      }
    }
    ctx.closePath();

    // Institutional Coral (#F15A3C) multidimensional viscosity gradient
    const fluidGrad = ctx.createRadialGradient(
      cx - effectiveR * 0.2 + mouse.x * 15,
      cy - effectiveR * 0.2 + mouse.y * 15,
      effectiveR * 0.04,
      cx,
      cy,
      effectiveR * 1.25
    );
    fluidGrad.addColorStop(0, '#FF7A5E');
    fluidGrad.addColorStop(0.35, '#F15A3C');
    fluidGrad.addColorStop(0.78, '#D64022');
    fluidGrad.addColorStop(1, 'rgba(180, 42, 16, 0.98)');

    ctx.fillStyle = fluidGrad;
    ctx.fill();

    // Internal fluid refraction highlights & internal vortex reorganization
    ctx.save();
    ctx.clip(); // Clip all internal lighting strictly to fluid body

    vortexes.forEach((v) => {
      const dx = Math.sin(t * v.speedX + v.phaseX) * (effectiveR * 0.38) + mouse.x * 24 * v.weight;
      const dy = Math.cos(t * v.speedY + v.phaseY) * (effectiveR * 0.38) + mouse.y * 24 * v.weight;
      const dr = effectiveR * v.radiusRatio;

      const subGrad = ctx.createRadialGradient(
        cx + dx,
        cy + dy,
        0,
        cx + dx,
        cy + dy,
        dr
      );
      subGrad.addColorStop(0, 'rgba(255, 155, 130, 0.42)');
      subGrad.addColorStop(0.55, 'rgba(241, 90, 60, 0.18)');
      subGrad.addColorStop(1, 'rgba(241, 90, 60, 0)');

      ctx.fillStyle = subGrad;
      ctx.beginPath();
      ctx.arc(cx + dx, cy + dy, dr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Meniscus liquid refraction specular highlight (top-left) - softens during full expansion
    if (smoothExpand < 0.7) {
      const highlightOpacity = (1 - smoothExpand * 1.4) * 0.26;
      ctx.beginPath();
      ctx.arc(
        cx - effectiveR * 0.18,
        cy - effectiveR * 0.22,
        effectiveR * 0.62,
        Math.PI * 1.15,
        Math.PI * 1.78
      );
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0, highlightOpacity)})`;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    ctx.restore(); // end clip

    ctx.restore();
  };

  // Subtle architectural geometry & tension accents
  const drawGeometricAccents = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    r: number,
    t: number,
    mouse: { x: number; y: number },
    scroll: number
  ) => {
    ctx.save();
    const rot = t * 0.00012;
    const fade = Math.max(0, 1 - scroll * 2.2); // Fades out early on scroll

    if (fade <= 0.01) {
      ctx.restore();
      return;
    }

    // Editorial crosshair guide lines
    ctx.strokeStyle = `rgba(237, 238, 238, ${0.07 * fade})`;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 10]);

    // Horizontal coordinate
    ctx.beginPath();
    ctx.moveTo(cx - r * 1.4, cy);
    ctx.lineTo(cx + r * 1.4, cy);
    ctx.stroke();

    // Vertical coordinate
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 1.4);
    ctx.lineTo(cx, cy + r * 1.4);
    ctx.stroke();

    // Perimeter orbital node
    ctx.setLineDash([]);
    const markerAngle = rot * 2.2;
    const markerX = cx + Math.cos(markerAngle) * (r * 1.28);
    const markerY = cy + Math.sin(markerAngle) * (r * 1.28);

    ctx.beginPath();
    ctx.arc(markerX, markerY, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(241, 90, 60, ${0.85 * fade})`;
    ctx.fill();

    ctx.restore();
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full pointer-events-none select-none overflow-visible flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};
