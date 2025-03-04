import React from 'react';
import Layout from '@/components/layout';

export default function ajustes() {
    const opciones = [
        { img: "/images/user.png", text: "Equipo" },
        { img: "/images/gestion.png", text: "Gestion de ligas" },
        { img: "/images/proteccion.png", text: "Usuario" },
        { img: "/images/interfaz.png", text: "Interfaz" },
    ];

    return (
        <Layout currentPage="Ajustes">
            <div className="h-screen flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl h-[90vh]">
                    {opciones.map((opcion, index) => (
                        <div key={index} className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg">
                            <img src={opcion.img} alt={opcion.text} className="w-16 h-16 mb-2" />
                            <p className="text-lg font-semibold">{opcion.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}
