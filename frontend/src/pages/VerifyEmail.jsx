import axios from "axios";
import { useState, useRef, useEffect, use } from "react";
import { useAuthStore } from "../store/auth-store";
import {
  AnimatePresence,
  easeIn,
  easeInOut,
  easeOut,
  motion,
} from "framer-motion";
import { LoaderCircle } from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { formatDate } from "../utils/date.js";

const VerifyEmail = () => {
  const OTP_WAITING_TIME = 59;
  const [canResendOtp, setcanResendOtp] = useState(true);
  const [seconds, setSeconds] = useState(OTP_WAITING_TIME);
  const [opts, setOpts] = useState(Array.from({ length: 6 }, () => ""));
  const [isSubmiting, setIsSubmiting] = useState(false);

  const navigate = useNavigate();

  const inputRefs = useRef([]);

  const buttonRef = useRef();

  //const {verifyEmail} = useAuthStore((state)=> ({verifyEmail: state.verifyEmail}))
  const { verifyEmail, resendOtp, isLoading, error, user } = useAuthStore();

  const isFilled = opts.every((opt) => opt !== "");

  useEffect(() => {
    useAuthStore.setState({ error: null });
   
  }, []);

  //focus the first input when component mounts
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  //handling the countdown ( seconds )
  useEffect(() => {
    // Start a timer that runs every 1 second
    const myIntervalId = setInterval(() => {
      if (!canResendOtp && !isLoading) {
        setSeconds((prev) => {
          if (prev !== 1) {
            prev = prev - 1;
          } else {
            setcanResendOtp(true);
            setSeconds(OTP_WAITING_TIME);
          }
          return prev;
        }); // Decrease seconds by 1 if resend is disabled
      }
    }, 1000);

    // This clean up function stops the timer when needed
    return () => {
      clearInterval(myIntervalId);
      // Stop the timer to avoid duplicates
      // Important in React Strict Mode, which runs effects twice during development
      // without this, the timer could run multiple times and count down too fast
    };
  }, [canResendOtp, isLoading]);

  // handling pasting
  useEffect(() => {
    const handlePaste = (e) => {
      const pastedText = e.clipboardData.getData("text").replace(/\s+/g, "");

      console.log(`--${pastedText}--`);

      if (/^\d{6}$/.test(pastedText)) {
        const newOpts = pastedText.split("");
        setOpts(newOpts);
        inputRefs.current[5]?.focus();
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  //handling auto submit
  useEffect(() => {
    if (isFilled && !isLoading && !isSubmiting) handleSubmit();
  }, [isFilled, isLoading, opts]);

  const handleInputChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOpts = [...opts];
    newOpts[index] = value;
    setOpts(newOpts);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (
      !/[0-9]/.test(key) &&
      ![
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
      ].includes(key)
    ) {
      e.preventDefault();
      return;
    }

    if (key === "Backspace" || key === "Delete") {
      const newOpts = [...opts];

      if (opts[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        newOpts[index] = "";
        setOpts(newOpts);
      }

      e.preventDefault();
      return;
    }

    if ((key === "ArrowRight" || key === "Enter") && index < 5) {
      inputRefs.current[index + 1]?.focus();
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      return;
    }

    if (/[0-9]/.test(key)) {
      const newOpts = [...opts];
      newOpts[index] = key;
      setOpts(newOpts);
      if (index < 5) inputRefs.current[index + 1]?.focus();
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    console.log("fireee");
    const verificationCode = opts.join("");
    try {
      setIsSubmiting(true);
      await verifyEmail(verificationCode);
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.log(error);
      setIsSubmiting(false);
    }
  };

  return (
    <motion.div
      className="
        relative 
        text-center
        flex flex-col items-center 
        gap-12
      bg-gray-800/80 bg-opacity-50
        rounded-2xl   pb-6 pt-6
        max-w-xl w-full
        
      "
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeOut }}
    >
      {/* Titles wrapper */}
      <div className="w-[80%] flex flex-col gap-4">
        <div className=" w-full  py-1 select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 to-85%  bg-clip-text text-transparent ">
          Verify your Email
        </div>

        {/* Enter the 6-digit code sent to you email address. */}

        <div className="text-white/55 w-full text-xl ">
          <span>Check your email! We've sent a code to </span>
          <motion.span
            animate={{ color: "#008236" }}
            initial={{ color: "#ffffff40" }}
            transition={{ ease: easeInOut, duration: 0.7 }}
            className="select-none break-words text-white/25"
          >
            {user?.email}
          </motion.span>
        </div>
      </div>

      {/* inputs + error  ( verify + resend )  */}
      <div className="  w-full flex flex-col gap-5 ">
        {/* Code Inputs  + error */}

        <div className=" w-[70%] mx-auto flex flex-col gap-2 items-start justify-center">
          <form onSubmit={handleSubmit}>
            <div className="flex  justify-center gap-2 items-center ">
              {opts.map((_, index) => (
                <input
                  key={index}
                  autoComplete="off"
                  inputMode="numeric" //HTML attribute that hints to devices (especially mobile) what kind of keyboard to show when the input is focused.
                  type="text"
                  maxLength="1"
                  value={opts[index]}
                  ref={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => {
                    handleInputChange(index, e.target.value);
                  }}
                  onKeyDown={(e) => {
                    handleKeyDown(e, index);
                  }}
                  className="focus:scale-102 select-none text-center text-3xl text-green-600 font-bold w-1/6 aspect-square rounded-lg flex justify-center items-center border bg-white/10 shadow-green-900 border-white/40 focus-within:shadow-md transition-all duration-150"
                />
              ))}
            </div>
          </form>
          {/* error message */}
          <AnimatePresence>
            {isFilled && error && (
              <motion.p
                layout
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1, ease: easeIn }}
                exit={{ opacity: 0 }}
                className="text-red-500"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* button + resend */}
        <div className="   flex flex-col items-center justify-between gap-3 ">
          <button
            ref={buttonRef}
            disabled={!isFilled || error || isLoading}
            className="
              action-button w-[85%]
              text-xl
              mb-0
              
             "
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoaderCircle
                  key="loader"
                  className="text-white w-7 h-7 animate-spin mx-auto"
                />
              ) : (
                <motion.span
                  key="text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  Verify
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div className="flex flex-col items-center text-white/60 text-md select-none w-full">
            <div className="mb-[-0.1rem]">Didn't receive a code?</div>

            <div className="flex gap-1">
              <motion.button
              disabled={!canResendOtp || isLoading}
                key="resend"
                layout
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // // exit={{ opacity: 0, transition: { duration: 0.2 } }}
                // transition={{ ease: easeIn, duration: 0.3, delay: 0.2 }}
                onClick={(e) => {
                  resendOtp();
                  setcanResendOtp(false);
                }}
                className={`text-green-600 ${
                  canResendOtp
                    ? "underline cursor-pointer  hover:text-green-500"
                    : ""
                } `}
              >
                Resend
              </motion.button>
              <AnimatePresence mode="wait">
                {!canResendOtp && !isLoading && (
                  <>
                    <div> - </div>
                    <motion.span
                      key="timer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.2, ease: easeOut },
                      }}
                      transition={{
                        ease: easeIn,
                        duration: 0.3,
                      }}
                    >
                      <span>00 : {String(seconds).padStart(2, "0")} </span>
                    </motion.span>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VerifyEmail;
