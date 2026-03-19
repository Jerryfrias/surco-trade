"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Sidebar from "../components/Sidebar";

type Producto = {
  id: number;
  nombre: string;
  tipo: string;
  origen: string;
  precio: string;
  unidad: string;
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState({ nombre: "", tipo: "", origen: "", precio: "", unidad: "" });
  const [mostrarForm, setMostrarForm] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const { data } = await supabase.from("productos").select("*").order("id", { ascending: false });
    if (data) setProductos(data);
  };

  const agregar = async () => {
    if (!form.nombre) return;
    await supabase.from("productos").insert([form]);
    setForm({ nombre: "", tipo: "", origen: "", precio: "", unidad: "" });
    setMostrarForm(false);
    cargar();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Productos</h2>
          <button onClick={() => setMostrarForm(!mostrarForm)}
            className="bg-green-500 hover:bg-green-400 text-black font-semibold px-4 py-2 rounded-lg transition">
            + Agregar Producto
          </button>
        </div>
        {mostrarForm && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 grid grid-cols-2 gap-4">
            {[
              { key: "nombre", label: "Nombre (ej: Camarón Vannamei)" },
              { key: "tipo", label: "Tipo (ej: Mariscos)" },
              { key: "origen", label: "Origen (ej: Ecuador)" },
              { key: "precio", label: "Precio referencial (USD)" },
              { key: "unidad", label: "Unidad (ej: kg, tonelada)" },
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
        {productos.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            <p className="text-lg">No hay productos registrados</p>
            <p className="text-sm mt-1">Agrega el primero con el botón de arriba</p>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-sm">
                <th className="text-left py-3 px-4">Nombre</th>
                <th className="text-left py-3 px-4">Tipo</th>
                <th className="text-left py-3 px-4">Origen</th>
                <th className="text-left py-3 px-4">Precio</th>
                <th className="text-left py-3 px-4">Unidad</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-900 transition">
                  <td className="py-3 px-4 font-medium">{p.nombre}</td>
                  <td className="py-3 px-4 text-green-400">{p.tipo}</td>
                  <td className="py-3 px-4 text-gray-300">{p.origen}</td>
                  <td className="py-3 px-4 text-gray-300">${p.precio}</td>
                  <td className="py-3 px-4 text-gray-300">{p.unidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}