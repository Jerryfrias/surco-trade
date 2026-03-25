"use client";
import React from "react";

export interface ContractData {
  type: "consolidation" | "container";
  referenceId: string;
  date: string;
  buyer: {
    nombre: string;
    dni: string;
    empresa: string;
    email: string;
    telefono: string;
  };
  product: {
    name: string;
    port: string;
    price: string;
    departure?: string;
    qty: number;
    total: number;
    talla?: string;
  };
  signatureDataUrl?: string;
}

interface Props {
  data: ContractData;
  lang: "EN" | "ES";
  onClose: () => void;
}

export default function ContractViewer({ data, lang, onClose }: Props) {
  const t = (en: string, es: string) => lang === "EN" ? en : es;
  const { type, referenceId, date, buyer, product, signatureDataUrl } = data;

  const terms = [
    t(
      "The Buyer commits to acquiring the agreed quantity within the established timeframes and conditions of this contract.",
      "El Comprador se compromete a adquirir la cantidad acordada dentro de los plazos y condiciones establecidos en el presente contrato."
    ),
    t(
      "Once the reservation is confirmed, full payment instructions will be sent to the Buyer's registered email within 24 business hours.",
      "Una vez confirmada la reserva, las instrucciones de pago completas serán enviadas al correo registrado del Comprador en un plazo de 24 horas hábiles."
    ),
    t(
      "Cancellations within the first 24 hours from the time of signing will incur no penalty.",
      "Las cancelaciones realizadas dentro de las primeras 24 horas desde la firma del contrato no generarán penalización alguna."
    ),
    t(
      "Cancellations after 24 hours will incur a penalty of 20% of the estimated total value, deducted from any refund.",
      "Las cancelaciones realizadas después de las 24 horas conllevarán una penalización del 20% del valor total estimado, descontado de cualquier devolución."
    ),
    t(
      "The final price may vary by ±3% subject to the official FOB weight certificate issued at port of origin.",
      "El precio final puede variar en ±3% sujeto al certificado oficial de peso FOB emitido en el puerto de origen."
    ),
    type === "container"
      ? t(
          "The reserved container is subject to availability confirmation by the producer within 48 hours. Surco.trade acts solely as facilitator.",
          "El contenedor reservado está sujeto a confirmación de disponibilidad por parte del productor en un plazo de 48 horas. Surco.trade actúa únicamente como facilitador."
        )
      : t(
          "The consolidation slot is subject to minimum fill confirmation. In the event of insufficient demand, the Buyer will be offered an alternative shipment at no extra cost.",
          "El espacio en consolidación está sujeto a confirmación de llenado mínimo. En caso de demanda insuficiente, se ofrecerá al Comprador un embarque alternativo sin costo adicional."
        ),
    t(
      "This document constitutes a legally binding purchase commitment under the laws of the Republic of Peru. Full commercial terms apply upon payment confirmation.",
      "Este documento constituye un compromiso de compra con carácter vinculante conforme a las leyes de la República del Perú. Los términos comerciales completos aplican a partir de la confirmación del pago."
    ),
  ];

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:700, display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"24px 20px", overflowY:"auto" }}>
      <div style={{ background:"#071e0f", border:"0.5px solid rgba(74,222,128,0.25)", borderRadius:"16px", width:"100%", maxWidth:"700px" }}>

        {/* Header */}
        <div style={{ padding:"28px 36px 20px", borderBottom:"0.5px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ color:"#4ade80", fontSize:"10px", fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase", marginBottom:"6px" }}>
              {t("Purchase Commitment Agreement","Contrato de Compromiso de Compra")}
            </div>
            <div style={{ color:"white", fontSize:"22px", fontWeight:700, letterSpacing:"-0.5px" }}>Surco<span style={{ color:"#4ade80" }}>.trade</span></div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:"8px", color:"rgba(255,255,255,0.4)", fontSize:"20px", cursor:"pointer", padding:"6px 13px", lineHeight:1 }}>×</button>
        </div>

        <div style={{ padding:"28px 36px 36px", fontFamily:"'Courier New', monospace", fontSize:"12px", lineHeight:"1.9", color:"rgba(255,255,255,0.75)" }}>

          {/* Meta strip */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"6px", marginBottom:"28px", padding:"16px", background:"rgba(255,255,255,0.03)", borderRadius:"10px", border:"0.5px solid rgba(255,255,255,0.07)" }}>
            {[
              [t("Reference","Referencia"), referenceId, "#4ade80"],
              [t("Date","Fecha"), date, "white"],
              [t("Type","Tipo"), type === "consolidation" ? t("Consolidation","Consolidación") : t("Full Container","Contenedor Completo"), "white"],
              ["Status", "✓ " + t("Signed","Firmado"), "#4ade80"],
            ].map(([label, value, color]) => (
              <div key={label as string}>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"3px" }}>{label}</div>
                <div style={{ color: color as string, fontWeight:600, fontSize:"11px" }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Parties */}
          <div style={{ marginBottom:"24px" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>{t("Parties / Partes","Partes")}</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
              <div style={{ paddingLeft:"12px", borderLeft:"2px solid rgba(74,222,128,0.25)" }}>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"1px", marginBottom:"5px" }}>{t("BUYER","COMPRADOR")}</div>
                <div style={{ color:"white", fontWeight:600, marginBottom:"2px" }}>{buyer.nombre}</div>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px" }}>{buyer.empresa}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px", marginTop:"3px" }}>ID: {buyer.dni}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px" }}>{buyer.email}</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px" }}>{buyer.telefono}</div>
              </div>
              <div style={{ paddingLeft:"12px", borderLeft:"2px solid rgba(74,222,128,0.25)" }}>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"1px", marginBottom:"5px" }}>{t("PLATFORM / FACILITATOR","PLATAFORMA / FACILITADOR")}</div>
                <div style={{ color:"white", fontWeight:600, marginBottom:"2px" }}>Surco.trade S.A.C.</div>
                <div style={{ color:"rgba(255,255,255,0.45)", fontSize:"11px" }}>RUC 20000000001</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px", marginTop:"3px" }}>Av. Larco 1301, Miraflores, Lima</div>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px" }}>legal@surco.trade</div>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div style={{ marginBottom:"24px" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>{t("Subject","Objeto del Contrato")}</div>
            <div style={{ paddingLeft:"12px", borderLeft:"2px solid rgba(74,222,128,0.25)", lineHeight:"1.8" }}>
              {type === "consolidation"
                ? t(
                    "This Purchase Commitment Agreement formalizes the Buyer's reservation of a slot in a consolidated refrigerated maritime shipment coordinated by Surco.trade, under the terms described herein.",
                    "El presente Contrato de Compromiso de Compra formaliza la reserva del Comprador de un espacio en un embarque marítimo refrigerado consolidado coordinado por Surco.trade, bajo los términos aquí descritos."
                  )
                : t(
                    "This Purchase Commitment Agreement formalizes the Buyer's reservation of a full refrigerated container (FCL) coordinated by Surco.trade through its network of certified producers, under the terms described herein.",
                    "El presente Contrato de Compromiso de Compra formaliza la reserva del Comprador de un contenedor refrigerado completo (FCL) coordinado por Surco.trade a través de su red de productores certificados, bajo los términos aquí descritos."
                  )
              }
            </div>
          </div>

          {/* Product details */}
          <div style={{ marginBottom:"24px" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>{t("Product & Shipment Details","Detalle del Producto y Embarque")}</div>
            <div style={{ background:"rgba(74,222,128,0.04)", border:"0.5px solid rgba(74,222,128,0.15)", borderRadius:"10px", padding:"18px" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px" }}>
                {[
                  [t("Product","Producto"), product.name],
                  [t("Destination port","Puerto destino"), product.port],
                  [t("Unit price","Precio unitario"), product.price],
                  ...(product.talla ? [[t("Size / Grade","Talla / Calibre"), product.talla]] : []),
                  ...(product.departure ? [[t("Est. departure","Salida est."), product.departure]] : []),
                  [t("Quantity","Cantidad"), `${product.qty} ${t("metric tons","toneladas métricas")}`],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"4px" }}>{label}</div>
                    <div style={{ color:"white", fontWeight:500 }}>{value}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.08)", marginTop:"16px", paddingTop:"14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"10px" }}>{t("ESTIMATED TOTAL (USD)","TOTAL ESTIMADO (USD)")}</div>
                <div style={{ color:"#4ade80", fontSize:"22px", fontWeight:700, letterSpacing:"-0.5px" }}>
                  ${product.total.toLocaleString()} <span style={{ color:"rgba(255,255,255,0.25)", fontSize:"11px", fontWeight:400 }}>USD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ marginBottom:"28px" }}>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"10px" }}>{t("Terms & Conditions","Términos y Condiciones")}</div>
            <div style={{ paddingLeft:"12px", borderLeft:"2px solid rgba(74,222,128,0.25)" }}>
              {terms.map((term, i) => (
                <div key={i} style={{ display:"flex", gap:"10px", marginBottom:"8px" }}>
                  <span style={{ color:"#4ade80", flexShrink:0, fontWeight:600 }}>{i + 1}.</span>
                  <span style={{ lineHeight:"1.75" }}>{term}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures */}
          <div style={{ borderTop:"0.5px solid rgba(255,255,255,0.09)", paddingTop:"24px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", alignItems:"flex-end" }}>
            <div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px" }}>{t("Buyer's Digital Signature","Firma Digital del Comprador")}</div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"8px", height:"90px", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
                {signatureDataUrl
                  ? <img src={signatureDataUrl} alt="signature" style={{ maxHeight:"74px", maxWidth:"100%", filter:"brightness(1.1)" }} />
                  : <span style={{ color:"rgba(255,255,255,0.15)", fontSize:"11px" }}>{t("Signature on file","Firma registrada")}</span>
                }
              </div>
              <div style={{ marginTop:"8px" }}>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"11px", fontWeight:500 }}>{buyer.nombre}</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px" }}>{buyer.empresa} · {buyer.dni}</div>
              </div>
            </div>
            <div>
              <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"8px" }}>Surco.trade</div>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(74,222,128,0.2)", borderRadius:"8px", height:"90px", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"4px" }}>
                <div style={{ color:"#4ade80", fontSize:"20px", fontWeight:700, letterSpacing:"-0.5px" }}>Surco.trade</div>
                <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"9px", letterSpacing:"1px", textTransform:"uppercase" }}>Platform Acceptance</div>
              </div>
              <div style={{ marginTop:"8px" }}>
                <div style={{ color:"rgba(255,255,255,0.55)", fontSize:"11px", fontWeight:500 }}>Surco.trade S.A.C.</div>
                <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"10px" }}>RUC 20000000001 · Lima, Perú</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop:"28px", padding:"14px", background:"rgba(255,255,255,0.02)", borderRadius:"8px", textAlign:"center", borderTop:"0.5px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color:"rgba(255,255,255,0.2)", fontSize:"10px", lineHeight:"1.7" }}>
              {t(
                "This document was digitally signed and timestamped via Surco.trade platform.",
                "Este documento fue firmado digitalmente con registro de fecha y hora a través de la plataforma Surco.trade."
              )}<br />
              {referenceId} · {date} · surco.trade/verify
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"0 36px 32px", display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.55)", fontSize:"13px", padding:"12px", borderRadius:"50px", border:"0.5px solid rgba(255,255,255,0.1)", cursor:"pointer" }}>
            {t("Close","Cerrar")}
          </button>
          <button style={{ flex:2, background:"#4ade80", color:"#071a0e", fontSize:"13px", fontWeight:700, padding:"12px", borderRadius:"50px", border:"none", cursor:"pointer" }}>
            ⬇ {t("Download PDF","Descargar PDF")}
          </button>
        </div>
      </div>
    </div>
  );
}
