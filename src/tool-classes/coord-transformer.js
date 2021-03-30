import {cos, multiply, sin, transpose} from "mathjs";

export class CoordTransformer {

    constructor(config) {
        this.config = config;
    }

    transform(vertex) {
        throw new Error("No implementation for 'transform' method");
    }
}

export class BasicCoordTransformer extends CoordTransformer {

    constructor(config) {
        super(config);
    }

    transform(vertex) {
        vertex.setTransformedCoordinates(
            this.config.scaling * vertex.x + this.config.displacementX,
            this.config.scaling * vertex.y + this.config.displacementY,
            this.config.scaling * vertex.z
        );
        return vertex;
    }
}

export class ProjectiveCoordTransformer extends CoordTransformer {

    constructor(config) {
        super(config);
    }

    transform(vertex) {

        this.#rotate(vertex);

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

    #rotate(vertex) {

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
