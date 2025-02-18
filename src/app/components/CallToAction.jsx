import React from 'react';
import './CallToAction.css';

const CallToAction = () => {
    return (
        <section id="cta">
            <div className="container">
                <button id="start-playing" onClick={() => document.getElementById('next-round').scrollIntoView({ behavior: 'smooth' })}>
                    COMENZAR A JUGAR
                </button>
            </div>
        </section>
    );
};

export default CallToAction;