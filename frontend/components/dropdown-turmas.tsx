// Class selection dropdown used by registration and filtering flows.
"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SetStateAction } from "react";

interface Properties {
  turma: string;
  setTurma: React.Dispatch<SetStateAction<string>>;
}
const DropdownTurmas = ({ turma, setTurma }: Properties) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="border border-[#b4b4b4] hover:bg-primary/40 text-black hover:text-black!"
        asChild
      >
        <Button variant="outline">{turma || "Selecionar Turma"}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 border border-[#b4b4b4]">
        <DropdownMenuRadioGroup value={turma} onValueChange={setTurma}>
          <DropdownMenuRadioItem value="1MA">1MA</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1MB">1MB</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1MC">1MC</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1NA">1NA</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1NB">1NB</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="1NC">1NC</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownTurmas;
