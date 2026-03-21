"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setTimeout(() => window.location.href = "/access", 2000);
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "11px 14px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px", display: "block" };

  return (
    <div style={{ background: "#071a0e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ position: "relative", width: "380px" }}>
        <div style={{ background: "#0a2414", borderRadius: "18px", height: "60px", position: "absolute", width: "380px", transform: "rotate(2.5deg) translateY(10px)", border: "0.5px solid rgba(74,222,128,0.08)" }} />
        <div style={{ background: "#0d2e1a", borderRadius: "18px", height: "60px", position: "absolute", width: "380px", transform: "rotate(-1.2deg) translateY(5px)", border: "0.5px solid rgba(74,222,128,0.1)" }} />
        <div style={{ background: "#0a2414", border: "0.5px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "32px 28px", position: "relative", zIndex: 10 }}>

          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ color: "#4ade80", fontSize: "16px", fontWeight: 500, marginBottom: "16px" }}>Surco.trade</div>
            <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(74,222,128,0.3)", marginBottom: "12px" }}>Reset password</div>
            <h2 style={{ color: "white", fontSize: "20px", fontWeight: 600, margin: "0 0 4px" }}>Set a new password</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Min. 8 characters.</p>
          </div>

          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ color: "#4ade80", fontSize: "32px", marginBottom: "12px" }}>✓</div>
              <p style={{ color: "white", fontSize: "15px", fontWeight: 500 }}>Password updated!</p>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "6px" }}>Redirecting to sign in...</p>
            </div>
          ) : (
            <div>
              {error && <div style={{ background: "rgba(248,113,113,0.1)", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "10px 12px", color: "#f87171", fontSize: "12px", marginBottom: "16px" }}>{error}</div>}
              <div style={{ marginBottom: "14px" }}>
                <label style={lbl}>New password</label>
                <input style={inp} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <div style={{ marginBottom: "20px" }}>
                <label style={lbl}>Confirm password</label>
                <input style={inp} type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)} />
              </div>
              <button onClick={handleReset} disabled={loading} style={{ width: "100%", background: "#4ade80", color: "#071a0e", fontSize: "14px", fontWeight: 600, padding: "12px", borderRadius: "50px", border: "none", cursor: "pointer" }}>
                {loading ? "Updating..." : "Update password →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}