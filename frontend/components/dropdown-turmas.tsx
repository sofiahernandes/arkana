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

const TURMAS = ["1MA", "1MB", "1MC", "1NA", "1NB", "1NC"];

interface Properties {
  turma: string;
  setTurma: React.Dispatch<SetStateAction<string>>;
  /** Id of the element that labels this control — the trigger is a button, so htmlFor does not reach it. */
  labelledBy?: string;
}

const DropdownTurmas = ({ turma, setTurma, labelledBy }: Properties) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-normal"
          aria-labelledby={labelledBy}
        >
          {turma || "Selecionar Turma"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={turma} onValueChange={setTurma}>
          {TURMAS.map((value) => (
            <DropdownMenuRadioItem key={value} value={value}>
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownTurmas;
