import growvibeLogo from "@/assets/growvibe-logo.png.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src={growvibeLogo.url}
      alt="GrowVibe Ads Solution"
      className={`object-contain ${className}`}
    />
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={growvibeLogo.url}
      alt="GrowVibe Ads Solution"
      className={`object-contain rounded-xl bg-white ${className}`}
    />
  );
}
