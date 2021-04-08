import {Lab} from "./lab";
import {createImage} from "../utils";
import {ZBufferedPolygonFiller} from "../tool-classes/z-buffered-polygon-filler";
import {drawLightSensitiveFilledPolygonImage} from "../drawing-fns";
import {QuaternionDrivenCoordTransformer} from "../tool-classes/projective-coord-transformer";
import {ObjFileHandler} from "../obj-file-handler";
import {rotationAngleControls, shiftVectorControls} from "../models/controls";

export class Lab3 extends Lab {


    constructor() {
        super();
    }

    #createProjectedImage(objModel, config) {
        const image = createImage("Projected Polygon Image", config.imageSize, config.imageSize);
        const imageCtx = image.getContext("2d");
        drawLightSensitiveFilledPolygonImage(
            new ZBufferedPolygonFiller(imageCtx),
            objModel,
            new QuaternionDrivenCoordTransformer(config)
        );
        return image;
    }

    run() {
        const handler = (objModel, config) => [this.#createProjectedImage(objModel, config)];

        new ObjFileHandler(handler, [...shiftVectorControls, ...rotationAngleControls]);
    }

}
