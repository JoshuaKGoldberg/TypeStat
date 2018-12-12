import { Physics } from "./original";
import { IBox } from "./IBox";

const physics = new Physics();

const boxImplicit = {
    changed: false,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    height: 0,
    width: 0,
    spriteheight: 0,
    spritewidth: 0,
    noshiftx: false,
    noshifty: false,
    parallaxHoriz: 0,
    parallaxVert: 0,
    xvel: 0,
    yvel: 0,
};

const boxExplicit: IBox = boxImplicit;

physics.boxAbove(boxImplicit, boxExplicit);
physics.boxToLeft(boxImplicit, boxExplicit);
