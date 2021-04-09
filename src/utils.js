import {saveAs} from "file-saver";
import {ceil, cross, divide, dot, min, sqrt, square} from "mathjs";
import {LabFactory} from "./lab-factory";

export function createImage(name = "image", width = 200, height = 200) {
    const canvas = document.createElement("canvas");
    canvas.classList.add("image");
    canvas.title = "Click to download";
    canvas.width = width;
    canvas.height = height;

    document
        .getElementById("image-container")
        .insertAdjacentElement("beforeend", canvas);

    canvas.addEventListener("click", () => {
        const dataURL = canvas.toDataURL();
        saveAs(dataURL, `${name}.png`);
    });

    return canvas;
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

function switchTabs(tab, callback) {
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

function onTabClick() {
    switchTabs(this.tabItem, () => {
        const labInstance = LabFactory.getLabInstanceByTabName(this.tabItem.firstElementChild.innerText);
        toggleLoader(true)
        setTimeout(() => {
            labInstance.run();
            toggleLoader(false)
        }, 100);
    });
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

        tabItem.onclick = onTabClick.bind({tabItem});

        if (i === defaultTabIndex) {
            tabItem.onclick();
        }
    }
}

export async function asyncForOf(array, callback, chunkSize = 100) {
    let i = 0;
    const chunksTotal = ceil(array.length / chunkSize);
    for (let chunkNum = 1; chunkNum <= chunksTotal; ++chunkNum) {
        setTimeout(() => {

            /* only for this project, remove if use this function in another one */
            if (chunkNum === 1) {
                toggleLoader(true);
            }

            for (; i < min(chunkSize * chunkNum, array.length); ++i) {
                callback(array[i], i);
            }

            /* only for this project, remove if use this function in another one */
            if (chunkNum === chunksTotal) {
                toggleLoader(false);
            }

        }, 1);
    }
}

/**
 * @param polygonVertices {Vertex[]}
 * @return {[number, number, number]}
 */
export function findNormal(polygonVertices) {
    return cross(
        [
            polygonVertices[1].x - polygonVertices[0].x,
            polygonVertices[1].y - polygonVertices[0].y,
            polygonVertices[1].z - polygonVertices[0].z
        ], [
            polygonVertices[1].x - polygonVertices[2].x,
            polygonVertices[1].y - polygonVertices[2].y,
            polygonVertices[1].z - polygonVertices[2].z
        ]
    );
}

/**
 * @param normal {[number, number, number]}
 * @param lightDirection {[number, number, number]}
 * @return {number}
 */
export function findCosineOfAngleOfIncidence(normal, lightDirection) {
    return divide(
        dot(normal, lightDirection),
        sqrt(square(normal[0]) + square(normal[1]) + square(normal[2]))
        * sqrt(square(lightDirection[0]) + square(lightDirection[1]) + square(lightDirection[2]))
    );
}
