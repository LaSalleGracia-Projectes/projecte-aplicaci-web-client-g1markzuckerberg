'use client';
import React from 'react';
import '../styles/globals.css';

export default function CallToAction() {
    return (
        <section id="cta">
            <div className="container">
                <button
                    id="start-playing"
                    onClick={() => document.getElementById('next-round').scrollIntoView({ behavior: 'smooth' })}
                >
                    COMENZAR A JUGAR
                </button>
            </div>
        </section>
    );
}