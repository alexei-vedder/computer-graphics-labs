import {saveAs} from "file-saver";
import OBJFile from "obj-file-parser";

export function createImage(name = "image", width = 200, height = 200) {
    const canvas = document.createElement("canvas");
    canvas.className = "image";
    canvas.width = width;
    canvas.height = height;

    document
        .getElementById("image-container")
        .insertAdjacentElement("beforeend", canvas);

    canvas.addEventListener("click", () => {
        const dataURL = canvas.toDataURL();
        saveAs(dataURL, `${name}.png`)
    });

    return canvas;
}

export function prepareObjFileUploading(handleParsedObjFile) {
    const objFileInput = document.getElementById("obj-file-input");
    const objFileSubmit = document.getElementById("obj-file-submit");
    const objFileAlpha = document.getElementById("obj-file-alpha");
    const objFileBeta = document.getElementById("obj-file-beta");
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent) => {
        const fileContent = fileLoadedEvent.target.result;
        const objFile = new OBJFile(fileContent);
        const parsedObjFile = objFile.parse();
        const alpha = Math.round(objFileAlpha.value);
        const beta = Math.round(objFileBeta.value);
        console.log(parsedObjFile, alpha, beta);
        handleParsedObjFile(parsedObjFile, {alpha, beta});
    };

    objFileSubmit.addEventListener("click", () => {
        fileReader.readAsText(objFileInput.files[0], "UTF-8");
    });
}
