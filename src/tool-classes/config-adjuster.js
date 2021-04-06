import {QuaternionDrivenCoordTransformer} from "./projective-coord-transformer";
import {abs, max} from "mathjs";

export class ConfigAdjuster {

    constructor(config, SCALING_COEFF = 0.8) {
        this.config = config;
        this.SCALING_COEFF = SCALING_COEFF;
    }

    adjust(vertices, imageSize /* TODO move to config */) {
        throw new Error("No implementation for 'adjust' method");
    }

    findExtremums(vertices) {
        let xMax = -Infinity,
            xMin = Infinity,
            yMax = -Infinity,
            yMin = Infinity,
            zMax = -Infinity,
            zMin = Infinity;

        vertices.forEach(v => {
            if (v.x < xMin) xMin = v.x;
            if (xMax < v.x) xMax = v.x;
            if (v.y < yMin) yMin = v.y;
            if (yMax < v.y) yMax = v.y;
            if (v.z < zMin) zMin = v.z;
            if (zMax < v.z) zMax = v.z;
        });

        return {
            xMax,
            xMin,
            yMax,
            yMin,
            zMax,
            zMin
        }
    }
}

export class BasicConfigAdjuster extends ConfigAdjuster {

    constructor(config) {
        super(config);
    }

    adjust(vertices, imageSize) {
        const {xMax, xMin, yMax, yMin} = this.findExtremums(vertices);

        const xDispersion = abs(xMax - xMin),
            yDispersion = abs(yMax - yMin);

        const dx = (xMax + xMin) / 2,
            dy = (yMax + yMin) / 2;

        return {
            scaling: this.SCALING_COEFF * imageSize / (max(xDispersion, yDispersion) + 2 * max(abs(dx), abs(dy)))
        }
    }
}

export class ProjectiveConfigAdjuster extends ConfigAdjuster {

    constructor(config, DISTANCE = 2) {
        super(config);
        this.transformer = new QuaternionDrivenCoordTransformer(config);
        this.DISTANCE = DISTANCE;
    }


    adjust(vertices, imageSize /* TODO move to config */) {

        let rotatedVertices = JSON.parse(JSON.stringify(vertices));
        rotatedVertices.forEach(v => this.transformer.rotate(v));

        const {xMax, xMin, yMax, yMin, zMax, zMin} = this.findExtremums(rotatedVertices);

        const xDispersion = abs(xMax - xMin),
            yDispersion = abs(yMax - yMin),
            zDispersion = abs(zMax - zMin);

        const dx = (xMax + xMin) / 2,
            dy = (yMax + yMin) / 2,
            dz = (zMax + zMin) / 2;

        const shiftZ = this.DISTANCE * zDispersion - dz;

        return {
            scaling: this.SCALING_COEFF * imageSize * shiftZ / max(xDispersion, yDispersion),
            shiftX: -dx,
            shiftY: -dy,
            shiftZ
        };
    }
}
