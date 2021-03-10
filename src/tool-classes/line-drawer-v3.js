import {Paintbrush} from "./paintbrush";
import {Color} from "../models/color";
import {abs} from "mathjs";

export class LineDrawerV3 extends Paintbrush {
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
        for (let x = x0; x <= x1; x++) {
            const t = (x - x0) / (x1 - x0);
            const y = y0 * (1 - t) + y1 * t;
            this.setPixel(steep ? y : x, steep ? x : y, color);
        }
        return this;
    }
}
