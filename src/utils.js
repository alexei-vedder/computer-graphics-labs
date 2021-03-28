import {saveAs} from "file-saver";
import OBJFile from "obj-file-parser";
import {round} from "mathjs";

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

function initObjFileUploadPanel() {

    const objFileUploadPanel = document.getElementById("obj-file-upload-panel");

    if (objFileUploadPanel) {
        objFileUploadPanel.parentNode.removeChild(objFileUploadPanel);
    }

    document
        .getElementById("main-container")
        .insertAdjacentHTML("beforeend", `
            <section id="obj-file-upload-panel">
                <label for="obj-file-input">Add your .obj file</label>
                <input id="obj-file-input" class="form-control" type="file"/>
                <label for="obj-file-alpha">Alpha (scaling)</label>
                <input id="obj-file-alpha" class="form-control" type="number" value="20"/>
                <label for="obj-file-beta">Beta (displacement)</label>
                <input id="obj-file-beta" class="form-control" type="number" value="500"/>
                <button type="button" class="btn btn-primary" id="obj-file-submit">Render</button>
            </section>
        `)
}

export function toggleLoader(enabled) {
    const loader = document.getElementById("loader")
    if (enabled) {
        if (!loader) {
            document.body.insertAdjacentHTML("beforeend", `
                <div class="d-flex justify-content-center" id="loader">
                    <div class="spinner-border" role="status">
                           <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            `)
        }
    } else {
        if (loader) {
            loader.parentNode.removeChild(loader);
        }
    }
}

export function switchTabs(tab, callback) {
    if (tab.classList.contains("active")) {
        return;
    }
    tab.classList.add("active");
    tab.parentElement.parentElement.childNodes.forEach((childNode) => {
        if (childNode.hasChildNodes() && childNode?.lastElementChild !== tab) {
            childNode.lastElementChild.classList.remove("active");
        }
    });

    document.getElementById("image-container").innerHTML = "";
    callback();
}

export function prepareObjFileUploading(handleParsedObjFile) {

    initObjFileUploadPanel();

    const objFileInput = document.getElementById("obj-file-input");
    const objFileSubmit = document.getElementById("obj-file-submit");
    const objFileAlpha = document.getElementById("obj-file-alpha");
    const objFileBeta = document.getElementById("obj-file-beta");
    const fileReader = new FileReader();

    fileReader.onload = (fileLoadedEvent) => {
        const fileContent = fileLoadedEvent.target.result;
        const objFile = new OBJFile(fileContent);
        const parsedObjFile = objFile.parse();
        const alpha = round(objFileAlpha.value);
        const beta = round(objFileBeta.value);
        console.log(parsedObjFile, alpha, beta);

        toggleLoader(true)
        setTimeout(() => {
            handleParsedObjFile(parsedObjFile, {alpha, beta})
                .then(() => {
                    toggleLoader(false);
                });
        }, 100);
    };

    objFileSubmit.addEventListener("click", () => {
        fileReader.readAsText(objFileInput.files[0], "UTF-8");
    });
}
