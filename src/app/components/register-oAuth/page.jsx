"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Layout2 from "@/components/layout2";

export default function RegisterOAuth() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const webToken = params.get("webToken");
    const refreshWebToken = params.get("refreshWebToken");

    if (webToken && refreshWebToken) {
      localStorage.setItem("token", webToken);
      localStorage.setItem("refreshToken", refreshWebToken);
      window.history.replaceState({}, document.title, "/"); // Limpia los query params
      router.push("/components/home_logged"); // Redirige al dashboard
    }
  }, []);

  const handleGoogleSignIn = () => {
    // Aquí redirigimos directamente al backend
    window.location.href = "http://localhost:4000/auth/google/web";
  };

  return (
    <Layout2>
      <div className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-128px)]">
        <div className="w-full max-w-md space-y-6 bg-white p-6 rounded-lg shadow-sm text-center">
          <div className="w-full aspect-[4/3] bg-[#e5e5ea] mb-6" />
          <h1 className="text-xl font-semibold">Registrarse con Google</h1>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button onClick={handleGoogleSignIn} className="p-2 border rounded-md mx-auto block">
            <Image src="/images/google.png" alt="Google Sign In" width={32} height={32} />
          </button>

          <p className="text-sm mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/components/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </Layout2>
  );
}
