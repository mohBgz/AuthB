import React from "react";
import { AnimatePresence, easeInOut, easeOut, motion } from "framer-motion";
import { useState, useRef } from "react";
import { User, Mail, Lock, LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ReCaptcha from "react-google-recaptcha";

import Input from "../components/Input.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../store/auth-store.js";
import { useEffect } from "react";

const SignupPage = () => {
  const opacityVariants = {
    visible: {
      opacity: 1,
      transition: {
        ease: easeInOut,
        duration: 0.5,
      },
    },
    hidden: {
      opacity: 0,
    },
  };
  const [recaptchaVal, setRecaptchaVal] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  /*useEffect(() => {
    console.log(recaptchaVal);
  }, [recaptchaVal]);*/

  const navigate = useNavigate();

  const buttonRef = useRef();

  // const [isLoading, setIsLoading] = useState(false);
  const { isLoading, signup, error } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, name);
      buttonRef.current.disabled = true;

      navigate("/verify-email", { state: { fromSignup: true } });
    } catch (error) {
      console.log(error);
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
        my-10
        
       
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      <div className=" select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent mb-8 ">
        Create Account
      </div>

      <form
        onSubmit={handleSignup}
        autoComplete="off"
        className="gap-6 flex flex-col w-full"
      >
        <Input
          icon={User}
          name="name"
          type="text"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <Input
          icon={Mail}
          name="email"
          type="email"
          placeholder="Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className="flex flex-col gap-4">
          <Input
            icon={Lock}
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <AnimatePresence>
            {score > 3 && (
              <motion.div
                variants={opacityVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transitionDuration: 0.5 }}
              >
                <ReCaptcha
                  onChange={(val) => setRecaptchaVal(val)}
                  sitekey="6Lf7H10rAAAAAEfcI46HAdsQl8v5iW61KlVJpf5M"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <p className="text-start text-red-400 text-lg" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !recaptchaVal } // if is loading  or captcha is null
          ref={buttonRef}
          className="action-button"
        >
          {isLoading ? (
            <LoaderCircle className=" w-full  animate-spin" />
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      <PasswordStrengthMeter
        className="mb-10"
        setScore={setScore}
        password={password}
      />

      <div className=" text-gray-500  bg-gray-900 py-3 absolute bottom-0  w-full select-none">
        Already have an account?
        <Link
          to="/login"
          className=" ml-1 text-green-600 hover:brightness-150 transition-all duration-150"
        >
          Login
        </Link>
      </div>
    </motion.div>
  );
};

export default SignupPage;
