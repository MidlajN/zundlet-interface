export const ungroup = (canvas) => {
    const selection = canvas.getActiveObject();
    if (selection) {
        const group = selection;
        const objects = group.getObjects();
        group.destroy();
        canvas.discardActiveObject();
        canvas.renderAll();
        objects.forEach((object) => {
            canvas.add(object);
        })
    }
}