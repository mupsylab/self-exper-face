<script setup lang="ts">
import { ElButton } from 'element-plus';
import { JsPsych } from '../../../utils/jsPsych/jsPsych';

const end = () => {
    JsPsych.instance.currTrial.finish({
        trial_type: "instruction_prac"
    });
}
</script>

<template>
    <div class="plugin-box">
        <div class="title">实验说明</div>
        <div>接下来你会看到两个图片，你需要选择两个当中最符合<strong>女性化面孔</strong>的图片</div>
        <div>你可以用触屏、鼠标点击、键盘左右按键来选择你认为较为女性化的面孔</div>
        <div>点击继续，进入练习阶段</div>
        <ElButton type="primary" @click="end">继续</ElButton>
    </div>
</template>

<style scoped>
.plugin-box>div {
    margin: 16px 0;
    font-size: 24px;
    line-height: 32px;
}

.plugin-box .title {
    text-align: center;
    font-size: 48px;
    line-height: 64px;
}

</style>