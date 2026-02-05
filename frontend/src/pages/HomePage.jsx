import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, Layers } from "lucide-react";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mt-32 max-w-3xl mx-auto p-10 bg-gray-900 bg-opacity-80 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800 select-none"
    >
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-center mb-4 bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        AuthB
      </h1>

      <p className="text-center text-gray-300 mb-10">
        A modular authentication API for managing applications, API keys, and
        secure access from a single dashboard.
      </p>

      {/* Feature blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="flex flex-col items-center text-center gap-3 p-5 bg-gray-800 rounded-lg border border-gray-700">
          <ShieldCheck className="text-green-400" size={32} />
          <h3 className="font-semibold text-gray-100">Secure</h3>
          <p className="text-sm text-gray-400">
            Token-based authentication with strong access control.
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-3 p-5 bg-gray-800 rounded-lg border border-gray-700">
          <KeyRound className="text-green-400" size={32} />
          <h3 className="font-semibold text-gray-100">API Keys</h3>
          <p className="text-sm text-gray-400">
            Generate and manage application API keys securely.
          </p>
        </div>

        <div className="flex flex-col items-center text-center gap-3 p-5 bg-gray-800 rounded-lg border border-gray-700">
          <Layers className="text-green-400" size={32} />
          <h3 className="font-semibold text-gray-100">Modular</h3>
          <p className="text-sm text-gray-400">
            Designed as a standalone service reusable across projects.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center text-gray-400 text-sm italic">
        Log in to access your dashboard and manage your applications.
      </div>
    </motion.div>
  );
};

export default HomePage;
