import {Vertex} from "./vertex";

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

    static clone(objModel) {
        const faces = objModel.faces.map(face => ({
            vertices: face.vertices.map(v => Vertex.clone(v)),
            normals: face.normals.map(n => [...n])
        }));
        const vertices = objModel.vertices.map(v => Vertex.clone(v));
        const normals = objModel.normals.map(n => [...n]);
        return new ObjModel(faces, vertices, normals);
    }
}
