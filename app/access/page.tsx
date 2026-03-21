"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const BLOCKED_DOMAINS = ["gmail","hotmail","yahoo","outlook","icloud","aol","live","msn","ymail","protonmail"];
const PRODUCTS = ["Seafood", "Fruits", "Agro", "Floriculture", "Poultry"];
const PORTS = ["Rotterdam, Netherlands", "Hamburg, Germany", "Valencia, Spain", "Miami, USA", "Houston, USA", "Shanghai, China", "Tokyo, Japan"];
const VOLUMES = ["Less than 1 ton", "1–5 tons", "5–20 tons", "20–50 tons", "50+ tons"];
const COUNTRIES = ["Netherlands", "Germany", "Spain", "United States", "China", "Japan", "United Kingdom", "France", "Other"];

const quotes = [
  { text: "We sourced 3 containers of Vannamei last quarter. Surco's consolidation model saved us 22% compared to our previous supplier.", name: "Marcus van der Berg", role: "Procurement Director · Rotterdam Seafood B.V.", initials: "MV" },
  { text: "Documentation handled end to end. We received our B/L and certificates without chasing anyone. That's rare in this industry.", name: "Lin Kaifeng", role: "Import Manager · Shanghai FreshTrade Co.", initials: "LK" },
  { text: "Direct access to verified Ecuadorian producers with transparent pricing. No more middlemen inflating costs on every shipment.", name: "Sofia Reinholt", role: "CEO · Nordic Produce GmbH · Hamburg", initials: "SR" },
];

export default function AccessPage() {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["Seafood"]);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const iv = setInterval(() => setQuoteIdx(i => (i + 1) % quotes.length), 4500);
    return () => clearInterval(iv);
  }, []);

  const toggleProduct = (p: string) => {
    setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const validateEmail = (email: string) => {
    const domain = (email.split("@")[1] || "").split(".")[0];
    if (BLOCKED_DOMAINS.includes(domain)) {
      setEmailError("Personal emails not accepted. Please use your company email.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSignIn = async () => {
    setLoading(true);
    setError("");
    const email = (document.getElementById("si-email") as HTMLInputElement).value;
    const password = (document.getElementById("si-pw") as HTMLInputElement).value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    window.location.href = "/my-account";
  };

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    const email = (document.getElementById("reg-email") as HTMLInputElement).value;
    if (!validateEmail(email)) { setLoading(false); return; }
    const password = (document.getElementById("reg-pw") as HTMLInputElement).value;
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) { setError(signUpError.message); setLoading(false); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("compradores").insert({
        email,
        company: (document.getElementById("reg-company") as HTMLInputElement).value,
        first_name: (document.getElementById("reg-fn") as HTMLInputElement).value,
        last_name: (document.getElementById("reg-ln") as HTMLInputElement).value,
        country: (document.getElementById("reg-country") as HTMLSelectElement).value,
        whatsapp: (document.getElementById("reg-wa") as HTMLInputElement).value,
        port: (document.getElementById("reg-port") as HTMLSelectElement).value,
        products: selectedProducts,
        volume: (document.getElementById("reg-vol") as HTMLSelectElement).value,
      });
    }
    window.location.href = "/my-account";
  };

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "11px 14px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px", display: "block" };
  const sel: React.CSSProperties = { ...inp, appearance: "none" as const };
  const fld: React.CSSProperties = { marginBottom: "14px" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100vh", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ background: "#071a0e", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 40px", position: "relative", overflowY: "auto", height: "100vh" }}>
        <div style={{ width: "380px", marginBottom: "24px" }}>
          <div style={{ color: "#4ade80", fontSize: "16px", fontWeight: 500 }}>Surco.trade</div>
        </div>
        <div style={{ position: "relative", width: "380px" }}>
          <div style={{ background: "#0a2414", borderRadius: "18px", height: "60px", position: "absolute", width: "380px", transform: "rotate(2.5deg) translateY(10px)", border: "0.5px solid rgba(74,222,128,0.08)" }} />
          <div style={{ background: "#0d2e1a", borderRadius: "18px", height: "60px", position: "absolute", width: "380px", transform: "rotate(-1.2deg) translateY(5px)", border: "0.5px solid rgba(74,222,128,0.1)" }} />
          <div style={{ background: "#0a2414", border: "0.5px solid rgba(74,222,128,0.2)", borderRadius: "16px", padding: "32px 28px", width: "380px", position: "relative", zIndex: 10 }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(74,222,128,0.3)", marginBottom: "12px" }}>Buyer access</div>
              <h2 style={{ color: "white", fontSize: "20px", fontWeight: 600, margin: "0 0 4px" }}>
                {mode === "signin" ? "Sign in to your account" : "Create your account"}
              </h2>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>Corporate accounts only.</p>
            </div>
            {error && <div style={{ background: "rgba(248,113,113,0.1)", border: "0.5px solid rgba(248,113,113,0.3)", borderRadius: "6px", padding: "10px 12px", color: "#f87171", fontSize: "12px", marginBottom: "16px" }}>{error}</div>}
            {mode === "signin" && (
              <div>
                <div style={fld}>
                  <label style={lbl}>Company email</label>
                  <input id="si-email" style={inp} type="email" placeholder="john@acmeseafood.com" />
                </div>
                <div style={fld}>
                  <label style={lbl}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input id="si-pw" style={{ ...inp, paddingRight: "52px" }} type={showPw ? "text" : "password"} placeholder="••••••••" />
                    <span onClick={() => setShowPw(!showPw)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>
                      {showPw ? "HIDE" : "SHOW"}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: "right", marginBottom: "20px" }}>
                  <span style={{ color: "#4ade80", fontSize: "12px", cursor: "pointer" }}>Forgot password?</span>
                </div>
                <button onClick={handleSignIn} disabled={loading} style={{ width: "100%", background: "#4ade80", color: "#071a0e", fontSize: "14px", fontWeight: 600, padding: "12px", borderRadius: "50px", border: "none", cursor: "pointer" }}>
                  {loading ? "Signing in..." : "Continue →"}
                </button>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center", marginTop: "16px" }}>
                  No account? <span onClick={() => setMode("register")} style={{ color: "#4ade80", cursor: "pointer", fontWeight: 500 }}>Create one →</span>
                </p>
              </div>
            )}
            {mode === "register" && (
              <div>
                <div style={fld}>
                  <label style={lbl}>Company name</label>
                  <input id="reg-company" style={inp} type="text" placeholder="Acme Seafood B.V." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={fld}><label style={lbl}>First name</label><input id="reg-fn" style={inp} placeholder="John" /></div>
                  <div style={fld}><label style={lbl}>Last name</label><input id="reg-ln" style={inp} placeholder="Smith" /></div>
                </div>
                <div style={fld}>
                  <label style={lbl}>Company email</label>
                  <input id="reg-email" style={{ ...inp, borderColor: emailError ? "rgba(248,113,113,0.5)" : "rgba(255,255,255,0.12)" }} type="email" placeholder="john@acmeseafood.com" onChange={e => validateEmail(e.target.value)} />
                  {emailError && <div style={{ color: "#f87171", fontSize: "11px", marginTop: "4px" }}>{emailError}</div>}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={fld}>
                    <label style={lbl}>Country</label>
                    <select id="reg-country" style={sel}><option value="">Country</option>{COUNTRIES.map(c => <option key={c}>{c}</option>)}</select>
                  </div>
                  <div style={fld}><label style={lbl}>WhatsApp</label><input id="reg-wa" style={inp} placeholder="+31 6 00000000" /></div>
                </div>
                <div style={fld}>
                  <label style={lbl}>Destination port</label>
                  <select id="reg-port" style={sel}><option value="">Select port</option>{PORTS.map(p => <option key={p}>{p}</option>)}</select>
                </div>
                <div style={fld}>
                  <label style={{ ...lbl, marginBottom: "8px" }}>Products of interest</label>
                  <div>
                    {PRODUCTS.map(p => (
                      <span key={p} onClick={() => toggleProduct(p)} style={{ display: "inline-flex", alignItems: "center", background: selectedProducts.includes(p) ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)", border: `0.5px solid ${selectedProducts.includes(p) ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.1)"}`, borderRadius: "6px", padding: "6px 11px", color: selectedProducts.includes(p) ? "#4ade80" : "rgba(255,255,255,0.45)", fontSize: "11px", cursor: "pointer", margin: "3px" }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div style={fld}>
                  <label style={lbl}>Monthly volume</label>
                  <select id="reg-vol" style={sel}><option value="">Select volume</option>{VOLUMES.map(v => <option key={v}>{v}</option>)}</select>
                </div>
                <div style={fld}>
                  <label style={lbl}>Password</label>
                  <input id="reg-pw" style={inp} type="password" placeholder="Min. 8 characters" />
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", marginBottom: "14px" }}>
                  <input type="checkbox" style={{ marginTop: "2px", accentColor: "#4ade80" }} />
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", lineHeight: 1.6 }}>I agree to <span style={{ color: "#4ade80", cursor: "pointer" }}>Terms</span> & <span style={{ color: "#4ade80", cursor: "pointer" }}>Privacy Policy</span>.</span>
                </div>
                <button onClick={handleRegister} disabled={loading} style={{ width: "100%", background: "#4ade80", color: "#071a0e", fontSize: "14px", fontWeight: 600, padding: "12px", borderRadius: "50px", border: "none", cursor: "pointer" }}>
                  {loading ? "Creating account..." : "Create account →"}
                </button>
                <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px", textAlign: "center", marginTop: "14px" }}>
                  Already registered? <span onClick={() => setMode("signin")} style={{ color: "#4ade80", cursor: "pointer", fontWeight: 500 }}>Sign in →</span>
                </p>
              </div>
            )}
          </div>
        </div>
        <div style={{ width: "380px", marginTop: "24px", display: "flex", gap: "16px" }}>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px" }}>© 2026 Surco.trade</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", cursor: "pointer" }}>Terms</span>
          <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "11px", cursor: "pointer" }}>Privacy</span>
        </div>
      </div>
      <div style={{ background: "#020806", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 56px", position: "sticky", top: 0, height: "100vh", overflow: "hidden", borderLeft: "0.5px solid rgba(255,255,255,0.05)" }}>
        {[{ s: "500px", t: "-120px", r: "-160px" }, { s: "280px", t: "-30px", r: "-50px" }, { s: "400px", b: "-150px", l: "-120px" }].map((d, i) => (
          <div key={i} style={{ position: "absolute", width: d.s, height: d.s, borderRadius: "50%", border: "0.5px solid rgba(74,222,128,0.06)", top: (d as any).t, right: (d as any).r, bottom: (d as any).b, left: (d as any).l }} />
        ))}
        <div style={{ maxWidth: "400px", width: "100%" }}>
          <div style={{ color: "rgba(74,222,128,0.4)", fontSize: "52px", lineHeight: 1, marginBottom: "20px", fontFamily: "Georgia, serif" }}>"</div>
          <div style={{ position: "relative", minHeight: "200px" }}>
            {quotes.map((q, i) => (
              <div key={i} style={{ position: i === quoteIdx ? "relative" : "absolute", top: 0, left: 0, width: "100%", opacity: i === quoteIdx ? 1 : 0, transform: i === quoteIdx ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.6s ease, transform 0.6s ease" }}>
                <p style={{ color: "white", fontSize: "19px", fontWeight: 400, lineHeight: 1.65, marginBottom: "24px" }}>"{q.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "0.5px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", fontSize: "11px", fontWeight: 600 }}>{q.initials}</div>
                  <div>
                    <div style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>{q.name}</div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>{q.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "28px" }}>
            {quotes.map((_, i) => (
              <div key={i} onClick={() => setQuoteIdx(i)} style={{ height: "3px", width: i === quoteIdx ? "20px" : "8px", borderRadius: "2px", background: i === quoteIdx ? "#4ade80" : "rgba(255,255,255,0.15)", transition: "all 0.3s", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}