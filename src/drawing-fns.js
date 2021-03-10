import {cos, cross, dot, sin, abs, divide, sqrt, square} from "mathjs";
import {Color} from "./color";
import {Vertex} from "./vertex";

export function drawStar(lineDrawer, x0 = 100, y0 = 100, length = 95) {
    lineDrawer.fill();
    for (let i = 0; i <= 12; ++i) {
        const alpha = 2 * 3.14 * i / 13;
        lineDrawer
            .drawLine(x0, y0, x0 + length * cos(alpha), y0 + length * sin(alpha));
    }
}

export function drawVertexImage(lineDrawer, vertices, scaling) {
    lineDrawer.fill();
    for (let vertex of vertices) {
        lineDrawer.setPixel(scaling.alpha * vertex.x + scaling.beta, scaling.alpha * -1 * vertex.y + scaling.beta);
    }
}

function findPolygonVertices(allVertices, face, scaling) {
    return face.vertices.map(faceVertex => { // находим координаты вершин полигона
        const polygonVertex = {...allVertices[faceVertex.vertexIndex - 1]};
        polygonVertex.x = scaling.alpha * polygonVertex.x + scaling.beta;
        polygonVertex.y = scaling.alpha * -1 * polygonVertex.y + scaling.beta;
        polygonVertex.z = scaling.alpha * polygonVertex.z + scaling.beta;
        return polygonVertex;
    });
}

export function drawPolygonImage(lineDrawer, vertices, faces, scaling) {
    lineDrawer.fill();
    for (let face of faces) {
        const polygonVertices = findPolygonVertices(vertices, face, scaling);
        lineDrawer
            .drawPolygon(polygonVertices[0].x, polygonVertices[0].y, polygonVertices[1].x, polygonVertices[1].y, polygonVertices[2].x, polygonVertices[2].y);
    }
}

export function drawFilledPolygonImage(polygonFiller, vertices, faces, scaling) {
    polygonFiller.fill();
    faces.forEach(face => {
        const polygonVertices = findPolygonVertices(vertices, face, scaling);
        polygonFiller
            .fillPolygon(
                new Vertex(polygonVertices[0].x, polygonVertices[0].y),
                new Vertex(polygonVertices[1].x, polygonVertices[1].y),
                new Vertex(polygonVertices[2].x, polygonVertices[2].y)
            )
    });
}

export function drawLightSensitiveFilledPolygonImage(polygonFiller, vertices, faces, scaling, lightDirection = [0, 0, 1]) {
    polygonFiller.fill();
    faces.forEach(face => {
        const polygonVertices = findPolygonVertices(vertices, face, scaling);
        const normal = cross(
            [polygonVertices[1].x - polygonVertices[0].x, polygonVertices[1].y - polygonVertices[0].y, polygonVertices[1].z - polygonVertices[0].z],
            [polygonVertices[1].x - polygonVertices[2].x, polygonVertices[1].y - polygonVertices[2].y, polygonVertices[1].z - polygonVertices[2].z]
        );
        const cosineOfAngleOfIncidence = divide(
            dot(normal, lightDirection),
            sqrt(square(normal[0]) + square(normal[1]) + square(normal[2])) * sqrt(square(lightDirection[0]) + square(lightDirection[1] + square(lightDirection[2])))
        );
        if (cosineOfAngleOfIncidence < 0) {
            polygonFiller
                .fillPolygon(
                    new Vertex(polygonVertices[0].x, polygonVertices[0].y, polygonVertices[0].z),
                    new Vertex(polygonVertices[1].x, polygonVertices[1].y, polygonVertices[1].z),
                    new Vertex(polygonVertices[2].x, polygonVertices[2].y, polygonVertices[2].z),
                    new Color(255 * abs(cosineOfAngleOfIncidence), 255 * abs(cosineOfAngleOfIncidence), 0),
                    {
                        z0: (polygonVertices[0].z - scaling.beta) / scaling.alpha,
                        z1: (polygonVertices[1].z - scaling.beta) / scaling.alpha,
                        z2: (polygonVertices[2].z - scaling.beta) / scaling.alpha,
                    }
                );
        }
    })
}
