import React from "react";

function PasswordResetConfirmation() {
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
        Check your Email
      </div>
      <p className="mb-7 border-0 text-white/70">
        If an account exists for the provided email address, you will receive a
        password reset link shortly.
      </p>

      <div className="flex justify-center items-center gap-1.5 text-green-700 bg-gray-900/90  py-3 absolute bottom-0 w-full  select-none">
        <ArrowLeft />

        <Link
          to="/"
          className="hover:brightness-150 transition-all duration-150"
        >
          Back to Login
        </Link>
      </div>
    </motion.div>
  );
}

export default PasswordResetConfirmation;
