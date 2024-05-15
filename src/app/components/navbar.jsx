import React from "react";
import './components.css'
export default function NavBar() {
  return (
    <nav className="navbar h-[9%]">
      <div className="px-16 w-full h-full flex justify-between items-center navDiv">
        <h3 className="py-5">Kochun<span>D</span></h3>
        <div className="buttonGroup px-[0.3rem] flex gap-4 items-center justify-around">
          <button className="active">Editor</button>
          <button>Setup</button>
          <button>Cut</button>
        </div>
      </div>
    </nav>
  )
}