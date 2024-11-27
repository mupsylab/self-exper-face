// KeyboardListener.ts

import { JsPsych } from "../../jsPsych";

type KeyboardEventHandler = (event: KeyboardEvent, time: number) => void;

class KeyboardListenerAPI {
    private dom: HTMLElement = document.documentElement;
    private listeners: Set<KeyboardEventHandler> = new Set();
    private holdKey: Set<string>  = new Set();

    private CaseSensority = false;

    constructor() {
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    public transforCaseToLower(s: string) {
        return this.CaseSensority ? s : s.toLowerCase();
    }

    public addListener(listener: KeyboardEventHandler) {
        this.listeners.add(listener);
    }
    public removeListener(listener: KeyboardEventHandler) {
        this.listeners.delete(listener);
    }
    public removeAllListener() {
        this.listeners.clear();
    }
    public isKeyPress(key: string) {
        return this.holdKey.has(this.transforCaseToLower(key));
    }

    private handleKeyDown(e: KeyboardEvent) {
        const time = JsPsych.instance.currTime;
        const {key} = e;
        for(const listener of this.listeners) {
            listener(e, time);
        }
        this.holdKey.add(this.transforCaseToLower(key));
    }
    private handleKeyUp(e: KeyboardEvent) {
        const {key} = e;
        this.holdKey.delete(this.transforCaseToLower(key));
    }

    registerListener() {
        this.dom.addEventListener("keydown", this.handleKeyDown);
        this.dom.addEventListener("keyup", this.handleKeyUp);
    }
    destoryListener() {
        this.dom.removeEventListener("keydown", this.handleKeyDown);
        this.dom.removeEventListener("keyup", this.handleKeyUp);
    }
}

export { KeyboardListenerAPI };
