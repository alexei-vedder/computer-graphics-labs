import {unit} from "mathjs";

export class AbstractCoordTransformer {

    constructor(config) {
        this.config = config;
        this.config.alpha = this.config.alpha || unit(0, "deg");
        this.config.beta = this.config.beta || unit(0, "deg");
        this.config.gamma = this.config.gamma || unit(0, "deg");
    }

    transform(vertex) {
        throw new Error("No implementation for 'transform' method");
    }
}

export class BasicCoordTransformer extends AbstractCoordTransformer {

    constructor(config) {
        super(config);
    }

    transform(vertex) {
        vertex.setTransformedCoordinates(
            this.config.scaling * vertex.x + this.config.imageSize / 2,
            this.config.scaling * vertex.y + this.config.imageSize / 2,
            this.config.scaling * vertex.z
        );
        return vertex;
    }
}

