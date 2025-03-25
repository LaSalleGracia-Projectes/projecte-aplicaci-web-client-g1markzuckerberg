import React from 'react';
import '../styles/globals.css';

export default function TopScorersAssists() {
    return (
        <section id="top-scorers-assists">
            <div className="container">
                <h2>Máximos Goleadores y Asistidores</h2>
                <div className="scorers-assists-container">
                    <div className="scorers">
                        <h3>Goleadores</h3>
                        <ul>
                            <li>1. Cristiano Ronaldo - 15 goles</li>
                            <li>2. Lionel Messi - 12 goles</li>
                            <li>3. Benzema - 10 goles</li>
                        </ul>
                    </div>
                    <div className="image">
                        <img src="/imagen.jpg" alt="Imagen Central" />
                    </div>
                    <div className="assists">
                        <h3>Asistencias</h3>
                        <ul>
                            <li>1. Modric - 10 asistencias</li>
                            <li>2. Kroos - 8 asistencias</li>
                            <li>3. Hazard - 6 asistencias</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}