import growvibeLogo from "@/assets/growvibe-logo.png";

/**
 * Brand logo with a circular white plate so the colorful mark stays
 * legible on any background (dark sidebars, hero banners, etc).
 */
export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <span
      className={`inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full bg-white p-0.5 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <img
        src={growvibeLogo}
        alt="GrowVibe Ads Solution"
        className="h-full w-full object-contain"
        loading="eager"
      />
    </span>
  );
}

/** Square-rounded variant (kept for callers that prefer a soft square). */
export function LogoMark({ className = "h-10" }: { className?: string }) {
  return (
    <span
      className={`inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-0.5 shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <img
        src={growvibeLogo}
        alt="GrowVibe Ads Solution"
        className="h-full w-full object-contain"
        loading="eager"
      />
    </span>
  );
}
