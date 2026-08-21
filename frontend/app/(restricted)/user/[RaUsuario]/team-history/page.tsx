// Restricted team history page. Aggregates contribution history from the user team perspective.
"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MenuMobile from "@/components/menu-mobile";
import MenuDesktop from "@/components/menu";
import RenderContributionCard from "@/components/grid-contribution";
import { fetchData } from "@/hooks/fetch-user-profile";
import RecordsModal from "@/components/records-modal";
import SwitchViewButton from "@/components/buttons/toggle";
import RenderContributionTable from "@/components/contributions-table";

export default function TeamHistory() {
  const params = useParams();
  const RaUsuario = Number(params.RaUsuario);
  const [menuOpen, setMenuOpen] = useState(false);
  const [team, setTeam] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [selectedContribution, setSelectedContribution] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Loads the shared team/profile context once so both the heading and the history views use the same source of truth.
  useEffect(() => {
    // Fetches the participant and team metadata that frame the contribution history page.
    const fetchTeamData = async () => {
      const data = await fetchData(RaUsuario);
      setUser(data?.user);
      setTeam(data?.team);
    };
    fetchTeamData();
  }, [RaUsuario]);

  return (
    <div className="min-h-dvh w-full overflow-y-hidden overflow-x-hidden flex flex-col bg-[#f4f3f1]/60">
      <div className="flex flex-col left-0 top-0">
        <header className="py-4 mt-6 relative flex justify-center items-center max-w-100 mx-auto">
          <button
            type="button"
            className={`open-menu hover:text-primary/60 ${
              menuOpen ? "menu-icon hidden" : "menu-icon"
            }`}
            onClick={() => setMenuOpen(true)}
          >
            {" "}
            ☰{" "}
          </button>
        </header>
      </div>

      <div className="w-full flex justify-center pt-4 transition-all duration-300 ease-in-out">
        <MenuDesktop
          menuOpen={menuOpen}
          setMenuOpen={(arg: SetStateAction<boolean>) => setMenuOpen(arg)}
        />

        <MenuMobile />

        <main className="w-full max-w-[1300px] p-4 md:mt-0">
          {selectedContribution && (
            <RecordsModal
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onDeleted={() => {
                setIsOpen(false);
                setSelectedContribution(null);
                setRefreshKey((k) => k + 1);
              }}
            />
          )}
          <div className="flex flex-col gap-2 text-center">
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              Histórico do time {team?.NomeTime && team?.NomeTime}
            </h3>
            <h4 className="text-xl text-primary/80">
              Turma {user?.TurmaUsuario ? user?.TurmaUsuario : "X"}
            </h4>
            <div className="self-end">
              <SwitchViewButton
                buttonSelected={buttonSelected}
                setButtonSelected={(arg: SetStateAction<boolean>) =>
                  setButtonSelected(arg)
                }
              />
            </div>
          </div>
          <div className="mt-2">
            {buttonSelected ? (
              <RenderContributionTable
                refreshKey={refreshKey}
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCard
                refreshKey={refreshKey}
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
