// Desktop navigation menu for restricted participant pages.
import { SetStateAction, useState, useEffect } from "react";
import Link from "next/link";
import React from "react";
import { useParams } from "next/navigation";
import { X } from "lucide-react";

interface Properties {
  menuOpen: Boolean;
  setMenuOpen: (arg: SetStateAction<boolean>) => void;
}

export default function MenuDesktop({ menuOpen, setMenuOpen }: Properties) {
  const params = useParams();
  const [RaUsuario, setRaUsuario] = useState<number | null>(null);

  useEffect(() => {
    if (params?.RaUsuario) {
      setRaUsuario(Number(params?.RaUsuario));
    }
  }, [params]);
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

        <Link href={`/user/${RaUsuario}/user-profile`}>
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Meu perfil
          </button>
        </Link>

        <Link href={`/user/${RaUsuario}/new-contribution`}>
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Cadastrar novas contribuições
          </button>
        </Link>

        <Link href={`/user/${RaUsuario}/team-history`}>
          <button className="p-2 my-2 rounded-lg bg-gray-50 hover:bg-gray-150 border border-gray-200 shadow-md transition-colors duration-300 cursor-pointer text-base w-59">
            Histórico de contribuições
          </button>
        </Link>
      </nav>
    </aside>
  );
}
