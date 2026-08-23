// Modal used to inspect a contribution record in detail without leaving the current page.
"use client";

import Modal from "@/hooks/use-modal";
import formatBRL from "@/hooks/use-format-currency";
import DeleteContribution from "@/components/delete-contribution-popup";
import type { Contribution } from "@/lib/normalize-contributions";

interface RecordsModalProps {
  data: Contribution;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  /** Only the owning participant may remove a record. */
  canDelete?: boolean;
  onDelete?: () => void;
}

const RecordsModal: React.FC<RecordsModalProps> = ({
  data,
  isOpen,
  setIsOpen,
  canDelete = false,
  onDelete,
}) => {
  if (!data) return null;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const unidade = data.TipoDoacao === "Financeira" ? " reais" : " kg";

  return (
    <Modal isActive={isOpen} onClose={toggleModal}>
      <div className="overflow-y-scroll max-h-300 drop-shadow-2xl items-center relative bg-card rounded-lg">
        <div className="flex max-w-[95vw] flex-col gap-5 z-10 p-6 md:p-10 w-120 text-left">
          <div>
            <div>
              <h2 className="text-xl font-semibold">{data.Fonte}</h2>
              <div>
                <p className="text-base text-muted-foreground mt-2 mb-0">
                  Data da Contribuição -{" "}
                  {new Date(data.DataContribuicao).toLocaleDateString()}{" "}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tipo de Doação
                    </p>
                    <p className="font-semibold">{data.TipoDoacao}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Quantidade</p>
                    <p className="font-semibold">
                      {Intl.NumberFormat("pt-BR").format(data.Quantidade)}
                      {unidade}
                    </p>
                  </div>

                  {data.Meta != null && (
                    <div>
                      <p className="text-sm text-muted-foreground">Meta</p>
                      <p className="font-semibold">
                        {Number.isFinite(data.Meta)
                          ? new Intl.NumberFormat("pt-BR").format(data.Meta)
                          : "-"}
                        {unidade}
                      </p>
                    </div>
                  )}

                  {data.Gastos != null && (
                    <div>
                      <p className="text-sm text-muted-foreground">Gastos</p>
                      <p className="font-semibold"> {formatBRL(data.Gastos)}</p>
                    </div>
                  )}

                  {data.TipoDoacao === "Alimenticia" &&
                  data.alimentos &&
                  data.alimentos.length > 0 ? (
                    <ul className="flex justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {" "}
                          Alimentos arrecadados
                        </p>
                        {data.alimentos.map((a, i) => (
                          <li key={i} className="font-semibold">
                            {" "}
                            {a.NomeAlimento}
                          </li>
                        ))}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {" "}
                          Pontuação
                        </p>
                        {data.alimentos.map((a, i) => (
                          <li key={i} className="font-semibold">
                            <p>
                              {" "}
                              {a.Pontuacao
                                ? a.Pontuacao * data.Quantidade
                                : 0}{" "}
                              ponto(s){" "}
                            </p>
                          </li>
                        ))}
                      </div>
                    </ul>
                  ) : data.TipoDoacao === "Alimenticia" ? (
                    <p>Nenhum alimento registrado.</p>
                  ) : null}

                  {data.comprovante?.Imagem && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Comprovante da doação
                      </p>
                      <a
                        href={data.comprovante.Imagem}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {" "}
                        Abrir comprovante
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {canDelete && (
              <DeleteContribution
                IdContribuicao={data.IdContribuicao}
                TipoDoacao={data.TipoDoacao}
                onDeleted={() => {
                  setIsOpen(false);
                  onDelete?.();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RecordsModal;
