import React, { useEffect } from "react";
import {
  AnimatePresence,
  easeInOut,
  easeOut,
  motion,
  spring,
} from "framer-motion";
import { useState, useRef } from "react";
import { Mail, LoaderCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input.jsx";

import { useAuthStore } from "../store/auth-store.js";

const ForgotPassword = () => {
  const { isLoading, forgotPassword } = useAuthStore();

  const emailRef = useRef();
  const isEmailValid = emailRef.current?.checkValidity();

  const [email, setEmail] = useState("");
  const [isSubmited, setIsSubmited] = useState(false);
  useEffect(() => {
    console.log(isSubmited);
  }, [isSubmited]);

  const navigate = useNavigate();
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      await forgotPassword(email);
      setIsSubmited(true);
    } catch (error) {
      setIsSubmited(true);
    }
  };
  return (
    <motion.div
      className="
        relative 
        text-center
        flex flex-col items-center
      bg-gray-800/80 bg-opacity-50
        rounded-2xl p-6
        max-w-md w-full
        overflow-hidden
        pb-20
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      {!isSubmited ? (
        <>
          <div className="pb-5 select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent  ">
            Forgot Password
          </div>
          <div className="text-lg mb-7 border-0 text-white/70">
            Enter your email address and we'll send you a link to reset you
            password
          </div>

          <form
            onSubmit={handleForgotPassword}
            autoComplete="off"
            className="w-full space-y-7"
          >
            <Input
              icon={Mail}
              name="email"
              type="email"
              ref={emailRef}
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button
              type="submit"
              disabled={isLoading || !isEmailValid} // if is loading  or email input  not valid
              className="action-button mb-0"
            >
              {isLoading ? (
                <LoaderCircle className=" w-full  animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        </>
      ) : (
        <div className=" flex flex-col justify-center items-center gap-2">
          <div className="pb-5 select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent  ">
            Check your Email
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: spring,
              stiffness: 500,
              damping: 40,
              duration: 0.3,
            }}
            className="shadow-green-800 shadow-md   mb-5 w-16 h-16 max-w-[80px] max-h-[80px] bg-green-500 rounded-full flex items-center justify-center"
          >
            <Mail className="w-8 h-8 text-white/80" />
          </motion.div>
          <div className=" text-[1.05rem] text-center mb-3 text-white/70 ">
            If an account exists for
            <span className="mx-1 text-green-700">{email}</span>, you will
            receive a password reset link shortly.
          </div>
        </div>
      )}

      <Link
        to="/login"
        className="flex justify-center items-center gap-1.5 transition-all duration-150 hover:text-green-600 text-green-700 bg-gray-900/90  py-3 absolute bottom-0 w-full  select-none"
      >
        <ArrowLeft /> <span className=" hover:underline ">Back to Login</span>
      </Link>
    </motion.div>
  );
};

export default ForgotPassword;
