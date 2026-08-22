// Administrator login form used for staff authentication.
"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  EmailMentor: string;
  setEmailMentor: React.Dispatch<React.SetStateAction<string>>;
  SenhaMentor: string;
  setSenhaMentor: React.Dispatch<React.SetStateAction<string>>;
};

const MentorInputs: React.FC<Props> = ({
  EmailMentor,
  setEmailMentor,
  SenhaMentor,
  setSenhaMentor,
}) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Email"
        name="EmailMentor"
        type="email"
        autoComplete="username"
        placeholder="Insira o email institucional"
        value={EmailMentor}
        onChange={(e) => setEmailMentor(e.target.value)}
        required
      />

      <div className="space-y-1.5">
        <Label htmlFor="field-SenhaMentor">Senha</Label>
        <div className="flex gap-2">
          <Input
            id="field-SenhaMentor"
            name="SenhaMentor"
            type={mostrarSenha ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Insira a senha"
            value={SenhaMentor}
            onChange={(e) => setSenhaMentor(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setMostrarSenha((visivel) => !visivel)}
            aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={mostrarSenha}
          >
            {mostrarSenha ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorInputs;
