import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ icon: Icon, type, value, ...props }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType =
    type === "password" ? (isPasswordVisible ? "text" : "password") : type;

  return (
    <div className="flex gap-4 items-center px-3 py-2 rounded-lg border bg-gray-900 shadow-green-900 border-gray-800 focus-within:shadow-md transition-all duration-150">
      <div className="flex gap-4 items-center flex-1">
        <Icon className="text-green-500" />
        <input
          required
          type={inputType}
          value={value}
          {...props}
          autoComplete="off"
          className="text-lg text-gray-400 placeholder-gray-600 w-full h-full"
        />
      </div>

      {type === "password" &&
        value &&
        (isPasswordVisible ? (
          <EyeOff
            className="text-green-600 hover:cursor-pointer select-none"
            onClick={() => setIsPasswordVisible(false)}
          />
        ) : (
          <Eye
            className="text-green-600 hover:cursor-pointer  transition-all duration-300  select-none"
            onClick={() => setIsPasswordVisible(true)}
          />
        ))}
    </div>
  );
};

export default Input;
