import React from "react";

const getStrength = (password) => {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
};

export default function PasswordStrength({ password, isDark }) {
  const strength = getStrength(password);

  const levels = [
    { label: "Weak", color: "bg-green-300" },
    { label: "Fair", color: "bg-green-400" },
    { label: "Good", color: "bg-green-500" },
    { label: "Strong", color: "bg-green-600" },
  ];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-2 mb-1">
        {levels.map((level, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded ${
              index < strength ? level.color : isDark ? "bg-slate-700" : "bg-slate-300"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${isDark ? "text-slate-400" : "text-slate-600"}`}>
        Strength: <span className="font-semibold">{levels[strength - 1]?.label || "Very Weak"}</span>
      </p>
    </div>
  );
}
