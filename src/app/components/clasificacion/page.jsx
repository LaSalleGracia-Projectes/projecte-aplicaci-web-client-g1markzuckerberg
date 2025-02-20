// pages/clasificacion.js
import Layout from "@/components/layout";

export default function Clasificacion() {
  return (
    <Layout currentPage="Clasificacion"> {/* Pasamos "Clasificacion" */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">Clasificación</h1>
        <p className="text-lg text-gray-700">
          Aquí puedes ver la clasificación actualizada.
        </p>
      </div>
    </Layout>
  );
}