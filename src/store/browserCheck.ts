import browser from "browser-tool";
import { defineStore } from "pinia";

export const useCheckBrowserInfo = defineStore("browser-info", {
    state() {
        const browser: Record<string, string> = {};
        return {
            isInit: false,
            browser
        };
    },
    actions: {
        init() {
            browser.getInfo().then((r) => {
                Object.keys(r).forEach(k => {
                    this.browser[k] = r[k];
                });
                this.isInit = true;
            });
        }
    }
});