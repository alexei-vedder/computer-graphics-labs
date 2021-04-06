import {cos, multiply, sin, transpose} from "mathjs";
import {Quaternion} from "quaternion";
import {AbstractCoordTransformer} from "./coord-transformer";

export class AbstractProjectiveCoordTransformer extends AbstractCoordTransformer {

    constructor(config) {
        super(config);
    }

    transform(vertex) {

        this.rotate(vertex);

        const intrinsic = [
            [this.config.scaling, 0, this.config.displacementX],
            [0, this.config.scaling, this.config.displacementY],
            [0, 0, 1]
        ];

        vertex.x += this.config.shiftX;
        vertex.y += this.config.shiftY;
        vertex.z += this.config.shiftZ;

        let transformedCoords = transpose(multiply(
            intrinsic,
            [
                [vertex.x],
                [vertex.y],
                [vertex.z]
            ]
        )).flat();

        const z = transformedCoords[2];
        transformedCoords = transformedCoords.map(coord => coord / z);
        vertex.setTransformedCoordinates(transformedCoords[0], transformedCoords[1], transformedCoords[2]);

        return vertex;
    }

    rotate(vertex) {
        throw new Error("No implementation for 'rotate' method");
    }
}

export class ProjectiveCoordTransformer extends AbstractProjectiveCoordTransformer {

    constructor(config) {
        super(config);
    }

    rotate(vertex) {

        const {alpha, beta, gamma} = this.config;

        const xRotationMatrix = [
            [1, 0, 0],
            [0, cos(alpha), sin(alpha)],
            [0, -sin(alpha), cos(alpha)]
        ];

        const yRotationMatrix = [
            [cos(beta), 0, sin(beta)],
            [0, 1, 0],
            [-sin(beta), 0, cos(beta)]
        ];

        const zRotationMatrix = [
            [cos(gamma), sin(gamma), 0],
            [-sin(gamma), cos(gamma), 0],
            [0, 0, 1]
        ];

        const rotationMatrix = multiply(multiply(xRotationMatrix, yRotationMatrix), zRotationMatrix);

        [vertex.x, vertex.y, vertex.z] = transpose(multiply(rotationMatrix, [[vertex.x], [vertex.y], [vertex.z]])).flat();
    }
}

export class QuaternionDrivenCoordTransformer extends AbstractProjectiveCoordTransformer {

    constructor(config) {
        super(config);
    }

    rotate(vertex) {
        let {alpha, beta, gamma} = this.config;
        const quaternion = Quaternion.fromEuler(gamma.value, alpha.value, beta.value);
        [vertex.x, vertex.y, vertex.z] = quaternion.rotateVector([vertex.x, vertex.y, vertex.z]);
    }

}
