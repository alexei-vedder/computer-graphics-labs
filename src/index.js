/**
 * In order to use async/await without "regeneratorRuntime is not defined" error
 * See https://flaviocopes.com/parcel-regeneratorruntime-not-defined/
 */
import "regenerator-runtime/runtime";

import {runLab1} from "./lab1";
import {runLab2} from "./lab2";
import {switchTabs, toggleLoader} from "./utils";

function onTabClick() {
    switch (this.node.childNodes[1].innerText) {
        case "Lab 1": {
            toggleLoader(true)
            setTimeout(() => {
                runLab1();
                toggleLoader(false)
            }, 100)
            break;
        }
        case "Lab 2": {
            toggleLoader(true);
            setTimeout(() => {
                runLab2();
                toggleLoader(false)
            }, 100)
            break;
        }
    }
}

const navbarList = document.getElementById("navbarSupportedContent").firstElementChild;
navbarList.childNodes.forEach(node => {
    if (node.nodeName === "LI") {
        node.onclick = () => {
            switchTabs(node.childNodes[1], onTabClick.bind({node}));
        }

        // setting default tab
        if (node.childNodes[1].innerText === "Lab 2") {
            switchTabs(node.childNodes[1], onTabClick.bind({node}));
        }
    }
})
