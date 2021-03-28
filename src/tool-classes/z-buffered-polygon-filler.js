import {PolygonFiller} from "./polygon-filler";
import {Color} from "../models/color";
import {Paintbrush} from "./paintbrush";
import {ceil, floor} from "mathjs";

export class ZBufferedPolygonFiller extends PolygonFiller {
    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
        this.zBuffer = new Array(this.imageData.width)
            .fill(null)
            .map(() => new Array(this.imageData.height).fill(Infinity))
    }

    /** @override */
    fillPolygon(p0, p1, p2, color = Paintbrush.getRandomColor()) {
        const constrainingRect = this._findConstrainingRectangle(p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
        for (let y = floor(constrainingRect.yMin); y <= ceil(constrainingRect.yMax); y++) {
            for (let x = floor(constrainingRect.xMin); x <= ceil(constrainingRect.xMax); x++) {
                const bcCoordinates = PolygonFiller.calcBarycentricCoordinates(x, y, p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
                if (0 < bcCoordinates.l0 && 0 < bcCoordinates.l1 && 0 < bcCoordinates.l2) {
                    const z = bcCoordinates.l0 * p0.z + bcCoordinates.l1 * p1.z + bcCoordinates.l2 * p2.z;
                    if (z < this.zBuffer[x][y]) {
                        this.zBuffer[x][y] = z;
                        this.setPixel(x, y, color);
                    }
                }
            }
        }
        return this;
    }
}
