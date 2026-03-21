"use client";
import { useState } from "react";

const categories = [
  { tag: "Category 01", title: "Aqua-\nculture", sub: "Ecuador · Pacific Coast", desc: "Premium shrimp, tilapia and seafood products farmed under strict quality standards, ready for international export.", products: ["Vannamei Shrimp", "Tilapia", "Black Tiger", "Tuna"], bg: "Aquaculture", label: "Aqua-culture" },
  { tag: "Category 02", title: "Agri-\nculture", sub: "Ecuador · Highlands & Coast", desc: "Fresh tropical fruits, cacao and specialty crops from verified Ecuadorian producers, consolidated for global buyers.", products: ["Dragon Fruit", "Banana", "Mango", "Cacao"], bg: "Agriculture", label: "Agri-culture" },
  { tag: "Category 03", title: "Flori-\nculture", sub: "Ecuador · Andean Region", desc: "Ecuador is the world's 3rd largest flower exporter. Fresh-cut roses, carnations and gypsophila shipped worldwide.", products: ["Roses", "Carnations", "Gypsophila", "Lilies"], bg: "Floriculture", label: "Flori-culture" },
  { tag: "Category 04", title: "Poultry", sub: "Ecuador · National Production", desc: "High-quality poultry products from certified Ecuadorian farms, meeting international food safety standards.", products: ["Chicken", "Turkey", "Eggs", "Processed"], bg: "Poultry", label: "Poultry" },
];

export default function Home() {
  const [active, setActive] = useState(0);

  return (
    <div style={{ background: "#071a0e", minHeight: "100vh", fontFamily: "sans-serif", color: "white" }}>

      {/* TICKER */}
      <div style={{ background: "#0a2414", borderBottom: "0.5px solid rgba(74,222,128,0.18)", padding: "9px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <style>{`
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes scrollleft { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        `}</style>
        <div style={{ display: "inline-flex", gap: "40px", animation: "scroll 28s linear infinite" }}>
          {[
            { name: "Vannamei Shrimp", price: "$4.20/kg", change: "+1.2%", up: true },
            { name: "Dragon Fruit", price: "$1.80/kg", change: "-0.5%", up: false },
            { name: "Organic Banana", price: "$0.62/kg", change: "+0.8%", up: true },
            { name: "Cacao", price: "$3.10/kg", change: "+2.1%", up: true },
            { name: "Tilapia", price: "$2.40/kg", change: "-0.3%", up: false },
            { name: "Mango", price: "$1.20/kg", change: "+0.6%", up: true },
            { name: "Vannamei Shrimp", price: "$4.20/kg", change: "+1.2%", up: true },
            { name: "Dragon Fruit", price: "$1.80/kg", change: "-0.5%", up: false },
            { name: "Organic Banana", price: "$0.62/kg", change: "+0.8%", up: true },
            { name: "Cacao", price: "$3.10/kg", change: "+2.1%", up: true },
          ].map((item, i) => (
            <span key={i} style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)" }}>
              <span style={{ color: "white", fontWeight: 500, marginRight: "6px" }}>{item.name}</span>
              {item.price} <span style={{ color: item.up ? "#4ade80" : "#f87171" }}>{item.change}</span>
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ background: "#071a0e", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
        <div style={{ color: "#4ade80", fontSize: "18px", fontWeight: 500 }}>Surco.trade</div>
        <div style={{ display: "flex", gap: "28px" }}>
          {["Products", "Producers", "How it works", "About"].map(item => (
            <a key={item} href="#" style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", textDecoration: "none" }}>{item}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <span style={{ fontSize: "18px" }}>🇬🇧</span>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>English</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "11px" }}>▾</span>
          </div>
          <button style={{ background: "transparent", color: "white", fontSize: "13px", fontWeight: 500, padding: "7px 18px", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.4)", cursor: "pointer" }}>
            My account
          </button>
        </div>
      </nav>

      {/* HERO - fondo 1 */}
      <div style={{ background: "#071a0e", minHeight: "100vh", padding: "64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center", alignContent: "center" }}>
        <div>
          <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", marginBottom: "20px", border: "0.5px solid rgba(74,222,128,0.3)" }}>
            B2B Agricultural Marketplace
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 500, lineHeight: 1.15, marginBottom: "16px", letterSpacing: "-0.5px" }}>
            Latin American produce,<br />
            <span style={{ color: "#4ade80" }}>direct to your door.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: 1.7, marginBottom: "28px", maxWidth: "400px" }}>
            We connect verified producers from Ecuador and Latin America with international buyers in Europe, USA, and Asia — sustainably and transparently.
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{ background: "#4ade80", color: "#071a0e", fontSize: "13px", fontWeight: 500, padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Browse products</button>
            <button style={{ background: "transparent", color: "white", fontSize: "13px", padding: "10px 24px", borderRadius: "6px", border: "0.5px solid rgba(255,255,255,0.18)", cursor: "pointer" }}>For producers</button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <div style={{ gridColumn: "span 2", display: "flex", gap: "16px", alignItems: "center", background: "#0a2414", border: "0.5px solid rgba(74,222,128,0.2)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ width: "64px", height: "64px", background: "#1a3a1a", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 28 C10 22, 16 18, 24 20 C30 22, 34 18, 32 12"/>
                <path d="M24 20 C26 24, 24 30, 20 32 C16 34, 10 32, 8 28"/>
                <path d="M32 12 C34 8, 30 6, 28 8"/>
                <circle cx="30" cy="10" r="1.5" fill="#4ade80" stroke="none"/>
              </svg>
            </div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Featured · Ecuador</div>
              <div style={{ color: "white", fontSize: "13px", fontWeight: 500, marginTop: "3px" }}>Vannamei White Shrimp</div>
              <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "3px" }}>From $4.20 / kg</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", marginTop: "2px" }}>Available year-round · LCL consolidation</div>
            </div>
          </div>
          {[
            { name: "Dragon Fruit", price: "From $1.80 / kg" },
            { name: "Organic Banana", price: "From $0.60 / kg" },
          ].map(p => (
            <div key={p.name} style={{ background: "#0a2414", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: "10px", padding: "16px" }}>
              <div style={{ width: "100%", height: "64px", background: "#1a3a1a", borderRadius: "8px", marginBottom: "10px" }} />
              <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "9px", letterSpacing: "0.5px", textTransform: "uppercase" }}>Ecuador</div>
              <div style={{ color: "white", fontSize: "13px", fontWeight: 500, marginTop: "3px" }}>{p.name}</div>
              <div style={{ color: "#4ade80", fontSize: "12px", marginTop: "3px" }}>{p.price}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PRICE TABLE - fondo 2 (más oscuro) */}
      <div style={{ background: "#040d06", padding: "60px 48px" }}>
        <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", marginBottom: "12px", border: "0.5px solid rgba(74,222,128,0.3)" }}>Live prices</div>
        <h2 style={{ fontSize: "26px", fontWeight: 500, letterSpacing: "-0.5px", marginBottom: "6px" }}>Market prices</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", lineHeight: 1.6, marginBottom: "28px" }}>Updated by our team. Prices reflect current export market conditions from Ecuador.</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          {["All", "Seafood", "Fruits", "Agro"].map((cat, i) => (
            <button key={cat} style={{ background: i === 0 ? "rgba(74,222,128,0.14)" : "transparent", border: i === 0 ? "0.5px solid rgba(74,222,128,0.35)" : "0.5px solid rgba(255,255,255,0.12)", color: i === 0 ? "#4ade80" : "rgba(255,255,255,0.45)", fontSize: "11px", padding: "5px 12px", borderRadius: "5px", cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
              {["Product", "Category", "Last Price", "Change", "Buy Price", "Sell Price", "Updated"].map((h, i) => (
                <th key={h} style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", fontWeight: 400, textAlign: i > 1 ? "right" : "left", padding: "10px 14px", letterSpacing: "0.5px", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { name: "Vannamei White Shrimp", cat: "Seafood", price: "$4.20/kg", change: "+1.20%", buy: "$3.95/kg", sell: "$4.45/kg", up: true, color: "#60a5fa" },
              { name: "Tilapia Fillet", cat: "Seafood", price: "$2.40/kg", change: "-0.30%", buy: "$2.20/kg", sell: "$2.60/kg", up: false, color: "#60a5fa" },
              { name: "Dragon Fruit", cat: "Fruits", price: "$1.80/kg", change: "-0.50%", buy: "$1.65/kg", sell: "$1.95/kg", up: false, color: "#4ade80" },
              { name: "Organic Banana", cat: "Fruits", price: "$0.62/kg", change: "+0.80%", buy: "$0.55/kg", sell: "$0.68/kg", up: true, color: "#4ade80" },
              { name: "Mango Tommy", cat: "Fruits", price: "$1.20/kg", change: "+0.60%", buy: "$1.10/kg", sell: "$1.30/kg", up: true, color: "#4ade80" },
              { name: "Cacao", cat: "Agro", price: "$3.10/kg", change: "+2.10%", buy: "$2.90/kg", sell: "$3.30/kg", up: true, color: "#fb923c" },
            ].map(row => (
              <tr key={row.name} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <td style={{ padding: "12px 14px", fontSize: "12px" }}>
                  <span style={{ display: "inline-block", width: "5px", height: "5px", borderRadius: "50%", background: row.color, marginRight: "7px", verticalAlign: "middle" }} />
                  {row.name}
                </td>
                <td style={{ padding: "12px 14px", fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>{row.cat}</td>
                <td style={{ padding: "12px 14px", fontSize: "12px", textAlign: "right" }}>{row.price}</td>
                <td style={{ padding: "12px 14px", fontSize: "12px", textAlign: "right", color: row.up ? "#4ade80" : "#f87171" }}>{row.change}</td>
                <td style={{ padding: "12px 14px", fontSize: "12px", textAlign: "right", color: "rgba(255,255,255,0.38)" }}>{row.buy}</td>
                <td style={{ padding: "12px 14px", fontSize: "12px", textAlign: "right", color: "rgba(255,255,255,0.38)" }}>{row.sell}</td>
                <td style={{ padding: "12px 14px", fontSize: "12px", textAlign: "right", color: "rgba(255,255,255,0.38)" }}>Today</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CATEGORY SLIDER - fondo 1 */}
      <div style={{ background: "#071a0e", padding: "60px 48px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", marginBottom: "12px", border: "0.5px solid rgba(74,222,128,0.3)" }}>Our categories</div>
        <h2 style={{ fontSize: "26px", fontWeight: 500, letterSpacing: "-0.5px", marginBottom: "32px" }}>What we export.</h2>
        <div style={{ display: "flex", gap: "10px", height: "440px", justifyContent: "center" }}>
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                borderRadius: "12px",
                background: "#0a2414",
                border: active === i ? "0.5px solid rgba(74,222,128,0.2)" : "0.5px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                transition: "all 0.4s ease",
                overflow: "hidden",
                position: "relative",
                ...(active === i
                  ? { flex: "1", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", textAlign: "center" as const, padding: "48px 40px" }
                  : { flex: "0 0 90px", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "flex-end", paddingBottom: "28px" }
                )
              }}
            >
              {active === i ? (
                <>
                  <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(74,222,128,0.3)", marginBottom: "20px" }}>{cat.tag}</div>
                  <div style={{ color: "white", fontSize: "52px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0, marginBottom: "6px", fontFamily: "Georgia, serif" }}>
                    {cat.title.split("\n").map((t, j) => <span key={j}>{t}{j === 0 && cat.title.includes("\n") && <br />}</span>)}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>{cat.sub}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px", maxWidth: "300px" }}>{cat.desc}</div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const, justifyContent: "center", marginBottom: "32px" }}>
                    {cat.products.map(p => (
                      <span key={p} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(255,255,255,0.1)" }}>{p}</span>
                    ))}
                  </div>
                  <button style={{ background: "#4ade80", color: "#071a0e", fontSize: "13px", fontWeight: 600, padding: "14px 32px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Browse products →</button>
                  <div style={{ position: "absolute", bottom: "0", left: "0", width: "100%", overflow: "hidden", pointerEvents: "none", whiteSpace: "nowrap" }}>
                    <div style={{ display: "inline-block", animation: "scrollleft 10s linear infinite" }}>
                      <span style={{ fontSize: "140px", fontWeight: 700, color: "rgba(255,255,255,0.04)", fontFamily: "Georgia, serif", display: "inline-block", paddingRight: "40px", lineHeight: 1 }}>{cat.bg}</span>
                      <span style={{ fontSize: "140px", fontWeight: 700, color: "rgba(255,255,255,0.04)", fontFamily: "Georgia, serif", display: "inline-block", paddingRight: "40px", lineHeight: 1 }}>{cat.bg}</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)", color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>{cat.tag}</div>
                  <div style={{ writingMode: "vertical-rl" as const, transform: "rotate(180deg)", color: "white", fontSize: "20px", fontWeight: 700, fontFamily: "Georgia, serif" }}>{cat.label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "16px" }}>→</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* HERO ILUSTRACIONES - fondo 2 (más oscuro) */}
      <div style={{ background: "#040d06", padding: "80px 48px", display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "40px", alignItems: "center" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
            <path d="M10 60 Q40 20 80 40" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            <path d="M60 60 L160 60 L190 40 L90 40 Z" fill="#0a2414" stroke="#4ade80" strokeWidth="1.2"/>
            <path d="M160 60 L190 40 L190 130 L160 150 Z" fill="#071a0e" stroke="#4ade80" strokeWidth="1.2"/>
            <path d="M60 60 L160 60 L160 150 L60 150 Z" fill="#0d2e1a" stroke="#4ade80" strokeWidth="1.2"/>
            <line x1="85" y1="60" x2="85" y2="150" stroke="#4ade80" strokeWidth="0.5" opacity="0.4"/>
            <line x1="110" y1="60" x2="110" y2="150" stroke="#4ade80" strokeWidth="0.5" opacity="0.4"/>
            <line x1="135" y1="60" x2="135" y2="150" stroke="#4ade80" strokeWidth="0.5" opacity="0.4"/>
            <line x1="110" y1="65" x2="110" y2="145" stroke="#4ade80" strokeWidth="1" opacity="0.6"/>
            <rect x="100" y="100" width="6" height="4" rx="1" fill="#4ade80" opacity="0.6"/>
            <rect x="112" y="100" width="6" height="4" rx="1" fill="#4ade80" opacity="0.6"/>
            <rect x="155" y="32" width="30" height="12" rx="2" fill="#0a2414" stroke="#4ade80" strokeWidth="0.8"/>
            <line x1="158" y1="35" x2="182" y2="35" stroke="#4ade80" strokeWidth="0.5" opacity="0.5"/>
            <line x1="158" y1="38" x2="182" y2="38" stroke="#4ade80" strokeWidth="0.5" opacity="0.5"/>
            <line x1="158" y1="41" x2="182" y2="41" stroke="#4ade80" strokeWidth="0.5" opacity="0.5"/>
            <ellipse cx="80" cy="155" rx="8" ry="4" fill="#071a0e" stroke="#4ade80" strokeWidth="1"/>
            <ellipse cx="140" cy="155" rx="8" ry="4" fill="#071a0e" stroke="#4ade80" strokeWidth="1"/>
            <ellipse cx="165" cy="148" rx="6" ry="3" fill="#071a0e" stroke="#4ade80" strokeWidth="0.8"/>
            <rect x="62" y="68" width="40" height="14" rx="3" fill="rgba(74,222,128,0.12)" stroke="#4ade80" strokeWidth="0.5"/>
            <text x="82" y="78" textAnchor="middle" fill="#4ade80" fontSize="7" fontFamily="monospace">-18°C</text>
            <rect x="30" y="90" width="52" height="22" rx="4" fill="#0a2414" stroke="rgba(74,222,128,0.3)" strokeWidth="0.5"/>
            <text x="56" y="99" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="sans-serif">20ft Reefer</text>
            <text x="56" y="108" textAnchor="middle" fill="#4ade80" fontSize="6.5" fontFamily="sans-serif">22 tons · 22 slots</text>
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 12px", borderRadius: "4px", border: "0.5px solid rgba(74,222,128,0.3)", marginBottom: "24px" }}>B2B Export Platform</div>
          <h2 style={{ color: "white", fontSize: "40px", fontWeight: 500, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: "16px" }}>
            From the farm<br />to your port.<br />
            <span style={{ color: "#4ade80", fontWeight: 700 }}>Fair prices.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "14px", lineHeight: 1.6, marginBottom: "32px" }}>
            No middlemen. Your volume.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button style={{ background: "#4ade80", color: "#040d06", fontSize: "14px", fontWeight: 600, padding: "13px 28px", borderRadius: "50px", border: "none", cursor: "pointer" }}>Book a demo</button>
            <button style={{ background: "transparent", color: "white", fontSize: "14px", padding: "13px 28px", borderRadius: "50px", border: "1.5px solid rgba(255,255,255,0.25)", cursor: "pointer" }}>Browse products</button>
          </div>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px", marginTop: "12px", fontStyle: "italic" }}>No commitment required</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
            <path d="M210 60 Q180 20 140 40" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 4" opacity="0.3"/>
            <path d="M30 70 L110 70 L140 50 L60 50 Z" fill="#0a2414" stroke="#4ade80" strokeWidth="1.2"/>
            <path d="M110 70 L140 50 L140 140 L110 160 Z" fill="#071a0e" stroke="#4ade80" strokeWidth="1.2"/>
            <path d="M30 70 L110 70 L110 160 L30 160 Z" fill="#0d2e1a" stroke="#4ade80" strokeWidth="1.2"/>
            <rect x="55" y="110" width="30" height="50" rx="1" fill="#071a0e" stroke="#4ade80" strokeWidth="0.8"/>
            <line x1="70" y1="110" x2="70" y2="160" stroke="#4ade80" strokeWidth="0.5" opacity="0.5"/>
            <line x1="56" y1="120" x2="84" y2="120" stroke="#4ade80" strokeWidth="0.3" opacity="0.4"/>
            <line x1="56" y1="130" x2="84" y2="130" stroke="#4ade80" strokeWidth="0.3" opacity="0.4"/>
            <line x1="56" y1="140" x2="84" y2="140" stroke="#4ade80" strokeWidth="0.3" opacity="0.4"/>
            <line x1="56" y1="150" x2="84" y2="150" stroke="#4ade80" strokeWidth="0.3" opacity="0.4"/>
            <rect x="35" y="80" width="15" height="12" rx="1" fill="#071a0e" stroke="#4ade80" strokeWidth="0.6"/>
            <rect x="90" y="80" width="15" height="12" rx="1" fill="#071a0e" stroke="#4ade80" strokeWidth="0.6"/>
            <rect x="95" y="130" width="60" height="30" rx="2" fill="#0a2414" stroke="#4ade80" strokeWidth="1"/>
            <path d="M155 135 L175 140 L175 160 L155 160 Z" fill="#0d2e1a" stroke="#4ade80" strokeWidth="1"/>
            <path d="M157 137 L173 141 L173 150 L157 150 Z" fill="#071a0e" stroke="#4ade80" strokeWidth="0.5"/>
            <ellipse cx="110" cy="162" rx="8" ry="5" fill="#071a0e" stroke="#4ade80" strokeWidth="1"/>
            <ellipse cx="145" cy="162" rx="8" ry="5" fill="#071a0e" stroke="#4ade80" strokeWidth="1"/>
            <ellipse cx="168" cy="162" rx="6" ry="4" fill="#071a0e" stroke="#4ade80" strokeWidth="0.8"/>
            <rect x="140" y="88" width="60" height="22" rx="4" fill="#0a2414" stroke="rgba(74,222,128,0.3)" strokeWidth="0.5"/>
            <text x="170" y="97" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="6.5" fontFamily="sans-serif">Guayaquil → World</text>
            <text x="170" y="106" textAnchor="middle" fill="#4ade80" fontSize="6.5" fontFamily="sans-serif">FOB · Direct export</text>
          </svg>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ background: "#0a2414", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ color: "#4ade80", fontSize: "15px", fontWeight: 500 }}>Surco.trade</div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>© 2026 Surco.trade · All rights reserved</div>
      </div>

    </div>
  );
}