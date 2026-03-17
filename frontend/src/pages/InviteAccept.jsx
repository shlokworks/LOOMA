import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { apiAcceptInvite, apiGetInviteInfo } from "../utils/authApi";

export default function InviteAccept() {
  const { inviteToken }      = useParams();
  const navigate             = useNavigate();
  const { user, token }      = useAuthStore();
  const [info, setInfo]      = useState(null);
  const [status, setStatus]  = useState("loading"); // loading | ready | accepting | done | error
  const [errMsg, setErrMsg]  = useState("");

  useEffect(() => {
    apiGetInviteInfo(inviteToken)
      .then(d => { setInfo(d); setStatus("ready"); })
      .catch(err => { setErrMsg(err.message); setStatus("error"); });
  }, [inviteToken]);

  useEffect(() => {
    if (status !== "ready") return;
    // Not logged in → go to /auth with invite token
    if (!user || !token) {
      navigate(`/auth?invite=${inviteToken}`, { replace: true });
    }
  }, [status, user, token]);

  const handleAccept = async () => {
    setStatus("accepting");
    try {
      await apiAcceptInvite(token, inviteToken);
      setStatus("done");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setErrMsg(err.message);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <span className="text-white font-black text-2xl">L</span>
        </div>

        {status === "loading" && (
          <p className="text-white/50">Loading invite details...</p>
        )}

        {status === "error" && (
          <>
            <h2 className="text-white font-bold text-xl mb-2">Invite not found</h2>
            <p className="text-white/40 text-sm mb-6">{errMsg || "This invite link is invalid or has expired."}</p>
            <button onClick={() => navigate("/dashboard")} className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              Go to Dashboard →
            </button>
          </>
        )}

        {status === "done" && (
          <>
            <h2 className="text-white font-bold text-xl mb-2">You're in! 🎉</h2>
            <p className="text-white/40 text-sm">Redirecting to your dashboard...</p>
          </>
        )}

        {(status === "ready" || status === "accepting") && info && user && token && (
          <>
            <h2 className="text-white font-bold text-xl mb-2">Join this project</h2>
            <p className="text-white/50 text-sm mb-4">
              <strong className="text-white">{info.inviterName}</strong> invited you to collaborate on
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3 mb-6">
              <p className="text-white font-semibold">📁 {info.projectName}</p>
            </div>
            <button
              onClick={handleAccept}
              disabled={status === "accepting"}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {status === "accepting" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Accepting...
                </>
              ) : "Accept Invitation"}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
