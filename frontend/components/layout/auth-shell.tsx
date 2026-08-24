// The split panel shared by login and sign-up.
// Both pages had rebuilt this frame independently, which is why one ended up
// with a fixed h-120 brand panel and a text-[22px] heading and the other didn't.
import Image from "next/image";

import logoLiderancas from "@/assets/logo-liderancas.png";
import BackHome from "@/components/buttons/back";
import { cn } from "@/lib/utils";

interface AuthShellProps {
  /** Optional heading inside the brand panel. */
  title?: string;
  /** Supporting content under the logo: a prompt, a link, a line of copy. */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function AuthShell({
  title,
  aside,
  children,
  className,
}: AuthShellProps) {
  return (
    <div className="min-h-dvh bg-background">
      <div className="px-4 pt-4 sm:px-6">
        <BackHome />
      </div>

      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center px-4 py-8 sm:px-6">
        <div
          className={cn(
            "grid w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-md md:grid-cols-2",
            className,
          )}
        >
          <section className="flex flex-col items-center justify-center gap-5 bg-primary p-8 text-center text-primary-foreground">
            {title && (
              <h1 className="text-balance font-display text-2xl leading-tight">
                {title}
              </h1>
            )}
            <Image
              src={logoLiderancas}
              alt="Lideranças Empáticas"
              width={144}
              height={144}
              className="h-auto w-28 md:w-36"
              priority
            />
            {aside}
          </section>

          <section className="flex flex-col justify-center p-6 sm:p-8">
            {children}
          </section>
        </div>
      </div>
    </div>
  );
}
