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
            <div class="text">休息一下吧，当你休息完成后，点击继续按钮</div>
            <div class="button" @click="end(true)">继续</div>
        </div>
    </div>
</template>

<style scoped>
.text {
    font-size: 24px;
    line-height: 32px;
}
.button {
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