import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { handleFile, handleKeyDown } from "./canvasFunctions";
import './components.css';

export default function Container({ children, expanded, setExpanded }) {
    const canvasRef = useRef(null);
    const [copiedObject, setCopiedObject] = useState(null);
    const [ objectValues, setObjectValues ] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotateAngle: 0, pathOffset: { x: 0, y: 0 } });

    useEffect(() => {
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.cornerColor = '#7f77eb85';
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerSize = 12;

        const canvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 500,
            backgroundColor: "white",
            fireRightClick: true,
            stopContextMenu: true
        });
        window.canvas = canvas;

        canvas.on('mouse:move', (e) => {
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                const x = parseFloat(activeObject.left.toFixed(2));
                const y = parseFloat(activeObject.top.toFixed(2));
                const scaleX = parseFloat(activeObject.scaleX.toFixed(2));
                const scaleY = parseFloat(activeObject.scaleY.toFixed(2));
                const angle = parseFloat(activeObject.angle.toFixed(2));

                const object = { x: x, y: y, scaleX: scaleX, scaleY: scaleY, rotateAngle: angle };
                setObjectValues(object);
            }
        })

        return () => canvas.dispose();
    }, []);

    useEffect(() => {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            activeObject.set({
                left: objectValues.x, 
                top: objectValues.y, 
                scaleX: objectValues.scaleX, 
                scaleY: objectValues.scaleY, 
                angle: objectValues.rotateAngle
            })
            canvas.renderAll();
        }
    }, [objectValues])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown( copiedObject, setCopiedObject ));
        return () => { 
            window.removeEventListener('keydown', handleKeyDown) 
        };
    }, [copiedObject]);

    return (
        <section className="h-full w-full flex canvas-section relative ">
            <div className={`canvas ${ expanded ? 'w-[80%]' : 'w-[100%]' } relative transition-all duration-500`}>
                <div className="machine-outer">
                    <div className="machine-inner relative"
                        onDrop={ e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) } } 
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