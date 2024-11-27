import { nextTick, render, VNode } from "vue";
import { TrialDescription, TrialResult, TrialResults } from ".";
import { Timeline } from "./Timeline";
import { TimelineNode } from "./TimelineNode";
import { JsPsych } from "../jsPsych";

export class Trial extends TimelineNode {
    public readonly description: TrialDescription;
    private results: TrialResults;
    private id: number;

    private trial_start_time: number = -1;
    private trial_finish_time: number = -1;

    constructor(description: TrialDescription, public readonly parent: Timeline, index: number = 0) {
        super();
        this.description = description;
        this.results = [];
        this.id = index;
    }

    run() {
        if (this.description.on_start) this.description.on_start(this);
        const component: VNode = typeof this.description.component === "function" ? this.description.component(this) : this.description.component;
        render(component, this.parent.getDisplayDom());
        nextTick(() => {
            this.trial_start_time = JsPsych.instance.currTime;
            if (this.description.on_load) this.description.on_load(component);
        });
    }
    finish(data: TrialResult) {
        JsPsych.plugin.timer.clearAllTimer();
        JsPsych.plugin.keyboard.removeAllListener();
        render(null, this.parent.getDisplayDom());
        nextTick(() => {
            this.trial_finish_time = JsPsych.instance.currTime;
            Object.assign(data, {
                trial_id: this.getCurrId(),
                trial_start_time: this.trial_start_time,
                trial_finish_time: this.trial_finish_time
            });
            if (this.description.on_finish) this.description.on_finish(data);
            this.write(data);

            this.parent.getTopTimeline().next();
            this.parent.getTopTimeline().run();
        });
    }
    getIntervalTime(time: number) {
        return time - this.trial_start_time;
    }
    getCurrId() {
        return `${this.parent.getCurrId()}-${this.id}`
    }
    getResults() {
        return this.results;
    }
    write(data: TrialResult) {
        this.results.push(data);
        JsPsych.instance.data.write(data);
    }
}