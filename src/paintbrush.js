import {Color} from "./color";
import {min, max, floor, ceil, round, abs, random} from "mathjs";

export class Paintbrush {

    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        this.setNewContext(ctx);
        this.defaultBackgroundColor = defaultBackgroundColor;
        this.defaultColor = defaultColor;
    }

    setNewContext(ctx) {
        this.ctx = ctx;
        ctx.imageSmoothingEnabled = false;
        this.imageData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        return this;
    }

    fill(color = this.defaultBackgroundColor) {
        for (let y = 0; y < this.imageData.height; y++) {
            for (let x = 0; x < this.imageData.width; x++) {
                this.setPixel(x, y, color);
            }
        }
        return this;
    }

    grayscale() {
        for (let y = 0; y < this.imageData.height; y++) {
            for (let x = 0; x < this.imageData.width; x++) {
                const pixelData = this.ctx.getImageData(x, y, x + 1, y + 1);
                const averageColorValue = (pixelData.data[0] + pixelData.data[1] + pixelData.data[2]) / 3;
                this.setPixel(x, y, new Color(averageColorValue, averageColorValue, averageColorValue));
            }
        }
        return this;
    }

    gradient() {
        for (let y = 0; y < this.imageData.height; y++) {
            for (let x = 0; x < this.imageData.width; x++) {
                const value = (x + y) % this.imageData.width;
                this.setPixel(x, y, {r: value, g: value, b: value, a: 255})
            }
        }
        return this;
    }

    setPixel(x, y, color = this.defaultColor) {
        const pixel = this.ctx.createImageData(1, 1)
        pixel.data[0] = color.r;
        pixel.data[1] = color.g;
        pixel.data[2] = color.b;
        pixel.data[3] = color.a;
        this.ctx.putImageData(pixel, round(x), round(y));
        return this;
    }
}

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

export class LineDrawerV2 extends Paintbrush {
    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
    }

    drawLine(x0, y0, x1, y1, color = this.defaultColor) {
        for (let x = x0; x <= x1; x++) {
            const t = (x - x0) / (x1 - x0);
            const y = y0 * (1 - t) + y1 * t;
            this.setPixel(x, y, color);
        }
        return this;
    }
}

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

export class PolygonFiller extends Paintbrush {

    constructor(ctx,
                defaultBackgroundColor = new Color(0, 0, 0),
                defaultColor = new Color(255, 255, 255)) {
        super(ctx, defaultBackgroundColor, defaultColor);
    }

    fillPolygon(x0, y0, x1, y1, x2, y2, color = this.#getRandomColor()) {
        const constrainingRect = this.#findConstrainingRectangle(x0, y0, x1, y1, x2, y2);
        for (let y = floor(constrainingRect.yMin); y <= ceil(constrainingRect.yMax); y++) {
            for (let x = floor(constrainingRect.xMin); x <= ceil(constrainingRect.xMax); x++) {
                const bcCoordinates = this.#calcBarycentricCoordinates(x, y, x0, y0, x1, y1, x2, y2);
                if (0 < bcCoordinates.l0 && 0 < bcCoordinates.l1 && 0 < bcCoordinates.l2) {
                    this.setPixel(x, y, color);
                }
            }
        }
        return this;
    }

    #getRandomColor() {
        const getRandomColorComponent = () => random(256);
        return new Color(
            getRandomColorComponent(),
            getRandomColorComponent(),
            getRandomColorComponent()
        )
    }

    #calcBarycentricCoordinates(x, y, x0, y0, x1, y1, x2, y2) {
        const l0 = ((x1 - x2) * (y - y2) - (y1 - y2) * (x - x2)) / ((x1 - x2) * (y0 - y2) - (y1 - y2) * (x0 - x2))
        const l1 = ((x2 - x0) * (y - y0) - (y2 - y0) * (x - x0)) / ((x2 - x0) * (y1 - y0) - (y2 - y0) * (x1 - x0))
        const l2 = ((x0 - x1) * (y - y1) - (y0 - y1) * (x - x1)) / ((x0 - x1) * (y2 - y1) - (y0 - y1) * (x2 - x1))

        const sum = round(l0 + l1 + l2);
        if (sum !== 1) {
            throw new Error(`Barycentric coordinates have been calculated wrong. Sum = ${sum}`);
        }

        return {
            l0,
            l1,
            l2
        }
    }

    #findConstrainingRectangle(x0, y0, x1, y1, x2, y2) {
        return {
            xMin: max(min(x0, x1, x2), 0),
            yMin: max(min(y0, y1, y2), 0),
            xMax: min(max(x0, x1, x2), this.imageData.width),
            yMax: min(max(y0, y1, y2), this.imageData.height)
        }
    }
}
