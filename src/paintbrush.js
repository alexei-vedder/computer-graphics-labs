export class Paintbrush {

    constructor(ctx) {
        this.setNewContext(ctx);
    }

    setNewContext(ctx) {
        this.ctx = ctx;
        ctx.imageSmoothingEnabled = false;
        this.imageData = ctx.getImageData(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        return this;
    }

    fill(color = {r: 0, g: 0, b: 0, a: 255}) {
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            this.imageData.data[i + 0] = color.r;
            this.imageData.data[i + 1] = color.g;
            this.imageData.data[i + 2] = color.b;
            this.imageData.data[i + 3] = color.a;
        }
        this.ctx.putImageData(this.imageData, 0, 0);
        return this;
    }

    grayscale() {
        for (let i = 0; i < this.imageData.data.length; i += 4) {
            const avg = (this.imageData.data[i] + this.imageData.data[i + 1] + this.imageData.data[i + 2]) / 3;
            this.imageData.data[i + 0] = avg;
            this.imageData.data[i + 1] = avg;
            this.imageData.data[i + 2] = avg;
        }
        this.ctx.putImageData(this.imageData, 0, 0);
        return this;
    }

    gradient() {
        for(let y = 0; y < this.imageData.height; y++){
            for(let x = 0; x < this.imageData.width; x++){
                const i = (y * 4) * this.imageData.width + x * 4;
                const value = (x + y) % this.imageData.width;
                this.imageData.data[i + 0] = value;
                this.imageData.data[i + 1] = value;
                this.imageData.data[i + 2] = value;
                this.imageData.data[i + 3] = 255;
            }
        }
        this.ctx.putImageData(this.imageData, 0, 0);
        return this;
    }
}
