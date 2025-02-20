// pages/index.js
import Layout from "@/components/layout";

export default function Home() {
  return (
    <Layout currentPage="Inicio"> {/* Pasamos "Inicio" */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Bienvenido a Mi Aplicación</h1>
        <p className="text-lg text-gray-700">
          Esta es la página de inicio de nuestra aplicación.
        </p>
      </div>
    </Layout>
  );
}