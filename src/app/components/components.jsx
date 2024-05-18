import { CloudUpload, Files, ArrowUpNarrowWide, ArrowDownNarrowWide, Trash2, Settings2, Plus, X, ChevronsDown} from "lucide-react";
import React, { useEffect, useState } from "react";
import { deleteObject } from "./canvasFunctions";


import ReactModal from "react-modal";
ReactModal.setAppElement('#main');
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

export function Import() {
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
    const [rightClickEvent, setRightClickEvent] = useState(null);
    const [jobSetUp, setJobSetup] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    
    
    useEffect(() => {
        canvas.on('mouse:down', (e) => {
            const handleRightClick = (event) => { if (event.button === 3) setRightClickEvent(event); }
            
            const activeObject = canvas.getActiveObject();
            
            if (activeObject) { 
                console.log('active Ovject :: ', activeObject)
                activeObject.set({
                    hasControls: false,
                    lockMovementX: true,
                    lockMovementY: true
                })
                canvas.renderAll();
                activeObject.on('mousedown', handleRightClick); 
            } 

            setRightClickEvent(null);
            return () => {
                if (activeObject) {
                    activeObject.off('mousedown');
                    canvas.renderAll();
                }
            }
        })
    },[])
     
    return (
        <>
            <div className="w-full h-full p-2">
                { rightClickEvent && <CustomComponent event={rightClickEvent} setEvent={setRightClickEvent} setModalOpen={setModalOpen} />}
                <div className="border-b-2 border-[#1c274c1c] py-1">
                    <h3>Machine Configuration</h3>
                </div>
                <div className="mt-4 h-[50%] bg-[#EBEBEB]">
                    <div className="w-full bg-[#081646ab] flex items-end justify-end gap-3 p-3">
                        <Plus 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'} 
                            onClick={ () => { setModalOpen(true); }} />
                        <ArrowDownNarrowWide 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'} />
                        <ArrowUpNarrowWide 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'} />
                        <Trash2 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'} />
                        <Files 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'} />
                    </div>
                </div>
            </div>
            { modalOpen && <SetupModal modalOpen={modalOpen} setModalOpen={setModalOpen} setJobSetup={setJobSetup}  /> }
        </>
    )
}


const CustomComponent = ({ event, setEvent, setModalOpen }) => {

    const deleteElement = () => {
        deleteObject();
        setEvent(null);
    }

    // You can access event properties such as event.clientX, event.clientY here
    return (
        <div className="contextMenu" style={{ top: event.e.clientY - 80 , left: event.e.clientX }}>
            <ul>
                <li className="hover:bg-gray-100">
                    <Settings2 size={14} /> 
                    <button aria-haspopup="true" aria-controls="menu-lang" class="w-full text-left flex items-center outline-none focus:outline-none">
                        <span class="pr-1 flex-1">Change Function</span>
                        <span class="mr-auto">
                            <svg class="fill-current h-4 w-4 transition duration-150 ease-in-out" viewBox="0 0 20 20" >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </span>
                    </button>

                    <ul id="menu-lang" aria-hidden="true" class="absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32">
                        <li class="px-3 py-1 hover:bg-gray-100" onClick={() => { setModalOpen(true) }}>Register Job</li>
                    </ul>
                </li>
                <li className="hover:bg-gray-100" onClick={deleteElement}><Trash2 size={14} /> Delete</li>
            </ul>
        </div>
    );
};


const SetupModal = ({modalOpen, setModalOpen, setJobSetup}) => {
    const [ selected, setSelected ] = useState('thru-cut');
    const [ thruCutData, setThruCutData ] = useState({
        name: 1,
        materialThickness: 0.5,
        zOffset: 0.1,
        zLowering: 300,
        zLowered: 500
    })
    const [ routerData, setRouterData ] = useState({
        name: 1,
        materialThickness: 0.5,
        clearingDist: 2,
        maxPassDepth: 2,
        lastPassDepth: 0.6,
        routerSpeed: 1200,
        offset: 'inside',
        zLowering: 200,
        zLowered: 400
    })

    const handleChange = (mode, event) => {
        if (mode === 'thru-cut') {
            setThruCutData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        } else if (mode === 'router') {
            setRouterData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
        }
    }

    
    const thruCut = () => {
        return (
            <div>
                <div className="flex items-end justify-between mb-4">
                    <p className="text-sm">Material Thickness : </p>
                    <div className="flex gap-1 w-[50%]">
                        <input 
                            type="text"
                            name="materialThickness"
                            className="w-full outline-none text-end px-2 text-xs" 
                            value={ thruCutData.materialThickness } 
                            onChange={ (e) => handleChange('thru-cut', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end justify-between">
                    <p className="text-sm">Z Offset : </p>
                    <div className="flex gap-1 w-[50%]">
                        <input 
                            type="text" 
                            name="zOffset"
                            className="w-full outline-none text-end px-2 text-xs"
                            value={ thruCutData.zOffset }
                            onChange={ (e) => handleChange('thru-cut', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
            </div>
        )
    }

    const router = () => {
        return (
            <div>
                <div className="flex items-end justify-between gap-12 mb-4">
                    <p className="text-sm">Material Thickness : </p>
                    <div className="flex gap-1 w-[40%]">
                        <input 
                            type="text" 
                            name="materialThickness"
                            className="w-full outline-none text-end px-2 text-xs"  
                            value={ routerData.materialThickness }
                            onChange={ (e) => handleChange('router', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-8 mb-4">
                    <p className="text-sm">Clearing Distance : </p>
                    <div className="flex gap-1 w-[40%]">
                        <input 
                            type="text"
                            name="clearingDist"
                            className="w-full outline-none text-end px-2 text-xs"  
                            value={ routerData.clearingDist }
                            onChange={ (e) => handleChange('router', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-8 mb-4">
                    <p className="text-sm">Maximum Depth in Multipass : </p>
                    <div className="flex gap-1 w-[40%]">
                        <input 
                            type="text" 
                            name="maxPassDepth"
                            className="w-full outline-none text-end px-2 text-xs"  
                            value={ routerData.maxPassDepth }
                            onChange={ (e) => handleChange('router', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end justify-between gap-8 mb-4">
                    <p className="text-sm">Multipass Last Pass Depth : </p>
                    <div className="flex gap-1 w-[40%]">
                        <input 
                            type="text" 
                            name="lastPassDepth"
                            className="w-full outline-none text-end px-2 text-xs"  
                            value={ routerData.lastPassDepth }
                            onChange={ (e) => handleChange('router', e) }
                        />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex justify-between">
                    <div className="flex items-end justify-between gap-2 mb-4">
                        <p className="text-sm">Router Speed : </p>
                        <div className="flex gap-1 w-full">
                            <input 
                                type="text" 
                                name="routerSpeed"
                                className="w-full outline-none text-end px-2 text-xs"  
                                value={ routerData.routerSpeed }
                                onChange={ (e) => handleChange('router', e) }
                            />
                            <p>rpm</p>
                        </div>
                    </div>
                    <div className="flex items-end justify-between gap-1 mb-4 w-[40%]">
                        <p className="text-sm">Offset Side: </p>
                        <select
                            name="offset" 
                            className="w-full outline-none border-bg-gray-300 min-w-[7rem]" 
                            value={ routerData.offset }
                            onChange={ (e) => handleChange('router', e) }
                        >
                            <option value="outside">Outside</option>
                            <option value="inside">Inside</option>
                        </select>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ReactModal 
            isOpen={modalOpen} 
            style={{ 
                overlay: { 
                    width: 'fit-content',
                    height: 'fit-content', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                }, 
                content: { 
                    width: 'fit-content', 
                    height: 'fit-content', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    padding: '0px',
                    border: 'none',
                    width: '50rem',
                    borderRadius: 'none',
                    background: 'transparent'
                } 
            }}>
            <div className="setupModal" >
                <div className="header">
                    <p>Machine Setup</p>
                    <button className="bg-[#ff4c4c] hover:bg-[#ec2929]">
                        <X size={18} strokeWidth={2} color={'#ffffff'} onClick={ () => { setModalOpen(false) } } />
                    </button>
                </div>
                <div className="content" >
                    <div className="select">
                        <p>Choose Method : </p>
                        <div className="options">
                            <select className="w-full" onChange={(e) => setSelected(e.target.value)}>
                                <option value="thru-cut">Thru-Cut</option>
                                <option value="router">Router</option>
                            </select>
                            <div><ChevronsDown size={18} /></div>
                        </div>
                    </div>  
                    <div className="name">
                        <p>Name : </p>
                        <input 
                            type="text" 
                            name="name"
                            value={ selected === 'thru-cut' ? thruCutData.name : routerData.name } 
                            onChange={ (e) => handleChange(selected, e) }
                        />
                    </div>

                    <div className="bg-[#e2e2e2] p-4 w-full min-h-[15rem]">
                        { selected === 'thru-cut' && thruCut() }
                        { selected === 'router' && router() }
                    </div>

                    <div className="mt-6 px-3 py-2">
                        <div className="flex items-end justify-between">
                            <p className="text-[13px]">Tool Lowered Speed : &nbsp;</p>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    name="zLowered"
                                    className="w-full outline-none text-end px-2 text-xs" 
                                    value={ selected === 'thru-cut' ? thruCutData.zLowered : routerData.zLowered }
                                    onChange={ (e) => handleChange(selected, e) }
                                />
                                <p>mm/s</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                            <p className="text-[13px]">Tool Lowering Speed : &nbsp;</p>
                            <div className="flex gap-2">
                                <input 
                                    type="text"
                                    name="zLowering"
                                    className="w-full outline-none text-end px-2 text-xs"
                                    value={ selected === 'thru-cut' ? thruCutData.zLowering : routerData.zLowering }
                                    onChange={ (e) => handleChange(selected, e) }
                                />
                                <p>mm/s</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                        <button className="transition-all duration-300 bg-[#2a365c] hover:bg-[#1C274C] px-8 py-[2px] text-white">Apply</button>
                        <button 
                            className="transition-all duration-300 bg-[#23325cbb] hover:bg-[#1C274C] px-8 py-[2px] text-white"
                            onClick={ () => { setModalOpen(false) } }
                        > Cancel
                        </button>
                    </div>
                </div>
            </div>
        </ReactModal>
    )
}
