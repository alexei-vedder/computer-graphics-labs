import {add, multiply, transpose} from "mathjs";

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
        const intrinsic = [
            [this.config.scaling, 0, this.config.displacementX],
            [0, this.config.scaling, this.config.displacementY],
            [0, 0, 1]
        ];

        let transformedCoords = transpose(multiply(
            intrinsic,
            add(
                [
                    [vertex.x],
                    [vertex.y],
                    [vertex.z]
                ], [
                    [this.config.shiftX],
                    [this.config.shiftY],
                    [this.config.shiftZ]
                ]
            )
        )).flat();

        const z = transformedCoords[2];
        transformedCoords = transformedCoords.map(coord => coord / z);
        vertex.setTransformedCoordinates(transformedCoords[0], transformedCoords[1], transformedCoords[2]);

        /** Another way to calculate new coordinates

         const u = this.config.scaling * (vertex.x + 0.005) / (vertex.z + 0.2) + this.config.displacementX,
         v = this.config.scaling * (vertex.y + 0.045) / (vertex.z + 0.2) + this.config.displacementY,
         w = 1;
         vertex.setTransformedCoordinates(u, v, w);

         */

        return vertex;
    }
}
