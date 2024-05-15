import React from "react";
import './components.css';

export default function Container({ children }) {
    return (
        <section className="h-full w-full canvas-section">
            <div className="canvas">
                <div className="machine-outer">
                    <div className="machine-inner relative">
                        <canvas width={700} height={500} style={{backgroundColor: 'white'}}></canvas>
                    </div>
                </div>
            </div>
        </section>
    )
}