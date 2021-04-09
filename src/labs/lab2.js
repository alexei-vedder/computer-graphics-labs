import {createImage} from "../utils";
import {drawFilledPolygonImage, drawLightSensitiveFilledPolygonImage} from "../drawing-fns";
import {Vertex} from "../models/vertex";
import {PolygonFiller} from "../tool-classes/polygon-filler";
import {ZBufferedPolygonFiller} from "../tool-classes/z-buffered-polygon-filler";
import {Lab} from "./lab";
import {BasicCoordTransformer} from "../tool-classes/coord-transformer";
import {ObjFileHandler} from "../obj-file-handler";

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
            .fillPolygon([
                new Vertex(10, 10),
                new Vertex(300, 300),
                new Vertex(100, 450)
            ])
            .fillPolygon([
                new Vertex(10, 10),
                new Vertex(100, -300),
                new Vertex(300, 300)
            ])
            .fillPolygon([
                new Vertex(300, 300),
                new Vertex(800, 100),
                new Vertex(400, 500)
            ])
            .fillPolygon([
                new Vertex(300, 150),
                new Vertex(450, 220),
                new Vertex(300, 300)
            ]);

        return justTriangle;
    }

    #createFilledPolygonImage(objModel, config) {
        const polygonImage = createImage("Filled Polygon Image", config.imageSize, config.imageSize);
        const polygonImageCtx = polygonImage.getContext("2d");
        drawFilledPolygonImage(
            new PolygonFiller(polygonImageCtx),
            objModel,
            new BasicCoordTransformer(config)
        );
        return polygonImage;
    }

    #createLightSensitiveFilledPolygonImage(objModel, config) {
        const polygonImage = createImage("Filled Polygon Image", config.imageSize, config.imageSize);
        const polygonImageCtx = polygonImage.getContext("2d");
        drawLightSensitiveFilledPolygonImage(
            new PolygonFiller(polygonImageCtx),
            objModel,
            new BasicCoordTransformer(config)
        );
        return polygonImage;
    }

    #createLightAndDistanceSensitiveFilledPolygonImage(objModel, config) {
        const polygonImage = createImage("Filled Polygon Image", config.imageSize, config.imageSize);
        const polygonImageCtx = polygonImage.getContext("2d");
        drawLightSensitiveFilledPolygonImage(
            new ZBufferedPolygonFiller(polygonImageCtx),
            objModel,
            new BasicCoordTransformer(config)
        );
        return polygonImage;
    }

    run() {
        const handle = (objModel, config) => [
            this.#createFilledPolygonImage(objModel, config),
            this.#createLightSensitiveFilledPolygonImage(objModel, config),
            this.#createLightAndDistanceSensitiveFilledPolygonImage(objModel, config)
        ];

        new ObjFileHandler(handle);

        this.#createTriangleImage();
    }
}
