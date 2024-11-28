import { TimelineArray, TimelineDescription, TimelineNodeStatus, TrialDescription, TrialResults } from ".";
import { DataCollection } from "../module/data/DataCollection";
import { repeat, sampleWithoutReplacement, sampleWithReplacement, shuffle, shuffleAlternateGroups } from "../module/randomization";
import { TimelineNode } from "./TimelineNode";
import { Trial } from "./Trial";

export class Timeline extends TimelineNode {
    public readonly description: TimelineDescription;
    private childNodes: TimelineNode[];
    private timeline_variables: number[]; // 变量的顺序
    private id: number;

    private status: TimelineNodeStatus = TimelineNodeStatus.PENDING;
    private cursor_node: number = 0; // 试次的顺序
    private cursor_variable: number = 0; // 变量的顺序
    private cursor_repetition: number = 0; // 循环的顺序

    constructor(
        description: TimelineDescription | TimelineArray,
        public readonly parent?: Timeline | HTMLElement,
        id: number = 0
    ) {
        super();

        this.id = id;
        this.description = Array.isArray(description) ? { timeline: description } : description;
        this.childNodes = this.description.timeline.map(
            (item, index) => Object.hasOwn(item, "timeline") ? new Timeline(item as TimelineDescription, this, index) : new Trial(item as TrialDescription, this, index)
        );
        this.timeline_variables = this.generateTimelineVariableOrder();
        this.reset();
    }

    reset() {
        this.cursor_node = 0;
        this.cursor_variable = 0;
        this.cursor_repetition = 0;

        for(const childNode of this.childNodes) {
            if (childNode instanceof Timeline) {
                childNode.reset();
            }
        }
        this.status = TimelineNodeStatus.RUNNING;
    }
    run() {
        if(this.status !== TimelineNodeStatus.RUNNING) return 0;
        const { conditional_function} = this.description;
        if (!conditional_function || conditional_function()) {
            if (this.description.on_timeline_start) this.description.on_timeline_start();

            this.childNodes[this.cursor_node].run();

            if (this.description.on_timeline_finish) this.description.on_timeline_finish();
        }
    }
    next() {
        if(this.status !== TimelineNodeStatus.RUNNING) return 0;
        const { loop_function, repetitions = 1 } = this.description;
        if(this.childNodes[this.cursor_node] instanceof Timeline) {
            // 如果子节点也是timeline, 则需要先跑完子节点的时间线
            const childNode = this.childNodes[this.cursor_node] as Timeline;
            childNode.next();
            if(childNode.getStatus() === TimelineNodeStatus.RUNNING) return 0;
        }
        this.cursor_node += 1;
        if(this.cursor_node >= this.childNodes.length) {
            // 一轮完毕
            this.cursor_node = 0;
            this.cursor_variable += 1;
            if (this.cursor_variable && this.cursor_variable % this.timeline_variables.length === 0) {
                // 变量循环完毕
                this.cursor_variable = 0;
                this.cursor_repetition += 1;
                if(this.cursor_repetition >= repetitions) {
                    // 需要结束当前轮次，判断是否需要重置
                    if(loop_function && loop_function(new DataCollection(this.getResults()))) {
                        for(const chlid of this.childNodes) {
                            if(chlid instanceof Timeline) chlid.reset();
                        }
                        this.reset();
                        return 0;
                    }

                    this.status = TimelineNodeStatus.COMPLETED;
                    return 0;
                }
                this.timeline_variables = this.generateTimelineVariableOrder();
            }
        }
    }
    getCurrId(): string {
        let id = [];
        if(this.parent instanceof Timeline) {
            id.push(...this.parent.getCurrId().split("-"));
        }
        id.push(this.id);
        return id.join("-");
    }
    getTopTimeline(): Timeline {
        if(this.parent instanceof Timeline) {
            return this.parent.getTopTimeline();
        }
        return this;
    }
    getActivateTrial(): Trial {
        const childNode = this.childNodes[this.cursor_node];
        if (childNode instanceof Timeline) return childNode.getActivateTrial();
        return childNode as Trial;
    }
    getStatus() {
        return this.status;
    }
    getResults() {
        const results: TrialResults = [];
        for (const child of this.childNodes) {
            results.push(...child.getResults());
        }
        return results;
    }
    getDisplayDom(): Element {
        if(this.parent instanceof Timeline) {
            return this.parent.getDisplayDom();
        }
        return this.parent as Element;
    }
    private generateTimelineVariableOrder() {
        const timelineVariableLength = this.description.timeline_variables?.length;
        if (!timelineVariableLength) { return [-1]; }

        let order = [...Array(timelineVariableLength).keys()];
        const sample = this.description.sample;

        if (sample) {
            switch (sample.type) {
                case "custom":
                    order = sample.fn(order);
                    break;

                case "with-replacement":
                    order = sampleWithReplacement(order, sample.size, sample.weights);
                    break;

                case "without-replacement":
                    order = sampleWithoutReplacement(order, sample.size);
                    break;

                case "fixed-repetitions":
                    order = repeat(order, sample.size);
                    break;

                case "alternate-groups":
                    order = shuffleAlternateGroups(sample.groups, sample.randomize_group_order);
                    break;
            }
        }

        if (this.description.randomize_order) {
            order = shuffle(order);
        }

        return order;
    }
    public getAllTimelineVariables(): Record<string, any> {
        return {
            ...this.parent instanceof Timeline ? this.parent.getAllTimelineVariables() : {},
            ...this.description.timeline_variables ? this.description.timeline_variables[this.cursor_variable] : {}
        };
    }
}
