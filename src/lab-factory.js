import {Lab1} from "./lab1";
import {Lab2} from "./lab2";
import {Lab3} from "./lab3";

export class LabFactory {

    static labs = [Lab1, Lab2, Lab3];

    static getLabInstanceByTabName(tabName) {
        const labClass = LabFactory.labs.find(lab => lab.name.includes(tabName.match(/([0-9])\w*/)[0]));
        return new labClass();
    }
}
