import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { handleFile } from "./editor/functions";
import './container.css';
import  useCanvas  from "../context";

export default function Container({ children, expanded, setExpanded }) {
    const { 
        canvas, 
        canvasRef, 
        objectValues, 
    } = useCanvas();

    return (
        <section className="h-full w-full flex canvas-section relative ">
            <div className={`canvas ${ expanded ? 'w-[80%]' : 'w-[100%]' } relative transition-all duration-500`}>
                <div className="machine-outer">
                    <div className="machine-inner relative"
                        onDrop={ e => { e.preventDefault(); handleFile(e.dataTransfer.files[0], canvas) } } 
                        onDragOver={ e => { e.preventDefault(); } }
                    >
                        <canvas ref={ canvasRef }></canvas>
                    </div>
                </div>

                <button onClick={() => setExpanded(!expanded)}>{ expanded ? <ChevronRight size={30} color="#F5762E" /> : <ChevronLeft size={30} color="#F5762E" /> }</button>
            </div>

            <div className={`${ expanded ? 'w-[20%]' : 'w-[0]' } bg-white transition-all duration-500 overflow-hidden`}>
                { children } 
            </div>
            <div className={`absolute bottom-0 ${ expanded ? 'w-[80%]' : 'w-full' } py-2 px-4 footer transition-all duration-500`}>
                <div><p>X : { objectValues.x }</p></div>
                <div><p>Y : { objectValues.y }</p></div>
                <div><p>scaleX : { objectValues.scaleX }</p></div>
                <div><p>scaleY : { objectValues.scaleY }</p></div>
                <div><p>angle : { objectValues.rotateAngle }</p></div>
            </div>
        </section>
    )
}