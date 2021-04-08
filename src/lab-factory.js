import {Lab1} from "./labs/lab1";
import {Lab2} from "./labs/lab2";
import {Lab3} from "./labs/lab3";
import {Lab4} from "./labs/lab4";

export class LabFactory {

    static labs = [Lab1, Lab2, Lab3, Lab4];

    static getLabInstanceByTabName(tabName) {
        const labClass = LabFactory.labs.find(lab => lab.name.includes(tabName.match(/([0-9])\w*/)[0]));
        return new labClass();
    }
}
