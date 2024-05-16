/**
 * Handles the uploaded file, loads SVG content, and adds it to the canvas.
 *
 * @param {File} file - The file to be handled
 * @return {void} 
 */
export const handleFile = (file) => {
    if (file.type !== 'image/svg+xml') return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const svg = e.target.result;

        fabric.loadSVGFromString(svg, (objects, options) => {
            const obj = fabric.util.groupSVGElements(objects, options);
            obj.set({ selectable: true, hasControls: true });
            canvas.add(obj);
            canvas.renderAll();
        })
    }
    reader.readAsText(file);
}


/**
 * Splits the active object into individual paths and creates separate fabric paths for each.
 * If the active object is a group, it converts it to an active selection
 * and removes the original group object.
 *
 * @return {void} No return value
 */
export const split = () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.get('type') === 'activeSelection') return;
    
    if (activeObject.get('type') === 'group') {
        activeObject.toActiveSelection();
        canvas.remove(activeObject);
    } else {
        if (activeObject.path) {
            const mainArray = [];
            const paths = activeObject.path;
            let array = [];

            for (let i = 0; i < paths.length; i++) {
                const line = paths[i] ? paths[i].join(' ') : null;
                const command = paths[i] ? paths[i][0] : null;

                if (command === 'M' || i === paths.length - 1) {
                    if (array.length) mainArray.push(array.join(' '));
                    array = []
                }
                array.push(line);
            }

            let fabricPaths = [];
            for (let i = 0; i < mainArray.length; i++) {
                if (mainArray[i] !== null) {
                    const fabricPath = new fabric.Path(mainArray[i]);
                    fabricPath.set({
                        selectable: true,
                        hasControls: true,
                        fill: 'transparent',
                        stroke: 'black',
                        strokeWidth: 0.1,
                    });
                    fabricPaths.push(fabricPath);
                }
            }

            const selection = new fabric.ActiveSelection(fabricPaths, { canvas: canvas });
            selection.set({
                top: activeObject.top,
                left: activeObject.left,
                scaleX: activeObject.scaleX,
                scaleY: activeObject.scaleY,
                angle: activeObject.angle
            });

            canvas.discardActiveObject();
            selection.toActiveSelection()
            canvas.remove(activeObject);
        }
    }
    canvas.renderAll();
}


/**
 * Function to group selected objects together.
 */
export const group = () => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.get('type') !== 'activeSelection') return;
    activeObject.toGroup();
    canvas.renderAll();
}


/**
 * Copies the active object on the canvas.
 *
 * @param {Function} setCopiedObject - A function to set the copied object.
 */
export const copyObject = (setCopiedObject) => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        activeObject.clone((clonedObject) => {
            setCopiedObject(clonedObject);
            console.log('Object copied');
        });
    } else {
        console.log('No object selected to copy');
    }
};


/**
 * Function to paste the copied object onto the canvas.
 *
 * @param {Object} copiedObject - The object to be pasted.
 * @return {void} 
 */
export const pasteObject = (copiedObject) => {
    if (copiedObject) {
        copiedObject.clone((clonedObject) => {

        clonedObject.set({
            left: clonedObject.left + 10,
            top: clonedObject.top + 10,
            evented: true,
        });const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'c') {
                copyObject(setCopiedObject);
            } else if (e.ctrlKey && e.key === 'v') {
                pasteObject(copiedObject);
            } else if (e.key === 'Delete') {
                deleteObject();
            } else if (e.ctrlKey && e.key === 'a') {
                selectAllObject();
                e.preventDefault();
            } else if (e.ctrlKey && e.key === 'g') {
                group();
                e.preventDefault();
            }
        };

        if (clonedObject.get('type') === 'activeSelection') {
            clonedObject.forEachObject((obj) => {
                canvas.add(obj);
            })
        }

        canvas.add(clonedObject);
        canvas.setActiveObject(clonedObject);
        canvas.requestRenderAll();
        });
        copiedObject.top += 10;
        copiedObject.left += 10;
    } else {
        return
    }
};


/**
 * Deletes the active object on the canvas if present.
 */
export const deleteObject = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
        if (activeObject.get('type') === 'activeSelection') {
            activeObject.forEachObject((obj) => {
                canvas.remove(obj);
            });
        } else {
            canvas.remove(activeObject);
        }
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    }
}


/**
 * A function to select all objects on the canvas.
 */
export const selectAllObject = () => {
    canvas.discardActiveObject();
    const selection = new fabric.ActiveSelection(canvas.getObjects(), { canvas: canvas });
    canvas.setActiveObject(selection);
    canvas.requestRenderAll();
}


export const handleKeyDown = ( copiedObject, setCopiedObject ) => (e) => {
    if (e.ctrlKey && e.key === 'c') {
        copyObject(setCopiedObject);
    } else if (e.ctrlKey && e.key === 'v') {
        pasteObject(copiedObject);
    } else if (e.key === 'Delete') {
        deleteObject();
    } else if (e.ctrlKey && e.key === 'a') {
        selectAllObject();
        e.preventDefault();
    } else if (e.ctrlKey && e.key === 'g') {
        group();
        e.preventDefault();
    } 
};

export const info = () => {
    const activeObject = canvas.getActiveObject();
    console.log('info', activeObject, ' stroke-width : ', activeObject.strokeWidth)
    canvas.renderAll();
}