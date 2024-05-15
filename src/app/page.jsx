'use client'
import React from "react";
import NavBar from "./components/navbar";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { Boxes, CaseSensitiveIcon, CloudUpload, MousePointer2Icon, PenLine, PenTool, Spline } from "lucide-react";

export default function Home() {
  return (
    <>
      <section className="h-screen">
        <NavBar />

        <div className="flex h-[91%]">
          <Sidebar>
            <SidebarItem icon={ <MousePointer2Icon size={25} strokeWidth={1.5} /> } text={'Select'} type={ 'rotateCW' } />
            <SidebarItem icon={ <Boxes size={25} strokeWidth={1.5} /> } text={'Elements'} type={ 'rotateCW' } />
            <SidebarItem icon={ <Spline size={25} strokeWidth={1.5} /> } text={'Curves'} type={ 'rotateCW' } />
            <SidebarItem icon={ <PenLine size={25} strokeWidth={1.5} /> } text={'Lines'} type={ 'rotateCW' } />
            <SidebarItem icon={ <PenTool size={25} strokeWidth={1.5} /> } text={'Pen'} type={ 'rotateCW' } />
            <SidebarItem icon={ <CaseSensitiveIcon size={25} strokeWidth={1.5} /> } text={'Pen'} type={ 'rotateCW' } />
            <SidebarItem icon={ <CloudUpload size={25} strokeWidth={1.5} /> } text={'Pen'} type={ 'rotateCW' } />
          </Sidebar>

        </div>
      </section>
    </>
  )
}