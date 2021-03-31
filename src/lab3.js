import {Lab} from "./lab";
import {createImage, prepareObjFileUploading} from "./utils";
import {ZBufferedPolygonFiller} from "./tool-classes/z-buffered-polygon-filler";
import {drawLightSensitiveFilledPolygonImage} from "./drawing-fns";
import {ProjectiveCoordTransformer} from "./tool-classes/coord-transformer";
import {unit} from "mathjs";

export class Lab3 extends Lab {

    #shiftVectorControls = [
        {
            id: "shift-x",
            type: "number",
            value: 0.005,
            label: "Shift (x)",
            handle: (value) => ({
                shiftX: Number.parseFloat(value)
            })
        },
        {
            id: "shift-y",
            type: "number",
            value: 0.05,
            label: "Shift (y)",
            handle: (value) => ({
                shiftY: Number.parseFloat(value)
            })
        },
        {
            id: "shift-z",
            type: "number",
            value: 0.2,
            label: "Shift (z)",
            handle: (value) => ({
                shiftZ: Number.parseFloat(value)
            })
        }
    ];

    #rotationAngleControls = [
        {
            id: "alpha",
            type: "number",
            value: 0,
            label: "Alpha (x angle in degrees)",
            handle: (value) => ({
                alpha: unit(Number.parseFloat(value), "deg")
            })
        },
        {
            id: "beta",
            type: "number",
            value: 0,
            label: "Beta (y angle in degrees)",
            handle: (value) => ({
                beta: unit(Number.parseFloat(value), "deg")
            })
        },
        {
            id: "gamma",
            type: "number",
            value: 0,
            label: "Gamma (z angle in degrees)",
            handle: (value) => ({
                gamma: unit(Number.parseFloat(value), "deg")
            })
        }
    ];

    constructor() {
        super();
    }

    async #createProjectedImage(parsedObjFile, config) {
        const image = createImage("Projected Polygon Image", 1000, 1000);
        const imageCtx = image.getContext("2d");
        drawLightSensitiveFilledPolygonImage(
            new ZBufferedPolygonFiller(imageCtx),
            parsedObjFile.models[0].vertices,
            parsedObjFile.models[0].faces,
            new ProjectiveCoordTransformer(config)
        );
    }

    run() {
        const handler = async (parsedObjFile, config, mode = "render") => {
            if (mode === "render") {
                await this.#createProjectedImage(parsedObjFile, config);
            } else if (mode === "adjust") {
                // TODO
            }
        };

        prepareObjFileUploading(handler, [...this.#shiftVectorControls, ...this.#rotationAngleControls]);
    }

}
