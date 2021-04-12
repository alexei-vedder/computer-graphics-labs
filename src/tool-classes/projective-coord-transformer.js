import {cos, multiply, round, sin, transpose} from "mathjs";
import {Quaternion} from "quaternion";
import {AbstractCoordTransformer} from "./coord-transformer";
import {Vertex} from "../models/vertex";

export class AbstractProjectiveCoordTransformer extends AbstractCoordTransformer {

    constructor(config) {
        super(config);
    }

    transform(v) {

        const vertex = this.rotate(v);

        const intrinsic = [
            [this.config.scaling, 0, round(this.config.imageSize / 2)],
            [0, this.config.scaling, round(this.config.imageSize / 2)],
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

    rotateNormal(normal) {
        const v = this.rotate(new Vertex(normal[0], normal[1], normal[2]));
        return [v.x, v.y, v.z];
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

        const vertexCopy = Vertex.clone(vertex);

        [vertexCopy.x, vertexCopy.y, vertexCopy.z] = transpose(multiply(rotationMatrix, [[vertex.x], [vertex.y], [vertex.z]])).flat();

        return vertexCopy;
    }
}

export class QuaternionDrivenCoordTransformer extends AbstractProjectiveCoordTransformer {

    constructor(config) {
        super(config);
    }

    rotate(vertex) {
        let {alpha, beta, gamma} = this.config;
        const quaternion = Quaternion.fromEuler(gamma.value, alpha.value, beta.value);
        const vertexCopy = Vertex.clone(vertex);
        [vertexCopy.x, vertexCopy.y, vertexCopy.z] = quaternion.rotateVector([vertex.x, vertex.y, vertex.z]);
        return vertexCopy;
    }

}
