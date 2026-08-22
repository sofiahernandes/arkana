// Shared close button used by modals and dismissible panels.
import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  onClick: () => void;
  isActive: boolean;
  className?: string;
}

const CloseButton: React.FC<Props> = ({ isActive, onClick, className }) => {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className={cn("absolute right-3 top-3 sm:right-4 sm:top-4", className)}
      onClick={onClick}
      aria-label="Fechar"
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      <X aria-hidden />
    </Button>
  );
};

export default CloseButton;
