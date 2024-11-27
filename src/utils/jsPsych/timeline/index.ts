import { VNode } from "vue";
import { DataCollection } from "../module/data/DataCollection";
import { Trial } from "./Trial";

export type SampleOptions =
    | { type: "with-replacement"; size: number; weights?: number[] }
    | { type: "without-replacement"; size: number }
    | { type: "fixed-repetitions"; size: number }
    | { type: "alternate-groups"; groups: number[][]; randomize_group_order?: boolean }
    | { type: "custom"; fn: (ids: number[]) => number[] };

export class TimelineVariable {
    constructor(public readonly name: string) { }
}

export type Parameter<T> = T | (() => T) | TimelineVariable;
export type TimelineArray = Array<TimelineDescription | TrialDescription>;

export interface TimelineDescription extends Record<string, any> {
    timeline: TimelineArray;
    timeline_variables?: Record<string, any>[];

    name?: string;

    repetitions?: number;
    loop_function?: (data: DataCollection) => boolean;
    conditional_function?: () => boolean;

    randomize_order?: boolean;
    sample?: SampleOptions;

    on_timeline_start?: () => void;
    on_timeline_finish?: () => void;
}

export interface TrialDescription extends Record<string, any> {
    component: VNode | ((trial: Trial) => VNode);

    on_start?: (trial: Trial) => void;
    on_load?: (component: VNode) => void;
    on_finish?: (data: TrialResult) => void;
}

export function isTrialDescription(
    description: TrialDescription | TimelineDescription
): description is TrialDescription {
    return !isTimelineDescription(description);
}

export function isTimelineDescription(
    description: TrialDescription | TimelineDescription | TimelineArray
): description is TimelineDescription | TimelineArray {
    return Boolean((description as TimelineDescription).timeline) || Array.isArray(description);
}

export enum TimelineNodeStatus {
    PENDING,
    RUNNING,
    PAUSED,
    COMPLETED,
    ABORTED,
  }

export type TrialResult = Record<string, any>;
export type TrialResults = Array<TrialResult>;