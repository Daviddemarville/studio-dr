"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface PasswordFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PasswordField({
  label,
  placeholder,
  value,
  onChange,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm text-gray-300">{label}</label>
      )}

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 pr-10 rounded-lg bg-[#111317] border border-gray-700
                     focus:border-blue-500 transition"
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
