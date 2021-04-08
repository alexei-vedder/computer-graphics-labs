import {abs, cos, cross, divide, dot, sin, sqrt, square} from "mathjs";
import {Color} from "./models/color";
import {asyncForOf} from "./utils";

export function drawStar(lineDrawer, x0 = 100, y0 = 100, length = 95) {
    lineDrawer.fill();
    for (let i = 0; i <= 12; ++i) {
        const alpha = 2 * 3.14 * i / 13;
        lineDrawer
            .drawLine(x0, y0, x0 + length * cos(alpha), y0 + length * sin(alpha));
    }
}

export function drawVertexImage(lineDrawer, {vertices}, transformer) {
    lineDrawer.fill();
    asyncForOf(vertices, (v) => {
        const vertex = transformer.transform(v);
        lineDrawer.setPixel(vertex.u, vertex.v);
    });
}

export function drawPolygonImage(lineDrawer, {faces}, transformer) {
    lineDrawer.fill();
    asyncForOf(faces, (face) => {
        const polygonVertices = face.vertices.map(vertex => transformer.transform(vertex));

        lineDrawer
            .drawPolygon(
                polygonVertices[0].u,
                polygonVertices[0].v,
                polygonVertices[1].u,
                polygonVertices[1].v,
                polygonVertices[2].u,
                polygonVertices[2].v);
    });
}

export function drawFilledPolygonImage(polygonFiller, {faces}, transformer) {
    polygonFiller.fill();
    asyncForOf(faces, (face) => {
        const polygonVertices = face.vertices.map(vertex => transformer.transform(vertex));

        polygonFiller.fillPolygon(
            polygonVertices[0],
            polygonVertices[1],
            polygonVertices[2]
        );
    });
}

function findNormal(polygonVertices) {
    return cross(
        [
            polygonVertices[1].x - polygonVertices[0].x,
            polygonVertices[1].y - polygonVertices[0].y,
            polygonVertices[1].z - polygonVertices[0].z
        ], [
            polygonVertices[1].x - polygonVertices[2].x,
            polygonVertices[1].y - polygonVertices[2].y,
            polygonVertices[1].z - polygonVertices[2].z
        ]
    );
}

function findCosineOfAngleOfIncidence(normal, lightDirection) {
    return divide(
        dot(normal, lightDirection),
        sqrt(square(normal[0]) + square(normal[1]) + square(normal[2]))
        * sqrt(square(lightDirection[0]) + square(lightDirection[1]) + square(lightDirection[2]))
    );
}

export function drawLightSensitiveFilledPolygonImage(polygonFiller,
                                                     {faces},
                                                     transformer,
                                                     lightDirection = [0, 0, 1]) {
    polygonFiller.fill();

    asyncForOf(faces, (face) => {
        const polygonVertices = face.vertices.map(vertex => transformer.transform(vertex));

        const cosineOfAngleOfIncidence = findCosineOfAngleOfIncidence(findNormal(polygonVertices), lightDirection);

        if (cosineOfAngleOfIncidence < 0) {
            polygonFiller.fillPolygon(
                polygonVertices[0],
                polygonVertices[1],
                polygonVertices[2],
                new Color(
                    80 * abs(cosineOfAngleOfIncidence),
                    255 * abs(cosineOfAngleOfIncidence),
                    0)
            );
        }
    });
}

export function drawGouraudShadedFilledPolygonImage(polygonFiller,
                                                    {faces},
                                                    transformer,
                                                    lightDirection = [0, 0, 1]) {

    const cosinesOfAngleOfIncidence = vertices
        .map(v => findCosineOfAngleOfIncidence(v.normal, lightDirection));


}
