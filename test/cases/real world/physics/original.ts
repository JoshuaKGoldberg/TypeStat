import { IBox } from "./IBox";

export class Physics {
    /**
     * Increases a box's width by pushing forward its right and decreasing its
     * width. It is marked as changed in appearance.
     *
     * @param box
     * @param dx   How much to increase the box's width.
     */
    public increaseWidth(box, dx) {
        box.right += dx;
        box.width += dx;

        this.markChanged(box);
    }
}
