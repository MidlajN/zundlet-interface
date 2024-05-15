'use client'
import React, { useState } from "react";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { BoxSelect, Boxes, CaseSensitiveIcon, CloudUpload, Group, MousePointer2Icon, PenLine, PenTool, Spline } from "lucide-react";
import Container from "./components/container";
import { Default, Elements, FreeDraw, Import, TextBox } from "./components/components";

export default function Home() {
  const [tool, setTool] = useState(null);
  const [ expanded, setExpanded ] = useState(true);
  return (
    <>
      <section className="h-screen">
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

        <div className="flex h-[91%]">
          <Sidebar>
            <SidebarItem 
              icon={ <MousePointer2Icon size={25} strokeWidth={1.5} color={ tool === 'Select' ? '#F5762E' : '#4b5563'} /> } 
              text={'Select'} 
              setTool={setTool} 
            />
            <SidebarItem 
              icon={ <Boxes size={25} strokeWidth={1.5} color={ tool === 'Elements' ? '#F5762E' : '#4b5563'}  /> } 
              text={'Elements'} 
              setTool={setTool}
            />
            <SidebarItem 
              icon={ <Group size={25} strokeWidth={1.5} color={ tool === 'Group' ? '#F5762E' : '#4b5563'} /> } 
              text={'Group'} 
              setTool={setTool}
              setExpanded={setExpanded}
            />
            <SidebarItem 
              icon={ <BoxSelect size={25} strokeWidth={1.5} color={ tool === 'Split' ? '#F5762E' : '#4b5563'} /> } 
              text={'Split'} 
              setTool={setTool} 
              setExpanded={setExpanded}
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
            />
            <SidebarItem 
              icon={ <CaseSensitiveIcon size={25} strokeWidth={1.5} color={ tool === 'Textbox' ? '#F5762E' : '#4b5563'} /> } 
              text={'Textbox'} 
              setTool={setTool} 
            />
            <SidebarItem 
              icon={ <CloudUpload size={25} strokeWidth={1.5} color={ tool === 'Import' ? '#F5762E' : '#4b5563'} /> } 
              text={'Import'} 
              setTool={setTool} 
            />
          </Sidebar>

          <Container expanded={ expanded } setExpanded={ setExpanded }>
            { tool === 'Select' && <Default /> }
            { tool === 'Elements' && <Elements /> }
            { tool === 'Pen' && <FreeDraw /> }
            { tool === 'Textbox' && <TextBox /> }
            { tool === 'Import' && <Import /> }
          </Container>
        </div>
      </section>
    </>
  )
}