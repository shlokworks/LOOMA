import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";

import AuthGuard        from "./components/AuthGuard";
import LoginSignup      from "./pages/auth/LoginSignup";
import Dashboard        from "./pages/Dashboard";
import LandingPage      from "./pages/LandingPage";
import Workspace        from "./pages/Workspace";
import InviteAccept     from "./pages/InviteAccept";
import LivePreviewTestPage from "./pages/LivePreviewTestPage";
import CustomCursor     from "./components/CustomCursor";

/** Redirects / based on auth state */
function IndexRedirect() {
  const navigate     = useNavigate();
  const { token }    = useAuthStore();
  useEffect(() => {
    navigate(token ? "/dashboard" : "/auth", { replace: true });
  }, []);
  return null;
}

export default function AppRoutes() {
  return (
    <>
      <CustomCursor />
      <Routes>
        {/* Public */}
        <Route path="/"                   element={<IndexRedirect />} />
        <Route path="/auth"               element={<LoginSignup />} />
        <Route path="/auth/LoginSignup"   element={<LoginSignup />} />
        <Route path="/invite/:inviteToken" element={<InviteAccept />} />
        <Route path="/preview-test"       element={<LivePreviewTestPage />} />

        {/* Protected */}
        <Route path="/dashboard"    element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/new-project"  element={<AuthGuard><LandingPage /></AuthGuard>} />
        <Route path="/workspace"    element={<AuthGuard><Workspace /></AuthGuard>} />
      </Routes>
    </>
  );
}
