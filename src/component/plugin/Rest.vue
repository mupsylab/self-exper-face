<script setup lang="ts">
import { JsPsych } from '../../utils/jsPsych/jsPsych';

const end = (c: boolean) => {
    JsPsych.instance.currTrial.finish({
        trial_type: "judge_trial",
        go: c
    });
}
</script>

<template>
    <div class="plugin-box">
        <div class="button-box">
            <div @click="end(true)">继续</div>
            <div @click="end(false)" style="background-color: var(--fc-error-bg);">结束</div>
            <div @click="end(true)">继续</div>
        </div>
    </div>
</template>

<style scoped>
.button-box > div {
    width: 96px;
    height: 48px;
    margin: 48px 0;
    font-size: 32px;
    line-height: 48px;
    text-align: center;
    background-color: var(--fc-success-bg);
    user-select: none;
    cursor: pointer;
}
</style>