import {cos, cross, dot, sin} from "mathjs";

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
            .fillPolygon(polygonVertices[0].x, polygonVertices[0].y, polygonVertices[1].x, polygonVertices[1].y, polygonVertices[2].x, polygonVertices[2].y);
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
        const cosineOfAngleOfIncidence = dot(normal, lightDirection);
        if (cosineOfAngleOfIncidence < 0) {
            polygonFiller
                .fillPolygon(polygonVertices[0].x, polygonVertices[0].y, polygonVertices[1].x, polygonVertices[1].y, polygonVertices[2].x, polygonVertices[2].y);

        }
    })
}
