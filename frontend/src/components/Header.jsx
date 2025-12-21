import { useState, useEffect, useRef } from "react";
import { Menu, X, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/auth-store";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed h-20 top-0 bg-green-950 left-0 right-0 flex justify-between items-center py-4 px-4 md:px-16 shadow-lg z-50">
      {/* Logo */}
      <div className="text-3xl font-bold text-gray-200 select-none">AuthB</div>

      {!isMobileMenuOpen && (
        <div className=" flex md:text-xl text-lg  text-gray-300 gap-3 md:gap-20  font-medium ">
          <div className="hover:text-green-400 transition-colors duration-200 cursor-pointer">
            Docs
          </div>
          <div className="hover:text-green-400 transition-colors duration-200 cursor-pointer">
            Support
          </div>
        </div>
      )}

      <div className=" flex">
        {/* Desktop Navigation */}
        {isAuthenticated ? (
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            ref={dropdownRef}
            className="relative  hidden md:flex gap-2 items-center py-2 rounded-full bg-gray-900 px-5 hover:cursor-pointer select-none"
          >
            <User color="#57fa5a" />

            <div className="font-semibold text-lg text-green-400">
              {user?.name}
            </div>
            <ChevronDown color="white" />

            {isMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg border border-gray-600 shadow-lg ">
                <ul className="py-1">
                  <li className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-colors duration-150">
                    <Settings size={16} />
                    Settings
                  </li>
                  <li
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 cursor-pointer transition-colors duration-150"
                  >
                    <LogOut size={16} />
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden text-lg md:flex items-center gap-15">
            <div className="flex items-center">
              <Link
                to="/login"
                className="px-6 py-2  text-gray-300 font-semibold  hover:text-white transition-colors duration-200"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-6 py-2 text-md  border-1 border-white text-white bg-green-700 rounded-lg font-semibold hover:bg-white hover:text-green-700 transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-8 h-auto" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed bg-black/50 inset-0 b z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-green-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-green-800">
            {isAuthenticated ? (
              <div className="flex gap-4">
                <User color="#57fa5a" />

                <div className="font-semibold text-lg text-gray-100">
                  {user?.name}
                </div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-white">Menu</div>
            )}

            <button
              className="text-white p-2 hover:bg-green-800 rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="flex-1 p-6 flex flex-col gap-6 ">
            <nav className="border-b-1 border-green-500">
              <ul className="space-y-2 text-gray-300  ">
                <li>
                  <a
                    href="/"
                    className="block   font-medium py-3 px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="block   font-medium py-3 px-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Support
                  </a>
                </li>
              </ul>
            </nav>

            <div className="flex flex-col gap-4">
              {!isAuthenticated ? (
                <>
                 
                  <Link
                    to="/login"
                    className="px-6 py-3 text-white border-2 border-white rounded-lg font-semibold  "
                  >
                    Login
                  </Link>
                   <Link
                    to="/signup"
                    className="px-6 py-3 text-green-700 bg-white rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/settings"
                    className="flex justify-start items-center gap-2  py-3 text-gray-300  font-semibold "
                  >
                    <Settings size={20} />
                    Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex justify-start items-center gap-2  py-3 text-gray-300  font-semibold "
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
