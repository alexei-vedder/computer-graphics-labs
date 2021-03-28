import {abs, cos, cross, divide, dot, sin, sqrt, square} from "mathjs";
import {Color} from "./models/color";
import {Vertex} from "./models/vertex";

export function drawStar(lineDrawer, x0 = 100, y0 = 100, length = 95) {
    lineDrawer.fill();
    for (let i = 0; i <= 12; ++i) {
        const alpha = 2 * 3.14 * i / 13;
        lineDrawer
            .drawLine(x0, y0, x0 + length * cos(alpha), y0 + length * sin(alpha));
    }
}

export function drawVertexImage(lineDrawer, vertices, transformer) {
    lineDrawer.fill();
    vertices.forEach(v => {
        const vertex = transformer.transform(new Vertex(v.x, -v.y, v.z));
        lineDrawer.setPixel(vertex.u, vertex.v);
    });
}

function findPolygonVertices(allVertices, face) {
    return face.vertices.map(faceVertex => {
        const vertex = allVertices[faceVertex.vertexIndex - 1];
        return new Vertex(
            vertex.x,
            -vertex.y,
            vertex.z
        );
    });
}

export function drawPolygonImage(lineDrawer, vertices, faces, transformer) {
    lineDrawer.fill();
    for (let face of faces) {
        const polygonVertices = findPolygonVertices(vertices, face)
            .map(vertex => transformer.transform(vertex));
        lineDrawer
            .drawPolygon(polygonVertices[0].u, polygonVertices[0].v, polygonVertices[1].u, polygonVertices[1].v, polygonVertices[2].u, polygonVertices[2].v);
    }
}

export function drawFilledPolygonImage(polygonFiller, vertices, faces, transformer) {
    polygonFiller.fill();
    for (let face of faces) {
        const polygonVertices = findPolygonVertices(vertices, face)
            .map(vertex => transformer.transform(vertex));
        polygonFiller.fillPolygon(
            new Vertex(polygonVertices[0].u, polygonVertices[0].v),
            new Vertex(polygonVertices[1].u, polygonVertices[1].v),
            new Vertex(polygonVertices[2].u, polygonVertices[2].v)
        );
    }
}

export function drawLightSensitiveFilledPolygonImage(polygonFiller, vertices, faces, transformer, lightDirection = [0, 0, 1]) {
    polygonFiller.fill();

    for (let face of faces) {

        const polygonVertices = findPolygonVertices(vertices, face)
            .map(vertex => transformer.transform(vertex));

        const normal = cross(
            [
                polygonVertices[1].x - polygonVertices[0].x, polygonVertices[1].y - polygonVertices[0].y,
                polygonVertices[1].z - polygonVertices[0].z
            ], [
                polygonVertices[1].x - polygonVertices[2].x, polygonVertices[1].y - polygonVertices[2].y,
                polygonVertices[1].z - polygonVertices[2].z
            ]
        );

        const cosineOfAngleOfIncidence = divide(
            dot(normal, lightDirection),
            sqrt(square(normal[0]) + square(normal[1]) + square(normal[2])) * sqrt(square(lightDirection[0]) + square(lightDirection[1] + square(lightDirection[2])))
        );

        if (cosineOfAngleOfIncidence < 0) {
            polygonFiller.fillPolygon(
                polygonVertices[0],
                polygonVertices[1],
                polygonVertices[2],
                new Color(80 * abs(cosineOfAngleOfIncidence), 255 * abs(cosineOfAngleOfIncidence), 0)
            );
        }
    }
}
