import React from "react";
import clsx from "clsx";

export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}) {
  const baseStyles =
    "px-8 py-3 rounded-full text-lg font-bold transition-all duration-300 focus:outline-none";

  const variants = {
    primary:
      "bg-[#48CAE4] text-slate-900 hover:bg-cyan-400 shadow-xl shadow-cyan-500/30",
    outline: "border-2 border-[#48CAE4] text-[#48CAE4] hover:bg-[#48CAE4]/10",
    danger:
      "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30",
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
