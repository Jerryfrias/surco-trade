"use client";
import React from "react";
import { useState, useEffect, useRef } from "react";
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
  onConfigChange?: (config: any) => void,
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
  useEffect(() => {
    if (producer.config && onConfigChange) {
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
  }, [selectedTalla, selectedPres, selectedProc, selectedPack, action, qty]);
  const [note, setNote] = useState("");
  const [noteSent, setNoteSent] = useState(false);
  const [saved, setSaved] = useState(false);
const [showConsol, setShowConsol] = useState(false);
const [consolStep, setConsolStep] = useState(1);
const [consolType, setConsolType] = useState<"new"|"join">("new");
const [consolJoinId, setConsolJoinId] = useState<any>(null);
const [consolTons, setConsolTons] = useState(1);
const [consolDest, setConsolDest] = useState(
    typeof window !== "undefined" ? localStorage.getItem("surco_user_port") || "" : ""
  );
const [consolSigned, setConsolSigned] = useState(false);
const [consolPortWarning, setConsolPortWarning] = useState(false);
const sigCanvasRef = useRef<HTMLCanvasElement>(null);
const sigDrawing = useRef(false);
  const TONS = 22000;
  const FREIGHT = 3200;
  const subtotal = TONS * (selectedTalla?.precio || 0) * qty;
  const freight = FREIGHT * qty;
  const total = subtotal + freight;

 const toggle = (arr: string[], val: string, set: (v: string[]) => void) => {
    const newArr = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
    if (producer.config) onDirty();
    set(newArr);
    if (producer.config && onConfigChange) onConfigChange({ producer, talla: selectedTalla, presentacion: selectedPres, proceso: selectedProc, packaging: selectedPack, action, qty, totalEstimado: total, savedAt: new Date().toISOString() });
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
                <div key={t.label} onClick={() => { if (t.precio) { if (producer.config) { onDirty(); if (onConfigChange) onConfigChange({ producer, talla: t, presentacion: selectedPres, proceso: selectedProc, packaging: selectedPack, action, qty, totalEstimado: TONS * (t?.precio || 0) * qty + FREIGHT * qty, savedAt: new Date().toISOString() }); } setSelectedTalla(t); } }} style={{ display:"inline-flex", flexDirection:"column", alignItems:"center", padding:"10px 14px", borderRadius:"8px", cursor: t.precio ? "pointer" : "not-allowed", margin:"3px", minWidth:"68px", border: selectedTalla?.label === t.label ? "2px solid #4ade80" : "1.5px solid rgba(255,255,255,0.1)", background: selectedTalla?.label === t.label ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)", opacity: t.precio ? 1 : 0.25 }}>
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
{/* DESCRIPTION + PHOTOS */}
      {producer.descripcion && (
        <div style={{ ...card, marginBottom:"16px" }}>
          <div style={stitle}>{t("About this producer","Sobre este productor")}</div>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:"13px", lineHeight:1.7 }}>{producer.descripcion}</p>
        </div>
      )}

      {producer.fotos?.length > 0 && (
        <div style={{ ...card, marginBottom:"16px" }}>
          <div style={stitle}>{t("Photos","Fotos")}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
            {producer.fotos.map((foto: string, i: number) => (
              <div key={i} style={{ borderRadius:"8px", overflow:"hidden", height:"140px", background:"#0a2414" }}>
                <img src={foto} alt={`${producer.nombre} ${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.85 }} />
              </div>
            ))}
          </div>
        </div>
      )}

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
                <div onClick={() => { const newQty = Math.max(1,qty-1); if (producer.config) { onDirty(); if (onConfigChange) onConfigChange({ producer, talla: selectedTalla, presentacion: selectedPres, proceso: selectedProc, packaging: selectedPack, action, qty: newQty, totalEstimado: TONS * (selectedTalla?.precio || 0) * newQty + FREIGHT * newQty, savedAt: new Date().toISOString() }); } setQty(newQty); }} style={{ width:"32px", height:"32px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</div>
                <div style={{ color:"white", fontSize:"18px", fontWeight:600, minWidth:"24px", textAlign:"center" }}>{qty}</div>
                <div onClick={() => { const newQty = qty+1; if (producer.config) { onDirty(); if (onConfigChange) onConfigChange({ producer, talla: selectedTalla, presentacion: selectedPres, proceso: selectedProc, packaging: selectedPack, action, qty: newQty, totalEstimado: TONS * (selectedTalla?.precio || 0) * newQty + FREIGHT * newQty, savedAt: new Date().toISOString() }); } setQty(newQty); }} style={{ width:"32px", height:"32px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"18px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</div>
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
            <button onClick={() => { setShowConsol(true); setConsolStep(1); setConsolType("new"); setConsolDest(producer.consolidaciones?.[0]?.puerto || "Rotterdam, Netherlands"); }} style={{ width:"100%", background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"13px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Start / join consolidation →","Iniciar / unirse a consolidación →")}</button>
          </div>
        )}

        {/* SAVE TO FAVORITES */}
        <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.07)", paddingTop:"14px", display:"flex", justifyContent:"center" }}>
          <button id="btn-update-favorite" onClick={handleSaveConfig} style={{ display:"flex", alignItems:"center", gap:"8px", background: saved ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)", color: saved ? "#4ade80" : "rgba(255,255,255,0.5)", fontSize:"12px", fontWeight:500, padding:"10px 20px", borderRadius:"50px", border: saved ? "0.5px solid rgba(74,222,128,0.3)" : "0.5px solid rgba(255,255,255,0.1)", cursor:"pointer", transition:"all 0.2s" }}>
            <span style={{ fontSize:"16px" }}>{saved ? "★" : "☆"}</span>
            {saved 
    ? t("Saved!","¡Guardado!") 
    : isFromFavorite 
      ? t("Update favorite","Actualizar favorito") 
      : t("Save this configuration to favorites","Guardar esta configuración en favoritos")}
          </button>
        </div>
      </div>
{/* CONSOLIDATION MODAL */}
      {showConsol && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
          <div style={{ background:"#071a0e", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"16px", width:"100%", maxWidth:"500px", maxHeight:"90vh", overflowY:"auto" }}>

            {/* Modal Header */}
            <div style={{ padding:"24px 28px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ color:"white", fontSize:"17px", fontWeight:600, marginBottom:"4px" }}>{t("Join or start a consolidation","Unirse o iniciar una consolidación")}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"12px" }}>{producer.nombre} · Vannamei Shrimp · {selectedTalla?.label} {selectedPres[0]} {selectedProc[0]}</div>
              </div>
              <div onClick={() => setShowConsol(false)} style={{ cursor:"pointer", color:"rgba(255,255,255,0.3)", fontSize:"24px", marginLeft:"16px" }}>×</div>
            </div>

            {/* Progress */}
            <div style={{ padding:"16px 28px 0", display:"flex", alignItems:"center" }}>
              {[1,2,3,4,5].map((n,i) => (
                <React.Fragment key={n}>
                  <div style={{ width:"22px", height:"22px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:600, flexShrink:0, background: consolStep > n ? "#4ade80" : consolStep === n ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)", border: consolStep === n ? "1.5px solid #4ade80" : "none", color: consolStep > n ? "#071a0e" : consolStep === n ? "#4ade80" : "rgba(255,255,255,0.3)" }}>
                    {consolStep > n ? "✓" : n}
                  </div>
                  {i < 4 && <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.1)", margin:"0 5px" }} />}
                </React.Fragment>
              ))}
            </div>
            <div style={{ padding:"4px 24px 0", display:"flex", justifyContent:"space-between" }}>
              {[t("Destination","Destino"), t("Quantity","Cantidad"), t("Notify","Notificar"), t("Confirm","Confirmar"), t("Sign","Firmar")].map((l,i) => (
                <span key={l} style={{ fontSize:"10px", color: consolStep === i+1 ? "#4ade80" : consolStep > i+1 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.3)" }}>{l}</span>
              ))}
            </div>

            <div style={{ padding:"20px 28px 28px" }}>

              {/* STEP 1 — Destination */}
              {consolStep === 1 && (
                <div>
                  {/* Primary: Start new */}
                  <div onClick={() => { setConsolType("new"); setConsolJoinId(null); }} style={{ display:"flex", alignItems:"center", gap:"14px", padding:"18px 20px", borderRadius:"10px", cursor:"pointer", marginBottom:"16px", border: consolType === "new" ? "2px solid #4ade80" : "1.5px solid rgba(255,255,255,0.08)", background: consolType === "new" ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.04)" }}>
                    <div style={{ width:"40px", height:"40px", borderRadius:"10px", background:"rgba(74,222,128,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </div>
                    <div>
                      <div style={{ color:"white", fontSize:"15px", fontWeight:600, marginBottom:"3px" }}>{t("Start new consolidation","Iniciar nueva consolidación")}</div>
                      <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>to Rotterdam, Netherlands · {t("your preferred port","tu puerto preferido")}</div>
                    </div>
                  </div>

                  {/* Join existing */}
                  {producer.consolidaciones?.length > 0 && (
                    <>
                      <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"14px 0" }}>
                        <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
                        <span style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px", whiteSpace:"nowrap" }}>{t("or join an active consolidation","o únete a una consolidación activa")}</span>
                        <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
                      </div>
                      {producer.consolidaciones.map((c: any, i: number) => (
                        <div key={i} onClick={() => { setConsolType("join"); setConsolJoinId(c); setConsolDest(c.puerto); }} style={{ padding:"14px 16px", borderRadius:"10px", cursor:"pointer", marginBottom:"8px", border: consolType === "join" && consolJoinId === c ? "2px solid #4ade80" : "0.5px solid rgba(255,255,255,0.08)", background: consolType === "join" && consolJoinId === c ? "rgba(74,222,128,0.06)" : "rgba(255,255,255,0.04)" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                            <div>
                              <div style={{ color:"white", fontSize:"13px", fontWeight:500, marginBottom:"2px" }}>{c.puerto} · {t("Departure","Salida")} {c.fecha}</div>
                              <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px" }}>{c.slots}/{c.total} {t("slots filled","slots ocupados")} · {c.total - c.slots} {t("available","disponibles")}</div>
                            </div>
                            <span style={{ background: c.status==="open" ? "rgba(74,222,128,0.12)" : "rgba(251,146,60,0.12)", color: c.status==="open" ? "#4ade80" : "#fb923c", fontSize:"10px", padding:"2px 8px", borderRadius:"4px" }}>{c.status==="open" ? "Open" : "Closing"}</span>
                          </div>
                          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"4px", height:"4px", marginTop:"8px", overflow:"hidden" }}>
                            <div style={{ background: c.status==="open" ? "#4ade80" : "#fb923c", height:"100%", width:`${Math.round(c.slots/c.total*100)}%`, borderRadius:"4px" }} />
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Different port */}
                  <div style={{ display:"flex", alignItems:"center", gap:"10px", margin:"14px 0" }}>
                    <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
                    <span style={{ color:"rgba(255,255,255,0.2)", fontSize:"11px", whiteSpace:"nowrap" }}>{t("or choose a different port","o elige otro puerto")}</span>
                    <div style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.08)" }} />
                  </div>
                  <select onChange={e => { if(e.target.value) { setConsolType("new"); setConsolDest(e.target.value); setConsolJoinId(null); } }} style={{ width:"100%", background:"rgba(255,255,255,0.05)", border:"0.5px solid rgba(255,255,255,0.12)", borderRadius:"8px", padding:"10px 14px", color:"white", fontSize:"13px", outline:"none", marginBottom:"14px", appearance:"none" as const }}>
                    <option value="">{t("Select a different port...","Selecciona otro puerto...")}</option>
                    {["Valencia, Spain","Hamburg, Germany","Miami, USA","Los Angeles, USA","Shanghai, China","Tokyo, Japan"].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>

                  {/* 14 days notice */}
                  <div style={{ display:"flex", alignItems:"flex-start", gap:"8px", background:"rgba(96,165,250,0.06)", border:"0.5px solid rgba(96,165,250,0.15)", borderRadius:"8px", padding:"10px 12px", marginBottom:"18px" }}>
                    <span style={{ fontSize:"13px", flexShrink:0 }}>📅</span>
                    <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"12px", lineHeight:1.5 }}><strong style={{ color:"white" }}>14-day window.</strong> {t("If the container isn't filled in 14 days, the consolidation is cancelled — no penalty.","Si el contenedor no se llena en 14 días, la consolidación se cancela sin penalización.")}</div>
                  </div>

                  <button onClick={() => {
                    const registeredPorts = ["Rotterdam, Netherlands","Hamburg, Germany","Valencia, Spain","Miami, USA","Los Angeles, USA","Shanghai, China","Tokyo, Japan"];
                    const dest = consolType === "join" && consolJoinId ? consolJoinId.puerto : consolDest || "Rotterdam, Netherlands";
                    const isRegistered = registeredPorts.some(p => dest.toLowerCase().includes(p.split(",")[0].toLowerCase()));
                    if (!isRegistered) { setConsolPortWarning(true); } else { setConsolStep(2); }
                  }} style={{ width:"100%", background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"12px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Continue →","Continuar →")}</button>

                  {consolPortWarning && (
                    <div style={{ marginTop:"12px", background:"rgba(251,146,60,0.08)", border:"0.5px solid rgba(251,146,60,0.25)", borderRadius:"10px", padding:"16px" }}>
                      <div style={{ color:"white", fontSize:"13px", fontWeight:600, marginBottom:"6px" }}>⚠ {t("Route not yet available","Ruta aún no disponible")}</div>
                      <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", lineHeight:1.6, marginBottom:"14px" }}>{t("Your selected port is not yet part of our active routes. Our team will review your request and reach out within 48 hours if we can accommodate this route.","El puerto seleccionado aún no forma parte de nuestras rutas activas. Nuestro equipo revisará tu solicitud y te contactará en 48 horas si podemos incorporar esta ruta.")}</div>
                      <div style={{ display:"flex", gap:"8px" }}>
                        <button onClick={() => setConsolPortWarning(false)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"12px", padding:"9px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>{t("Choose another port","Elegir otro puerto")}</button>
                        <button onClick={() => { setConsolPortWarning(false); setConsolStep(2); }} style={{ flex:1, background:"rgba(251,146,60,0.15)", color:"#fb923c", fontSize:"12px", fontWeight:600, padding:"9px", borderRadius:"50px", border:"0.5px solid rgba(251,146,60,0.3)", cursor:"pointer" }}>{t("Submit anyway","Enviar de todas formas")}</button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2 — Quantity */}
              {consolStep === 2 && (
                <div>
                  <div style={{ background:"rgba(74,222,128,0.06)", border:"0.5px solid rgba(74,222,128,0.15)", borderRadius:"10px", padding:"12px 16px", marginBottom:"16px" }}>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", marginBottom:"3px" }}>{t("Selected destination","Destino seleccionado")}</div>
                    <div style={{ color:"white", fontSize:"14px", fontWeight:500 }}>{consolType === "join" && consolJoinId ? `${consolJoinId.puerto} · ${consolJoinId.fecha}` : `${t("New consolidation","Nueva consolidación")} · ${consolDest || "Rotterdam, Netherlands"}`}</div>
                  </div>

                  {/* Container grid */}
                  <div style={{ marginBottom:"14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                      <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px" }}>Container · 22 slots</div>
                      <div style={{ fontSize:"11px", color:"#4ade80" }}>{(consolType === "join" && consolJoinId ? consolJoinId.total - consolJoinId.slots : 22) - consolTons} {t("more needed","más necesarios")}</div>
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(11,1fr)", gap:"4px", marginBottom:"8px" }}>
                      {Array.from({length:22}).map((_,i) => {
                        const f = consolType === "join" && consolJoinId ? consolJoinId.slots : 0;
                        return (
                          <div key={i} style={{ aspectRatio:"1", borderRadius:"4px", background: i < f ? "rgba(74,222,128,0.2)" : i < f + consolTons ? "rgba(74,222,128,0.6)" : "rgba(255,255,255,0.04)", border: i < f ? "0.5px solid rgba(74,222,128,0.4)" : i < f + consolTons ? "1.5px solid #4ade80" : "0.5px dashed rgba(255,255,255,0.15)" }} />
                        );
                      })}
                    </div>
                    <div style={{ display:"flex", gap:"14px", fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>
                      <span><span style={{ display:"inline-block", width:"8px", height:"8px", background:"rgba(74,222,128,0.2)", border:"0.5px solid rgba(74,222,128,0.4)", borderRadius:"2px", marginRight:"4px", verticalAlign:"middle" }}></span>{t("Filled","Ocupados")}</span>
                      <span><span style={{ display:"inline-block", width:"8px", height:"8px", background:"rgba(74,222,128,0.6)", border:"1.5px solid #4ade80", borderRadius:"2px", marginRight:"4px", verticalAlign:"middle" }}></span>{t("Yours","Tuyos")}</span>
                      <span><span style={{ display:"inline-block", width:"8px", height:"8px", background:"rgba(255,255,255,0.04)", border:"0.5px dashed rgba(255,255,255,0.15)", borderRadius:"2px", marginRight:"4px", verticalAlign:"middle" }}></span>{t("Available","Disponibles")}</span>
                    </div>
                  </div>

                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"10px" }}>{t("How many tons?","¿Cuántas toneladas?")}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:"20px", justifyContent:"center", marginBottom:"6px" }}>
                    <div onClick={() => setConsolTons(Math.max(1, consolTons-1))} style={{ width:"40px", height:"40px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>−</div>
                    <div style={{ textAlign:"center" }}><div style={{ color:"white", fontSize:"36px", fontWeight:600 }}>{consolTons}</div><div style={{ color:"rgba(255,255,255,0.3)", fontSize:"12px" }}>tons</div></div>
                    <div onClick={() => setConsolTons(Math.min(consolType === "join" && consolJoinId ? consolJoinId.total - consolJoinId.slots : 22, consolTons+1))} style={{ width:"40px", height:"40px", borderRadius:"8px", border:"0.5px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"20px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>+</div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", textAlign:"center", marginBottom:"14px" }}>Min. 1 · Max. {consolType === "join" && consolJoinId ? consolJoinId.total - consolJoinId.slots : 22}</div>

                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"10px", padding:"14px", marginBottom:"18px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}><span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>{(consolTons*1000).toLocaleString()} kg × ${selectedTalla?.precio?.toFixed(2)}/kg</span><span style={{ color:"white", fontSize:"12px" }}>${(consolTons*1000*(selectedTalla?.precio||0)).toLocaleString()}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"8px", borderTop:"0.5px solid rgba(255,255,255,0.07)" }}><span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{t("Estimated total","Total estimado")}</span><span style={{ color:"#4ade80", fontSize:"16px", fontWeight:600 }}>${(consolTons*1000*(selectedTalla?.precio||0)).toLocaleString()}</span></div>
                  </div>

                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={() => setConsolStep(1)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"13px", padding:"11px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>← {t("Back","Atrás")}</button>
                    <button onClick={() => setConsolStep(3)} style={{ flex:2, background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"11px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Continue →","Continuar →")}</button>
                  </div>
                </div>
              )}

              {/* STEP 3 — Notify */}
              {consolStep === 3 && (
                <div>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>{t("How we'll fill this consolidation","Cómo llenaremos esta consolidación")}</div>
                  {[
                    { icon:"M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.4 1.13 2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.19a16 16 0 006.72 6.72l1.21-1.21a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z", label:"WhatsApp", sub:"~14 buyers with Rotterdam as preferred port" },
                    { icon:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6", label:"Email", sub:"Buyers interested in Vannamei Shrimp → Rotterdam" },
                    { icon:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10", label:"Homepage", sub:"Visible publicly on surco.trade" },
                  ].map(row => (
                    <div key={row.label} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background:"rgba(255,255,255,0.04)", borderRadius:"8px", marginBottom:"6px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.5"><path d={row.icon}/></svg>
                      <div style={{ flex:1 }}><div style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{row.label}</div><div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px" }}>{row.sub}</div></div>
                      <span style={{ background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"10px", padding:"2px 8px", borderRadius:"4px" }}>Auto</span>
                    </div>
                  ))}
                  <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", padding:"10px 0 18px" }}>🔒 {t("Your company name is shown. Exact tonnage stays private until confirmed.","Tu empresa aparece. La cantidad exacta es privada hasta confirmar.")}</div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={() => setConsolStep(2)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"13px", padding:"11px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>← {t("Back","Atrás")}</button>
                    <button onClick={() => setConsolStep(4)} style={{ flex:2, background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"11px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Continue →","Continuar →")}</button>
                  </div>
                </div>
              )}

              {/* STEP 4 — Confirm */}
              {consolStep === 4 && (
                <div>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>{t("Review your request","Revisa tu solicitud")}</div>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"10px", padding:"16px", marginBottom:"14px" }}>
                    {[
                      [t("Producer","Productor"), producer.nombre],
                      [t("Product","Producto"), `Vannamei Shrimp · ${selectedTalla?.label} ${selectedPres[0]} ${selectedProc[0]}`],
                      [t("Destination","Destino"), consolType === "join" && consolJoinId ? consolJoinId.puerto : consolDest || "Rotterdam, Netherlands"],
                      [t("Quantity","Cantidad"), `${consolTons} ton${consolTons > 1 ? "s" : ""} · ${consolTons} slots`],
                      [t("Price","Precio"), `$${selectedTalla?.precio?.toFixed(2)}/kg · FOB Guayaquil`],
                    ].map(([l, v]) => (
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:"7px" }}><span style={{ color:"rgba(255,255,255,0.4)", fontSize:"12px" }}>{l}</span><span style={{ color:"white", fontSize:"12px" }}>{v}</span></div>
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", paddingTop:"10px", borderTop:"0.5px solid rgba(255,255,255,0.07)" }}><span style={{ color:"white", fontSize:"13px", fontWeight:500 }}>{t("Estimated total","Total estimado")}</span><span style={{ color:"#4ade80", fontSize:"16px", fontWeight:600 }}>${(consolTons*1000*(selectedTalla?.precio||0)).toLocaleString()}</span></div>
                  </div>
                  <div style={{ background:"rgba(251,146,60,0.07)", border:"0.5px solid rgba(251,146,60,0.18)", borderRadius:"8px", padding:"10px 12px", marginBottom:"14px", display:"flex", gap:"8px", alignItems:"flex-start" }}>
                    <span style={{ color:"#fb923c", flexShrink:0 }}>⚠</span>
                    <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", lineHeight:1.5 }}>{t("Reviewed within 24h. Open","Revisado en 24h. Abierto")} <strong style={{ color:"white" }}>14 {t("days","días")}</strong>. {t("Cancellation =","Cancelación =")} <strong style={{ color:"white" }}>20% {t("penalty","penalización")}</strong>. {t("No penalty if container not filled.","Sin penalización si el contenedor no se llena.")}</div>
                  </div>
                  <label style={{ display:"flex", alignItems:"flex-start", gap:"10px", cursor:"pointer", marginBottom:"20px" }}>
                    <input type="checkbox" id="consol-tc" style={{ marginTop:"2px", accentColor:"#4ade80" }} />
                    <span style={{ color:"rgba(255,255,255,0.5)", fontSize:"12px", lineHeight:1.6 }}>{t("I agree to the","Acepto la")} <a href="/terms" target="_blank" style={{ color:"#4ade80" }}>{t("cancellation policy","política de cancelación")}</a> {t("and","y")} <a href="/terms" target="_blank" style={{ color:"#4ade80" }}>{t("terms & conditions","términos y condiciones")}</a>.</span>
                  </label>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={() => setConsolStep(3)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"13px", padding:"11px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>← {t("Back","Atrás")}</button>
                    <button onClick={() => setConsolStep(5)} style={{ flex:2, background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"11px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Continue to sign →","Continuar a firmar →")}</button>
                  </div>
                </div>
              )}

              {/* STEP 5 — Sign */}
              {consolStep === 5 && (
                <div>
                  <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px", textTransform:"uppercase", letterSpacing:"1px", marginBottom:"12px" }}>{t("Digital signature","Firma digital")}</div>
                  <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"10px", padding:"12px 16px", marginBottom:"14px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}><span style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px" }}>{t("Reference","Referencia")}</span><span style={{ color:"#4ade80", fontSize:"11px", fontWeight:600 }}>CONS-2026-ROT-{String(Date.now()).slice(-4)}</span></div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}><span style={{ color:"rgba(255,255,255,0.35)", fontSize:"11px" }}>{t("Commitment","Compromiso")}</span><span style={{ color:"white", fontSize:"11px" }}>{consolTons} tons · {consolDest || "Rotterdam"} · ${(consolTons*1000*(selectedTalla?.precio||0)).toLocaleString()}</span></div>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"6px" }}>{t("Sign here","Firma aquí")}</div>
                  <canvas ref={sigCanvasRef} height={130} style={{ width:"100%", borderRadius:"8px", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"crosshair", touchAction:"none", display:"block" }}
                    onMouseDown={e => { sigDrawing.current=true; const c=sigCanvasRef.current!; const ctx=c.getContext("2d")!; ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY); }}
                    onMouseMove={e => { if(!sigDrawing.current)return; const c=sigCanvasRef.current!; const ctx=c.getContext("2d")!; ctx.strokeStyle="#4ade80"; ctx.lineWidth=2; ctx.lineCap="round"; ctx.lineTo(e.nativeEvent.offsetX,e.nativeEvent.offsetY); ctx.stroke(); }}
                    onMouseUp={() => sigDrawing.current=false}
                    onMouseLeave={() => sigDrawing.current=false}
                  />
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"6px", marginBottom:"6px" }}>
                    <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px" }}>📍 IP, {t("date and time UTC recorded.","fecha y hora UTC registradas.")}</div>
                    <button onClick={() => { const c=sigCanvasRef.current!; c.getContext("2d")!.clearRect(0,0,c.width,c.height); }} style={{ background:"transparent", color:"rgba(255,255,255,0.3)", fontSize:"11px", border:"none", cursor:"pointer" }}>{t("Clear","Limpiar")}</button>
                  </div>
                  <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px", marginBottom:"18px" }}>{t("Valid under","Válido bajo")} <a href="/terms" target="_blank" style={{ color:"rgba(74,222,128,0.6)" }}>eIDAS (Europe) / ESIGN Act (USA)</a>.</div>
                  <div style={{ display:"flex", gap:"10px" }}>
                    <button onClick={() => setConsolStep(4)} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.6)", fontSize:"13px", padding:"11px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.12)", cursor:"pointer" }}>← {t("Back","Atrás")}</button>
                    <button onClick={async () => {
                      await supabase.from("consolidacion_compradores").insert({
                        consolidacion_id: consolJoinId?.id || null,
                        comprador_email: (await supabase.auth.getUser()).data.user?.email,
                        slots: consolTons,
                        toneladas: consolTons,
                        valor_estimado: consolTons*1000*(selectedTalla?.precio||0),
                        estado_firma: "signed",
                        fecha_firma: new Date().toISOString(),
                      });
                      setConsolSigned(true);
                      setConsolStep(6 as any);
                    }} style={{ flex:2, background:"#4ade80", color:"#071a0e", fontSize:"14px", fontWeight:600, padding:"11px", borderRadius:"50px", border:"none", cursor:"pointer" }}>{t("Submit & sign →","Enviar y firmar →")}</button>
                  </div>
                </div>
              )}

              {/* STEP 6 — Success */}
              {consolStep === (6 as any) && (
                <div style={{ textAlign:"center", padding:"16px 0" }}>
                  <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:"rgba(74,222,128,0.15)", border:"2px solid rgba(74,222,128,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"28px" }}>✓</div>
                  <div style={{ color:"white", fontSize:"18px", fontWeight:600, marginBottom:"8px" }}>{t("Request submitted!","¡Solicitud enviada!")}</div>
                  <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"13px", lineHeight:1.7, marginBottom:"20px" }}>{t("Surco.trade will review and confirm within 24 hours via WhatsApp and email.","Surco.trade revisará y confirmará en 24 horas por WhatsApp y email.")}</div>
                  <div style={{ background:"rgba(74,222,128,0.08)", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"10px", padding:"14px", marginBottom:"20px" }}>
                    <div style={{ color:"rgba(255,255,255,0.4)", fontSize:"11px", marginBottom:"4px" }}>{t("Reference number","Número de referencia")}</div>
                    <div style={{ color:"#4ade80", fontSize:"20px", fontWeight:600 }}>CONS-2026-ROT-{String(Date.now()).slice(-4)}</div>
                  </div>
                  <button onClick={() => setShowConsol(false)} style={{ width:"100%", background:"rgba(74,222,128,0.12)", color:"#4ade80", fontSize:"13px", fontWeight:600, padding:"12px", borderRadius:"50px", border:"0.5px solid rgba(74,222,128,0.3)", cursor:"pointer" }}>{t("Back to producer profile","Volver al perfil del productor")}</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
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