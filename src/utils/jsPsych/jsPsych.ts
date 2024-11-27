import { Data } from "./module/data";
import { KeyboardListenerAPI, TimerAPI } from "./module/plugin-api";
import { TimelineArray, TimelineDescription } from "./timeline";
import { Timeline } from "./timeline/Timeline";

export class JsPsych {
    private static only_instance: JsPsych | undefined;
    public static plugin = {
        timer: new TimerAPI(),
        keyboard: new KeyboardListenerAPI()
    };
    private timeline: Timeline;
    public data: Data = new Data();

    constructor() {
        this.data.reset();
        this.timeline = new Timeline([], document.documentElement);
        JsPsych.plugin.keyboard.registerListener();
    }
    load(timeline: TimelineDescription | TimelineArray, dom: HTMLElement) {
        this.timeline = new Timeline(timeline, dom);
    }
    next() {
        this.timeline.next();
    }
    run() {
        this.timeline.run();
    }
    get currTrial() {
        return this.timeline.getActivateTrial();
    }
    get currTime() {
        return new Date().getTime();
    }
    static get instance() {
        if (JsPsych.only_instance === undefined) JsPsych.only_instance = new JsPsych();
        return JsPsych.only_instance;
    }
}