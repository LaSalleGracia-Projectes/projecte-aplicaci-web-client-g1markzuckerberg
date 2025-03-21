import Layout from "@/components/layout";
import AuthGuard from "@/components/authGuard/authGuard";

export default function Jornada() {
  return (
    <AuthGuard>
      <Layout currentPage="Jornada"> {/* Pasamos "Inicio" */}
        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen bg-cover bg-center"
          style={{
            backgroundImage: 'url("/images/campo.png")',
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            minHeight: "100%",
          }}
        >
          <p className="text-lg text-gray-700">
          </p>
        </div>
      </Layout>
    </AuthGuard>
  );
}