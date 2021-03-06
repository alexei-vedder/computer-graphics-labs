import {Color} from "../models/color";
import {createImage} from "../utils";
import {drawPolygonImage, drawStar, drawVertexImage} from "../drawing-fns";
import {Paintbrush} from "../tool-classes/paintbrush";
import {LineDrawerV1} from "../tool-classes/line-drawer-v1";
import {LineDrawerV2} from "../tool-classes/line-drawer-v2";
import {LineDrawerV3} from "../tool-classes/line-drawer-v3";
import {LineDrawerV4} from "../tool-classes/line-drawer-v4";
import {Lab} from "./lab";
import {BasicCoordTransformer} from "../tool-classes/coord-transformer";
import {ObjFileHandler} from "../obj-file-handler";


export class Lab1 extends Lab {

    constructor() {
        super();
    }

    #createBlackImage() {
        const blackImage = createImage("Black");
        const blackImageCtx = blackImage.getContext("2d");
        const paintbrush = new Paintbrush(blackImageCtx);
        paintbrush
            .fill()
            .grayscale();
        return blackImage;
    }

    #createWhiteImage() {
        const whiteImage = createImage("White");
        const whiteImageCtx = whiteImage.getContext("2d");
        const paintbrush = new Paintbrush(whiteImageCtx);
        paintbrush
            .fill(new Color(255, 255, 255))
            .grayscale();
        return whiteImage;
    }

    #createRedImage() {
        const redImage = createImage("Red");
        const redImageCtx = redImage.getContext("2d");
        const paintbrush = new Paintbrush(redImageCtx);
        paintbrush
            .fill(new Color(255, 0, 0));
        return redImage;
    }

    #createGradientImage() {
        const gradientImage = createImage("Gradient");
        const gradientImageCtx = gradientImage.getContext("2d");
        const paintbrush = new Paintbrush(gradientImageCtx);
        paintbrush
            .gradient();
        return gradientImage;
    }

    #createStarImages() {
        const starImage1 = createImage("Star 1");
        const starImage1Ctx = starImage1.getContext("2d");

        const lineDrawerV1 = new LineDrawerV1(starImage1Ctx);
        drawStar(lineDrawerV1);

        const starImage2 = createImage("Star 2");
        const starImage2Ctx = starImage2.getContext("2d");

        const lineDrawerV2 = new LineDrawerV2(starImage2Ctx);
        drawStar(lineDrawerV2);

        const starImage3 = createImage("Star 3");
        const starImage3Ctx = starImage3.getContext("2d");

        const lineDrawerV3 = new LineDrawerV3(starImage3Ctx);
        drawStar(lineDrawerV3);

        const starImage4 = createImage("Star 4");
        const starImage4Ctx = starImage4.getContext("2d");

        const lineDrawerV4 = new LineDrawerV4(starImage4Ctx);
        drawStar(lineDrawerV4);

        return [
            starImage1,
            starImage2,
            starImage3,
            starImage4
        ]
    }

    #createVertexImage(objModel, config) {
        const vertexImage = createImage("Vertex Image", config.imageSize, config.imageSize);
        const vertexImageCtx = vertexImage.getContext("2d");
        const lineDrawerV4 = new LineDrawerV4(vertexImageCtx);
        drawVertexImage(
            lineDrawerV4,
            objModel,
            new BasicCoordTransformer(config)
        );
        return vertexImage;
    }

    #createPolygonImage(objModel, config) {
        const polygonImage = createImage("Polygon Image", config.imageSize, config.imageSize);
        const polygonImageCtx = polygonImage.getContext("2d");
        const lineDrawerV4 = new LineDrawerV4(polygonImageCtx);
        drawPolygonImage(
            lineDrawerV4,
            objModel,
            new BasicCoordTransformer(config)
        );
        return polygonImage;
    }

    run() {
        const handle = (objModel, config) => [
            this.#createVertexImage(objModel, config),
            this.#createPolygonImage(objModel, config)
        ];

        new ObjFileHandler(handle);

        this.#createBlackImage();
        this.#createWhiteImage();
        this.#createRedImage();
        this.#createGradientImage();
        this.#createStarImages();
    }
}
