"use client";
import { useState } from "react";

const categories = [
  { tag: "Category 01", title: "Aqua-\nculture", sub: "Ecuador · Pacific Coast", desc: "Premium shrimp, tilapia and seafood products farmed under strict quality standards, ready for international export.", products: ["Vannamei Shrimp", "Tilapia", "Black Tiger", "Tuna"], bg: "Aquaculture" },
  { tag: "Category 02", title: "Agri-\nculture", sub: "Ecuador · Highlands & Coast", desc: "Fresh tropical fruits, cacao and specialty crops from verified Ecuadorian producers, consolidated for global buyers.", products: ["Dragon Fruit", "Banana", "Mango", "Cacao"], bg: "Agriculture" },
  { tag: "Category 03", title: "Flori-\nculture", sub: "Ecuador · Andean Region", desc: "Ecuador is the world's 3rd largest flower exporter. Fresh-cut roses, carnations and gypsophila shipped worldwide.", products: ["Roses", "Carnations", "Gypsophila", "Lilies"], bg: "Floriculture" },
  { tag: "Category 04", title: "Poultry", sub: "Ecuador · National Production", desc: "High-quality poultry products from certified Ecuadorian farms, meeting international food safety standards.", products: ["Chicken", "Turkey", "Eggs", "Processed"], bg: "Poultry" },
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
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 48px", borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
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

      {/* HERO */}
      <div style={{ padding: "64px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "center" }}>
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

      {/* PRICE TABLE */}
      <div style={{ padding: "40px 48px" }}>
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

      {/* CATEGORY SLIDER */}
      <div style={{ padding: "40px 48px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", marginBottom: "12px", border: "0.5px solid rgba(74,222,128,0.3)" }}>Our categories</div>
        <h2 style={{ fontSize: "26px", fontWeight: 500, letterSpacing: "-0.5px", marginBottom: "32px" }}>What we export.</h2>
        <div style={{ display: "flex", gap: "12px", height: "400px" }}>
          {categories.map((cat, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                borderRadius: "12px",
                background: "#0a2414",
                border: active === i ? "0.5px solid rgba(74,222,128,0.25)" : "0.5px solid rgba(255,255,255,0.07)",
                cursor: "pointer",
                transition: "all 0.4s ease",
                overflow: "hidden",
                position: "relative",
                ...(active === i
                  ? { flex: 1, padding: "40px", display: "flex", flexDirection: "column", justifyContent: "space-between" }
                  : { width: "80px", flexShrink: 0, display: "flex", alignItems: "flex-end", padding: "24px 0" }
                )
              }}
            >
              {active === i ? (
                <>
                  <div>
                    <div style={{ display: "inline-block", background: "rgba(74,222,128,0.12)", color: "#4ade80", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(74,222,128,0.3)", marginBottom: "20px" }}>{cat.tag}</div>
                    <div style={{ color: "white", fontSize: "52px", fontWeight: 700, letterSpacing: "-2px", lineHeight: 1.0, marginBottom: "6px", fontFamily: "Georgia, serif" }}>{cat.title.split("\n").map((t, j) => <span key={j}>{t}{j === 0 && <br />}</span>)}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "20px" }}>{cat.sub}</div>
                    <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", lineHeight: 1.6, marginBottom: "24px", maxWidth: "340px" }}>{cat.desc}</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
                      {cat.products.map(p => (
                        <span key={p} style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", fontSize: "11px", padding: "4px 10px", borderRadius: "4px", border: "0.5px solid rgba(255,255,255,0.1)" }}>{p}</span>
                      ))}
                    </div>
                  </div>
                  <button style={{ background: "#4ade80", color: "#071a0e", fontSize: "13px", fontWeight: 600, padding: "14px 32px", borderRadius: "50px", border: "none", cursor: "pointer", width: "fit-content" }}>Browse products →</button>
                  <div style={{ position: "absolute", bottom: "-30px", right: "-10px", fontSize: "160px", fontWeight: 700, color: "rgba(255,255,255,0.04)", letterSpacing: "-8px", pointerEvents: "none", lineHeight: 1, fontFamily: "Georgia, serif", animation: "scrollleft 8s linear infinite", whiteSpace: "nowrap" }}>
                    {cat.bg}&nbsp;&nbsp;{cat.bg}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", width: "100%", textAlign: "center", marginBottom: "8px" }}>{cat.tag}</div>
                  <div style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: "white", fontSize: "22px", fontWeight: 700, width: "100%", textAlign: "center", fontFamily: "Georgia, serif" }}>{cat.title.replace("\n", "")}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "16px", position: "absolute", bottom: "20px", left: "50%", transform: "translateX(-50%)" }}>→</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.06)", padding: "28px 48px", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "40px" }}>
        <div style={{ color: "#4ade80", fontSize: "15px", fontWeight: 500 }}>Surco.trade</div>
        <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "11px" }}>© 2026 Surco.trade · All rights reserved</div>
      </div>

    </div>
  );
}