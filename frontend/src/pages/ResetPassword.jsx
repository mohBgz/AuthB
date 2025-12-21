import { easeOut, motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Lock, LoaderCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/Input.jsx";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter.jsx";
import { useAuthStore } from "../store/auth-store.js";

const ResetPassword = () => {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [score, setScore] = useState(0);
  const { isLoading, error, resetPassword } = useAuthStore();

  const { token } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    useAuthStore.setState({ error: null });
  }, []);

  useEffect(() => {
    if (password !== confirmPassword) {
      useAuthStore.setState({
        error: "Passwords do not match. Please try again.",
      });
    } else {
      useAuthStore.setState({
        error: null,
      });
    }
  }, [password, confirmPassword]);

  const [cooldown, setCooldown] = useState(false);
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (cooldown) return;

    if (error) {
      toast.error(error);
      setCooldown(true);
      setTimeout(() => setCooldown(false), 2000); // block 2 seconds
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success("Password reset successfully, redirecting to login ...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Error resetting password"
      );
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
      <div className="pb-5 select-none align-middle text-4xl font-bold bg-gradient-to-r from-green-400 to-green-500 bg-clip-text text-transparent  ">
        Reset Password
      </div>
      {/* <p className="mb-7 border-0 text-white/70">
        Enter your email address and we'll send you a link to reset you password
      </p> */}

      <form
        onSubmit={handleResetPassword}
        autoComplete="off"
        className="w-full space-y-7"
      >
        <Input
          icon={Lock}
          name="password"
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Input
          icon={Lock}
          name="password"
          type="password"
          placeholder="Confirm New Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
        />
        {/* <p className="text-start text-red-400 text-lg" role="alert">
          {error}
        </p> */}
        <button
          type="submit"
          disabled={isLoading || score <= 3 || cooldown} // if is loading or  week password or cooldown
          className="action-button mb-16"
        >
          {isLoading ? (
            <LoaderCircle className=" w-full  animate-spin" />
          ) : (
            "Set New Password"
          )}
        </button>
      </form>

      <PasswordStrengthMeter
        className="mb-10"
        setScore={setScore}
        password={password}
      />

      <Link
        to="/login"
        className="flex justify-center items-center gap-1.5 transition-all duration-150 hover:text-green-600 text-green-700 bg-gray-900/90  py-3 absolute bottom-0 w-full  select-none"
      >
        <ArrowLeft /> <span className=" hover:underline ">Back to Login</span>
      </Link>
    </motion.div>
  );
};

export default ResetPassword;
