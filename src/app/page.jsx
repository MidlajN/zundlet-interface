'use client'
import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { Boxes, CaseSensitiveIcon, CloudUpload, Group, MousePointer2Icon, PenLine, PenTool, Spline } from "lucide-react";
import Container from "./components/container";
import { Default, Elements, FreeDraw, Import, TextBox, Setup } from "./components/components";
import { split, group, info } from "./components/canvasFunctions";

export default function Home() {
  const [tool, setTool] = useState(null);
  const [ expanded, setExpanded ] = useState(false);
  const [ hideSideBar, setHideSideBar ] = useState(false);
  return (
    <>
      <section className="h-screen">
        <nav className="navbar h-[9%]">
          <div className="px-16 w-full h-full flex justify-between items-center navDiv">
            <h3 className="py-5">Kochun<span>D</span></h3>
            <div className="buttonGroup px-[0.3rem] flex gap-4 items-center justify-around">
              <button 
                className="active"
                onClick={() => {
                  setTool('Select');
                  setExpanded(true);
                  setHideSideBar(false);
                  canvas.getObjects().forEach((obj) => obj.set({
                    hasControls: true,
                    lockMovementX: false,
                    lockMovementY: false
                  }));
                }}
              > Editor </button>
              <button 
                onClick={() => {
                  setTool('Setup');
                  setExpanded(true);
                  setHideSideBar(true);
                  canvas.getObjects().forEach((obj) => obj.set({
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true
                  }));
                }}
              > Setup </button>
              <button>Cut</button>
            </div>
          </div>
        </nav>

        <div className="flex h-[91%]"> 
          { !hideSideBar && 
          <Sidebar>
            <SidebarItem 
              icon={ <MousePointer2Icon size={25} strokeWidth={1.5} color={ tool === 'Select' ? '#F5762E' : '#4b5563'} /> } 
              text={'Select'} 
              setTool={setTool} 
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <Boxes size={25} strokeWidth={1.5} color={ tool === 'Elements' ? '#F5762E' : '#4b5563'}  /> } 
              text={'Elements'} 
              setTool={setTool}
              setExpanded={setExpanded}
              canvasFunction={info}
            />
            <SidebarItem 
              icon={ <Group size={25} strokeWidth={1.5} color={ tool === 'Group' ? '#F5762E' : '#4b5563'} /> } 
              text={'Group'} 
              setTool={setTool}
              setExpanded={setExpanded}
              canvasFunction={group}
            />
            <SidebarItem 
              icon={ <img src="/split.svg" alt="" /> } 
              text={'Split'} 
              setTool={setTool} 
              setExpanded={setExpanded}
              canvasFunction={split}
            />
            <SidebarItem 
              icon={ <Spline size={25} strokeWidth={1.5} color={ tool === 'Curves' ? '#F5762E' : '#4b5563'} /> } 
              text={'Curves'} 
              setTool={setTool}
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <PenLine size={25} strokeWidth={1.5} color={ tool === 'Lines' ? '#F5762E' : '#4b5563'} /> } 
              text={'Lines'} 
              setTool={setTool} 
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <PenTool size={25} strokeWidth={1.5} color={ tool === 'Pen' ? '#F5762E' : '#4b5563'} /> } 
              text={'Pen'} 
              setTool={setTool}
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <CaseSensitiveIcon size={25} strokeWidth={1.5} color={ tool === 'Textbox' ? '#F5762E' : '#4b5563'} /> } 
              text={'Textbox'} 
              setTool={setTool} 
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <CloudUpload size={25} strokeWidth={1.5} color={ tool === 'Import' ? '#F5762E' : '#4b5563'} /> } 
              text={'Import'} 
              setTool={setTool} 
              setExpanded={setExpanded}
            />
          </Sidebar> }

          <Container expanded={ expanded } setExpanded={ setExpanded }>
            <div className={ `h-full py-5 px-5 transition-all ${ expanded ? 'opacity-100 duration-[2s]' : 'opacity-0'}`}>
              { tool === 'Select' && <Default /> }
              { tool === 'Elements' && <Elements /> }
              { tool === 'Pen' && <FreeDraw /> }
              { tool === 'Textbox' && <TextBox /> }
              { tool === 'Import' && <Import /> }
              { tool === 'Setup' && <Setup /> }
            </div>
          </Container>
        </div>
      </section>
    </>
  )
}