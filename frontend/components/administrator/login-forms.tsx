// Administrator login form used for staff authentication.
import React from "react";

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
    <div>
      <div className="flex flex-col gap-3 items-center">
        <input
          type="text"
          placeholder="Email"
          value={EmailMentor}
          className="w-[80%] bg-[white] border border-gray-300 rounded-lg text-black placeholder-gray-700 px-3 py-1.5 text-base focus:outline-none"
          onChange={(e) => setEmailMentor(e.target.value)}
        />

        <input
          type={mostrarSenha ? "text" : "password"}
          value={SenhaMentor}
          onChange={(e) => setSenhaMentor(e.target.value)}
          className="w-[80%] bg-[white] border border-gray-300 rounded-lg text-black placeholder-gray-700 px-3 py-1.5 text-base focus:outline-none"
          placeholder="Senha"
        />
        <button
          onClick={() => setMostrarSenha(!mostrarSenha)}
          className="hidden rounded-lg"
        >
          {mostrarSenha ? (
            <img src="../assets/EyeClosed.png" />
          ) : (
            <img src="../assets/EyeOpen.png" />
          )}
        </button>
      </div>
    </div>
  );
};
export default MentorInputs;
