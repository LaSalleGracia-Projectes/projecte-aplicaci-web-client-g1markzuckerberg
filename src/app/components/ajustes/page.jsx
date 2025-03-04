"use client";

import React, { useState } from 'react';
import Layout from '@/components/layout';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';

export default function Ajustes() {
    const [isOpen, setIsOpen] = useState(false);
    const [popupContent, setPopupContent] = useState("");

    const openPopup = (content) => {
        setPopupContent(content);
        setIsOpen(true);
    };

    const opciones = [
        { img: "/images/user.png", text: "Equipo", action: () => openPopup("Información sobre el equipo.") },
        { img: "/images/gestion.png", text: "Gestion de ligas", action: "/gestion-ligas" },
        { img: "/images/proteccion.png", text: "Usuario", action: "/cuenta" },
        { img: "/images/interfaz.png", text: "Interfaz", action: () => openPopup("Datos sobre los nuevos burger-menu.") },
    ];

    return (
        <Layout currentPage="Ajustes">
            <div className="h-screen flex items-center justify-center">
                <div className="grid grid-cols-2 gap-8 w-full max-w-2xl h-[90vh]">
                    {opciones.map((opcion, index) => (
                        typeof opcion.action === "string" ? (
                            <Link key={index} href={opcion.action} className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300">
                                <img src={opcion.img} alt={opcion.text} className="w-24 h-24 mb-2" />
                                <p className="text-lg font-semibold">{opcion.text}</p>
                            </Link>
                        ) : (
                            <div key={index} onClick={opcion.action} className="flex flex-col items-center justify-center bg-gray-200 p-6 rounded-2xl shadow-lg cursor-pointer hover:bg-gray-300">
                                <img src={opcion.img} alt={opcion.text} className="w-24 h-24 mb-2" />
                                <p className="text-lg font-semibold">{opcion.text}</p>
                            </div>
                        )
                    ))}
                </div>
            </div>
            
            {/* Popup */}
            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4">Información</h2>
                    <p>{popupContent}</p>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Cerrar
                    </button>
                </div>
            </Dialog>
        </Layout>
    );
}
