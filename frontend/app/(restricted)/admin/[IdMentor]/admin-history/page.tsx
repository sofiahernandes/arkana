// Restricted administrator history page. Presents the broader contribution history used by admins.
"use client";

import React, { SetStateAction } from "react";
import RecordsMentor from "@/components/administrator/records-mentor";
import SwitchViewButton from "@/components/buttons/toggle";
import MenuDesktopAdmin from "@/components/administrator/menu";
import MenuMobileAdmin from "@/components/administrator/menu-mobile";
import RenderContributionTableAdmin from "@/components/administrator/contributions-table";
import RenderContributionCardAdmin from "@/components/administrator/contributions-grid";

export default function AdminPageVision() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [buttonSelected, setButtonSelected] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [selectedContribution, setSelectedContribution] =
    React.useState<any>(null);

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
        <MenuDesktopAdmin menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

        <MenuMobileAdmin />

        <main className="w-full max-w-[1300px] p-4 md:mt-0">
          {selectedContribution && (
            <RecordsMentor
              data={selectedContribution}
              isOpen={isOpen}
              setIsOpen={setIsOpen}
            />
          )}
          <div className="flex flex-col gap-2 text-center">
            <h3 className="text-2xl uppercase font-semibold text-primary ">
              Histórico de contribuições de todos os grupos
            </h3>
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
              <RenderContributionTableAdmin
                onSelect={(contribution: any) => {
                  setSelectedContribution(contribution);
                  setIsOpen(true);
                }}
              />
            ) : (
              <RenderContributionCardAdmin
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
