import { BaseDictionary, StringDictionary } from "../../../../type/interface";
import { DataCollection } from "./DataCollection";
import { getQueryString } from "./utils";

export class Data {
    private results: DataCollection = new DataCollection();
    private dataProperties: BaseDictionary = {};
    private queryString: StringDictionary = {};

    constructor() {
        this.reset();
    }

    reset() {
        this.results = new DataCollection();
        this.dataProperties = {};
        this.queryString = {};
    }
    get() {
        return this.results;
    }
    write(data_obj: BaseDictionary) {
        Object.assign(data_obj, this.dataProperties);
        this.results.push(data_obj);
    }
    addProperties(properties: BaseDictionary) {
        this.results.addToAll(properties);
        this.dataProperties = Object.assign({}, this.dataProperties, properties);
    }
    addDataToLastTrial(data: BaseDictionary) {
        this.results.addToLast(data);
    }
    urlVariables() {
        if (Object.keys(this.queryString).length == 0) {
            this.queryString = getQueryString();
        }
        return this.queryString;
    }
    getURLVariable(whichvar: string | number) {
        return this.urlVariables()[whichvar];
    }
    getDisplayData(format = "json") {
        format = format.toLowerCase();
        if (format !== "json" && format !== "csv") {
            console.log("Invalid format declared for displayData function. Using json as default.");
            format = "json";
        }
        return format === "json" ? this.results.json(true) : this.results.csv();
    }
    getLastTrialData() {
        return this.results.top();
    }
}