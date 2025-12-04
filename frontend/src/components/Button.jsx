export default function Button({
  children,
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-lg bg-[#4CCCE6] text-black dark:bg-[#137386] dark:text-white font-medium transition-colors duration-300 hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
