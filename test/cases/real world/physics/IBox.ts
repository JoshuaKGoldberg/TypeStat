export interface IBox {
    changed: boolean;
    top: number;
    right: number;
    bottom: number;
    left: number;
    height: number;
    width: number;
    spriteheight: number;
    spritewidth: number;
    noshiftx?: boolean;
    noshifty?: boolean;
    parallaxHoriz: number;
    parallaxVert: number;
    xvel: number;
    yvel: number;
}