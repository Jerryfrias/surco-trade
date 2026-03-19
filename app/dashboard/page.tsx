export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      
      {/* Menú lateral */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col gap-8">
        <div>
          <h1 className="text-green-400 font-bold text-xl">Surco.trade</h1>
          <p className="text-gray-500 text-xs mt-1">Panel Interno</p>
        </div>
        <nav className="flex flex-col gap-2">
          {[
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

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Resumen</h2>
        
        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Productores", value: "0" },
            { label: "Productos", value: "0" },
            { label: "Pedidos", value: "0" },
            { label: "Compradores", value: "0" },
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