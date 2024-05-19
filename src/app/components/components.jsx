import React, { act, useEffect, useRef, useState } from "react";
import { deleteObject } from "./canvasFunctions";
import { 
    CloudUpload, 
    Files, 
    ArrowUpNarrowWide, 
    ArrowDownNarrowWide, 
    Trash2, 
    Settings2, 
    Plus, 
    X, 
    ChevronsDown, 
    Eye, 
    EyeOff,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronDown,
    Home,
    Power,
    Dot,
    Pause,
    ActivityIcon,
} from "lucide-react";

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


export const Cut = ({ jobSetUp, setJobSetup }) => {
    const textareaRef = useRef(null)
    const [ port , setPort ] = useState(null);
    const [ writer, setWriter ] = useState(null);
    const [ reader, setReader ] = useState(null);
    const [ controllers, setControllers ] = useState({x: 0, y: 0});
    const [ response, setResponse ] = useState({ visible: false, message: '' });


    const [ pause, setPause ] = useState(false);
    const [ index, setIndex ] = useState({jobIndex: 0, arrayIndex: 0});
    const [ isRunning, setIsRunning ] = useState(false);
    const array = [
        {type: 'thru-cut', gcode: ['G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30','G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30','G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X10 Y10', 'G1 X20 Y20', 'G1 X30 Y30']},
        {type: 'thru-cut', gcode: ['G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30','G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30','G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30', 'G1 X32 Y32', 'G1 X20 Y20', 'G1 X30 Y30']}
    ];

    const processMsg = async () => {
        let text = '';
        if (reader) {
            const { done, value } = await reader.read();
            if (done) return;

            text += new TextDecoder().decode(value);
            // const newlineIndex = text.indexOf('\n');
            // if (newlineIndex !== -1) {
            //     const completeMessage = text.substring(0, newlineIndex + 1);
            //     text = text.substring(newlineIndex + 1);
            //     setResponse(prev => ({ ...prev, message: prev.message + completeMessage}))
            // }
            setResponse(prev => ({ ...prev, message: prev.message + text }));

            processMsg();
        }
    }

    const handleConnection = async () => {
        try {
            const newPort = await navigator.serial.requestPort();
            await newPort.open({ baudRate: 9600 });
            setPort(newPort);
            console.log('port', newPort)
            setWriter(newPort.writable.getWriter());
            setReader(newPort.readable.getReader());
        } catch (err) {
            console.log("Error while connecting", err)
        }
    }

    const closeConnection = async () => {
        if (port) {
            await reader.releaseLock();
            await writer.releaseLock();
            await port.close();
            console.log('Port Closed Successfully >>>')
            setPort(null);
        }
    }

    const handleJob = () => {
        if (isRunning) {
            setIsRunning(false);
            return;
        }
        setIsRunning(true);
    }


    const sendGCode = () => {
        const current = index.arrayIndex;
        if (!pause) {
            setTimeout(() => {
                console.log('current',array[index.jobIndex], current, index)
                if ( current == array[index.jobIndex]['gcode'].length) {
                    if ( index.jobIndex === array.length - 1) {
                        setIsRunning(false);
                        setIndex({jobIndex: 0, arrayIndex: 0});
                    } else {
                        setIndex({jobIndex: index.jobIndex + 1, arrayIndex: 0});
                    }
                } else {
                    sendToMachine(array[index.jobIndex]['gcode'][current])
                    setIndex({jobIndex: index.jobIndex, arrayIndex: current + 1});
                }
                console.log('array \n index: ', index)
            }, 1000);
        }
    }

    const sendToMachine = async (gcode) => {
        try {
            if (!writer) return;
            await writer.write(new TextEncoder().encode(`${gcode}\n`));
            console.log('sent: ', gcode)
            // serialRecieve(reader);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        processMsg();
    }, [reader]);

    useEffect(() => {
        if (isRunning && !pause) {
            sendGCode()
        }
    },[isRunning, pause, index])

     // Scroll the textarea to the bottom when it overflows
    useEffect(() => {
        if ( textareaRef.current ) {
            textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, [response.message]);


    return (
        <div className="flex justify-between gap-8 flex-col h-full pb-6">
            <div className="mt-4 h-full bg-[#EBEBEB] cut">
                <div className="w-full h-[10%] bg-[#081646ab] flex items-end justify-end gap-3 p-3">
                    <ActivityIcon 
                        size={20} 
                        strokeWidth={2} 
                        color={'#ffffff'} 
                        onClick={ () => { setResponse(prev => ({ ...prev, visible: !response.visible })) }} />
                    
                </div>
                { response.visible ? 
                    <div className="text-sm responses h-[90%]">
                        <textarea ref={textareaRef} value={ response.message } ></textarea>
                    </div>
                 : 
                    jobSetUp.map((item, index) => {
                        return (
                            <div key={index} className={ `flex justify-between items-end h-[90%] py-1 px-3 border-b border-b-[#1c274c28] hover:bg-[#d6d6d6ab]` } >
                                <p className="font-['MarryWeatherSansRegular'] text-[13px]">{ item.name }</p>
                                <div className="flex gap-3 py-1">
                                    <Trash2 
                                        size={15} 
                                        strokeWidth={2} 
                                        onClick={ () => setJobSetup(jobSetUp.filter((item, i) => i !== index)) }
                                        cursor={'pointer'}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
            <div className="flex flex-col items-center justify-center gap-5">
                <div className="flex flex-col items-center justify-center gap-3 pb-10">
                    <button 
                        className="p-3 bg-[#1C274C] rounded"
                        onClick={ () => {
                            sendToMachine(`G01 X${controllers.x} Y${controllers.y}`);
                            setControllers({...controllers, y: controllers.y + 10});
                        }}
                        >
                        <ChevronUp size={20} strokeWidth={4} color={'#F5762E'}/>
                    </button>
                    <div className="flex gap-3">
                        <button 
                            className="p-3 bg-[#1C274C] rounded"
                            onClick={ () => {
                                sendToMachine(`G01 X${controllers.x} Y${controllers.y}`);
                                setControllers({...controllers, x: (controllers.x - 10) < 0 ? 0 : controllers.x - 10});
                            }}>
                            <ChevronLeft size={20} strokeWidth={4} color={'#F5762E'}/>
                        </button>
                        <button 
                            className="p-3 bg-[#1C274C] rounded"
                            onClick={ () => sendToMachine('G28')} >
                            <Home size={20} strokeWidth={2} color={'#ffffff'}/>
                        </button>
                        <button 
                            className="p-3 bg-[#1C274C] rounded"
                            onClick={ () => {
                                sendToMachine(`G01 X${controllers.x} Y${controllers.y}`);
                                setControllers({...controllers, x: controllers.x + 10});
                            }}>
                            <ChevronRight size={20} strokeWidth={4} color={'#F5762E'}/>
                        </button>
                    </div>
                    <button 
                        className="p-3 bg-[#1C274C] rounded"
                        onClick={ () => {
                            sendToMachine(`G01 X${controllers.x} Y${controllers.y}`);
                            setControllers({...controllers, y: (controllers.y - 10) < 0 ? 0 : controllers.y - 10});
                        }}>
                        <ChevronDown size={20} strokeWidth={4} color={'#F5762E'}/>
                    </button>
                </div>

                <div className="flex w-full items-end justify-between">
                    { !port ? (
                        <button className="flex items-center justify-center gap-1 bg-[#F5762E] py-1 px-8 rounded-full" onClick={ handleConnection }>
                            <Power size={18} strokeWidth={4} color="#FFFFFF" /> 
                            <span className="text-[#1C274C] font-['MarryWeatherSans'] text-[13px] "> Connect</span>
                        </button>
                    ) : (
                        <button className="flex items-center justify-center gap-1 bg-[#d41d1d] py-1 px-6 rounded-full" onClick={ closeConnection }>
                            <Power size={18} strokeWidth={4} color="#FFFFFF" /> 
                            <span className="text-[#FFFFFF] font-['MarryWeatherSans'] text-[14px] "> Disconnect</span>
                        </button>
                    )}
                    <p className="flex items-center gap-1">
                        <Dot size={20} strokeWidth={4} className={!port ? 'text-[#d41d1d]' : 'text-[#2c944f]'} /> 
                        <span className={`text-[12px] ${!port ? 'text-[#d41d1d]' : 'text-[#2c944f]'}`}>{ port ? 'Device Connected' : 'No Device Connected'}</span>
                    </p>
                </div>

                <div className="flex justify-between w-full">
                    <button className="flex items-center justify-center gap-1 bg-[#027200] py-1 px-6 rounded" onClick={ handleJob }>
                        <span className="text-[#FFFFFF] font-['MarryWeatherSans'] text-[14px] tracking-wide"> Start Job</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 bg-[#1C274C] py-1 px-6 rounded" onClick={ () => { setPause(!pause) }}>
                        <Pause size={18} strokeWidth={2} fill="#FFFFFF" color="#FFFFFF" /> 
                        <span className="text-[#FFFFFF] font-['MarryWeatherSans'] text-[14px] tracking-wide"> Pause</span>
                    </button>
                    <button 
                        className="flex items-center justify-center gap-1 bg-[#BE0A0A] py-1 px-6 rounded-full"  
                        onClick={ () => {
                            setIsRunning(false);
                            setIndex({jobIndex: 0, arrayIndex: 0});
                        }}>
                        <Power size={18} strokeWidth={4} color="#FFFFFF" /> 
                        <span className="text-[#FFFFFF] font-['MarryWeatherSans'] text-[14px] tracking-wide"> Stop</span>
                    </button>
                </div>
            </div>
        </div>
    )
}


export function Setup({ jobSetUp, setJobSetup }) {
    const [rightClickEvent, setRightClickEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [jobToUpdate, setJobToUpdate] = useState(null)
    
    
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
                            color={'#ffffff'}
                            onClick={ () => {
                                const newSetup = [...jobSetUp];
                                const targetIndex = selected === newSetup.length - 1 ? 0 : selected + 1;

                                [newSetup[selected], newSetup[targetIndex]] = [newSetup[targetIndex], newSetup[selected]];
                                setJobSetup(newSetup);
                                setSelected(selected + 1)
                            }} />
                        <ArrowUpNarrowWide 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'}
                            onClick={ () => {
                                const newSetup = [...jobSetUp];
                                const targetIndex = selected === 0? newSetup.length - 1  : selected - 1;

                                [newSetup[selected], newSetup[targetIndex]] = [newSetup[targetIndex], newSetup[selected]];
                                setJobSetup(newSetup);
                                setSelected(selected - 1);
                            }}
                        />
                        <Trash2 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'}
                            onClick={ () => {
                                setJobSetup(jobSetUp.filter((item, i) => i !== selected));
                                setSelected(null);
                            }} />
                        <Files 
                            size={20} 
                            strokeWidth={1.3} 
                            color={'#ffffff'}
                            onClick={ () => {
                                const itemToCopy = jobSetUp.find((item, i) => i === selected);
                                if (itemToCopy) {
                                    const newSetup = [...jobSetUp];
                                    newSetup.splice(selected + 1, 0, itemToCopy);
                                    setJobSetup(newSetup);
                                }

                            }} />
                    </div>
                    <div>
                        { jobSetUp.map((item, index) => {
                            return (
                                <div key={index} className={ `flex justify-between items-end py-1 px-3 border-b border-b-[#1c274c28] ${ selected === index ? 'bg-[#d6d6d6ab]' : '' }` } onClick={() => setSelected(index)}>
                                    <p className="font-['MarryWeatherSansRegular'] text-[13px]">{ item.name }</p>
                                    <div className="flex gap-3 py-1">
                                        <Settings2 
                                            size={17} 
                                            strokeWidth={2} 
                                            cursor={'pointer'}
                                            onClick={ () => {
                                                setModalOpen(true);
                                                setJobToUpdate(item);
                                            }} 
                                            />
                                        { item.selected ? (
                                            <Eye 
                                                size={17} 
                                                strokeWidth={2} 
                                                cursor={'pointer'} 
                                                onClick={ () => {
                                                    setJobSetup((prevSetup) => prevSetup.map((item, i) => i === index ? {...item, selected: false} : item));

                                                    if (item.objects.get('type') === 'activeSelection') {
                                                        item.objects.forEachObject((obj) => {
                                                            obj.set({ stroke: 'transparent', hasControls: false, selectable: false })
                                                        })
                                                    } else {
                                                        item.objects.set({ stroke: 'transparent', hasControls: false, selectable: false })
                                                    }
                                                    canvas.discardActiveObject();
                                                    canvas.renderAll();
                                                }}
                                            />
                                        ) : (
                                            <EyeOff
                                                size={17} 
                                                strokeWidth={2} 
                                                cursor={'pointer'} 
                                                onClick={ () => {
                                                    setJobSetup((prevSetup) => prevSetup.map((item, i) => i === index ? {...item, selected: true} : item));

                                                    if (item.objects.get('type') === 'activeSelection') {
                                                        item.objects.forEachObject((obj) => {
                                                            obj.set({ stroke: item.type === 'thru-cut' ? 'red' : 'blue', hasControls: false, selectable: true })
                                                        })
                                                    } else {
                                                        item.objects.set({ stroke: item.type === 'thru-cut' ? 'red' : 'blue', hasControls: false, selectable: true })
                                                    }
                                                    canvas.discardActiveObject();
                                                    canvas.renderAll();
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            { modalOpen && 
                <SetupModal 
                    modalOpen={modalOpen} 
                    setModalOpen={setModalOpen}
                    jobSetUp={jobSetUp} 
                    setJobSetup={setJobSetup} 
                    setRightClickEvent={setRightClickEvent} 
                    jobToUpdate={jobToUpdate}
                    setJobToUpdate={setJobToUpdate}
                /> 
            }
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


const SetupModal = ({modalOpen, setModalOpen, jobSetUp, setJobSetup, setRightClickEvent , jobToUpdate, setJobToUpdate}) => {
    const [ selected, setSelected ] = useState('thru-cut');
    const [ thruCutData, setThruCutData ] = useState({
        name: 1,
        properties : {
            materialThickness: 0.5,
            zOffset: 0.1,
            zLowering: 300,
            zLowered: 500
        }
    })
    const [ routerData, setRouterData ] = useState({
        name: 1,
        properties: {
            materialThickness: 0.5,
            clearingDist: 2,
            maxPassDepth: 2,
            lastPassDepth: 0.6,
            routerSpeed: 1200,
            offset: 'inside',
            zLowering: 200,
            zLowered: 400
        }
    })

    useEffect(() => {
        console.log('jobToUpdate', jobToUpdate)
        if (jobToUpdate) {
            setSelected(jobToUpdate.type);
            if (jobToUpdate.type === 'thru-cut') {
                setThruCutData({name: jobToUpdate.name, properties: jobToUpdate.properties});
            } else if (jobToUpdate.type === 'router') {
                setRouterData({name: jobToUpdate.name, properties: jobToUpdate.properties});
            }
        }
    },[jobToUpdate])

    const handleChange = (mode, event) => {
        if (mode === 'thru-cut') {
            if (event.target.name === 'name') {
                setThruCutData((prev) => ({ ...prev, name: event.target.value }));
            } else {
                setThruCutData((prev) => ({ ...prev, properties: { ...prev.properties, [event.target.name] : event.target.value } }));
            }

        } else if (mode === 'router') {
            if (event.target.name === 'name') {
                setRouterData((prev) => ({ ...prev, name: event.target.value }));
            } else {
                setRouterData((prev) => ({ ...prev, properties: { ...prev.properties, [event.target.name] : event.target.value } }));
            }
        }
    }

    const applySetup = () => {
        const activeObject = canvas.getActiveObject();
        console.log('applySetup', jobToUpdate)
        if (!activeObject && !jobToUpdate) return;

        if (activeObject) {
            if (activeObject.get('type') === 'activeSelection') {
                activeObject.forEachObject((obj) => {
                    obj.set({
                        stroke: selected === 'thru-cut' ? '#ff0000' : '#0000ff',
                    })
                });
            } else {
                activeObject.set({
                    stroke: selected === 'thru-cut' ? '#ff0000' : '#0000ff',
                })
            }
        }
        canvas.discardActiveObject()
        canvas.requestRenderAll();
        const setup = {
            name: selected === 'thru-cut' ? `Thru-Cut ${thruCutData.name}` : `Router ${routerData.name}`,
            type: selected === 'thru-cut' ? 'thru-cut' : 'router',
            objects: activeObject,
            properties: selected === 'thru-cut' ? thruCutData.properties : routerData.properties, 
            selected: true
        }
        
        if (jobToUpdate) {
            console.log('jobToUpdate', jobSetUp)
            const index = jobSetUp.findIndex((job) => job.name === jobToUpdate.name);
            jobSetUp[index] = setup;
            setJobSetup([...jobSetUp]);
            setJobToUpdate(null);
        } else {
            setJobSetup((prevSetup) => [...prevSetup, setup]);
        }
        setRightClickEvent(null);
        setModalOpen(false);
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
                            value={ thruCutData.properties.materialThickness } 
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
                            value={ thruCutData.properties.zOffset }
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
                            value={ routerData.properties.materialThickness }
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
                            value={ routerData.properties.clearingDist }
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
                            value={ routerData.properties.maxPassDepth }
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
                            value={ routerData.properties.lastPassDepth }
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
                                value={ routerData.properties.routerSpeed }
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
                            value={ routerData.properties.offset }
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
                                    value={ selected === 'thru-cut' ? thruCutData.properties.zLowered : routerData.properties.zLowered }
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
                                    value={ selected === 'thru-cut' ? thruCutData.properties.zLowering : routerData.properties.zLowering }
                                    onChange={ (e) => handleChange(selected, e) }
                                />
                                <p>mm/s</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-10">
                        <button 
                            className="transition-all duration-300 bg-[#2a365c] hover:bg-[#1C274C] px-8 py-[2px] text-white"
                            onClick={ applySetup }>Apply</button>
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
