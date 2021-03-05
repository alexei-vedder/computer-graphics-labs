import {createImage, prepareObjFileUploading} from "./utils";
import {PolygonFiller} from "./paintbrush";
import {drawFilledPolygonImage} from "./drawing-fns";

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
    const vertexImage = createImage("Filled Polygon Image", 1000, 1000);
    const vertexImageCtx = vertexImage.getContext("2d");
    const polygonFiller = new PolygonFiller(vertexImageCtx);
    drawFilledPolygonImage(polygonFiller, parsedObjFile.models[0].vertices, parsedObjFile.models[0].faces, scaling);
}

export function runLab2() {
    createTriangleImage();
    prepareObjFileUploading(createFilledPolygonImage);
}