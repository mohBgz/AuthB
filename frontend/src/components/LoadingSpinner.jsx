import React from "react";
import FloatingShape from "./FloatingShape";
import {
  AnimatePresence,
  easeIn,
  easeInOut,
  easeOut,
  motion,
} from "framer-motion";
import { useAuthStore } from "../store/auth-store";

const LoadingSpinner = () => {
  const { isCheckingAuth } = useAuthStore();
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      <FloatingShape
        color="bg-green-500"
        size="w-64 h-64"
        top="-5%"
        left="10%"
        delay={0}
      />

      <FloatingShape
        color="bg-green-500"
        size="w-48 h-48"
        top="70%"
        left="80%"
        delay={5}
      />

      <FloatingShape
        color="bg-green-500"
        size="w-32 h-32"
        top="40%"
        left="-10%"
        delay={15}
      />

      {/* Loading Spinner */}

      <motion.div
        key="spinner"
        animate={{ rotate: [0, 360] }}
        transition={{
          duration: 1,
          ease: "linear",
          repeat: Infinity,
        }}
        className="h-[10%] aspect-square border-white border-t-green-600 border-5 rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
