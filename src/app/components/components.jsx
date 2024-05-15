import React from "react";

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

export function Import() {
    return (
        <div>
            <div className="border-b-2 border-[#1c274c1c] py-1">
                <h3>Upload SVG</h3>
            </div>
            <div className="py-4">
                <p className="text-[13px] text-slate-600">Upload an SVG file by clicking below. Make sure the SVG file contains valid vector graphics that you want to work with.</p>
            </div>
        </div>
    )
}
