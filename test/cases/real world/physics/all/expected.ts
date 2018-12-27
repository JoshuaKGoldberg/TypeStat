{
    interface IBox {
        x: number;
        y: number;
    }

    const shiftBox = (box: { x: any; y: any }) => {
        box.x += 1;
        box.y += 1;
    };

    const box = {
        x: 0,
        y: 0,
    };

    shiftBox(box);
}
