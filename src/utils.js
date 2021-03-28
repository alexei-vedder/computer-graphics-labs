import {saveAs} from "file-saver";
import OBJFile from "obj-file-parser";
import {round} from "mathjs";
import {LabFactory} from "./lab-factory";

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

function initObjFileUploadPanel(controls) {

    const objFileUploadPanel = document.getElementById("obj-file-upload-panel");

    if (objFileUploadPanel) {
        objFileUploadPanel.parentNode.removeChild(objFileUploadPanel);
    }

    const controlsTemplates =
        controls.map(control => `<label for="${control.id}">${control.label}</label>
                <input id="${control.id}" class="form-control" type="${control.type}" value="${control.value}"/>`);

    document
        .getElementById("main-container")
        .insertAdjacentHTML("beforeend", `
            <section id="obj-file-upload-panel">
                <label for="obj-file-input">Add your .obj file</label>
                <input id="obj-file-input" class="form-control" type="file"/>
                ${controlsTemplates.join("")}
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
    const tabLink = tab.firstElementChild;
    if (tabLink.classList.contains("active")) {
        return;
    }
    tabLink.classList.add("active");
    tab.parentElement.childNodes
        .forEach((tabItem) => {
            if (tabItem.hasChildNodes() && tabItem !== tab) {
                tabItem.firstElementChild.classList.remove("active");
            }
        });

    document.getElementById("image-container").innerHTML = "";
    callback();
}

export function prepareObjFileUploading(handleParsedObjFile, extraControls = []) {

    const controls = [
        {
            id: "scaling",
            type: "number",
            value: 1000,
            label: "Scaling",
            handle: (value) => ({
                scaling: round(value)
            })
        }, {
            id: "displacement-x",
            type: "number",
            value: 500,
            label: "Displacement (x)",
            handle: (value) => ({
                displacementX: round(value)
            })
        }, {
            id: "displacement-y",
            type: "number",
            value: 500,
            label: "Displacement (y)",
            handle: (value) => ({
                displacementY: round(value)
            })
        }
    ].concat(extraControls);

    initObjFileUploadPanel(controls);

    const objFileInput = document.getElementById("obj-file-input");
    const objFileSubmit = document.getElementById("obj-file-submit");
    const fileReader = new FileReader();

    objFileSubmit.addEventListener("click", () => {
        const uploadedFile = objFileInput.files[0];
        if (uploadedFile) {
            fileReader.readAsText(uploadedFile, "UTF-8");
        }
    });

    fileReader.onload = (fileLoadedEvent) => {
        const fileContent = fileLoadedEvent.target.result;
        const parsedObjFile = new OBJFile(fileContent).parse();

        const config = controls.reduce((config, control) => {
            const controlValue = control.handle(document.getElementById(control.id).value);
            return Object.assign(config, controlValue)
        }, {});

        toggleLoader(true)
        setTimeout(() => {
            handleParsedObjFile(parsedObjFile, config)
                .then(() => {
                    toggleLoader(false);
                });
        }, 100);
    };
}

export function initTabs(defaultTabIndex = 0) {

    const getTabItemTemplate = (tabName) => `<li class="nav-item"><a class="nav-link">${tabName}</a></li>`;

    let tabsTemplate = LabFactory.labs
        .map(lab => getTabItemTemplate("Lab " + lab.name.match(/([0-9])\w*/)[0]))
        .join("");

    document
        .getElementById("navbarSupportedContent")
        .insertAdjacentHTML("afterbegin", `<ul class="navbar-nav me-auto mb-2 mb-lg-0">${tabsTemplate}</ul>`);

    const tabs = document
        .getElementById("navbarSupportedContent")
        .firstElementChild
        .getElementsByTagName("LI");

    for (let i = 0, tabItem = tabs.item(i); i < tabs.length; tabItem = tabs.item(++i)) {

        tabItem.onclick = () => {
            switchTabs(tabItem, () => {
                const labInstance = LabFactory.getLabInstanceByTabName(tabItem.firstElementChild.innerText);
                toggleLoader(true)
                setTimeout(() => {
                    labInstance.run();
                    toggleLoader(false)
                }, 100);
            });
        }

        if (i === defaultTabIndex) {
            tabItem.onclick();
        }
    }
}
