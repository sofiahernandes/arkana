// Shared close button used by modals and dismissible panels.
import { X } from "lucide-react";
import React from "react";

interface Props {
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

const CloseButton: React.FC<Props> = ({ isActive, onClick, className }) => {
  return (
    <button
      className={`absolute top-2 right-2 sm:top-6 sm:right-6 transition-colors hover:text-current-primary ${
        className ?? ""
      }`}
      onClick={onClick}
      aria-label="Fechar modal"
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <X className="h-6 w-6" />
    </button>
  );
};

export default CloseButton;
