import {PolygonFiller} from "./polygon-filler";
import {Color} from "../models/color";

export class ZBufferedPolygonFiller extends PolygonFiller {

    zBuffer;

    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
        this.zBuffer = new Array(this.imageData.width)
            .fill(null)
            .map(() => new Array(this.imageData.height).fill(Infinity))
    }

    handlePolygonPixel(x, y, {p0, p1, p2}, colorFn) {

        if (this.zBuffer.length <= x || this.zBuffer[0].length <= y) {
            return;
        }

        const bcCoords = PolygonFiller.calcBarycentricCoordinates(x, y, p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);

        if (bcCoords.l0 <= 0 || bcCoords.l1 <= 0 || bcCoords.l2 <= 0) {
            return;
        }

        const z = bcCoords.l0 * p0.z + bcCoords.l1 * p1.z + bcCoords.l2 * p2.z;

        if (this.zBuffer[x][y] <= z) {
            return;
        }

        this.zBuffer[x][y] = z;
        this.setPixel(x, y, colorFn(bcCoords));
    }
}
