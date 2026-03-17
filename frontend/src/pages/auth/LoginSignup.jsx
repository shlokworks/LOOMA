import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { apiLogin, apiRegister, apiAcceptInvite, apiGetInviteInfo } from "../../utils/authApi";

export default function LoginSignup() {
  const navigate       = useNavigate();
  const [params]       = useSearchParams();
  const inviteToken    = params.get("invite");

  const { user, token, setAuth } = useAuthStore();
  const [isLogin, setIsLogin]    = useState(!inviteToken); // start on signup if invite
  const [name, setName]          = useState("");
  const [email, setEmail]        = useState("");
  const [password, setPassword]  = useState("");
  const [loading, setLoading]    = useState(false);
  const [error, setError]        = useState("");
  const [inviteInfo, setInviteInfo] = useState(null);

  // If already logged in, redirect
  useEffect(() => {
    if (user && token) {
      navigate(inviteToken ? `/invite/${inviteToken}` : "/dashboard", { replace: true });
    }
  }, [user, token]);

  // Load invite info if token present
  useEffect(() => {
    if (!inviteToken) return;
    apiGetInviteInfo(inviteToken)
      .then(info => {
        setInviteInfo(info);
        setEmail(info.email);
        setIsLogin(false); // push to signup if they don't have account
      })
      .catch(() => {}); // ignore if token is invalid
  }, [inviteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await apiLogin(email, password);
      } else {
        if (!name.trim()) throw new Error("Full name is required");
        result = await apiRegister(name, email, password);
      }
      setAuth(result.user, result.token);
      // If this was an invite flow, accept it
      if (inviteToken) {
        try { await apiAcceptInvite(result.token, inviteToken); } catch { /* already linked */ }
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0f172a] flex items-center justify-center p-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-10 shadow-2xl">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">L</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl leading-none">Looma</h1>
                <p className="text-white/40 text-xs">AI-Powered Code Generation</p>
              </div>
            </div>

            {/* Invite banner */}
            {inviteInfo && (
              <div className="mb-6 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <p className="text-blue-300 text-sm font-medium">
                  🎉 <strong>{inviteInfo.inviterName}</strong> invited you to collaborate on
                </p>
                <p className="text-white font-bold mt-1">📁 {inviteInfo.projectName}</p>
                <p className="text-white/50 text-xs mt-1">
                  {isLogin ? "Log in" : "Create an account"} to accept the invite.
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold text-white mb-1">
              {isLogin ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/40 text-sm mb-6">
              {isLogin ? "Sign in to your Looma account" : "Start building with AI today"}
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (signup only) */}
              {!isLogin && (
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={isLogin ? "••••••••" : "At least 6 characters"}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-white/20 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm text-white/40">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => { setIsLogin(p => !p); setError(""); }}
                className="ml-1.5 text-blue-400 hover:text-blue-300 transition-colors"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>

            <p className="mt-5 text-center text-xs text-white/20">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
