import React from 'react';
import headerFantasy from './headerFantasy';

export default function ajustes() {
    const opciones = [
        { img: "/images/icon1.png", text: "Texto 1" },
        { img: "/images/icon2.png", text: "Texto 2" },
        { img: "/images/icon3.png", text: "Texto 3" },
        { img: "/images/icon4.png", text: "Texto 4" },
      ];
return (
    <Layout currentPage="Ajustes"> {/* Pasamos "Ajustes" */}
    <div className="flex flex-col items-center justify-center h-screen">

    </div>
    </Layout>
);
}