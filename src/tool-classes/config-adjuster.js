import {QuaternionDrivenCoordTransformer} from "./projective-coord-transformer";
import {abs, max} from "mathjs";

export class ConfigAdjuster {

    constructor(config, SCALING_COEFF = 0.8) {
        this.config = config;
        this.SCALING_COEFF = SCALING_COEFF;
    }

    adjust(vertices) {
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

    adjust(vertices) {
        const {xMax, xMin, yMax, yMin} = this.findExtremums(vertices);
        const maximum = max(abs(xMax), abs(xMin), abs(yMax), abs(yMin));

        return {
            scaling: this.SCALING_COEFF * this.config.imageSize / (2 * maximum)
        }
    }
}

export class ProjectiveConfigAdjuster extends ConfigAdjuster {

    constructor(config, DISTANCE = 2) {
        super(config);
        this.transformer = new QuaternionDrivenCoordTransformer(config);
        this.DISTANCE = DISTANCE;
    }


    adjust(vertices) {

        const rotatedVertices = vertices.map(v => this.transformer.rotate(v));

        const {xMax, xMin, yMax, yMin, zMax, zMin} = this.findExtremums(rotatedVertices);

        const xDispersion = abs(xMax - xMin),
            yDispersion = abs(yMax - yMin),
            zDispersion = abs(zMax - zMin);

        const dx = (xMax + xMin) / 2,
            dy = (yMax + yMin) / 2,
            dz = (zMax + zMin) / 2;

        const shiftZ = this.DISTANCE * zDispersion;

        return {
            scaling: this.SCALING_COEFF * this.config.imageSize * shiftZ / max(xDispersion, yDispersion),
            shiftX: -dx,
            shiftY: -dy,
            shiftZ: shiftZ - dz
        };
    }
}
