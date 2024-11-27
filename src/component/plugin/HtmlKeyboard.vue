<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';

const props = defineProps({
    stimulus: {
        type: String,
        default: ""
    },
    stimulus_duration: {
        type: Number,
        default: 0
    },
    trial_duration_time: {
        type: Number,
        default: 0
    },
    response_ends_trial: {
        type: Boolean,
        default: true
    },
    choices: {
        type: Array<String>,
        default: ["ALL_KEYS"]
    }
});

const keyboard = (e: KeyboardEvent, time: number) => {
    const key = JsPsych.plugin.keyboard.transforCaseToLower(e.key);
    if(props.choices.indexOf("NO_KEYS") >= 0) { return 0; }
    if(props.choices.indexOf("ALL_KEYS") >= 0 || props.choices.indexOf(key) >= 0) {
        const result = {
            rt: JsPsych.instance.currTrial.getIntervalTime(time),
            response: key,
            stimulus: props.stimulus
        };
        end(false, result);
    }
};
JsPsych.plugin.keyboard.addListener(keyboard);
const end = (timer = false, result = {}) => {
    const data = {
        trial_type: "html-keyboard",
        ...result
    };
    if (props.response_ends_trial && !timer) {
        JsPsych.instance.currTrial.finish(data);
    }
    if (timer) {
        JsPsych.instance.currTrial.finish(data);
    }
}

const dom = ref<HTMLDivElement>();
onMounted(() => {
    if (props.trial_duration_time > 0) {
        JsPsych.plugin.timer.setTimeout(() => {
            end(true);
        }, props.trial_duration_time);
    }
    if (props.stimulus_duration > 0) {
        JsPsych.plugin.timer.setTimeout(() => {
            dom.value?.classList.add("hidden");
            dom.value?.attributes.setNamedItem(document.createAttribute("hidden"));
        }, props.stimulus_duration);
    }
});
</script>

<template>
    <div class="plugin-box" ref="dom">
        <div v-html="props.stimulus"></div>
    </div>
</template>

<style scoped>
.plugin-box {
    font-size: 48px;
    line-height: 64px;
}
</style>