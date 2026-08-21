// Desktop navigation menu for administrator pages.
import { SetStateAction, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { X } from "lucide-react";

interface Properties {
  menuOpen: Boolean;
  setMenuOpen: (arg: SetStateAction<boolean>) => void;
}

export default function MenuDesktopAdmin({
  menuOpen,
  setMenuOpen,
}: Properties) {
  const params = useParams();
  const [IdMentor, setIdMentor] = useState<string | null>(null);

  // Reads the current admin id from the route so every menu link points back to the active administrator area.
  useEffect(() => {
    if (params?.IdMentor) {
      setIdMentor(params.IdMentor as string);
    }
  }, [params]);

  if (!IdMentor) {
    return (
      <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
        <button className="close-menu" onClick={() => setMenuOpen(false)}>
          <X className="h-6 w-6" />
        </button>
        <nav>
          <p>Carregando...</p>
        </nav>
      </aside>
    );
  }

  return (
    <aside className={`side-menu ${menuOpen ? "open" : ""}`}>
      <button className="close-menu" onClick={() => setMenuOpen(false)}>
        <X className="h-6 w-6" />
      </button>
      <nav>
        <Link href="/">
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Voltar ao Dashboard
          </button>
        </Link>

        <Link href={`/admin/${IdMentor}/admin-profile`}>
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Meu perfil
          </button>
        </Link>

        <Link href={`/admin/${IdMentor}/admin-history`}>
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Histórico de contribuições
          </button>
        </Link>
      </nav>
    </aside>
  );
}
