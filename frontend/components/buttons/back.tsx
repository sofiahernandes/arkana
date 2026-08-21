// Shared back button used to keep return navigation consistent across restricted pages.
import Link from "next/link";

export default function BackHome() {
  return (
    <Link href="/" className="underline text-black fixed p-4">
      <img
        width="30"
        height="30"
        className="text-primary opacity-60 hover:opacity-70"
        src="https://img.icons8.com/glyph-neue/64/circled-left-2.png"
        alt="circled-left-2"
      />
    </Link>
  );
}
