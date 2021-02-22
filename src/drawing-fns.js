const alpha = 4000, beta = 500;

export function drawStar(lineDrawer, x0 = 100, y0 = 100, length = 95) {
    lineDrawer.fill();
    for (let i = 0; i <= 12; ++i) {
        const alpha = 2 * 3.14 * i / 13;
        lineDrawer
            .drawLine(x0, y0, x0 + length * Math.cos(alpha), y0 + length * Math.sin(alpha));
    }
}

export function drawVertexImage(lineDrawer, vertices) {
    lineDrawer.fill();
    vertices.forEach(vertex => {
        lineDrawer.setPixel(alpha * vertex.x + beta, alpha * vertex.y + beta);
    })
}
