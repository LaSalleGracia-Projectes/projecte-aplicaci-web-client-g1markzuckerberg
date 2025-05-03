import { useState } from "react";
import Layout from "@/components/layout";
import AuthGuard from "@/components/authGuard/authGuard";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Get token from localStorage
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setError("No estás autenticado. Por favor, inicia sesión primero.");
        setIsSubmitting(false);
        return;
      }

      const response = await fetch("http://localhost:3000/api/v1/contactForm/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          mensaje: message 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ha ocurrido un error al enviar el formulario");
      }

      setSuccess("¡Mensaje enviado correctamente!");
      setMessage("");
    } catch (error) {
      setError(error.message || "Ha ocurrido un error al enviar el formulario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Formulario de Contacto</h1>
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 w-full max-w-lg">
            <p>{success}</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-lg">
            <p>{error}</p>
          </div>
        )}
        
        <div className="w-full max-w-lg bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
              Mensaje
            </label>
            <textarea 
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
              id="message" 
              placeholder="Escribe tu mensaje aquí..." 
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button 
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </div>
        <AuthGuard /> 
      </main>
    </Layout>
  );
}