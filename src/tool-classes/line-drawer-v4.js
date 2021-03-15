import {Paintbrush} from "./paintbrush";
import {Color} from "../models/color";
import {abs} from "mathjs";

/**
 * Uses Bresenham's line algorithm
 * Use this class as final tool for drawing lines
 */
export class LineDrawerV4 extends Paintbrush {

    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
    }

    drawLine(x0, y0, x1, y1, color = this.defaultColor) {
        const steep = abs(x0 - x1) < abs(y0 - y1);
        if (steep) {
            [x0, y0] = [y0, x0];
            [x1, y1] = [y1, x1];
        }
        if (x1 < x0) {
            [x0, x1] = [x1, x0];
            [y0, y1] = [y1, y0];
        }
        const dx = x1 - x0;
        const dy = y1 - y0;
        const dError = abs(dy / dx);
        let error = 0;
        let y = y0;
        for (let x = x0; x <= x1; ++x) {
            this.setPixel(steep ? y : x, steep ? x : y, color);
            error += dError;
            if (0.5 < error) {
                y += y0 < y1 ? 1 : -1;
                error -= 1;
            }
        }
        return this;
    }

    drawPolygon(x0, y0, x1, y1, x2, y2, color = this.defaultColor) {
        this
            .drawLine(x0, y0, x1, y1, color)
            .drawLine(x1, y1, x2, y2, color)
            .drawLine(x2, y2, x0, y0, color);
    }
}
