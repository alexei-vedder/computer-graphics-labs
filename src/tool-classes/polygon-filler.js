import {Paintbrush} from "./paintbrush";
import {Color} from "../models/color";
import {ceil, floor, max, min, round} from "mathjs";

export class PolygonFiller extends Paintbrush {

    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
    }

    static calcBarycentricCoordinates(x, y, x0, y0, x1, y1, x2, y2) {
        const l0 = ((x1 - x2) * (y - y2) - (y1 - y2) * (x - x2)) / ((x1 - x2) * (y0 - y2) - (y1 - y2) * (x0 - x2));
        const l1 = ((x2 - x0) * (y - y0) - (y2 - y0) * (x - x0)) / ((x2 - x0) * (y1 - y0) - (y2 - y0) * (x1 - x0));
        const l2 = ((x0 - x1) * (y - y1) - (y0 - y1) * (x - x1)) / ((x0 - x1) * (y2 - y1) - (y0 - y1) * (x2 - x1));

        const sum = round(l0 + l1 + l2);
        if (sum !== 1) {
            console.warn(`Barycentric coordinates have been calculated wrong. Sum = ${sum}`) // throw new Error(`Barycentric coordinates have been calculated wrong. Sum = ${sum}`);
        }

        return {
            l0,
            l1,
            l2
        }
    }

    fillPolygon(p0, p1, p2, color = Paintbrush.getRandomColor()) {
        const constrainingRect = this.findConstrainingRectangle(p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
        for (let y = floor(constrainingRect.yMin); y <= ceil(constrainingRect.yMax); y++) {
            for (let x = floor(constrainingRect.xMin); x <= ceil(constrainingRect.xMax); x++) {
                if (x < this.imageData.width && y < this.imageData.height) {
                    const bcCoordinates = PolygonFiller.calcBarycentricCoordinates(x, y, p0.u, p0.v, p1.u, p1.v, p2.u, p2.v);
                    if (0 < bcCoordinates.l0 && 0 < bcCoordinates.l1 && 0 < bcCoordinates.l2) {
                        this.setPixel(x, y, color);
                    }
                }
            }
        }
        return this;
    }

    /** @internal */
    findConstrainingRectangle(x0, y0, x1, y1, x2, y2) {
        return {
            xMin: max(min(x0, x1, x2), 0),
            yMin: max(min(y0, y1, y2), 0),
            xMax: min(max(x0, x1, x2), this.imageData.width),
            yMax: min(max(y0, y1, y2), this.imageData.height)
        }
    }
}
