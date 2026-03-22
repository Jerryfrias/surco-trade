"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ALL_PRES, ALL_PROC, ALL_PACK } from "./data";

const certTag = (label: string) => (
  <span key={label} style={{ display:"inline-flex", background:"rgba(74,222,128,0.1)", color:"#4ade80", border:"0.5px solid rgba(74,222,128,0.25)", fontSize:"10px", padding:"4px 9px", borderRadius:"6px", margin:"2px" }}>{label}</span>
);

const Opt = ({ label, sub, available, selected, onToggle }: any) => (
  <div onClick={() => available && onToggle()} style={{ display:"inline-flex", alignItems:"center", gap:"7px", padding:"8px 14px", borderRadius:"8px", cursor: available ? "pointer" : "not-allowed", margin:"3px", fontSize:"12px", border: selected ? "2px solid #4ade80" : "1.5px solid rgba(255,255,255,0.1)", color: selected ? "white" : available ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)", background: selected ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)", opacity: available ? 1 : 0.3 }}>
    <div style={{ width:"8px", height:"8px", borderRadius:"50%", border: selected ? "none" : "1.5px solid rgba(255,255,255,0.3)", background: selected ? "#4ade80" : "transparent", flexShrink:0 }} />
    {label}{sub && <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.35)", marginLeft:"3px" }}>{sub}</span>}
  </div>
);

export default function ProducerProfile({ producer, onBack, isFavorite, onToggleFavorite, onSaveConfig, onDirty, onConfigChange, lang }: {
  producer: any,
  onBack: () => void,
  isFavorite: boolean,
  onToggleFavorite: () => void,
  onSaveConfig: (config: any) => void,
  onDirty: () => void,
  onConfigChange: (config: any) => void,
  lang: string
}) {
  const t = (en: string, es: string) => lang === "EN" ? en : es;

const [selectedTalla, setSelectedTalla] = useState(
    producer.config?.talla || producer.tallas?.find((t: any) => t.precio) || producer.tallas?.[0]
  );
  const [selectedPres, setSelectedPres] = useState<string[]>(
    producer.config?.presentacion || [producer.presentaciones?.[0]].filter(Boolean)
  );
  const [selectedProc, setSelectedProc] = useState<string[]>(
    producer.config?.proceso || [producer.procesos?.[0]].filter(Boolean)
  );
  const [selectedPack, setSelectedPack] = useState<string[]>(
    producer.config?.packaging || [producer.packaging?.[1] || producer.packaging?.[0]].filter(Boolean)
  );
  const [action, setAction] = useState<"container"|"consol">(producer.config?.action || "container");
  const [qty, setQty] = useState(producer.config?.qty || 1);
  const isFromFavorite = !!producer.config;
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const [saved, setSaved] = useState(false);

  const TONS = 22000;
  const FREIGHT = 3200;
  const subtotal = TONS * (selectedTalla?.precio || 0) * qty;
  const freight = FREIGHT * qty;
  const total = subtotal + freight;

  useEffect(() => {
    if (producer.config) {
      onConfigChange({
        producer,
        talla: selectedTalla,
        presentacion: selectedPres,
        proceso: selectedProc,
        packaging: selectedPack,
        action,
        qty,
        totalEstimado: TONS * (selectedTalla?.precio || 0) * qty + FREIGHT * qty,
        savedAt: new Date().toISOString(),
      });
    }
  }, [selectedTalla, selectedPres, selectedProc, selectedPack, action, qty, onConfigChange]);

  const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    if (producer.config) onDirty();
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  };

  const handleSaveConfig = () => {
    const config = {
      producer,
      talla: selectedTalla,
      presentacion: selectedPres,
      proceso: selectedProc,
      packaging: selectedPack,
      action,
      qty,
      totalEstimado: total,
      savedAt: new Date().toISOString(),
    };
    onSaveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const card: React.CSSProperties = { background:"#071a0e", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"12px", padding:"20px" };
  const stitle: React.CSSProperties = { color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"14px" };

  return (
    <div style={{ padding:"28px 36px", overflowY:"auto" }}>

      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px", fontSize:"12px", color:"rgba(255,255,255,0.3)" }}>
        <span onClick={onBack} style={{ cursor:"pointer", color:"#4ade80" }}>← {t("Products","Productos")}</span>
        <span>/</span>
        <span onClick={onBack} style={{ cursor:"pointer", color:"#4ade80" }}>Vannamei Shrimp</span>
        <span>/</span>
        <span style={{ color:"rgba(255,255,255,0.5)" }}>{producer.nombre}</span>
      </div>

      {/* HEADER */}
      <div style={{ ...card, marginBottom:"16px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:"24px", alignItems:"start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
              <h1 style={{ fontSize:"20px", fontWeight:600 }}>{producer.nombre}</h1>
              <span style={{ background:"rgba(74,222,128,0.15)", color:"#4ade80", border:"0.5px solid rgba(74,222,128,0.3)", fontSize:"10px", padding:"3px 8px", borderRadius:"4px" }}>Verified</span>

            </div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", marginBottom:"10px" }}>Vannamei Shrimp · {producer.region}, {producer.country} · {producer.anos_experiencia} years</div>
            <div>{producer.certificaciones?.map((c: string) => certTag(c))}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px", marginBottom:"3px" }}>{t("Starting from","Desde")}</div>
            <div style={{ color:"#4ade80", fontSize:"22px", fontWeight:600 }}>${selectedTalla?.precio?.toFixed(2)}<span style={{ fontSize:"13px", fontWeight:400, color:"rgba(255,255,255,0.35)" }}>/kg</span></div>
            <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px" }}>FOB Guayaquil</div>
          </div>
        </div>
      </div>

      {/* SPECS + HARVEST */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
        <div style={card}>
          <div style={stitle}>{t("Product specifications","Especificaciones del producto")}</div>

          <div style={{ marginBottom:"16px" }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, marginBottom:"8px" }}>{t("Size & price / kg","Talla & precio / kg")}</div>
            <div>
              {producer.tallas?.map((t: any) => (
                <div key={t.label} onClick={() => { if (t.precio) { if (producer.config) onDirty(); setSelectedTalla(t); } }} style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", padding:"10px 14px", borderRadius:"8px", cursor: t.precio ? "pointer" : "not-allowed", margin:"3px", minWidth:"68px", border: selectedTalla?.label === t.label ? "2px solid #4ade80" : "1.5px solid rgba(255,255,255,0.1)", background: selectedTalla?.label === t.label ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)", opacity: t.precio ? 1 : 0.25 }}>
                  <span style={{ fontSize:"13px", fontWeight:600, color: selectedTalla?.label === t.label ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{t.label}</span>
                  <span style={{ fontSize:"10px", color: selectedTalla?.label === t.label ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)", marginTop:"2px" }}>{t.precio ? `$${t.precio}/kg` : "N/A"}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:"14px" }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, marginBottom:"8px" }}>{t("Presentation","Presentación")}</div>
            {ALL_PRES.map(p => (
              <Opt key={p} label={p} sub={p==="HLSO"?"Head-less, shell-on":p==="PD"?"Peeled & deveined":p==="HOSO"?"Head-on, shell-on":"Peeled undeveined"} available={producer.presentaciones?.includes(p)} selected={selectedPres.includes(p)} onToggle={() => toggle(selectedPres, p, setSelectedPres)} />
            ))}
          </div>

          <div style={{ marginBottom:"14px" }}>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, marginBottom:"8px" }}>{t("Process","Proceso")}</div>
            {ALL_PROC.map(p => (
              <Opt key={p} label={p} available={producer.procesos?.includes(p)} selected={selectedProc.includes(p)} onToggle={() => toggle(selectedProc, p, setSelectedProc)} />
            ))}
          </div>

          <div>
            <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, marginBottom:"8px" }}>{t("Packaging","Empaque")}</div>
            {ALL_PACK.map(p => (
              <Opt key={p} label={p} available={producer.packaging?.includes(p)} selected={selectedPack.includes(p)} onToggle={() => toggle(selectedPack, p, setSelectedPack)} />
            ))}
          </div>

          <div style={{ background:"rgba(74,222,128,0.08)", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"10px", padding:"12px 16px", marginTop:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{t("Selected price","Precio seleccionado")}</div>
            <div style={{ color:"#4ade80", fontSize:"20px", fontWeight:600 }}>${selectedTalla?.precio?.toFixed(2)}<span style={{ fontSize:"12px", fontWeight:400, color:"rgba(255,255,255,0.35)" }}>/kg</span></div>
          </div>
          <div style={{ marginTop:"8px", color:"rgba(255,255,255,0.2)", fontSize:"10px" }}>{t("Green = selected · Gray = not offered","Verde = seleccionado · Gris = no disponible")}</div>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={card}>
            <div style={stitle}>{t("Harvest & availability","Cosecha & disponibilidad")}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
              {[
                [t("Next harvest","Próxima cosecha"), new Date(producer.proxima_cosecha).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})],
                [t("Available","Disponible"), `~${producer.volumen_disponible} tons`],
                [t("Min. order","Pedido mínimo"), `${producer.volumen_minimo} tons`],
                [t("Lead time","Tiempo de entrega"), producer.lead_time],
              ].map(([label, val]) => (
                <div key={label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:"8px", padding:"12px" }}>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"4px" }}>{label}</div>
                  <div style={{ color:"white", fontSize:"14px", fontWeight:500 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={card}>
            <div style={stitle}>{t("Packing house","Empacadora")}</div>
            <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"3px" }}>{producer.empacadora_nombre}</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", marginBottom:"10px" }}>{producer.region} · Est. {producer.empacadora_ano}</div>
            <div>{producer.empacadora_certs?.map((c: string) => certTag(c))}</div>
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div style={{ ...card, marginBottom:"16px" }}>
        <div style={stitle}>{t("Location","Ubicación")}</div>
        <div style={{ background:"#041208", borderRadius:"8px", height:"120px", position:"relative", overflow:"hidden", border:"0.5px solid rgba(74,222,128,0.07)" }}>
          <svg width="100%" height="100%" viewBox="0 0 700 120" fill="none" preserveAspectRatio="xMidYMid slice">
            <rect width="700" height="120" fill="#041208"/>
            <path d="M0 60 Q175 40 350 55 Q525 70 700 50" stroke="rgba(74,222,128,0.05)" strokeWidth="45" fill="none"/>
            <circle cx="220" cy="60" r="7" fill="#4ade80" opacity="0.9"/>
            <circle cx="220" cy="60" r="14" fill="#4ade80" opacity="0.15"/>
            <circle cx="220" cy="60" r="22" fill="#4ade80" opacity="0.05"/>
          </svg>
          <div style={{ position:"absolute", top:"15px", left:"245px", background:"#0a2414", border:"0.5px solid rgba(74,222,128,0.25)", borderRadius:"8px", padding:"8px 12px", whiteSpace:"nowrap" }}>
            <div style={{ color:"white", fontSize:"12px", fontWeight:500 }}>{producer.nombre}</div>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"10px" }}>{producer.region}, {producer.country}</div>
          </div>
        </div>
      </div>

      {/* HOW TO PROCEED */}
      <div style={{ ...card, marginBottom:"16px" }}>
        <div style={stitle}>{t("How do you want to proceed?","¿Cómo quieres proceder?")}</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
          {[
            { id:"container", label:t("Buy full container","Comprar contenedor completo"), sub:t("22 tons exclusively for you.","22 toneladas exclusivamente para ti."), icon:"M2 3h20v14a2 2 0 01-2 2H4a2 2 0 01-2-2V3zM8 21h8M12 17v4" },
            { id:"consol", label:t("Start / join consolidation","Iniciar / unirse a consolidación"), sub:t("Share a container. Pay only for your slots.","Comparte un contenedor. Paga solo por tus slots."), icon:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
          ].map(opt => (
            <div key={opt.id} onClick={() => setAction(opt.id as any)} style={{ border: action === opt.id ? "2px solid #4ade80" : "1.5px solid rgba(255,255,255,0.1)", borderRadius:"10px", padding:"14px", cursor:"pointer", background: action === opt.id ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.02)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                <div style={{ width:"28px", height:"28px", borderRadius:"7px", background: action === opt.id ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={action === opt.id ? "#4ade80" : "rgba(255,255,255,0.3)"} strokeWidth="1.5"><path d={opt.icon}/></svg>
                </div>
                <span style={{ color: action === opt.id ? "white" : "rgba(255,255,255,0.4)", fontSize:"13px", fontWeight:500 }}>{opt.label}</span>
              </div>
              <div style={{ color: action === opt.id ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.2)", fontSize:"11px", lineHeight:1.5 }}>{opt.sub}</div>
            </div>
          ))}
        </div>

        {action === "container" && (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"10px", padding:"18px", marginBottom:"14px" }}>
            <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"14px" }}>{t("Container order summary","Resumen del pedido")}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:"16px" }}>
              <div>
                <div style={{ color:"white", fontSize:"13px", marginBottom:"2px" }}>20ft Reefer · 22 tons · {selectedTalla?.label} IQF HLSO</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>{producer.nombre}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                <div onClick={() => { if (producer.config) onDirty(); setQty(Math.max(1,qty-1)); }} style={{ width:"32px", height:"32px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</div>
                <div style={{ color:"white", fontSize:"18px", fontWeight:600, minWidth:"24px", textAlign:"center" }}>{qty}</div>
                <div onClick={() => { if (producer.config) onDirty(); setQty(qty+1); }} style={{ width:"32px", height:"32px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</div>
              </div>
            </div>
            <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.07)", paddingTop:"14px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
                <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px" }}>22,000 kg × ${selectedTalla?.precio?.toFixed(2)}/kg × {qty} container{qty > 1 ? "s" : ""}</span>
                <span style={{ color:"white", fontSize:"12px" }}>${subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"10px" }}>
                <span style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px" }}>{t("Freight estimate (Rotterdam)","Estimado de flete (Rotterdam)")}</span>
                <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px" }}>~${freight.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"10px", borderTop:"0.5px solid rgba(255,255,255,0.07)" }}>
                <span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{t("Estimated total","Total estimado")}</span>
                <span style={{ color:"#4ade80", fontSize:"18px", fontWeight:600 }}>${total.toLocaleString()}</span>
              </div>
              <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px", marginTop:"6px" }}>* {t("Freight is an estimate. Final price confirmed by Surco.trade team.","El flete es un estimado. Precio final confirmado por el equipo de Surco.trade.")}</div>
            </div>
            <button style={{ width:"100%", background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"13px", borderRadius:"50px", border:"none", cursor:"pointer", marginTop:"16px" }}>{t("Reserve container →","Reservar contenedor →")}</button>
          </div>
        )}

        {action === "consol" && (
          <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.07)", borderRadius:"10px", padding:"16px", marginBottom:"14px" }}>
            <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"10px" }}>{t("Active consolidations from this producer","Consolidaciones activas de este productor")}</div>
            {producer.consolidaciones?.length > 0 ? (
              <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"14px" }}>
                {producer.consolidaciones.map((c: any, i: number) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 12px", background:"rgba(255,255,255,0.03)", borderRadius:"8px", border:`0.5px solid ${c.status==="open"?"rgba(74,222,128,0.1)":"rgba(251,146,60,0.1)"}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <div style={{ width:"5px", height:"5px", borderRadius:"50%", background: c.status==="open" ? "#4ade80" : "#fb923c" }}/>
                      <span style={{ color:"white", fontSize:"12px" }}>{c.puerto}</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                      <span style={{ color:"rgba(255,255,255,0.3)", fontSize:"11px" }}>{c.slots}/{c.total} slots · {c.fecha}</span>
                      <span style={{ background: c.status==="open"?"rgba(74,222,128,0.12)":"rgba(251,146,60,0.12)", color: c.status==="open"?"#4ade80":"#fb923c", border:`0.5px solid ${c.status==="open"?"rgba(74,222,128,0.25)":"rgba(251,146,60,0.25)"}`, fontSize:"10px", padding:"2px 7px", borderRadius:"4px" }}>
                        {c.status==="open"?"Open":"Closing"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", marginBottom:"14px" }}>{t("No active consolidations. Be the first to start one.","No hay consolidaciones activas. Sé el primero en iniciar una.")}</div>
            )}
            <button style={{ width:"100%", background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"13px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Start / join consolidation →","Iniciar / unirse a consolidación →")}</button>
          </div>
        )}

        {/* SAVE TO FAVORITES */}
        <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.07)", paddingTop:"14px", display:"flex", justifyContent:"center" }}>
          <button onClick={handleSaveConfig} style={{ display:"flex", alignItems:"center", gap:"8px", background: saved ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)", color: saved ? "#4ade80" : "rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, padding:"10px 20px", borderRadius:"50px", border: saved ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)", cursor:"pointer", transition:"all 0.2s" }}>
            <span style={{ fontSize:"16px" }}>{saved ? "★" : "☆"}</span>
            {saved 
    ? t("Saved!","¡Guardado!") 
    : isFromFavorite 
      ? t("Update favorite","Actualizar favorito") 
      : t("Save this configuration to favorites","Guardar esta configuración en favoritos")}
          </button>
        </div>
      </div>

      {/* NOTES */}
      <div style={card}>
        <div style={stitle}>{t("Notes for Surco.trade team","Notas para el equipo de Surco.trade")}</div>
        <p style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px", marginBottom:"10px" }}>{t("Any specific requirements? Our team will review and follow up directly.","¿Algún requisito específico? Nuestro equipo revisará y hará seguimiento directamente.")}</p>
        {noteSent ? (
          <div style={{ textAlign:"center", padding:"16px", color:"#4ade80" }}>
            <div style={{ fontSize:"24px", marginBottom:"6px" }}>✓</div>
            <div style={{ fontSize:"13px" }}>{t("Note sent to Surco.trade team.","Nota enviada al equipo de Surco.trade.")}</div>
          </div>
        ) : (
          <>
            <textarea value={note} onChange={e => setNote(e.target.value)} style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)", borderRadius:"8px", padding:"12px", color:"white", fontSize:"13px", outline:"none", resize:"vertical", minHeight:"80px", fontFamily:"sans-serif", boxSizing:"border-box" } as React.CSSProperties} placeholder={`e.g. Need ${selectedTalla?.label} IQF HLSO, 5 tons, delivery before May 15...`} />
            <button onClick={async () => {
              if (!note.trim()) return;
              await supabase.from("notas_productores").insert({ producer_id: producer.id, nota: note });
              setNoteSent(true);
            }} style={{ marginTop:"10px", background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"12px", fontWeight:600, padding:"9px 20px", borderRadius:"50px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>{t("Send note →","Enviar nota →")}</button>
          </>
        )}
      </div>

    </div>
  );
}