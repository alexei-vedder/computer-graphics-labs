export class Vertex {
    x;
    y;
    z;

    u;
    v;
    w;

    constructor(x, y, z) {
        this.x = this.u = x;
        this.y = this.v = y;
        this.z = this.w = z;
    }

    setTransformedCoordinates(u, v, w) {
        this.u = u;
        this.v = v;
        this.w = w;
    }
}
