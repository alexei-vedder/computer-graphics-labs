import {createImage} from "./utils";
import {Paintbrush} from "./paintbrush";


const blackImage = createImage();
const blackImageCtx = blackImage.getContext("2d");

const paintbrush = new Paintbrush(blackImageCtx);

paintbrush
    .fill({r: 0, g: 0, b: 0, a: 255})
    .grayscale();

const whiteImage = createImage();
const whiteImageCtx = whiteImage.getContext("2d");

paintbrush
    .setNewContext(whiteImageCtx)
    .fill({r: 255, g: 255, b: 255, a: 255})
    .grayscale();

const redImage = createImage();
const redImageCtx = redImage.getContext("2d");

paintbrush
    .setNewContext(redImageCtx)
    .fill({r: 255, g: 0, b: 0, a: 255});

const gradientImage = createImage();
const gradientImageCtx = gradientImage.getContext("2d");

paintbrush
    .setNewContext(gradientImageCtx)
    .gradient();
