import { CloudUpload, Files, ArrowUpNarrowWide, ArrowDownNarrowWide, Trash2, Settings2, Plus, X, ChevronsDown} from "lucide-react";
import React, { useEffect, useState } from "react";
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
                activeObject.on('mousedown', handleRightClick); 
            } 

            setRightClickEvent(null);
            return () => {
                if (activeObject) {
                    activeObject.off('mousedown');
                }
            }
        })
    },[])
     
    return (
        <>
            <div className="w-full h-full p-2">
                { rightClickEvent && <CustomComponent event={rightClickEvent} />}
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


const SetupModal = ({modalOpen, setModalOpen, setJobSetup}) => {
    const [selected, setSelected] = useState('thru-cut');
    const thruCut = () => {
        return (
            <div>
                <div className="flex items-end gap-8 mb-4">
                    <p className="text-sm">Material Thickness : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end gap-8">
                    <p className="text-sm">Z Offset : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
            </div>
        )
    }

    const router = () => {
        return (
            <div>
                <div className="flex items-end gap-12 mb-4">
                    <p className="text-sm">Material Thickness : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end gap-8 mb-4">
                    <p className="text-sm">Clearing Distance : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end gap-8 mb-4">
                    <p className="text-sm">Maximum Depth in Multipass : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex items-end gap-8 mb-4">
                    <p className="text-sm">Multipass Last Pass Depth : </p>
                    <div className="flex gap-1 w-full">
                        <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                        <p>mm</p>
                    </div>
                </div>
                <div className="flex gap-8">
                    <div className="flex items-end gap-2 mb-4">
                        <p className="text-sm">Router Speed : </p>
                        <div className="flex gap-1 w-full">
                            <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                            <p>mm/s</p>
                        </div>
                    </div>
                    <div className="flex items-end gap-1 mb-4">
                        <p className="text-sm">Offset Side: </p>
                        <select className="w-full outline-none border-bg-gray-300 min-w-[7rem]">
                            <option value="inside">Inside</option>
                            <option value="outside">Outside</option>
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
                    width: '40rem',
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
                        <input type="text" />
                    </div>

                    <div className="bg-[#e2e2e2] p-4 w-full min-h-[15rem]">
                        { selected === 'thru-cut' && thruCut() }
                        { selected === 'router' && router() }
                    </div>

                    <div className="mt-6 px-3 py-2">
                        <div className="flex items-end justify-between">
                            <p className="text-[13px]">Tool Lowered Speed : &nbsp;</p>
                            <div className="flex gap-2">
                                <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                                <p>mm/s</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-3">
                            <p className="text-[13px]">Tool Lowering Speed : &nbsp;</p>
                            <div className="flex gap-2">
                                <input className="w-full outline-none text-end px-2 text-xs" type="text" />
                                <p>mm/s</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ReactModal>
    )
}



const CustomComponent = ({ event }) => {

    // You can access event properties such as event.clientX, event.clientY here
    return (
        <div className="contextMenu" style={{ top: event.e.clientY , left: event.e.clientX }}>
            <ul>
                <li className="hover:bg-gray-100">
                    <Settings2 size={14} /> 
                    <button aria-haspopup="true" aria-controls="menu-lang" class="w-full text-left flex items-center outline-none focus:outline-none">
                        <span class="pr-1 flex-1">Langauges</span>
                        <span class="mr-auto">
                            <svg class="fill-current h-4 w-4 transition duration-150 ease-in-out" viewBox="0 0 20 20" >
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </span>
                    </button>

                    <ul id="menu-lang" aria-hidden="true" class="absolute top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-32">
                        <li class="px-3 py-1 hover:bg-gray-100">Javascript</li>
                        <li class="px-3 py-1 hover:bg-gray-100">Go</li>
                        <li class="px-3 py-1 hover:bg-gray-100">Rust</li>
                    </ul>
                </li>
                <li className="hover:bg-gray-100"><Trash2 size={14} /> Delete</li>
            </ul>
        </div>
    );
};