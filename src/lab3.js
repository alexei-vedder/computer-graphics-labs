import {Lab} from "./lab";
import {createImage, prepareObjFileUploading} from "./utils";
import {ZBufferedPolygonFiller} from "./tool-classes/z-buffered-polygon-filler";
import {drawLightSensitiveFilledPolygonImage} from "./drawing-fns";
import {ProjectiveCoordTransformer} from "./tool-classes/coord-transformer";

export class Lab3 extends Lab {

    #shiftVectorControls = [
        {
            id: "shift-x",
            type: "number",
            value: 0.005,
            label: "Shift (x)",
            handle: (value) => ({
                shiftX: value
            })
        },
        {
            id: "shift-y",
            type: "number",
            value: 0.05,
            label: "Shift (y)",
            handle: (value) => ({
                shiftY: value
            })
        },
        {
            id: "shift-z",
            type: "number",
            value: 0.2,
            label: "Shift (z)",
            handle: (value) => ({
                shiftZ: value
            })
        }
    ];

    constructor() {
        super();
    }

    async #createProjectedImage(parsedObjFile, config) {
        const image = createImage("Projected Polygon Image", 1000, 1000);
        const imageCtx = image.getContext("2d");
        const polygonFiller = new ZBufferedPolygonFiller(imageCtx);
        drawLightSensitiveFilledPolygonImage(
            polygonFiller,
            parsedObjFile.models[0].vertices,
            parsedObjFile.models[0].faces,
            new ProjectiveCoordTransformer(config)
        );
    }

    run() {
        const handler = async (parsedObjFile, config) => {
            await this.#createProjectedImage(parsedObjFile, config);
        };

        prepareObjFileUploading(handler, this.#shiftVectorControls);
    }

}
