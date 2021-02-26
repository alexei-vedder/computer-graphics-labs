export function drawStar(lineDrawer, x0 = 100, y0 = 100, length = 95) {
    lineDrawer.fill();
    for (let i = 0; i <= 12; ++i) {
        const alpha = 2 * 3.14 * i / 13;
        lineDrawer
            .drawLine(x0, y0, x0 + length * Math.cos(alpha), y0 + length * Math.sin(alpha));
    }
}

export function drawVertexImage(lineDrawer, vertices, scaling) {
    lineDrawer.fill();
    vertices.forEach(vertex => {
        lineDrawer.setPixel(scaling.alpha * vertex.x + scaling.beta, scaling.alpha * -1 * vertex.y + scaling.beta);
    })
}

export function drawPolygonImage(lineDrawer, vertices, faces, scaling) {
    lineDrawer.fill();
    faces.forEach(face => {
        const polygonVertices = face.vertices.map(faceVertex => { // находим координаты вершин полигона
            const polygonVertex = {...vertices[faceVertex.vertexIndex - 1]};
            polygonVertex.x = scaling.alpha * polygonVertex.x + scaling.beta;
            polygonVertex.y = scaling.alpha * -1 * polygonVertex.y + scaling.beta;
            return polygonVertex;
        });
        lineDrawer
            .drawPolygon(polygonVertices[0].x, polygonVertices[0].y, polygonVertices[1].x, polygonVertices[1].y, polygonVertices[2].x, polygonVertices[2].y);
    });
}
