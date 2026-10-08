import Link from "next/link";
import Image from "next/image";

// Official mark (design/visual-pack-v1/assets/brand/Logo_Oficial_AtlasHub.png, resized only; circular mask
// removes the square background without touching the symbol geometry).
export function Symbol({ size = 40, priority = false }: { size?: number; priority?: boolean }) {
  return <Image className="vp-symbol" src={size > 128 ? "/brand/atlashub-symbol-512.webp" : "/brand/atlashub-symbol-128.png"} width={size} height={size} alt="" priority={priority} />;
}
export default function Brand({ size = 40 }: { size?: number }) {
  return (
    <Link className="vp-brand" href="/" aria-label="AtlasHub.SI — início">
      <Symbol size={size} priority />
      <span>AtlasHub<i>.SI</i></span>
    </Link>
  );
}
