import { Link } from "react-router-dom";

function DashboardCard({ to, icon, title, description }) {
  return (
    <Link
      to={to}
      className="
    p-8 rounded-2xl
    bg-white dark:bg-slate-800
    border border-slate-300 dark:border-slate-700
    shadow-sm

    transition-all duration-300 ease-out
    transform will-change-transform

    hover:shadow-2xl
    hover:scale-[1.03]
    hover:bg-[var(--color-sky-aqua-50)]
    dark:hover:bg-slate-700
    hover:border-[#4CCCE6]

    text-left
  "
    >
      <h3 className="text-2xl font-bold mb-3 text-[#1999b3] dark:text-[#4CCCE6] flex items-center gap-2">
        {icon} {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </Link>
  );
}

export default DashboardCard;
