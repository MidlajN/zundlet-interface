'use client';

import React,{ createContext, useContext, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { handleKeyDown } from "./components/canvasFunctions";

const CanvasContext = createContext(null);

export default function useCanvas() {
    return useContext(CanvasContext);
}

export const CanvasProvider = ({ children }) => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas ] = useState(null);
    const [ objectValues, setObjectValues ] = useState({ x: 0, y: 0, scaleX: 1, scaleY: 1, rotateAngle: 0 });
    const [ copiedObject, setCopiedObject ] = useState(null);

    useEffect(() => {
        fabric.Object.prototype.cornerStyle = 'circle';
        fabric.Object.prototype.cornerColor = '#7f77eb85';
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerSize = 12;

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 500,
            backgroundColor: "white",
            fireRightClick: true,
            stopContextMenu: true
        })

        setCanvas(fabricCanvas);
        return () => fabricCanvas.dispose();
    }, []);

    useEffect(() => {
        if (!canvas) return;
        canvas.on('mouse:move', (event) => {
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                const x = parseFloat(activeObject.left.toFixed(2));
                const y = parseFloat(activeObject.top.toFixed(2));
                const scaleX = parseFloat(activeObject.scaleX.toFixed(2));
                const scaleY = parseFloat(activeObject.scaleY.toFixed(2));
                const angle = parseFloat(activeObject.angle.toFixed(2));

                setObjectValues({ x: x, y: y, scaleX: scaleX, scaleY: scaleY, rotateAngle: angle });
            }
        })
    }, [canvas]);

    useEffect(() => {
        if (!canvas) return;

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
    }, [objectValues]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown( copiedObject, setCopiedObject, canvas ));
        return () => { 
            window.removeEventListener('keydown', handleKeyDown) 
        };
    }, [copiedObject]);

    return (
        <CanvasContext.Provider value={{ canvas, canvasRef, objectValues, setObjectValues, copiedObject, setCopiedObject }}>
            { children }
        </CanvasContext.Provider>
    );
};