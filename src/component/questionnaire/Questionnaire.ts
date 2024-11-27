import type { FormItemRule } from 'element-plus'

interface BaseQues {
    readonly name: string;
    readonly id?: string;
    readonly title?: string;
    readonly disabled?: boolean;
    readonly required?: boolean;
    readonly valid?: FormItemRule[]
}

interface DescQues extends BaseQues {
    readonly type: "desc";
    readonly desc: string;
}

// 基础填空题
interface TextQues extends BaseQues {
    readonly type: "text";
    readonly placeholder?: string;
    readonly readonly?: boolean;
    readonly showPassword?: boolean;
}

// 基础单选题
interface RadioQues extends BaseQues {
    readonly type: "radio";
    readonly choices: string[] | number[]
}

// 基础多选题
interface CheckboxQues extends BaseQues {
    readonly type: "checkbox";
    readonly choices: string[] | number[]
}

// 选择单选题
interface SwitchQues extends BaseQues {
    readonly type: "switch";
    readonly choices: string[]
}

// 日期选择题
interface DateQues extends BaseQues {
    readonly type: "date";
}

// 时间选择题
interface TimeQues extends BaseQues {
    readonly type: "time";
}

// 基础数字题
interface NumberQues extends BaseQues {
    readonly type: "number";
    readonly placeholder?: string;
    readonly readonly?: boolean;
}

// 滑块题
interface SliderQues extends BaseQues {
    readonly type: "slider";
    readonly min?: number;
    readonly max?: number;
    readonly step?: number;
}

// 评分题
interface RatingQues extends BaseQues {
    readonly type: "rating";
    readonly max?: number;
}

type Ques =
    | DescQues
    | TextQues
    | RadioQues
    | CheckboxQues
    | SwitchQues
    | DateQues
    | TimeQues
    | NumberQues
    | SliderQues
    | RatingQues;

export type { Ques };
