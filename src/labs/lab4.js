import {Lab} from "./lab";
import {ObjFileHandler} from "../obj-file-handler";
import {rotationAngleControls, shiftVectorControls} from "../models/controls";
import {createImage} from "../utils";
import {drawGouraudShadedFilledPolygonImage} from "../drawing-fns";
import {ZBufferedPolygonFiller} from "../tool-classes/z-buffered-polygon-filler";
import {QuaternionDrivenCoordTransformer} from "../tool-classes/projective-coord-transformer";

export class Lab4 extends Lab {

    #createGouraudShadedImage(objModel, config) {
        const image = createImage("Gouraud Shaded Image", config.imageSize, config.imageSize);
        const imageCtx = image.getContext("2d");
        drawGouraudShadedFilledPolygonImage(
            new ZBufferedPolygonFiller(imageCtx),
            objModel,
            new QuaternionDrivenCoordTransformer(config)
        );
        return image;
    }


    run() {
        const handle = (objModel, config) => {
            return [this.#createGouraudShadedImage(objModel, config)];
        };

        new ObjFileHandler(handle, [...shiftVectorControls, ...rotationAngleControls])

    }
}
