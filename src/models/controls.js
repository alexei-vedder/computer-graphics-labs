import {round, unit} from "mathjs";

export const defaultControls = [
    {
        id: "scaling",
        type: "number",
        value: 1000,
        label: "Scaling",
        handle: (value) => ({
            scaling: round(value)
        })
    }, {
        id: "imageSize",
        type: "number",
        value: 500,
        label: "Image size",
        handle: (value) => ({
            imageSize: round(value)
        })
    }
];

export const shiftVectorControls = [
    {
        id: "shiftX",
        type: "number",
        value: 0.005,
        label: "Shift (x)",
        handle: (value) => ({
            shiftX: Number.parseFloat(value)
        })
    },
    {
        id: "shiftY",
        type: "number",
        value: 0.05,
        label: "Shift (y)",
        handle: (value) => ({
            shiftY: Number.parseFloat(value)
        })
    },
    {
        id: "shiftZ",
        type: "number",
        value: 0.2,
        label: "Shift (z)",
        handle: (value) => ({
            shiftZ: Number.parseFloat(value)
        })
    }
];

export const rotationAngleControls = [
    {
        id: "alpha",
        type: "number",
        value: 0,
        label: "Alpha (x angle in degrees)",
        handle: (value) => ({
            alpha: unit(Number.parseFloat(value), "deg")
        })
    },
    {
        id: "beta",
        type: "number",
        value: 0,
        label: "Beta (y angle in degrees)",
        handle: (value) => ({
            beta: unit(Number.parseFloat(value), "deg")
        })
    },
    {
        id: "gamma",
        type: "number",
        value: 0,
        label: "Gamma (z angle in degrees)",
        handle: (value) => ({
            gamma: unit(Number.parseFloat(value), "deg")
        })
    }
];
