<template>
    <div id="exp"></div>
</template>

<script setup lang="ts">
import { h, onMounted } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { TimelineArray } from '../../utils/jsPsych/timeline';

import EndExp from '../../component/endExp.vue';
import HtmlKeyboard from '../../component/plugin/HtmlKeyboard.vue';
import FaceSelectAndroid from '../../component/plugin/ImgSelectAndroid.vue';
import { deepCopy } from '../../utils/jsPsych/module/utils';
import Rest from '../../component/plugin/Rest.vue';
import EnterFullScreen from '../../component/plugin/EnterFullScreen.vue';
import Session from '../../utils/dataSaver/session';
import { getUuid } from '../../utils/jsPsych/module/randomization';
import { ElMessage } from 'element-plus';
import Instr_prac from './instr/instr_prac.vue';
import Instr_form from './instr/instr_form.vue';

const jspsych = JsPsych.instance;
const timeline: TimelineArray = [];

const noises = (function () {
    const len = 10000; const res: number[] = [];
    for (let i = 0; i < len; i++) {
        res.push(i);
    }
    return res;
})(); // 噪音的索引值
const block_len = 70; // 单个block的试次数量
const trial_max = 1000; // 总共trial试次限制
let tmpA = deepCopy(noises);

const fixation = {
    component() {
        return h(HtmlKeyboard, {
            stimulus: "+",
            stimulus_duration: 500,
            trial_duration_time: 1000,
        })
    }
};

timeline.push({
    component: h(EnterFullScreen, {
        model: false
    })
});

let rrrr = { isLeftAdd: true, noise_index: -1 };
// 练习阶段
timeline.push({
    timeline: [{
        component: h(Instr_prac)
    }, {
        timeline: [fixation, {
            component() {
                rrrr.isLeftAdd = Math.random() > 0.5;
                return h(FaceSelectAndroid, {
                    imgL: `https://insula.oss-cn-chengdu.aliyuncs.com/2024112801/img/prac/female${rrrr.isLeftAdd ? "less" : "more"}.jpg`,
                    imgR: `https://insula.oss-cn-chengdu.aliyuncs.com/2024112801/img/prac/female${rrrr.isLeftAdd ? "more" : "less"}.jpg`
                })
            },
            on_finish(data) {
                const { isLeftAdd } = rrrr;
                const cc: { [key: string]: any } = isLeftAdd ? { left: "less", right: "more" } : { left: "more", right: "less" };
                Object.assign(data, {
                    left_pos: cc["left"],
                    right_pos: cc["right"],
                    response_pos: cc[data.response],
                    acc: cc[data.response] == "more" ? 1 : 0,
                    save: true,
                    prac: true
                });
            }
        }],
        repetitions: 5
    }],
    loop_function() {
        const acc = jspsych.data.get().filter({ prac: true }).last(5).select("acc").mean() as number;
        if (acc < 0.8) ElMessage.error("错误率较高，请重新练习");
        return acc < 0.8;
    }
});

// 正式阶段
timeline.push({
    component: h(Instr_form)
});
timeline.push({
    timeline: [{
        timeline: [fixation, {
            component() {
                if (tmpA.length < 1) tmpA = deepCopy(noises);
                rrrr.isLeftAdd = Math.random() > 0.5;
                rrrr.noise_index = tmpA.splice(Math.floor(Math.random() * tmpA.length), 1)[0];
                const { isLeftAdd, noise_index } = rrrr;
                return h(FaceSelectAndroid, {
                    imgL: `https://insula.oss-cn-chengdu.aliyuncs.com/2024112801/img/${isLeftAdd ? "add" : "reduce"}/${noise_index}.jpg`,
                    imgR: `https://insula.oss-cn-chengdu.aliyuncs.com/2024112801/img/${isLeftAdd ? "reduce" : "add"}/${noise_index}.jpg`
                })
            },
            on_finish(data) {
                const { isLeftAdd, noise_index } = rrrr;
                const cc: { [key: string]: any } = isLeftAdd ? { left: "add", right: "reduce" } : { left: "reduce", right: "add" };
                Object.assign(data, {
                    noise_index: noise_index,
                    left_pos: cc["left"],
                    right_pos: cc["right"],
                    response_pos: cc[data.response],
                    save: true
                });
            }
        }],
        repetitions: block_len
    }, {
        component() {
            return h(Rest);
        }
    }],
    loop_function() {
        const r = jspsych.data.get().filter({
            trial_type: "judge_trial"
        }).last(1).values();
        if (!r[0].go) return false;
        if (jspsych.data.get().filter({
            save: true
        }).values().length > trial_max) return false;
        return true;
    }
});

timeline.push({
    component: h(EnterFullScreen, {
        model: false
    })
});

timeline.push({
    component: h(EndExp, {
        onEnd() {
            console.log(jspsych.data.get().filter({ save: true }).values());
        }
    }),
    on_start() {
        new Session().offlineSave(jspsych.data.get().filter({ save: true }).csv(), getUuid());
    }
});

onMounted(() => {
    const expDom = document.querySelector("#exp") as HTMLDivElement;
    jspsych.load(timeline, expDom);
    jspsych.run();
});
</script>