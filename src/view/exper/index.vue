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

timeline.push({
    component: h(EnterFullScreen)
});

let rrrr = { isLeftAdd: true, noise_index: -1 };
timeline.push({
    timeline: [{
        timeline: [{
            component() {
                return h(HtmlKeyboard, {
                    stimulus: "+",
                    stimulus_duration: 500,
                    trial_duration_time: 1000,
                })
            }
        }, {
            component() {
                if(tmpA.length < 1) tmpA = deepCopy(noises);
                rrrr.isLeftAdd = Math.random() > 0.5;
                rrrr.noise_index = tmpA.splice(Math.floor(Math.random() * tmpA.length), 1)[0];
                const { isLeftAdd, noise_index } = rrrr;
                return h(FaceSelectAndroid, {
                    imgL: `./assets/img/${isLeftAdd ? "add" : "reduce"}/${noise_index}.jpg`,
                    imgR: `./assets/img/${isLeftAdd ? "reduce" : "add"}/${noise_index}.jpg`
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
        if(!r[0].go) return false;
        if(jspsych.data.get().filter({
            save: true
        }).values().length > trial_max) return false;
        return true;
    }
});

timeline.push({
    component: h(EndExp, {
        onEnd() {
            new Session().offlineSave(jspsych.data.get().filter({ save: true }).csv(), getUuid());
        }
    }),
    on_start() {
        console.log(jspsych.data.get().filter({ save: true }).values())
    }
});

onMounted(() => {
    const expDom = document.querySelector("#exp") as HTMLDivElement;
    jspsych.load(timeline, expDom);
    jspsych.run();
});
</script>