import { CloudUpload, Files, ArrowUpNarrowWide, ArrowDownNarrowWide, Trash2 } from "lucide-react";
import React from "react";
import './components.css'

export function Default() {
    return (
        <div>Default</div>
    )
}

export function Elements() {
    return (
        <div>Elements</div>
    )
}

export function FreeDraw() {
    return (
        <div>CurvedLines</div>
    )
}

export function TextBox() {
    return (
        <div>TextBox</div>
    )
}

export function Import() {Up
    const handleFile = (file) => {
        if (file.type !== 'image/svg+xml') return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const svg = e.target.result;
            fabric.loadSVGFromString(svg, (objects, options) => {
                const svgObj = fabric.util.groupSVGElements(objects, options);
                svgObj.set({ selectable: true, hasControls: true });
                canvas.add(svgObj);
                canvas.renderAll();
            })
        }
        reader.readAsText(file);
    }

    return (
        <div onDragOver={ e => { e.preventDefault(); }} onDrop={ e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) } }>
            <div className="border-b-2 border-[#1c274c1c] py-1">
                <h3>Upload SVG</h3>
            </div>
            <div className="py-4">
                <p className="text-[13px] text-slate-600">Upload an SVG file by clicking below. Make sure the SVG file contains valid vector graphics that you want to work with.</p>
                <div className="svgImport">
                    <CloudUpload size={70} strokeWidth={1} color={'#a7a7a7'}/>
                    <p>Drag & Drop Files <br /> or Click to Browse</p>
                    <input type="file" onChange={ e => handleFile(e.target.files[0]) } />
                    <span>.svg files only</span>
                </div>
            </div>
        </div>
    )
}

export function Setup() {
    return (
        <div className="w-full h-full p-2">
            <div className="border-b-2 border-[#1c274c1c] py-1">
                <h3>Machine Configuration</h3>
            </div>
            <div className="mt-4 h-[50%] bg-[#EBEBEB]">
                <div className="w-full bg-[#081646ab] flex items-end justify-end gap-3 p-3">
                    <ArrowDownNarrowWide size={25} strokeWidth={1.5} color={'#ffffff'} />
                    <ArrowUpNarrowWide size={25} strokeWidth={1.5} color={'#ffffff'} />
                    <Trash2 size={25} strokeWidth={1.5} color={'#ffffff'} />
                    <Files size={25} strokeWidth={1.5} color={'#ffffff'} />
                </div>
            </div>
        </div>
    )
}
