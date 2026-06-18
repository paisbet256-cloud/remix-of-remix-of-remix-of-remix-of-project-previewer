/**
 * Brand logo. Uses an inline placeholder mark so the app builds without
 * a binary asset. Replace by saving your logo at
 * `src/assets/growvibe-logo.png` and switching to:
 *   import logo from "@/assets/growvibe-logo.png";
 *   <img src={logo} ... />
 */
export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <span
      className={`inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <span className="text-[0.55em] tracking-tight">GV</span>
    </span>
  );
}

export function LogoMark({ className = "h-10" }: { className?: string }) {
  return (
    <span
      className={`inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-white font-bold shadow-sm ring-1 ring-black/5 ${className}`}
    >
      <span className="text-[0.55em] tracking-tight">GV</span>
    </span>
  );
}
