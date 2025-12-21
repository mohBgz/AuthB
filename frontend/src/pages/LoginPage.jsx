import React from "react";
import { easeOut, motion, AnimatePresence, easeInOut } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail, Lock, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import Input from "../components/Input.jsx";
import { useAuthStore } from "../store/auth-store.js";

const LoginPage = () => {
  const { user, login, error, isLoading, resendOtp } = useAuthStore();

  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      // await resendOtp()
      navigate("/");
      console.log("logged in !");
    } catch (error) {
      console.error(error);
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
        
        
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <div className=" select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-8 ">
        Welcome Back
      </div>

      <form
        onSubmit={handleLogin}
        autoComplete="off"
        className="gap-6 flex flex-col w-full"
      >
        <Input
          icon={Mail}
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div>
          <Input
            icon={Lock}
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <Link
            to="/forgot-password"
            className="w-full block text-start mt-4 mb-2   text-green-600 hover:brightness-150 hover:underline transition-all duration-150 hover:cursor-pointer select-none"
          >
            Forgot password?
          </Link>
        </div>

        <div className="flex flex-col gap-1.5 items-start">
          <AnimatePresence>
            {error && (
              <motion.div
                key="error" // optional but recommended
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: easeInOut, duration: 0.3 }}
                className="select-none font-semibold text-red-600"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            type="submit"
            disabled={isLoading}
            className="action-button"
          >
            {isLoading ? (
              <LoaderCircle className="animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </motion.button>
        </div>
      </form>

      <div className=" text-gray-500  bg-gray-900 py-3 absolute bottom-0  w-full select-none">
        Don't have an account?
        <Link
          to="/signup"
          className=" ml-1 text-green-600 hover:brightness-150 transition-all duration-150"
        >
          signup
        </Link>
      </div>
    </motion.div>
  );
};

export default LoginPage;
