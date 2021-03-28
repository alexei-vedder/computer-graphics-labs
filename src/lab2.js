import {createImage, prepareObjFileUploading} from "./utils";
import {drawFilledPolygonImage, drawLightSensitiveFilledPolygonImage} from "./drawing-fns";
import {Vertex} from "./models/vertex";
import {PolygonFiller} from "./tool-classes/polygon-filler";
import {ZBufferedPolygonFiller} from "./tool-classes/z-buffered-polygon-filler";
import {Lab} from "./lab";

export class Lab2 extends Lab {

    constructor() {
        super();
    }

    #createTriangleImage() {
        const justTriangle = createImage("Triangles", 500, 500);
        const justTriangleCtx = justTriangle.getContext("2d");
        const polygonFiller = new PolygonFiller(justTriangleCtx);

        polygonFiller
            .fill()
            .fillPolygon(
                new Vertex(10, 10),
                new Vertex(300, 300),
                new Vertex(100, 450)
            )
            .fillPolygon(
                new Vertex(10, 10),
                new Vertex(100, -300),
                new Vertex(300, 300)
            )
            .fillPolygon(
                new Vertex(300, 300),
                new Vertex(800, 100),
                new Vertex(400, 500)
            )
            .fillPolygon(
                new Vertex(300, 150),
                new Vertex(450, 220),
                new Vertex(300, 300)
            )
    }

    async #createFilledPolygonImage(parsedObjFile, scaling) {
        const polygonImage = createImage("Filled Polygon Image", 1000, 1000);
        const polygonImageCtx = polygonImage.getContext("2d");
        const polygonFiller = new PolygonFiller(polygonImageCtx);
        drawFilledPolygonImage(polygonFiller, parsedObjFile.models[0].vertices, parsedObjFile.models[0].faces, scaling);
    }

    async #createLightSensitiveFilledPolygonImage(parsedObjFile, scaling, lightDirection) {
        const polygonImage = createImage("Filled Polygon Image", 1000, 1000);
        const polygonImageCtx = polygonImage.getContext("2d");
        const polygonFiller = new PolygonFiller(polygonImageCtx);
        drawLightSensitiveFilledPolygonImage(
            polygonFiller,
            parsedObjFile.models[0].vertices,
            parsedObjFile.models[0].faces,
            scaling,
            lightDirection
        );
    }

    async #createLightAndDistanceSensitiveFilledPolygonImage(parsedObjFile, scaling, lightDirection) {
        const polygonImage = createImage("Filled Polygon Image", 1000, 1000);
        const polygonImageCtx = polygonImage.getContext("2d");
        const polygonFiller = new ZBufferedPolygonFiller(polygonImageCtx);
        drawLightSensitiveFilledPolygonImage(
            polygonFiller,
            parsedObjFile.models[0].vertices,
            parsedObjFile.models[0].faces,
            scaling,
            lightDirection
        );
    }

    run() {
        this.#createTriangleImage();
        prepareObjFileUploading(async (parsedObjFile, scaling, lightDirection) => {
            await this.#createFilledPolygonImage(parsedObjFile, scaling);
            await this.#createLightSensitiveFilledPolygonImage(parsedObjFile, scaling, lightDirection);
            await this.#createLightAndDistanceSensitiveFilledPolygonImage(parsedObjFile, scaling, lightDirection);
        });
    }
}
