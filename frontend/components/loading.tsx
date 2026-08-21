// Loading state component displayed while asynchronous page data is still being resolved.
import React from "react";

interface Properties {
  className?: string;
}

const Loading: React.FC<Properties> = ({ className }) => {
  return (
    <div
      className={`relative w-16 h-16 animate-spin border-solid border-[transparent] border-t-current rounded-full border-[0.375rem] ${
        className ?? ""
      }`}
    />
  );
};

export default Loading;
