import {round} from "mathjs";
import OBJFile from "obj-file-parser";
import {toggleLoader} from "./utils";
import {BasicConfigAdjuster, ProjectiveConfigAdjuster} from "./tool-classes/config-adjuster";
import {Vertex} from "./models/vertex";

export class ObjFileHandler {

    defaultControls = [
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

    parsedObjFile;

    constructor(handle, extraControls = []) {
        this.handle = handle;
        this.controls = this.defaultControls.concat(extraControls);

        this.initObjFileUploadPanel();

        this.objFileInput = document.getElementById("obj-file-input");
        this.renderButton = document.getElementById("render-btn");
        this.autoAdjustButton = document.getElementById("auto-adjust-btn");
        this.fileReader = new FileReader();

        this.fileReader.onload = this.onFileLoad.bind(this);
        this.objFileInput.addEventListener("change", this.readFile.bind(this));

        this.autoAdjustButton.addEventListener("click", this.onAutoAdjust.bind(this));
        this.renderButton.addEventListener("click", this.onRender.bind(this));
    }

    initObjFileUploadPanel() {

        const objFileUploadPanel = document.getElementById("obj-file-upload-panel");

        if (objFileUploadPanel) {
            objFileUploadPanel.parentNode.removeChild(objFileUploadPanel);
        }

        const controlsTemplates = this.controls.map(control => `<label for="${control.id}">${control.label}</label>
                <input id="${control.id}" class="form-control" type="${control.type}" value="${control.value}"/>`);

        document
            .getElementById("main-container")
            .insertAdjacentHTML("beforeend", `
            <section id="obj-file-upload-panel">
                <label for="obj-file-input">Add your .obj file</label>
                <input id="obj-file-input" class="form-control" type="file"/>
                ${controlsTemplates.join("")}
                <button type="button" class="btn" id="auto-adjust-btn" disabled>Auto adjust</button>
                <button type="button" class="btn btn-primary" id="render-btn" disabled>Render</button>
            </section>
        `)
    }

    onRender() {
        toggleLoader(true)
        setTimeout(() => {
            this.handle(this.parsedObjFile, this.getConfig())
                .then(() => {
                    toggleLoader(false);
                });
        }, 100);
    }

    onAutoAdjust() {
        toggleLoader(true);

        const config = this.getConfig(),
            vertices = this.parsedObjFile.models[0].vertices
                .map(v => new Vertex(v.x, -v.y, v.z));

        let adjuster;

        if (config.shiftX && config.shiftY && config.shiftZ) {
            adjuster = new ProjectiveConfigAdjuster(config);
        } else {
            adjuster = new BasicConfigAdjuster(config);
        }

        const adjustedConfig =
            adjuster.adjust(vertices, 1000);

        this.controls.forEach(control => {
            if (adjustedConfig[control.id]) {
                document.getElementById(control.id).value = adjustedConfig[control.id];
            }
        });

        toggleLoader(false);
    }

    readFile() {
        const uploadedFile = this.objFileInput.files[0];
        if (uploadedFile) {
            this.fileReader.readAsText(uploadedFile, "UTF-8");
        } else {
            this.renderButton.disabled = true;
            this.autoAdjustButton.disabled = true;
        }
    }

    getConfig() {
        return this.controls.reduce((config, control) => {
            const controlValue = control.handle(document.getElementById(control.id).value);
            return Object.assign(config, controlValue)
        }, {});
    }

    onFileLoad(fileLoadedEvent) {
        const fileContent = fileLoadedEvent.target.result;
        this.parsedObjFile = new OBJFile(fileContent).parse();

        this.autoAdjustButton.disabled = false;
        this.renderButton.disabled = false;
    }
}
