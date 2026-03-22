"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import ProducerProfile from "./ProducerProfile";
import {
  CERTS, PROCESSES, COUNTRIES, HARVESTS,
  MOCK_PRODUCERS, allProducts, prices,
  documents, notifications, consolidations, orders
} from "./data";

type Section = "overview"|"browse"|"orders"|"products"|"prices"|"documents"|"notifications"|"support"|"profile"|"favorites";

function Dropdown({ label, icon, options, selected, onToggle, onClear }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const has = selected.length > 0;
  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div onClick={() => setOpen(!open)} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"8px 14px", background: has ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)", border:`0.5px solid ${has ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.12)"}`, borderRadius:"8px", color: has ? "#4ade80" : "rgba(255,255,255,0.7)", fontSize:"12px", cursor:"pointer", whiteSpace:"nowrap" as const }}>
        {icon}
        <span>{has ? `${label} (${selected.length})` : label}</span>
        <svg style={{ transition:"transform 0.2s", transform: open ? "rotate(180deg)" : "none" }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <div style={{ position:"absolute", top:"calc(100% + 8px)", left:0, background:"#0a2414", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"10px", padding:"8px", minWidth:"180px", zIndex:100 }}>
          <div onClick={() => onClear()} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"12px", color: selected.length === 0 ? "#4ade80" : "rgba(255,255,255,0.5)", background: selected.length === 0 ? "rgba(74,222,128,0.08)" : "transparent" }}>
            <div style={{ width:"15px", height:"15px", borderRadius:"3px", border: selected.length === 0 ? "none" : "0.5px solid rgba(255,255,255,0.2)", background: selected.length === 0 ? "#4ade80" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {selected.length === 0 && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7 8,3" stroke="#071a0e" strokeWidth="1.5" strokeLinecap="round"/></svg>}
            </div>
            Any option
          </div>
          {options.map((opt: string) => (
            <div key={opt} onClick={() => onToggle(opt)} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"8px 10px", borderRadius:"6px", cursor:"pointer", fontSize:"12px", color: selected.includes(opt) ? "white" : "rgba(255,255,255,0.6)" }}>
              <div style={{ width:"15px", height:"15px", borderRadius:"3px", border: selected.includes(opt) ? "none" : "0.5px solid rgba(255,255,255,0.2)", background: selected.includes(opt) ? "#4ade80" : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {selected.includes(opt) && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7 8,3" stroke="#071a0e" strokeWidth="1.5" strokeLinecap="round"/></svg>}
              </div>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MyAccountPage() {
  const getParams = () => typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();

  const [section, setSection] = useState<Section>(() => (getParams().get("section") as Section) || "overview");
  const [selectedProductPage, setSelectedProductPage] = useState<string | null>(() => getParams().get("product"));
  const [selectedProducer, setSelectedProducer] = useState<any>(() => {
    const pid = getParams().get("producer");
    const product = getParams().get("product");
    if (!pid || !product) return null;
    return MOCK_PRODUCERS[product]?.find((p: any) => p.id === parseInt(pid)) || null;
  });
  const [favorites, setFavorites] = useState<any[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("surco_favorites") || "[]"); } catch { return []; }
  });
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [prodFilter, setProdFilter] = useState("All");
  const [browseFilter, setBrowseFilter] = useState("All");
  const [docFilter, setDocFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Best match");
  const [selCerts, setSelCerts] = useState<string[]>([]);
  const [selProcesses, setSelProcesses] = useState<string[]>([]);
  const [selCountries, setSelCountries] = useState<string[]>([]);
  const [selHarvest, setSelHarvest] = useState<string[]>([]);
  const [lang, setLang] = useState<"EN"|"ES">(() => {
    if (typeof window === "undefined") return "EN";
    return (localStorage.getItem("surco_lang") as "EN"|"ES") || "EN";
  });
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const currentConfigRef = useRef<any>(null);

  const t = (en: string, es: string) => lang === "EN" ? en : es;

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { window.location.href = "/access"; return; }
      setUser(user);
      supabase.from("compradores").select("*").eq("email", user.email).single().then(({ data }) => setProfile(data));
    });
  }, []);

  const updateURL = (sec: string, product?: string | null, producerId?: number | null) => {
    const params = new URLSearchParams();
    params.set("section", sec);
    if (product) params.set("product", product);
    if (producerId) params.set("producer", String(producerId));
    window.history.replaceState(null, "", `/my-account?${params.toString()}`);
  };

  const toggleFavorite = (producer: any) => {
    const exists = favorites.find((f: any) => f.id === producer.id && !f.config);
    const updated = exists ? favorites.filter((f: any) => !(f.id === producer.id && !f.config)) : [...favorites, producer];
    setFavorites(updated);
    localStorage.setItem("surco_favorites", JSON.stringify(updated));
  };

  const saveConfig = (config: any) => {
    const producerId = String(config.producer.id).replace("-config","").replace(/^fav-/,"");
    const fixedId = `fav-${producerId}`;
    const newFav = { ...config.producer, config, id: fixedId };
    setFavorites(prev => {
      const updated = [...prev.filter((f: any) => {
        const fId = String(f.id).replace("-config","").replace(/^fav-/,"");
        return fId !== producerId;
      }), newFav];
      localStorage.setItem("surco_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (producer: any) => favorites.some((f: any) => f.id === producer.id);

  const handleNavigate = (fn: () => void) => {
    if (selectedProducer?.config && isDirty) {
      setPendingNavigation(() => fn);
      setShowUnsavedPopup(true);
    } else {
      fn();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const card: React.CSSProperties = { background:"#071a0e", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"20px" };
  const inp: React.CSSProperties = { width:"100%", background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:"8px", padding:"10px 14px", color:"white", fontSize:"13px", outline:"none", boxSizing:"border-box" };
  const lbl: React.CSSProperties = { color:"rgba(255,255,255,0.4)", fontSize:"11px", letterSpacing:"0.5px", textTransform:"uppercase", marginBottom:"6px", display:"block" };

  const Badge = ({ status }: { status: string }) => {
    const map: any = {
      open: { bg:"rgba(74,222,128,0.15)", color:"#4ade80", border:"rgba(74,222,128,0.3)", label:"Open" },
      closing: { bg:"rgba(251,146,60,0.15)", color:"#fb923c", border:"rgba(251,146,60,0.3)", label:"Closing soon" },
      full: { bg:"rgba(248,113,113,0.15)", color:"#f87171", border:"rgba(248,113,113,0.3)", label:"Full" },
      transit: { bg:"rgba(96,165,250,0.15)", color:"#60a5fa", border:"rgba(96,165,250,0.3)", label:"In transit" },
      delivered: { bg:"rgba(74,222,128,0.15)", color:"#4ade80", border:"rgba(74,222,128,0.3)", label:"Delivered" },
      signed: { bg:"rgba(74,222,128,0.15)", color:"#4ade80", border:"rgba(74,222,128,0.3)", label:"Signed" },
    };
    const s = map[status] || map.open;
    return <span style={{ display:"inline-block", fontSize:"10px", padding:"3px 8px", borderRadius:"4px", background:s.bg, color:s.color, border:`0.5px solid ${s.border}` }}>{s.label}</span>;
  };

  const SideItem = ({ id, label, icon, badge }: { id: Section, label: string, icon: React.ReactNode, badge?: number }) => {
    const isActive = section === id && !selectedProductPage && !selectedProducer;
    return (
      <div onClick={() => handleNavigate(() => { setSection(id); setSelectedProductPage(null); setSelectedProducer(null); setIsDirty(false); updateURL(id); })} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 20px", color: isActive ? "white" : "rgba(255,255,255,0.4)", fontSize:"13px", cursor:"pointer", borderLeft:`2px solid ${isActive ? "#4ade80" : "transparent"}`, background: isActive ? "rgba(74,222,128,0.06)" : "transparent", transition:"all 0.15s" }}>
        {icon}
        {label}
        {badge ? <span style={{ marginLeft:"auto", background:"rgba(74,222,128,0.15)", color:"#4ade80", fontSize:"10px", padding:"1px 6px", borderRadius:"10px", border:"0.5px solid rgba(74,222,128,0.3)" }}>{badge}</span> : null}
      </div>
    );
  };

  const ic = (d: string) => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={d}/></svg>;

  const producers = selectedProductPage ? (MOCK_PRODUCERS[selectedProductPage] || []) : [];
  const filteredProducers = producers.filter(p => {
    if (selCerts.length > 0 && !selCerts.every(c => p.certificaciones?.includes(c))) return false;
    if (selProcesses.length > 0 && !selProcesses.some(pr => p.procesos?.includes(pr))) return false;
    if (selCountries.length > 0 && !selCountries.includes(p.country)) return false;
    if (selHarvest.length > 0) {
      const days = Math.ceil((new Date(p.proxima_cosecha).getTime() - Date.now()) / 86400000);
      const maxDays = selHarvest.includes("Within 2 weeks") ? 14 : selHarvest.includes("Within 1 month") ? 30 : 90;
      if (days > maxDays) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === "Price: Low to high") return a.tallas[0].precio - b.tallas[0].precio;
    if (sortBy === "Price: High to low") return b.tallas[0].precio - a.tallas[0].precio;
    if (sortBy === "Next harvest") return new Date(a.proxima_cosecha).getTime() - new Date(b.proxima_cosecha).getTime();
    return 0;
  });

  const filteredProducts = prodFilter === "All" ? allProducts : allProducts.filter(p => p.cat === prodFilter);
  const filteredBrowse = browseFilter === "All" ? consolidations : consolidations.filter(c => {
    if (browseFilter === "Seafood") return ["Vannamei Shrimp","Tilapia Fillet"].includes(c.product);
    if (browseFilter === "Fruits") return ["Dragon Fruit","Organic Banana","Mango Tommy"].includes(c.product);
    return true;
  });
  const filteredDocs = docFilter === "All" ? documents : docFilter === "Signed" ? documents.filter(d => d.type === "signed") : documents.filter(d => d.type !== "signed");
  const hasFilters = selCerts.length > 0 || selProcesses.length > 0 || selCountries.length > 0 || selHarvest.length > 0;

  const ProducerCard = ({ p }: { p: any }) => (
    <div key={p.id} onClick={() => { setSelectedProducer(p); setIsDirty(false); updateURL("products", selectedProductPage, p.id); }} style={{ background:"#071a0e", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"12px", overflow:"hidden", cursor:"pointer", position:"relative" }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)")}
      onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
      <div style={{ height:"100px", background:"#0a2414", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="rgba(74,222,128,0.3)" strokeWidth="1.2">
          <path d="M10 34 C13 27 20 23 29 25 C35 27 40 22 38 15"/>
          <path d="M29 25 C31 30 29 37 24 39 C19 41 13 39 10 34"/>
          <circle cx="37" cy="13" r="2" fill="rgba(74,222,128,0.3)" stroke="none"/>
        </svg>
        <div onClick={e => { e.stopPropagation(); toggleFavorite(p); }} style={{ position:"absolute", top:"8px", right:"8px", cursor:"pointer", color: isFavorite(p) ? "#facc15" : "rgba(255,255,255,0.3)", fontSize:"18px" }}>
          {isFavorite(p) ? "★" : "☆"}
        </div>
      </div>
      <div style={{ padding:"14px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
          <div>
            <div style={{ color:"white", fontSize:"12px", fontWeight:500 }}>{p.nombre}</div>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", marginTop:"2px" }}>{p.country} · {p.anos_experiencia} yrs</div>
          </div>
          <div style={{ color:"#4ade80", fontSize:"12px", fontWeight:500 }}>${p.tallas.find((t: any) => t.precio)?.precio.toFixed(2)}/kg</div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap" as const, gap:"3px", marginBottom:"10px" }}>
          {p.certificaciones?.slice(0,3).map((c: string) => (
            <span key={c} style={{ background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"0.5px solid rgba(74,222,128,0.25)", fontSize:"9px", padding:"2px 6px", borderRadius:"4px" }}>{c}</span>
          ))}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", color:"rgba(255,255,255,0.3)", marginBottom:"10px" }}>
          <span>Next: {new Date(p.proxima_cosecha).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span>
          <span>Min. {p.volumen_minimo}t</span>
        </div>
        <button style={{ width:"100%", background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"11px", fontWeight:600, padding:"7px", borderRadius:"8px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>
          {t("View producer →","Ver productor →")}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", minHeight:"100vh", fontFamily:"sans-serif", background:"#020806", color:"white" }}>

      {/* SIDEBAR */}
      <div style={{ background:"#071a0e", borderRight:"0.5px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", minHeight:"100vh", position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        <div style={{ padding:"20px 20px 16px", borderBottom:"0.5px solid rgba(255,255,255,0.06)", marginBottom:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ color:"#4ade80", fontSize:"16px", fontWeight:500 }}>Surco.trade</div>
          <div style={{ display:"flex", gap:"4px" }}>
            {(["EN","ES"] as const).map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem("surco_lang", l); }} style={{ padding:"3px 8px", fontSize:"10px", borderRadius:"4px", border: lang === l ? "0.5px solid rgba(74,222,128,0.4)" : "0.5px solid rgba(255,255,255,0.1)", background: lang === l ? "rgba(74,222,128,0.15)" : "transparent", color: lang === l ? "#4ade80" : "rgba(255,255,255,0.3)", cursor:"pointer" }}>{l}</button>
            ))}
          </div>
        </div>

        <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px", letterSpacing:"1px", textTransform:"uppercase", padding:"12px 20px 4px" }}>{t("Main","Principal")}</div>
        <SideItem id="overview" label={t("Overview","Resumen")} icon={ic("M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z")} />
        <SideItem id="browse" label={t("Browse","Explorar")} icon={ic("M11 3a8 8 0 100 16 8 8 0 000-16zM21 21l-4.35-4.35")} />
        <SideItem id="orders" label={t("My orders","Mis pedidos")} icon={ic("M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 3h6v4H9z")} />
        <SideItem id="products" label={t("Products","Productos")} icon={ic("M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z")} />
        <SideItem id="prices" label={t("Prices","Precios")} icon={ic("M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6")} />
        <SideItem id="favorites" label={t("Favorites","Favoritos")} icon={ic("M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z")} badge={favorites.length > 0 ? favorites.length : undefined} />

        <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px", letterSpacing:"1px", textTransform:"uppercase", padding:"12px 20px 4px" }}>{t("My account","Mi cuenta")}</div>
        <SideItem id="documents" label={t("Documents","Documentos")} icon={ic("M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6")} />
        <SideItem id="notifications" label={t("Notifications","Notificaciones")} icon={ic("M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0")} badge={notifications.filter(n => !n.read).length} />
        <SideItem id="support" label={t("Support","Soporte")} icon={ic("M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z")} />

        <div style={{ marginTop:"auto", borderTop:"0.5px solid rgba(255,255,255,0.06)", paddingTop:"8px" }}>
          <SideItem id="profile" label={t("My profile","Mi perfil")} icon={ic("M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z")} />
          <div onClick={handleSignOut} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"9px 20px", color:"rgba(255,255,255,0.25)", fontSize:"13px", cursor:"pointer" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
            {t("Sign out","Cerrar sesión")}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ overflowY:"auto" }}>

        {/* UNSAVED CHANGES POPUP */}
        {showUnsavedPopup && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ background:"#0a2414", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"16px", padding:"28px 32px", maxWidth:"380px", width:"90%" }}>
              <div style={{ color:"white", fontSize:"16px", fontWeight:600, marginBottom:"8px" }}>{t("Unsaved changes","Cambios sin guardar")}</div>
              <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"13px", marginBottom:"24px", lineHeight:1.6 }}>{t("You have unsaved changes to this configuration.","Tienes cambios sin guardar en esta configuración.")}</div>
              <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                <button onClick={() => {
                  if (currentConfigRef.current) saveConfig(currentConfigRef.current);
                  setShowUnsavedPopup(false);
                  setIsDirty(false);
                  if (pendingNavigation) { pendingNavigation(); setPendingNavigation(null); }
                }} style={{ width:"100%", background:"#4ade80", color:"#071a0e", fontSize:"13px", fontWeight:600, padding:"11px", borderRadius:"50px", border:"none", cursor:"pointer" }}>
                  {t("Save and leave","Guardar y salir")}
                </button>
                <button onClick={() => {
                  setShowUnsavedPopup(false);
                }} style={{ width:"100%", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"13px", fontWeight:500, padding:"11px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>
                  {t("Keep editing","Seguir editando")}
                </button>
                <button onClick={() => {
                  setShowUnsavedPopup(false);
                  setIsDirty(false);
                  if (pendingNavigation) { pendingNavigation(); setPendingNavigation(null); }
                }} style={{ width:"100%", background:"transparent", color:"rgba(255,255,255,0.3)", fontSize:"12px", padding:"8px", border:"none", cursor:"pointer" }}>
                  {t("Leave without saving","Salir sin guardar")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCER PROFILE */}
        {selectedProducer && (
          <ProducerProfile
            producer={selectedProducer}
            onBack={() => handleNavigate(() => { setSelectedProducer(null); updateURL("products", selectedProductPage); })}
            isFavorite={isFavorite(selectedProducer)}
            onToggleFavorite={() => toggleFavorite(selectedProducer)}
            onSaveConfig={(config) => { saveConfig(config); setIsDirty(false); currentConfigRef.current = config; }}
            onConfigChange={(config) => { currentConfigRef.current = config; }}
            onDirty={() => setIsDirty(true)}
            lang={lang}
          />
        )}

        {/* PRODUCER LIST */}
        {!selectedProducer && selectedProductPage && (
          <div style={{ padding:"28px 36px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"16px", cursor:"pointer" }} onClick={() => { setSelectedProductPage(null); setSelectedProducer(null); updateURL("products"); }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              <span style={{ color:"#4ade80", fontSize:"12px" }}>{t("Back to Products","Volver a Productos")}</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"3px" }}>{selectedProductPage}</h2>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px" }}>{filteredProducers.length} {t("verified producers · Ecuador","productores verificados · Ecuador")}</div>
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:"8px", padding:"8px 12px", color:"white", fontSize:"12px", outline:"none", appearance:"none" as const }}>
                {["Best match","Price: Low to high","Price: High to low","Next harvest"].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>

            <div style={{ background:"#071a0e", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"14px 18px", marginBottom:"20px", display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" as const }}>
              <Dropdown label={t("Certifications","Certificaciones")} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} options={CERTS} selected={selCerts} onToggle={(v: string) => toggle(selCerts, v, setSelCerts)} onClear={() => setSelCerts([])} />
              <Dropdown label={t("Process","Proceso")} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>} options={PROCESSES} selected={selProcesses} onToggle={(v: string) => toggle(selProcesses, v, setSelProcesses)} onClear={() => setSelProcesses([])} />
              <Dropdown label={t("Country","País")} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>} options={COUNTRIES} selected={selCountries} onToggle={(v: string) => toggle(selCountries, v, setSelCountries)} onClear={() => setSelCountries([])} />
              <Dropdown label={t("Next harvest","Próxima cosecha")} icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>} options={HARVESTS} selected={selHarvest} onToggle={(v: string) => toggle(selHarvest, v, setSelHarvest)} onClear={() => setSelHarvest([])} />
              {hasFilters && <button onClick={() => { setSelCerts([]); setSelProcesses([]); setSelCountries([]); setSelHarvest([]); }} style={{ background:"transparent", color:"rgba(255,255,255,0.3)", fontSize:"11px", border:"none", cursor:"pointer", marginLeft:"auto" }}>{t("Clear all","Limpiar")}</button>}
            </div>

            {filteredProducers.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)", fontSize:"14px" }}>{t("No producers match your filters.","Ningún productor coincide con tus filtros.")}</div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
                {filteredProducers.map(p => <ProducerCard key={p.id} p={p} />)}
              </div>
            )}
          </div>
        )}

        {/* NORMAL SECTIONS */}
        {!selectedProducer && !selectedProductPage && (
          <div style={{ padding:"32px 40px" }}>

            {section === "overview" && (
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"24px" }}>
                  <div>
                    <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", marginBottom:"4px" }}>{t("Welcome back","Bienvenido")}</div>
                    <h1 style={{ color:"white", fontSize:"20px", fontWeight:600, margin:0 }}>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : user?.email}</h1>
                    <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px", marginTop:"2px" }}>{profile?.company} · {profile?.country}</div>
                  </div>
                  <div style={{ width:"38px", height:"38px", borderRadius:"50%", background:"rgba(74,222,128,0.12)", border:"0.5px solid rgba(74,222,128,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#4ade80", fontSize:"12px", fontWeight:600 }}>
                    {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"28px" }}>
                  {[[t("Active consolidations","Consolidaciones activas"),"3"],[t("Orders placed","Pedidos"),"7"],[t("Total volume","Volumen total"),"18 tons"],[t("Documents","Documentos"),"5"]].map(([label, val]) => (
                    <div key={label} style={card}>
                      <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>{label}</div>
                      <div style={{ color:"white", fontSize:"22px", fontWeight:600 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{ color:"white", fontSize:"14px", fontWeight:500, marginBottom:"14px" }}>{t("Your active consolidations","Tus consolidaciones activas")}</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {consolidations.filter(c => c.status !== "full").map(c => (
                    <div key={c.id} style={{ ...card, display:"grid", gridTemplateColumns:"1fr auto", gap:"16px", alignItems:"center" }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                          <span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{c.product} · {c.port}</span>
                          <Badge status={c.status} />
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px", marginBottom:"10px" }}>Departure {c.departure} · {c.price} · {c.daysLeft} days left</div>
                        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"4px", overflow:"hidden" }}>
                          <div style={{ background: c.status === "closing" ? "#fb923c" : "#4ade80", height:"100%", width:`${Math.round(c.slots/c.total*100)}%`, borderRadius:"4px" }} />
                        </div>
                      </div>
                      <button onClick={() => { setSection("browse"); updateURL("browse"); }} style={{ background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"11px", fontWeight:600, padding:"7px 14px", borderRadius:"50px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>{t("View","Ver")}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "browse" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Browse consolidations","Explorar consolidaciones")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Available consolidations matching your preferences.","Consolidaciones disponibles según tus preferencias.")}</p>
                <div style={{ display:"flex", gap:"6px", marginBottom:"16px" }}>
                  {["All","Seafood","Fruits"].map(f => (
                    <button key={f} onClick={() => setBrowseFilter(f)} style={{ padding:"6px 14px", fontSize:"11px", cursor:"pointer", borderRadius:"6px", color: browseFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: browseFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: browseFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {filteredBrowse.map(c => (
                    <div key={c.id} style={{ ...card, display:"grid", gridTemplateColumns:"1fr auto", gap:"20px", alignItems:"center", opacity: c.status === "full" ? 0.5 : 1 }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                          <span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{c.product} · {c.port}</span>
                          <Badge status={c.status} />
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px", marginBottom:"10px" }}>Departure {c.departure} · FOB Guayaquil · {c.price} · {c.daysLeft > 0 ? `${c.daysLeft} days left` : "Closed"}</div>
                        <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"4px", overflow:"hidden" }}>
                          <div style={{ background: c.status === "full" ? "#f87171" : c.status === "closing" ? "#fb923c" : "#4ade80", height:"100%", width:`${Math.round(c.slots/c.total*100)}%`, borderRadius:"4px" }} />
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginTop:"5px" }}>{c.slots} / {c.total} slots filled</div>
                      </div>
                      <button disabled={c.status === "full"} style={{ background: c.status === "full" ? "rgba(255,255,255,0.06)" : "#4ade80", color: c.status === "full" ? "rgba(255,255,255,0.25)" : "#071a0e", fontSize:"12px", fontWeight:600, padding:"9px 18px", borderRadius:"50px", border: c.status === "full" ? "0.5px solid rgba(255,255,255,0.08)" : "none", cursor: c.status === "full" ? "not-allowed" : "pointer", whiteSpace:"nowrap" as const }}>
                        {c.status === "full" ? "Full" : "Join →"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "orders" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("My orders","Mis pedidos")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Consolidations you have joined.","Consolidaciones en las que participas.")}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {orders.map(o => (
                    <div key={o.id} style={card}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
                        <div>
                          <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"4px" }}>{o.product} · {o.port}</div>
                          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px" }}>{o.id} · {o.tons} tons · {o.value}</div>
                        </div>
                        <Badge status={o.status} />
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginTop:"12px", paddingTop:"12px", borderTop:"0.5px solid rgba(255,255,255,0.06)", flexWrap:"wrap" as const }}>
                        <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>Departed {o.date}</span>
                        {o.eta && <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>ETA {o.eta}</span>}
                        <span style={{ display:"inline-block", fontSize:"10px", padding:"2px 8px", borderRadius:"4px", background:"rgba(74,222,128,0.12)", color:"#4ade80", border:"0.5px solid rgba(74,222,128,0.3)" }}>Signed {o.signed}</span>
                        <button onClick={() => { setSection("documents"); updateURL("documents"); }} style={{ marginLeft:"auto", background:"transparent", color:"#4ade80", fontSize:"11px", border:"none", cursor:"pointer" }}>{t("View contract →","Ver contrato →")}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "products" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Products","Productos")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Select a product to view verified producers.","Selecciona un producto para ver productores verificados.")}</p>
                <div style={{ display:"flex", gap:"6px", marginBottom:"16px" }}>
                  {["All","Seafood","Fruits","Agro"].map(f => (
                    <button key={f} onClick={() => setProdFilter(f)} style={{ padding:"6px 14px", fontSize:"11px", cursor:"pointer", borderRadius:"6px", color: prodFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: prodFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: prodFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
                  ))}
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"12px" }}>
                  {filteredProducts.map(p => (
                    <div key={p.name} style={card}>
                      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>{p.cat}</div>
                      <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"4px" }}>{p.name}</div>
                      <div style={{ color:"#4ade80", fontSize:"13px", marginBottom:"4px" }}>{p.price}</div>
                      <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", marginBottom:"12px" }}>{p.season}</div>
                      <button onClick={() => { setSelectedProductPage(p.name); setSelCerts([]); setSelProcesses([]); setSelCountries([]); setSelHarvest([]); updateURL("products", p.name); }} style={{ width:"100%", background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"11px", fontWeight:600, padding:"7px", borderRadius:"6px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>
                        {t("View producers →","Ver productores →")}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "favorites" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Favorites","Favoritos")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Producers you have saved.","Productores que has guardado.")}</p>
                {favorites.length === 0 ? (
                  <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.25)", fontSize:"14px" }}>
                    {t("No favorites yet. Star a producer to save them here.","Aún no tienes favoritos. Marca un productor con ★ para guardarlo.")}
                  </div>
                ) : (
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
                    {favorites.map((f: any) => f.config ? (
                      <div key={f.id} style={card}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                          <div>
                            <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"3px" }}>{f.nombre}</div>
                            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>{f.region}, {f.country}</div>
                          </div>
                          <div onClick={() => { setFavorites(prev => { const u = prev.filter((x: any) => x.id !== f.id); localStorage.setItem("surco_favorites", JSON.stringify(u)); return u; }); }} style={{ cursor:"pointer", color:"#facc15", fontSize:"18px" }}>★</div>
                        </div>
                        <div style={{ display:"flex", flexWrap:"wrap" as const, gap:"6px", marginBottom:"12px" }}>
                          <span style={{ background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"0.5px solid rgba(74,222,128,0.25)", fontSize:"10px", padding:"3px 8px", borderRadius:"4px" }}>{f.config.talla?.label} · ${f.config.talla?.precio}/kg</span>
                          {f.config.presentacion?.map((p: string) => <span key={p} style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"10px", padding:"3px 8px", borderRadius:"4px" }}>{p}</span>)}
                          {f.config.proceso?.map((p: string) => <span key={p} style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"10px", padding:"3px 8px", borderRadius:"4px" }}>{p}</span>)}
                          <span style={{ background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"10px", padding:"3px 8px", borderRadius:"4px" }}>{f.config.action === "container" ? `${f.config.qty} container${f.config.qty > 1 ? "s" : ""}` : "Consolidation"}</span>
                        </div>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:"rgba(74,222,128,0.06)", borderRadius:"8px", border:"0.5px solid rgba(74,222,128,0.15)", marginBottom:"12px" }}>
                          <span style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{t("Estimated total","Total estimado")}</span>
                          <span style={{ color:"#4ade80", fontSize:"16px", fontWeight:600 }}>${f.config.totalEstimado?.toLocaleString()}</span>
                        </div>
                        <button onClick={() => { setSelectedProducer(f); setIsDirty(false); currentConfigRef.current = f.config; setSection("products"); updateURL("products", "Vannamei Shrimp", f.id); }} style={{ width:"100%", background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"12px", fontWeight:600, padding:"8px", borderRadius:"8px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>{t("Continue →","Continuar →")}</button>
                      </div>
                    ) : <ProducerCard key={f.id} p={f} />)}
                  </div>
                )}
              </div>
            )}

            {section === "prices" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Live prices","Precios en vivo")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Current export prices from Ecuador.","Precios actuales de exportación desde Ecuador.")}</p>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ borderBottom:"0.5px solid rgba(255,255,255,0.07)" }}>
                      {[t("Product","Producto"),t("Category","Categoría"),t("Price","Precio"),t("Change","Cambio")].map((h, i) => (
                        <th key={h} style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", fontWeight:400, textAlign: i > 1 ? "right" : "left", padding:"10px 12px", textTransform:"uppercase", letterSpacing:"0.5px" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map(p => (
                      <tr key={p.name} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding:"12px", fontSize:"12px", color:"white" }}>{p.name}</td>
                        <td style={{ padding:"12px", fontSize:"12px", color:"rgba(255,255,255,0.35)" }}>{p.cat}</td>
                        <td style={{ padding:"12px", fontSize:"12px", color:"white", textAlign:"right" }}>{p.price}</td>
                        <td style={{ padding:"12px", fontSize:"12px", color: p.up ? "#4ade80" : "#f87171", textAlign:"right" }}>{p.change}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {section === "documents" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Documents","Documentos")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Your B/L, invoices, certificates and signed contracts.","Tus B/L, facturas, certificados y contratos firmados.")}</p>
                <div style={{ display:"flex", gap:"6px", marginBottom:"16px" }}>
                  {["All","Signed","Other"].map(f => (
                    <button key={f} onClick={() => setDocFilter(f)} style={{ padding:"6px 14px", fontSize:"11px", cursor:"pointer", borderRadius:"6px", color: docFilter === f ? "#4ade80" : "rgba(255,255,255,0.4)", background: docFilter === f ? "rgba(74,222,128,0.12)" : "transparent", border: docFilter === f ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)" }}>{f}</button>
                  ))}
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {filteredDocs.map((d, i) => (
                    <div key={i} style={{ ...card, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"3px" }}>
                          <span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{d.name}</span>
                          {d.type === "signed" && <Badge status="signed" />}
                        </div>
                        <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px" }}>{d.ref} · {d.date} · PDF</div>
                      </div>
                      <button style={{ background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"11px", fontWeight:600, padding:"7px 14px", borderRadius:"6px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>{t("Download","Descargar")}</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "notifications" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Notifications","Notificaciones")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Your latest alerts and updates.","Tus últimas alertas y actualizaciones.")}</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
                  {notifications.map((n, i) => (
                    <div key={i} style={{ ...card, display:"flex", gap:"14px", alignItems:"flex-start", borderColor: n.read ? "rgba(255,255,255,0.07)" : "rgba(74,222,128,0.15)" }}>
                      <div style={{ width:"8px", height:"8px", borderRadius:"50%", background: n.read ? "rgba(255,255,255,0.15)" : "#4ade80", flexShrink:0, marginTop:"3px" }} />
                      <div>
                        <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"3px" }}>{n.title}</div>
                        <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>{n.body}</div>
                        <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px", marginTop:"4px" }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {section === "support" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("Support","Soporte")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Contact the Surco.trade team directly.","Contacta directamente al equipo de Surco.trade.")}</p>
                <div style={{ ...card, maxWidth:"480px" }}>
                  <div style={{ marginBottom:"14px" }}><label style={lbl}>{t("Subject","Asunto")}</label><input style={inp} placeholder={t("e.g. Question about my order","ej. Pregunta sobre mi pedido")} /></div>
                  <div style={{ marginBottom:"20px" }}><label style={lbl}>{t("Message","Mensaje")}</label><textarea style={{ ...inp, resize:"vertical", minHeight:"100px" } as React.CSSProperties} placeholder={t("Describe your question or issue...","Describe tu pregunta o problema...")} /></div>
                  <button style={{ background:"#4ade80", color:"#071a0e", fontSize:"13px", fontWeight:600, padding:"11px 24px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Send message →","Enviar mensaje →")}</button>
                </div>
              </div>
            )}

            {section === "profile" && (
              <div>
                <h2 style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"6px" }}>{t("My profile","Mi perfil")}</h2>
                <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"13px", marginBottom:"20px" }}>{t("Your company and contact information.","Tu empresa e información de contacto.")}</p>
                <div style={{ ...card, maxWidth:"480px" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
                    {[[t("Company","Empresa"), profile?.company||""],[t("Country","País"), profile?.country||""],[t("First name","Nombre"), profile?.first_name||""],[t("Last name","Apellido"), profile?.last_name||""],[t("Email","Correo"), user?.email||""],[t("WhatsApp","WhatsApp"), profile?.whatsapp||""]].map(([label, val]) => (
                      <div key={label}><label style={lbl}>{label}</label><input style={inp} defaultValue={val} /></div>
                    ))}
                  </div>
                  <div style={{ marginTop:"14px" }}>
                    <label style={lbl}>{t("Destination port","Puerto de destino")}</label>
                    <input style={inp} defaultValue={profile?.port||""} />
                  </div>
                  <button style={{ marginTop:"20px", background:"#4ade80", color:"#071a0e", fontSize:"13px", fontWeight:600, padding:"11px 24px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Save changes","Guardar cambios")}</button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}