// Shared back button used to keep return navigation consistent across pages.
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BackHome() {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-1.5">
      <Link href="/">
        <ArrowLeft aria-hidden />
        Voltar ao painel
      </Link>
    </Button>
  );
}
