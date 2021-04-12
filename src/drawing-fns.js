import {abs, cos, sin} from "mathjs";
import {Color} from "./models/color";
import {asyncForOf, findCosineOfAngleOfIncidence, findNormal} from "./utils";

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

        polygonFiller.fillPolygon(polygonVertices);
    });
}

export function drawLightSensitiveFilledPolygonImage(polygonFiller,
                                                     {faces},
                                                     transformer,
                                                     lightDirection = [0, 0, 1]) {
    polygonFiller.fill();

    asyncForOf(faces, (face) => {
        const polygonVertices = face.vertices.map(vertex => transformer.transform(vertex));

        const cosineOfAngleOfIncidence = findCosineOfAngleOfIncidence(findNormal(polygonVertices), lightDirection);

        if (0 <= cosineOfAngleOfIncidence) {
            return;
        }

        polygonFiller.fillPolygon(polygonVertices, () => new Color(
            80 * abs(cosineOfAngleOfIncidence),
            255 * abs(cosineOfAngleOfIncidence),
            0)
        );
    });
}

export function drawGouraudShadedFilledPolygonImage(polygonFiller,
                                                    {faces},
                                                    transformer,
                                                    lightDirection = [0, 0, 1]) {
    polygonFiller.fill();

    asyncForOf(faces, (face) => {

        const polygonVertices = face.vertices.map(vertex => transformer.transform(vertex));
        const polygonNormals = face.normals.map(normal => transformer.rotateNormal(normal));

        const colorFn = (bcCoords) => {
            const cosine0 = findCosineOfAngleOfIncidence(polygonNormals[0], lightDirection);
            const cosine1 = findCosineOfAngleOfIncidence(polygonNormals[1], lightDirection);
            const cosine2 = findCosineOfAngleOfIncidence(polygonNormals[2], lightDirection);
            const colorCoeff = abs(bcCoords.l0 * cosine0 + bcCoords.l1 * cosine1 + bcCoords.l2 * cosine2);
            return new Color(
                80 * colorCoeff,
                255 * colorCoeff,
                0
            )
        };

        const cosineOfAngleOfIncidence = findCosineOfAngleOfIncidence(findNormal(polygonVertices), lightDirection);

        if (0 <= cosineOfAngleOfIncidence) {
            return;
        }

        polygonFiller.fillPolygon([...polygonVertices, ...polygonNormals], colorFn);
    });

}
