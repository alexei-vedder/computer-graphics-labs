import {createImage, prepareObjFileUploading} from "./utils";
import {PolygonFiller} from "./paintbrush";
import {drawFilledPolygonImage, drawLightSensitiveFilledPolygonImage} from "./drawing-fns";

function createTriangleImage() {
    const justTriangle = createImage("Triangles", 500, 500);
    const justTriangleCtx = justTriangle.getContext("2d");
    const polygonFiller = new PolygonFiller(justTriangleCtx);

    polygonFiller
        .fill()
        .fillPolygon(10, 10, 300, 300, 100, 450)
        .fillPolygon(10, 10, 100, -300, 300, 300)
        .fillPolygon(300, 300, 800, 100, 400, 500)
        .fillPolygon(300, 150, 450, 220, 300, 300)
}

function createFilledPolygonImage(parsedObjFile, scaling) {
    const polygonImage = createImage("Filled Polygon Image", 1000, 1000);
    const polygonImageCtx = polygonImage.getContext("2d");
    const polygonFiller = new PolygonFiller(polygonImageCtx);
    drawFilledPolygonImage(polygonFiller, parsedObjFile.models[0].vertices, parsedObjFile.models[0].faces, scaling);
}

function createLightSensitiveFilledPolygonImage(parsedObjFile, scaling) {
    const polygonImage = createImage("Filled Polygon Image", 1000, 1000);
    const polygonImageCtx = polygonImage.getContext("2d");
    const polygonFiller = new PolygonFiller(polygonImageCtx);
    drawLightSensitiveFilledPolygonImage(polygonFiller, parsedObjFile.models[0].vertices, parsedObjFile.models[0].faces, scaling);
}

export function runLab2() {
    createTriangleImage();
    prepareObjFileUploading(createLightSensitiveFilledPolygonImage);
}
