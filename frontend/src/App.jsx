import "./App.css";

import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";



import FloatingShape from "./components/FloatingShape.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import Header from "./components/Header.jsx";

import { useAuthStore } from "./store/auth-store.js";
import { useEffect } from "react";

const RedirectVerifiedUsers = ({ children }) => {
  const { isAuthenticated, user, requiresVerification } = useAuthStore();

  // if (isCheckingAuth) {
  //   return <div>Loading...</div>;
  // }

  if (!isAuthenticated && !requiresVerification) {
    console.log("requires verification = ",requiresVerification);
    return <Navigate to="/login" replace />;
  }

 

  if (user?.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

//protects routes that require authentification
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // if (isCheckingAuth) {
  //   return <div>Loading...</div>;
  // }

  if (!isAuthenticated) {
    console.log("checking auth from /login : ", isCheckingAuth);
    return <Navigate to="/login" replace />;
  }

  if (!user?.isVerified) {
    console.log("checking auth from /verify-email : ", isCheckingAuth);

    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

// redirects authenticated users to their Dashbord
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  // if (isCheckingAuth) {
  //   return <div>Loading...</div>; // You can use a spinner component here
  // }

  if (isAuthenticated && user) {
    if (!user.isVerified) {
      return <Navigate to="/verify-email" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const  App = () => {
  const { user, isCheckingAuth, checkAuth, isAuthenticated } = useAuthStore();
  const location = useLocation();
  useEffect(() => async () => {
    console.log("checking auth ?", isCheckingAuth);
try {
  await checkAuth();
  
} catch (error) {
  console.error("Error during auth check in App.jsx:", error);
}
    
    
  }, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-950 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {location.pathname === "/" && <Header />}
      <FloatingShape color="bg-green-500" 
          size="w-64 h-64"
          top="-5%"
          left="10%"
          delay={0} 
        />

        <FloatingShape color="bg-green-500" 
          size="w-48 h-48"
          top="70%"
          left="80%"
          delay={5} 
        />

        <FloatingShape color="bg-green-500" 
          size="w-32 h-32"
          top="40%"
          left="-10%"
          delay={15} 
        />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route
          path="/signup"
          element={
            <RedirectAuthenticatedUser>
              <SignupPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/login"
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/verify-email"
          element={
            <RedirectVerifiedUsers>
              <VerifyEmail />
            </RedirectVerifiedUsers>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <RedirectAuthenticatedUser>
              <ForgotPassword />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <RedirectAuthenticatedUser>
              <ResetPassword />
            </RedirectAuthenticatedUser>
          }
        />

      
        {/* Catch-all route for unmatched paths */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
