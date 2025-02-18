import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="container">
                <div className="footer-left">
                    <select id="language-selector">
                        <option value="es">Español</option>
                        <option value="en">English</option>
                    </select>
                    <a href="#">Política de Privacidad</a>
                    <a href="#">Contacto</a>
                    <a href="#">Configuración de Cookies</a>
                </div>
                <div className="footer-right">
                    &copy; Noviembre 2024 Mark Zuckerberg S.L
                </div>
            </div>
        </footer>
    );
};

export default Footer;