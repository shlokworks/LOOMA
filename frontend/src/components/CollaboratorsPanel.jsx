import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { useProjectStore } from "../store/useProjectStore";
import {
  apiGetCollaborators,
  apiInviteCollaborator,
  apiRemoveCollaborator,
} from "../utils/authApi";

const STATUS_STYLES = {
  accepted: "bg-green-500/15 text-green-400 border-green-500/20",
  pending:  "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
};

export default function CollaboratorsPanel({ onClose }) {
  const { token, user }    = useAuthStore();
  const { projectId }      = useProjectStore();

  const [collabs, setCollabs]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteErr, setInviteErr] = useState("");
  const [inviteOk, setInviteOk] = useState("");

  useEffect(() => {
    if (!projectId || !token) return;
    apiGetCollaborators(token, projectId)
      .then(d => setCollabs(d.collaborators || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [projectId, token]);

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true); setInviteErr(""); setInviteOk("");
    try {
      await apiInviteCollaborator(token, projectId, inviteEmail.trim());
      setInviteOk(`Invite sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      // Refresh list
      const d = await apiGetCollaborators(token, projectId);
      setCollabs(d.collaborators || []);
    } catch (err) {
      setInviteErr(err.message);
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (collabId) => {
    try {
      await apiRemoveCollaborator(token, projectId, collabId);
      setCollabs(prev => prev.filter(c => c.id !== collabId));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-80 h-full bg-[#111827] border-l border-white/5 flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-white font-semibold text-sm">Collaborators</span>
        </div>
        <button onClick={onClose} className="text-white/30 hover:text-white transition-colors p-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* No project selected */}
        {!projectId && (
          <p className="text-white/30 text-sm text-center py-8">
            Generate or open a project first to manage collaborators.
          </p>
        )}

        {/* Invite form */}
        {projectId && (
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Invite by Email</p>
            <form onSubmit={handleInvite} className="space-y-2">
              <input
                type="email"
                value={inviteEmail}
                onChange={e => { setInviteEmail(e.target.value); setInviteErr(""); setInviteOk(""); }}
                placeholder="colleague@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-white/20 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all"
              />
              {inviteErr && <p className="text-red-400 text-xs">{inviteErr}</p>}
              {inviteOk  && <p className="text-green-400 text-xs">{inviteOk}</p>}
              <button
                type="submit"
                disabled={inviting || !inviteEmail.trim()}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {inviting ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                )}
                {inviting ? "Sending..." : "Send Invite"}
              </button>
            </form>
            <p className="text-white/20 text-xs mt-2">
              They'll receive an email from Looma with a link to accept.
            </p>
          </div>
        )}

        {/* Collaborator list */}
        {projectId && (
          <div>
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
              People with access
            </p>
            {loading ? (
              <div className="space-y-2">
                {[1,2].map(i => <div key={i} className="h-12 bg-white/5 rounded-lg animate-pulse"/>)}
              </div>
            ) : collabs.length === 0 ? (
              <p className="text-white/20 text-sm text-center py-4">
                No collaborators yet. Invite someone above!
              </p>
            ) : (
              <div className="space-y-2">
                {collabs.map(c => (
                  <div key={c.id} className="flex items-center gap-3 bg-white/3 border border-white/5 rounded-lg px-3 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {(c.user_name || c.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{c.user_name || c.email}</p>
                      {c.user_name && <p className="text-white/30 text-xs truncate">{c.email}</p>}
                      <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded border mt-0.5 ${STATUS_STYLES[c.status] || STATUS_STYLES.pending}`}>
                        {c.status}
                      </span>
                    </div>
                    {c.email !== user?.email && (
                      <button
                        onClick={() => handleRemove(c.id)}
                        className="text-white/20 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                        title="Remove"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
