import React from 'react';
import './NextRound.css';

const NextRound = () => {
    return (
        <section id="next-round">
            <div className="container">
                <h2>Próxima Jornada</h2>
                <div className="matches">
                    <div className="match">Real Madrid vs Barcelona</div>
                    <div className="match">Atletico Madrid vs Sevilla</div>
                    <div className="match">Valencia vs Villarreal</div>
                </div>
            </div>
        </section>
    );
};

export default NextRound;