export class ObjModel {

    faces;
    vertices;
    normals;

    /**
     * @param faces {{vertices: Vertex[], normals: [number, number, number][]}[]}
     * @param vertices {Vertex[]}
     * @param normals {[number, number, number][]}
     */
    constructor(faces, vertices, normals) {
        this.faces = faces;
        this.vertices = vertices;
        this.normals = normals;
    }
}
