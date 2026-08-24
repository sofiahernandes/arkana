// Login form fields for participant access. Keeps validation and input wiring grouped together.
"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

import Field from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  RaUsuario: string;
  setRaUsuario: React.Dispatch<React.SetStateAction<string>>;
  SenhaUsuario: string;
  setSenhaUsuario: React.Dispatch<React.SetStateAction<string>>;
};

const CustomInputs: React.FC<Props> = ({
  RaUsuario,
  setRaUsuario,
  SenhaUsuario,
  setSenhaUsuario,
}) => {
  const [mostrarSenha, setMostrarSenha] = React.useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Field
        label="R.A do aluno-mentor"
        name="RaUsuario"
        type="text"
        inputMode="numeric"
        autoComplete="username"
        placeholder="Insira seu R.A"
        value={RaUsuario}
        onChange={(e) => setRaUsuario(e.target.value)}
        required
      />

      <div className="space-y-1.5">
        <Label htmlFor="field-SenhaUsuario">Senha</Label>
        <div className="flex gap-2">
          <Input
            id="field-SenhaUsuario"
            name="SenhaUsuario"
            type={mostrarSenha ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Insira a senha"
            value={SenhaUsuario}
            onChange={(e) => setSenhaUsuario(e.target.value)}
            required
          />
          {/* Was a `hidden` button pointing at a broken relative image path, so
              there was no way to check a mistyped password. */}
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

export default CustomInputs;
