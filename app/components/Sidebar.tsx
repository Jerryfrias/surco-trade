"use client";
import { supabase } from "../../lib/supabase";

export default function Sidebar() {
  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
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
  );
}