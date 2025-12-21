import { motion } from "framer-motion";
import { useAuthStore } from "../store/auth-store";
import Header from "../components/Header";

const HomePage = () => {
  const { user, logout, isAuthe } = useAuthStore();

  const handleLogout = () => {
    logout();
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className=" select-none max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        HomePage
      </h2>

     
    </motion.div>
  );
};
export default HomePage;
