import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

/**
 * Wraps protected routes. Redirects to /auth if not authenticated.
 * Shows a loading spinner while verifying the stored token.
 */
export default function AuthGuard({ children }) {
  const navigate         = useNavigate();
  const location         = useLocation();
  const { user, token, verifyToken } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!token) {
        navigate("/auth", { replace: true, state: { from: location.pathname } });
        return;
      }
      const valid = await verifyToken();
      if (!valid) {
        navigate("/auth", { replace: true, state: { from: location.pathname } });
      }
      setChecking(false);
    };
    check();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return children;
}
