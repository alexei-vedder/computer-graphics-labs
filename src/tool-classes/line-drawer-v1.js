import {Paintbrush} from "./paintbrush";
import {Color} from "../models/color";

export class LineDrawerV1 extends Paintbrush {
    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
    }

    drawLine(x0, y0, x1, y1, color = this.defaultColor) {
        for (let t = 0; t < 1; t += 0.01) {
            const x = x0 * (1 - t) + x1 * t;
            const y = y0 * (1 - t) + y1 * t;
            this.setPixel(x, y, color);
        }
        return this;
    }
}
