// Modal state hook that centralizes open/close behavior for reusable overlay components.
"use client";

import React, {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { tv } from "tailwind-variants";
import Loading from "../components/loading";
import CloseButton from "../components/buttons/close";

interface Properties {
  id?: string;
  isActive: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onLoad?: () => void;
}

const modalClassVariant = tv({
  slots: {
    base: "fixed inset-0 w-full h-full z-[9999] flex items-center justify-center transition-all duration-400 ease-in-out",
    background:
      "absolute top-0 transition-opacity !duration-500 left-0 z-0 w-full h-auto bg-black/70",
    box: "relative z-10 rounded-md border-none shadow-card transition-[opacity,transform] duration-400 ease-in-out w-fit max-w-[1000px] bg-white shadow-card flex flex-col max-h-[90vh]",
    content: "rounded-md overflow-auto",
  },
  variants: {
    showing: {
      true: {
        base: "pointer-events-auto sm:overflow-y-auto bg-black/60",
        background: "opacity-70",
      },
      false: {
        base: "pointer-events-none overflow-y-hidden",
        background: "opacity-0",
      },
    },
    active: {
      false: {
        box: "opacity-0 scale-0",
      },
      true: {
        box: "opacity-100 scale-100",
      },
    },
  },
});

const Modal: React.FC<React.PropsWithChildren<Properties>> = ({
  id,
  isActive,
  isLoading,
  onClose,
  onLoad,
  children,
}) => {
  const [isActiveControl, setActiveControl] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const classNames = modalClassVariant({
    showing: isActiveControl || isLoading,
    active: isActiveControl,
  });

  useEffect(() => {
    if (isActiveControl) {
      containerRef.current?.scrollTo(0, 0);
    }

    document.body.style.overflow = isActiveControl ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isActiveControl]);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      setActiveControl(isActive);
    });
  }, [isActive]);

  useEffect(() => {
    if (onLoad) {
      startTransition(() => {
        onLoad();
      });
    }
  }, [onLoad]);

  return createPortal(
    <div
      id={id}
      className={classNames.base()}
      ref={containerRef}
      aria-hidden={!isActiveControl}
      style={{
        zIndex: 9999,
      }}
    >
      <div className="flex relative rounded-lg justify-center items-center w-full h-full sm:h-auto sm:min-h-full p-5">
        <div className={classNames.background()} />
        {!isActiveControl && isLoading && (
          <div className="flex absolute top-0 left-0 z-10 justify-center items-center w-full h-full">
            <Loading className="text-current-primary" />
          </div>
        )}
        <div className={classNames.box()}>
          <CloseButton
            className="z-20 text-2xl"
            isActive={isActiveControl}
            onClick={onClose}
          />
          <div className={classNames.content()}>{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
