import React from "react";
import './navbar.css'
export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="px-16 w-full flex justify-between items-center navDiv">
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