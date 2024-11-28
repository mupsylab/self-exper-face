<script setup lang="ts">
import { ElButton } from 'element-plus';
import { JsPsych } from '../../utils/jsPsych/jsPsych';
import { onMounted } from 'vue';

const props = defineProps({
    model: {
        type: Boolean,
        default: false
    },
    msg: {
        type: String,
        default: "欢迎参与实验"
    },
    button_label: {
        type: String,
        default: "点击进入全屏"
    }
});

const end = () => {
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (props.model && !doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
        // 进入全屏
        if (docEl.requestFullscreen) {
            docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) { // Safari
            docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) { // Firefox
            docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) { // IE/Edge
            docEl.msRequestFullscreen();
        }
    }

    if (!props.model && (
        doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement
    )) {
        // 退出全屏
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) { // Safari
            doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) { // Firefox
            doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) { // IE/Edge
            doc.msExitFullscreen();
        }
    }

    JsPsych.instance.currTrial.finish({
        trial_type: "fullscreen"
    });
}
onMounted(() => {
    if(!props.model) {end();}
});
</script>

<template>
    <div class="plugin-box">
        <div class="title">{{ props.msg }}</div>
        <ElButton @click="end">{{ props.button_label }}</ElButton>
    </div>
</template>

<style scoped>
.title {
    font-size: 24px;
    line-height: 32px;
    margin: 24px 0;
}
</style>