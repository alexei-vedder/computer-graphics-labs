import {createImage, drawStar} from "./utils";
import {LineDrawerV1, LineDrawerV2, LineDrawerV3, LineDrawerV4, Paintbrush} from "./paintbrush";
import {Color} from "./image";


const blackImage = createImage("Black");
const blackImageCtx = blackImage.getContext("2d");

const paintbrush = new Paintbrush(blackImageCtx);

paintbrush
    .fill()
    .grayscale();

const whiteImage = createImage("White");
const whiteImageCtx = whiteImage.getContext("2d");

paintbrush
    .setNewContext(whiteImageCtx)
    .fill(new Color(255,255,255))
    .grayscale();

const redImage = createImage("Red");
const redImageCtx = redImage.getContext("2d");

paintbrush
    .setNewContext(redImageCtx)
    .fill(new Color(255, 0, 0));

const gradientImage = createImage("Gradient");
const gradientImageCtx = gradientImage.getContext("2d");

paintbrush
    .setNewContext(gradientImageCtx)
    .gradient();

const starImage1 = createImage("Star 1");
const starImage1Ctx = starImage1.getContext("2d");

const lineDrawerV1 = new LineDrawerV1(starImage1Ctx);
lineDrawerV1.fill();
drawStar(lineDrawerV1);

const starImage2 = createImage("Star 2");
const starImage2Ctx = starImage2.getContext("2d");

const lineDrawerV2 = new LineDrawerV2(starImage2Ctx);
lineDrawerV2.fill();
drawStar(lineDrawerV2);

const starImage3 = createImage("Star 3");
const starImage3Ctx = starImage3.getContext("2d");

const lineDrawerV3 = new LineDrawerV3(starImage3Ctx);
lineDrawerV3.fill();
drawStar(lineDrawerV3);

const starImage4 = createImage("Star 4");
const starImage4Ctx = starImage4.getContext("2d");

const lineDrawerV4 = new LineDrawerV4(starImage4Ctx);
lineDrawerV4.fill();
drawStar(lineDrawerV4);
