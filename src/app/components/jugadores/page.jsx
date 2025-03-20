// pages/index.js
import Layout from "@/components/layout";
import Image from "next/image";
import AuthGuard from "@/components/authGuard/authGuard";

export default function Jugadores() {
  return (
    <AuthGuard>
      <Layout currentPage="Jugadores">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-lg text-gray-700">
          </p>
        </div>
      </Layout>
    </AuthGuard>
  );
}