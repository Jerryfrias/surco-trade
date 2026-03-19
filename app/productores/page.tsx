"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

type Productor = {
  id: number;
  nombre: string;
  producto: string;
  region: string;
  contacto: string;
};

export default function Productores() {
  const [productores, setProductores] = useState<Productor[]>([]);
  const [form, setForm] = useState({ nombre: "", producto: "", region: "", contacto: "" });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const { data } = await supabase.from("productores").select("*").order("id", { ascending: false });
    if (data) setProductores(data);
  };

  const agregar = async () => {
    if (!form.nombre) return;
    await supabase.from("productores").insert([form]);
    setForm({ nombre: "", producto: "", region: "", contacto: "" });
    setMostrarForm(false);
    cargar();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-green-400 font-bold text-xl">Surco.trade</h1>
          <p className="text-gray-500 text-xs mt-1">Panel Interno</p>
        </div>
        <nav className="flex flex-col gap-2">
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
      </aside>
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productores</h2>
          <button onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition">
            + Agregar Productor
          </button>
        </div>
        {mostrarForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
            {[
              { key: "nombre", label: "Nombre" },
              { key: "producto", label: "Producto (ej: Camarón)" },
              { key: "region", label: "Región" },
              { key: "contacto", label: "Contacto" },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-gray-400 text-sm mb-1 block">{field.label}</label>
                <input
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            ))}
            <div className="col-span-2 flex gap-3">
              <button onClick={agregar}
                className="bg-green-500 hover:bg-green-400 text-black font-semibold px-6 py-2 rounded-lg transition">
                Guardar
              </button>
              <button onClick={() => setMostrarForm(false)}
                className="text-gray-400 hover:text-white px-4 py-2 transition">
                Cancelar
              </button>
            </div>
          </div>
        )}
        {productores.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-lg">No hay productores registrados</p>
            <p className="text-sm mt-1">Agrega el primero con el botón de arriba</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Producto</th>
                <th className="text-left py-3 px-4">Región</th>
                <th className="text-left py-3 px-4">Contacto</th>
              </tr>
            </thead>
            <tbody>
              {productores.map((p) => (
                <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="py-3 px-4">{p.nombre}</td>
                  <td className="py-3 px-4 text-green-400">{p.producto}</td>
                  <td className="py-3 px-4 text-gray-300">{p.region}</td>
                  <td className="py-3 px-4 text-gray-300">{p.contacto}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}