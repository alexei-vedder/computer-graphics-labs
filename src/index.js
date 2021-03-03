import {runLab1} from "./lab1";
import {runLab2} from "./lab2";
import {toggleLoader} from "./utils";

function switchTabs(tab) {
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
    switch (tab.innerText) {
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
console.log(navbarList.childNodes);
navbarList.childNodes.forEach(node => {
    if (node.nodeName === "LI") {
        node.onclick = () => {
            switchTabs(node.childNodes[1]);
        }

        if (node.childNodes[1].innerText === "Lab 2") {
            switchTabs(node.childNodes[1]);
        }
    }
})
