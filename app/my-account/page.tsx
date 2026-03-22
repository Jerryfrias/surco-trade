"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const SECTIONS = ["overview","browse","orders","products","prices","documents","notifications","support","profile"] as const;
type Section = typeof SECTIONS[number];

const consolidations = [
  { id: "CONS-2026-ROT-0042", product: "Vannamei Shrimp", port: "Rotterdam", price: "$4.20/kg", departure: "Apr 15", daysLeft: 8, slots: 14, total: 22, status: "open" },
  { id: "CONS-2026-ROT-0043", product: "Dragon Fruit", port: "Rotterdam", price: "$1.80/kg", departure: "Apr 10", daysLeft: 3, slots: 20, total: 22, status: "closing" },
  { id: "CONS-2026-HAM-0011", product: "Vannamei Shrimp", port: "Hamburg", price: "$4.20/kg", departure: "Apr 8", daysLeft: 0, slots: 22, total: 22, status: "full" },
];

const orders = [
  { id: "CONS-2026-ROT-0042", product: "Vannamei Shrimp", port: "Rotterdam", tons: 2, value: "$8,400", status: "transit", date: "Mar 10", eta: "Apr 2", signed: "Mar 8" },
  { id: "CONS-2026-ROT-0038", product: "Cacao", port: "Rotterdam", tons: 1, value: "$3,100", status: "delivered", date: "Feb 10", eta: null, signed: "Feb 7" },
];

const products = [
  { name: "Vannamei Shrimp", cat: "Seafood", price: "$4.20/kg", season: "Year-round" },
  { name: "Tilapia Fillet", cat: "Seafood", price: "$2.40/kg", season: "Year-round" },
  { name: "Dragon Fruit", cat: "Fruits", price: "$1.80/kg", season: "Apr–Oct" },
  { name: "Organic Banana", cat: "Fruits", price: "$0.62/kg", season: "Year-round" },
  { name: "Mango Tommy", cat: "Fruits", price: "$1.20/kg", season: "Jan–Apr" },
  { name: "Cacao", cat: "Agro", price: "$3.10/kg", season: "Year-round" },
];

const prices = [
  { name: "Vannamei Shrimp", cat: "Seafood", price: "$4.20/kg", change: "+1.2%", up: true },
  { name: "Dragon Fruit", cat: "Fruits", price: "$1.80/kg", change: "-0.5%", up: false },
  { name: "Organic Banana", cat: "Fruits", price: "$0.62/kg", change: "+0.8%", up: true },
  { name: "Cacao", cat: "Agro", price: "$3.10/kg", change: "+2.1%", up: true },
  { name: "Mango Tommy", cat: "Fruits", price: "$1.20/kg", change: "+0.6%", up: true },
];

const documents = [
  { name: "Bill of Lading", ref: "CONS-2026-ROT-0042", date: "Mar 10, 2026", type: "bl" },
  { name: "Commercial Invoice", ref: "CONS-2026-ROT-0042", date: "Mar 8, 2026", type: "invoice" },
  { name: "Sanitary Certificate", ref: "CONS-2026-ROT-0042", date: "Mar 7, 2026", type: "cert" },
  { name: "Signed Contract", ref: "CONS-2026-ROT-0042", date: "Mar 8, 2026", type: "signed" },
  { name: "Signed Contract", ref: "CONS-2026-ROT-0038", date: "Feb 7, 2026", type: "signed" },
];

const notifications = [
  { title: "New consolidation available", body: "Vannamei Shrimp to Rotterdam — 8 days left to join.", time: "2 hours ago", read: false },
  { title: "Documents ready", body: "B/L and invoice for CONS-2026-ROT-0042 are available.", time: "Yesterday", read: false },
  { title: "Shipment departed", body: "CONS-2026-ROT-0042 departed Guayaquil on Mar 10.", time: "Mar 10", read: true },
];

export default function MyAccountPage() {
  const [section, setSection] = useState<Section>("overview");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [prodFilter, setProdFilter] = useState("All");
  const [browseFilter, setBrowseFilter] = useState("All");
  const [docFilter, setDocFilter] = useState("All");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/access"; return; }
      setUser(user);
      supabase.from("compradores").select("*").eq("email", user.email).single().then(({ data }) => setProfile(data));
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const card: React.CSSProperties = { background: "#071a0e", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px" };
  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "10px 14px", color: "white", fontSize: "13px", outline: "none", boxSizing: "border-box" };
  const lbl: React.CSSProperties = { color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.5px", textTransform: "uppercase", marginBottom: "6px", display: "block" };

  const Badge = ({ status }: { status: string }) => {
    const map: any = {
      open: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.3)", label: "Open" },
      closing: { bg: "rgba(251,146,60,0.15)", color: "#fb923c", border: "rgba(251,146,60,0.3)", label: "Closing soon" },
      full: { bg: "rgba(248,113,113,0.15)", color: "#f87171", border: "rgba(248,113,113,0.3)", label: "Full" },
      transit: { bg: "rgba(96,165,250,0.15)", color: "#60a5fa", border: "rgba(96,165,250,0.3)", label: "In transit" },
      delivered: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.3)", label: "Delivered" },
      signed: { bg: "rgba(74,222,128,0.15)", color: "#4ade80", border: "rgba(74,222,128,0.3)", label: "Signed" },
    };
    const s = map[status] || map.open;
    return <span style={{ display: "inline-block", fontSize: "10px", padding: "3px 8px", borderRadius: "4px", background: s.bg, color: s.color, border: `0.5px solid ${s.border}`, letterSpacing: "0.3px" }}>{s.label}</span>;
  };

  const SideItem = ({ id, label, icon, badge }: { id: Section, label: string, icon: React.ReactNode, badge?: number }) => (
    <div onClick={() => setSection(id)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 20px", color: section === id ? "white" : "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", borderLeft: `2px solid ${section === id ? "#4ade80" : "transparent"}`, background: section === id ? "rgba(74,222,128,0.06)" : "transparent", transition: "all 0.15s" }}>
      {icon}
      {label}
      {badge ? <span style={{ marginLeft: "auto", background: "rgba(74,222,128,0.15)", color: "#4ade80", fontSize: "10px", padding: "1px 6px", borderRadius: "10px", border: "0.5px solid rgba(74,222,128,0.3)" }}>{badge}</span> : null}
    </div>
  );

  const ic = (d: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={d}/></svg>;

  const filteredProducts = prodFilter === "All" ? products : products.filter(p => p.cat === prodFilter);
  const filteredBrowse = browseFilter === "All" ? consolidations : consolidations.filter(c => {
    if (browseFilter === "Seafood") return ["Vannamei Shrimp","Tilapia Fillet"].includes(c.product);
    if (browseFilter === "Fruits") return ["Dragon Fruit","Organic Banana","Mango Tommy"].includes(c.product);
    return true;
  });
  const filteredDocs = docFilter === "All" ? documents : docFilter === "Signed" ? documents.filter(d => d.type === "signed") : documents.filter(d => d.type !== "signed");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "100vh", fontFamily: "sans-serif", background: "#020806" }}>

      {/* SIDEBAR */}
      <div style={{ background: "#071a0e", borderRight: "0.5px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", minHeight: "100vh", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ color: "#4ade80", fontSize: "16px", fontWeight: 500, padding: "24px 20px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>Surco.trade</div>

        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "12px 20px 4px" }}>Main</div>
        <SideItem id="overview" label="Overview" icon={ic("M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z")} />
        <SideItem id="browse" label="Browse" icon={ic("M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35")} />
        <SideItem id="orders" label="My orders" icon={ic("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6v4H9z")} />
        <SideItem id="products" label="Products" icon={ic("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z")} />
        <SideItem id="prices" label="Prices" icon={ic("M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6")} />

        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "12px 20px 4px" }}>My account</div>
        <SideItem id="documents" label="Documents" icon={ic("M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6")} />
        <SideItem id="notifications" label="Notifications" icon={ic("M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0")} badge={notifications.filter(n => !n.read).length} />
        <SideItem id="support" label="Support" icon={ic("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z")} />

        <div style={{ marginTop: "auto", borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: "8px" }}>
          <SideItem id="profile" label="My profile" icon={ic("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z")} />
          <div onClick={handleSignOut} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 20px", color: "rgba(255,255,255,0.25)", fontSize: "13px", cursor: "pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            Sign out
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: "32px 40px", overflowY: "auto" }}>

        {/* OVERVIEW */}
        {section === "overview" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px", marginBottom: "4px" }}>Welcome back</div>
                <h1 style={{ color: "white", fontSize: "20px", fontWeight: 600, margin: 0 }}>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}</h1>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "2px" }}>{profile?.company} · {profile?.country}</div>
              </div>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "0.5px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", fontSize: "12px", fontWeight: 600 }}>
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "28px" }}>
              {[["Active consolidations","3"],["Orders placed","7"],["Total volume","18 tons"],["Documents","5"]].map(([label, val]) => (
                <div key={label} style={card}>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{label}</div>
                  <div style={{ color: "white", fontSize: "22px", fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
            <div style={{ color: "white", fontSize: "14px", fontWeight: 500, marginBottom: "14px" }}>Your active consolidations</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {consolidations.filter(c => c.status !== "full").map(c => (
                <div key={c.id} style={{ ...card, display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>{c.product} · {c.port}</span>
                      <Badge status={c.status} />
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "10px" }}>Departure {c.departure} · {c.price} · {c.daysLeft} days left</div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
                      <div style={{ background: c.status === "closing" ? "#fb923c" : "#4ade80", height: "100%", width: `${Math.round(c.slots/c.total*100)}%`, borderRadius: "4px" }} />
                    </div>
                  </div>
                  <button onClick={() => setSection("browse")} style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "11px", fontWeight: 600, padding: "7px 14px", borderRadius: "50px", border: "0.5px solid rgba(74,222,128,0.3)", cursor: "pointer" }}>View</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BROWSE */}
        {section === "browse" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Browse consolidations</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Available consolidations matching your preferences.</p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {["All","Seafood","Fruits"].map(f => (
                <button key={f} onClick={() => setBrowseFilter(f)} style={{ padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "6px", color: browseFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: browseFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: browseFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredBrowse.map(c => (
                <div key={c.id} style={{ ...card, display: "grid", gridTemplateColumns: "1fr auto", gap: "20px", alignItems: "center", opacity: c.status === "full" ? 0.5 : 1 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>{c.product} · {c.port}</span>
                      <Badge status={c.status} />
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginBottom: "10px" }}>Departure {c.departure} · FOB Guayaquil · {c.price} · {c.daysLeft > 0 ? `${c.daysLeft} days left` : "Closed"}</div>
                    <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
                      <div style={{ background: c.status === "full" ? "#f87171" : c.status === "closing" ? "#fb923c" : "#4ade80", height: "100%", width: `${Math.round(c.slots/c.total*100)}%`, borderRadius: "4px" }} />
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "5px" }}>{c.slots} / {c.total} slots filled</div>
                  </div>
                  <button disabled={c.status === "full"} style={{ background: c.status === "full" ? "rgba(255,255,255,0.06)" : "#4ade80", color: c.status === "full" ? "rgba(255,255,255,0.25)" : "#071a0e", fontSize: "12px", fontWeight: 600, padding: "9px 18px", borderRadius: "50px", border: c.status === "full" ? "0.5px solid rgba(255,255,255,0.08)" : "none", cursor: c.status === "full" ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
                    {c.status === "full" ? "Full" : "Join →"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {section === "orders" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>My orders</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Consolidations you have joined.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {orders.map(o => (
                <div key={o.id} style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                    <div>
                      <div style={{ color: "white", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>{o.product} · {o.port}</div>
                      <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{o.id} · {o.tons} tons · {o.value}</div>
                    </div>
                    <Badge status={o.status} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "12px", paddingTop: "12px", borderTop: "0.5px solid rgba(255,255,255,0.06)", flexWrap: "wrap" as const }}>
                    <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>Departed {o.date}</span>
                    {o.eta && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>ETA Rotterdam {o.eta}</span>}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ display: "inline-block", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "0.5px solid rgba(74,222,128,0.3)" }}>Signed {o.signed}</span>
                    </div>
                    <button onClick={() => setSection("documents")} style={{ marginLeft: "auto", background: "transparent", color: "#4ade80", fontSize: "11px", border: "none", cursor: "pointer" }}>View contract →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {section === "products" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Product catalog</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Verified products available for export from Ecuador.</p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {["All","Seafood","Fruits","Agro"].map(f => (
                <button key={f} onClick={() => setProdFilter(f)} style={{ padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "6px", color: prodFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: prodFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: prodFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px" }}>
              {filteredProducts.map(p => (
                <div key={p.name} style={card}>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{p.cat}</div>
                  <div style={{ color: "white", fontSize: "13px", fontWeight: 500, marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ color: "#4ade80", fontSize: "13px", marginBottom: "4px" }}>{p.price}</div>
                  <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginBottom: "12px" }}>{p.season}</div>
                  <button style={{ width: "100%", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "11px", fontWeight: 600, padding: "7px", borderRadius: "6px", border: "0.5px solid rgba(74,222,128,0.3)", cursor: "pointer" }}>Request quote</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PRICES */}
        {section === "prices" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Live prices</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Current export prices from Ecuador. Updated by our team.</p>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
                  {["Product","Category","Price","Change"].map((h, i) => (
                    <th key={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: 400, textAlign: i > 1 ? "right" : "left", padding: "10px 12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prices.map(p => (
                  <tr key={p.name} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px", fontSize: "12px", color: "white" }}>{p.name}</td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{p.cat}</td>
                    <td style={{ padding: "12px", fontSize: "12px", color: "white", textAlign: "right" }}>{p.price}</td>
                    <td style={{ padding: "12px", fontSize: "12px", color: p.up ? "#4ade80" : "#f87171", textAlign: "right" }}>{p.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* DOCUMENTS */}
        {section === "documents" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Documents</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Your B/L, invoices, certificates and signed contracts.</p>
            <div style={{ display: "flex", gap: "6px", marginBottom: "16px" }}>
              {["All","Signed","Other"].map(f => (
                <button key={f} onClick={() => setDocFilter(f)} style={{ padding: "6px 14px", fontSize: "11px", cursor: "pointer", borderRadius: "6px", color: docFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: docFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: docFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredDocs.map((d, i) => (
                <div key={i} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <span style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>{d.name}</span>
                      {d.type === "signed" && <Badge status="signed" />}
                    </div>
                    <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>{d.ref} · {d.date} · PDF</div>
                  </div>
                  <button style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "11px", fontWeight: 600, padding: "7px 14px", borderRadius: "6px", border: "0.5px solid rgba(74,222,128,0.3)", cursor: "pointer" }}>Download</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {section === "notifications" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Notifications</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Your latest alerts and updates.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {notifications.map((n, i) => (
                <div key={i} style={{ ...card, display: "flex", gap: "14px", alignItems: "flex-start", borderColor: n.read ? "rgba(255,255,255,0.07)" : "rgba(74,222,128,0.15)" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: n.read ? "rgba(255,255,255,0.15)" : "#4ade80", flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <div style={{ color: "white", fontSize: "13px", fontWeight: 500, marginBottom: "3px" }}>{n.title}</div>
                    <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>{n.body}</div>
                    <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px", marginTop: "4px" }}>{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPORT */}
        {section === "support" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>Support</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Contact the Surco.trade team directly.</p>
            <div style={{ ...card, maxWidth: "480px" }}>
              <div style={{ marginBottom: "14px" }}><label style={lbl}>Subject</label><input style={inp} placeholder="e.g. Question about my order" /></div>
              <div style={{ marginBottom: "20px" }}><label style={lbl}>Message</label><textarea style={{ ...inp, resize: "vertical", minHeight: "100px" } as React.CSSProperties} placeholder="Describe your question or issue..." /></div>
              <button style={{ background: "#4ade80", color: "#071a0e", fontSize: "13px", fontWeight: 600, padding: "11px 24px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Send message →</button>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div>
            <h2 style={{ color: "white", fontSize: "18px", fontWeight: 600, marginBottom: "6px" }}>My profile</h2>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginBottom: "20px" }}>Your company and contact information.</p>
            <div style={{ ...card, maxWidth: "480px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                {[
                  ["Company", profile?.company || ""],
                  ["Country", profile?.country || ""],
                  ["First name", profile?.first_name || ""],
                  ["Last name", profile?.last_name || ""],
                  ["Email", user?.email || ""],
                  ["WhatsApp", profile?.whatsapp || ""],
                ].map(([label, val]) => (
                  <div key={label}><label style={lbl}>{label}</label><input style={inp} defaultValue={val} /></div>
                ))}
              </div>
              <div style={{ marginTop: "14px" }}>
                <label style={lbl}>Destination port</label>
                <input style={inp} defaultValue={profile?.port || ""} />
              </div>
              <button style={{ marginTop: "20px", background: "#4ade80", color: "#071a0e", fontSize: "13px", fontWeight: 600, padding: "11px 24px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Save changes</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}