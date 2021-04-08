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

    static clone({x, y, z, u, v, w}) {
        const vertex = new Vertex(x, y, z);
        if (u || v || w) {
            vertex.setTransformedCoordinates(u, v, w);
        }
        return vertex;
    }
}
