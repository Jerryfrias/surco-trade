"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [counts, setCounts] = useState({ productores: 0, productos: 0, pedidos: 0 });

  useEffect(() => {
    const cargar = async () => {
      const [p1, p2, p3] = await Promise.all([
        supabase.from("productores").select("*", { count: "exact", head: true }),
        supabase.from("productos").select("*", { count: "exact", head: true }),
        supabase.from("pedidos").select("*", { count: "exact", head: true }),
      ]);
      setCounts({
        productores: p1.count || 0,
        productos: p2.count || 0,
        pedidos: p3.count || 0,
      });
    };
    cargar();
  }, []);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-green-400 font-bold text-xl">Surco.trade</h1>
          <p className="text-gray-500 text-xs mt-1">Panel Interno</p>
        </div>
        <nav className="flex flex-col gap-2 flex-1">
          {[
            { label: "Resumen", href: "/dashboard" },
            { label: "Productores", href: "/productores" },
            { label: "Productos", href: "/productos" },
            { label: "Pedidos", href: "/pedidos" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              className="text-left px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition">
              {item.label}
            </a>
          ))}
        </nav>
        <button onClick={cerrarSesion}
          className="text-left px-4 py-2 rounded-lg text-red-400 hover:bg-gray-800 transition text-sm">
          Cerrar sesión
        </button>
      </aside>
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Resumen</h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Productores", value: counts.productores },
            { label: "Productos", value: counts.productos },
            { label: "Pedidos", value: counts.pedidos },
            { label: "Compradores", value: 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600">Bienvenido al panel de Surco.trade</p>
      </main>
    </div>
  );
}