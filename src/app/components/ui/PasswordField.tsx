"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label?: string;
  placeholder?: string;
  register: ReturnType<any>;
  error?: string;
}

export default function PasswordField({
  label,
  placeholder,
  register,
  error,
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
          {...register}
          className={`
            w-full p-3 pr-10 rounded-lg bg-[#111317] border 
            focus:border-blue-500 transition 
            ${error ? "border-red-500" : "border-gray-700"}
          `}
        />

        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
