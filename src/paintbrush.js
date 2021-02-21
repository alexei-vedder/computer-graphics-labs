import {Color} from "./image";

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
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const average = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
            this.imageData.data[i + 0] = average;
            this.imageData.data[i + 1] = average;
            this.imageData.data[i + 2] = average;
        }
        this.ctx.putImageData(this.imageData, 0, 0);
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
        const i = (Math.round(y) * 4) * this.imageData.width + Math.round(x) * 4;
        this.imageData.data[i + 0] = color.r;
        this.imageData.data[i + 1] = color.g;
        this.imageData.data[i + 2] = color.b;
        this.imageData.data[i + 3] = color.a;
        this.ctx.putImageData(this.imageData, 0, 0);
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
        const steep = Math.abs(x0 - x1) < Math.abs(y0 - y1);
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
        const steep = Math.abs(x0 - x1) < Math.abs(y0 - y1);
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
        const dError = Math.abs(dy / dx);
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
    }
}
