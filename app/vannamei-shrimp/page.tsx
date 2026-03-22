"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const CERTS = ["ASC","BAP","Organic","GlobalG.A.P.","HACCP","Rainforest","Fair Trade"];
const PROCESSES = ["Fresh","Frozen","Processed","Whole","Peeled"];
const REGIONS = ["Pacific Coast","Gulf of Guayaquil","Manabí","El Oro","Esmeraldas"];

const MOCK = [
  { id:1, nombre:"Aquafarm El Guabo", region:"Gulf of Guayaquil", anos_experiencia:14, producto_principal:"Vannamei Shrimp", precio_kg:4.10, volumen_minimo:2, proxima_cosecha:"2026-04-05", certificaciones:["ASC","BAP","HACCP"], procesos:["Fresh","Frozen"] },
  { id:2, nombre:"Mar Pacífico S.A.", region:"Pacific Coast", anos_experiencia:22, producto_principal:"Vannamei Shrimp", precio_kg:4.20, volumen_minimo:5, proxima_cosecha:"2026-04-12", certificaciones:["ASC","BAP","GlobalG.A.P.","HACCP"], procesos:["Fresh","Frozen","Processed"] },
  { id:3, nombre:"Camaronera Manabí", region:"Manabí", anos_experiencia:8, producto_principal:"Vannamei Shrimp", precio_kg:3.90, volumen_minimo:1, proxima_cosecha:"2026-04-20", certificaciones:["BAP","HACCP"], procesos:["Fresh"] },
  { id:4, nombre:"Ecuamar Premium", region:"El Oro", anos_experiencia:18, producto_principal:"Vannamei Shrimp", precio_kg:4.20, volumen_minimo:3, proxima_cosecha:"2026-05-01", certificaciones:["ASC","BAP","Organic","HACCP"], procesos:["Fresh","Frozen"] },
  { id:5, nombre:"Aquacultura del Sur", region:"Pacific Coast", anos_experiencia:11, producto_principal:"Vannamei Shrimp", precio_kg:4.05, volumen_minimo:2, proxima_cosecha:"2026-04-08", certificaciones:["BAP","GlobalG.A.P.","HACCP"], procesos:["Fresh","Frozen"] },
  { id:6, nombre:"Esmeraldas Shrimp Co.", region:"Esmeraldas", anos_experiencia:6, producto_principal:"Vannamei Shrimp", precio_kg:3.85, volumen_minimo:1, proxima_cosecha:"2026-04-15", certificaciones:["BAP","Fair Trade"], procesos:["Fresh"] },
];

export default function CatalogPage() {
  const [selectedCerts, setSelectedCerts] = useState<string[]>([]);
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(8);
  const [maxVolume, setMaxVolume] = useState(50);
  const [harvest, setHarvest] = useState("Any time");
  const [sortBy, setSortBy] = useState("Best match");
  const [producers, setProducers] = useState(MOCK);

  useEffect(() => {
    supabase.from("productores_perfil").select("*")
      .eq("activo", true)
      .eq("producto_principal", "Vannamei Shrimp")
      .then(({ data }) => {
        if (data && data.length > 0) setProducers(data);
      });
  }, []);

  const toggleCert = (c: string) => setSelectedCerts(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  const toggleProcess = (p: string) => setSelectedProcesses(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  const toggleRegion = (r: string) => setSelectedRegions(prev => prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]);

  const filtered = producers.filter(p => {
    if (selectedCerts.length > 0 && !selectedCerts.every(c => p.certificaciones?.includes(c))) return false;
    if (selectedProcesses.length > 0 && !selectedProcesses.some(pr => p.procesos?.includes(pr))) return false;
    if (selectedRegions.length > 0 && !selectedRegions.includes(p.region)) return false;
    if (p.precio_kg > maxPrice) return false;
    if (p.volumen_minimo > maxVolume) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Price: Low to high") return a.precio_kg - b.precio_kg;
    if (sortBy === "Price: High to low") return b.precio_kg - a.precio_kg;
    if (sortBy === "Next harvest") return new Date(a.proxima_cosecha).getTime() - new Date(b.proxima_cosecha).getTime();
    return 0;
  });

  const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: "8px", padding: "9px 12px", color: "white", fontSize: "12px", outline: "none", appearance: "none" as const };

  return (
    <div style={{ background: "#020806", minHeight: "100vh", fontFamily: "sans-serif", color: "white" }}>

      {/* NAV */}
      <nav style={{ background: "#071a0e", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 48px", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
        <div onClick={() => window.location.href = "/"} style={{ color: "#4ade80", fontSize: "16px", fontWeight: 500, cursor: "pointer" }}>Surco.trade</div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Products","Producers","How it works"].map(item => (
            <span key={item} style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => window.location.href = "/access"} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: "13px", padding: "7px 16px", borderRadius: "8px", border: "0.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Sign in</button>
          <button onClick={() => window.location.href = "/access"} style={{ background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: "13px", padding: "7px 16px", borderRadius: "8px", border: "0.5px solid rgba(255,255,255,0.2)", cursor: "pointer" }}>Create account</button>
        </div>
      </nav>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>

        {/* FILTERS */}
        <div style={{ background: "#071a0e", borderRight: "0.5px solid rgba(255,255,255,0.06)", padding: "28px 24px", minHeight: "calc(100vh - 53px)" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ color: "white", fontSize: "14px", fontWeight: 500, marginBottom: "4px" }}>Filters</div>
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>Showing {sorted.length} producers</div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Certifications</div>
            <div>
              {CERTS.map(c => (
                <span key={c} onClick={() => toggleCert(c)} style={{ display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", margin: "3px", border: selectedCerts.includes(c) ? "0.5px solid rgba(74,222,128,0.35)" : "0.5px solid rgba(255,255,255,0.1)", color: selectedCerts.includes(c) ? "#4ade80" : "rgba(255,255,255,0.45)", background: selectedCerts.includes(c) ? "rgba(74,222,128,0.12)" : "transparent" }}>{c}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Process</div>
            <div>
              {PROCESSES.map(p => (
                <span key={p} onClick={() => toggleProcess(p)} style={{ display: "inline-flex", alignItems: "center", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", cursor: "pointer", margin: "3px", border: selectedProcesses.includes(p) ? "0.5px solid rgba(74,222,128,0.35)" : "0.5px solid rgba(255,255,255,0.1)", color: selectedProcesses.includes(p) ? "#4ade80" : "rgba(255,255,255,0.45)", background: selectedProcesses.includes(p) ? "rgba(74,222,128,0.12)" : "transparent" }}>{p}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Region</div>
            {REGIONS.map(r => (
              <div key={r} onClick={() => toggleRegion(r)} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 0", cursor: "pointer", fontSize: "12px", color: selectedRegions.includes(r) ? "white" : "rgba(255,255,255,0.45)" }}>
                <div style={{ width: "14px", height: "14px", borderRadius: "3px", border: selectedRegions.includes(r) ? "none" : "0.5px solid rgba(255,255,255,0.2)", background: selectedRegions.includes(r) ? "#4ade80" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {selectedRegions.includes(r) && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><polyline points="2,5 4,7 8,3" stroke="#071a0e" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                </div>
                {r}
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Max price / kg</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>$1.00</span>
              <span style={{ color: "white", fontSize: "11px", fontWeight: 500 }}>${maxPrice.toFixed(2)}</span>
            </div>
            <input type="range" min="1" max="8" step="0.1" value={maxPrice} onChange={e => setMaxPrice(parseFloat(e.target.value))} style={{ width: "100%", accentColor: "#4ade80" }} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Min. volume (tons)</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>1 ton</span>
              <span style={{ color: "white", fontSize: "11px", fontWeight: 500 }}>{maxVolume} tons</span>
            </div>
            <input type="range" min="1" max="50" step="1" value={maxVolume} onChange={e => setMaxVolume(parseInt(e.target.value))} style={{ width: "100%", accentColor: "#4ade80" }} />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>Next harvest</div>
            <select value={harvest} onChange={e => setHarvest(e.target.value)} style={inp}>
              {["Any time","Within 2 weeks","Within 1 month","Within 3 months"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          <button onClick={() => { setSelectedCerts([]); setSelectedProcesses([]); setSelectedRegions([]); setMaxPrice(8); setMaxVolume(50); setHarvest("Any time"); }} style={{ width: "100%", background: "transparent", color: "rgba(255,255,255,0.3)", fontSize: "12px", padding: "8px", border: "none", cursor: "pointer" }}>Clear all filters</button>
        </div>

        {/* GRID */}
        <div style={{ padding: "28px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <h1 style={{ color: "white", fontSize: "20px", fontWeight: 600, marginBottom: "4px" }}>Vannamei Shrimp</h1>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>{sorted.length} verified producers · Ecuador</div>
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inp, width: "auto" }}>
              {["Best match","Price: Low to high","Price: High to low","Next harvest"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>

          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)", fontSize: "14px" }}>No producers match your filters. Try adjusting them.</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
              {sorted.map(p => (
                <div key={p.id} onClick={() => window.location.href = `/producers/${p.id}`}
                  style={{ background: "#071a0e", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "12px", overflow: "hidden", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(74,222,128,0.25)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)")}>
                  <div style={{ height: "120px", background: "#0a2414", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="rgba(74,222,128,0.3)" strokeWidth="1.2">
                      <path d="M10 34 C13 27 20 23 29 25 C35 27 40 22 38 15"/>
                      <path d="M29 25 C31 30 29 37 24 39 C19 41 13 39 10 34"/>
                      <circle cx="37" cy="13" r="2" fill="rgba(74,222,128,0.3)" stroke="none"/>
                    </svg>
                  </div>
                  <div style={{ padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div>
                        <div style={{ color: "white", fontSize: "13px", fontWeight: 500 }}>{p.nombre}</div>
                        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px", marginTop: "2px" }}>{p.region} · {p.anos_experiencia} years</div>
                      </div>
                      <div style={{ color: "#4ade80", fontSize: "13px", fontWeight: 500 }}>${p.precio_kg.toFixed(2)}/kg</div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "4px", marginBottom: "12px" }}>
                      {p.certificaciones?.slice(0,4).map((c: string) => (
                        <span key={c} style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80", border: "0.5px solid rgba(74,222,128,0.25)", fontSize: "10px", padding: "2px 7px", borderRadius: "4px" }}>{c}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>
                      <span>Next harvest: {new Date(p.proxima_cosecha).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span>Min. {p.volumen_minimo} ton{p.volumen_minimo > 1 ? "s" : ""}</span>
                    </div>
                    <button style={{ width: "100%", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "12px", fontWeight: 600, padding: "8px", borderRadius: "8px", border: "0.5px solid rgba(74,222,128,0.3)", cursor: "pointer" }}>
                      View producer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}