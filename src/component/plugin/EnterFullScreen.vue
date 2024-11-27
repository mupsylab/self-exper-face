<script setup lang="ts">
import { ElButton } from 'element-plus';
import { JsPsych } from '../../utils/jsPsych/jsPsych';


const end = () => {
    const doc: any = document;
    const docEl: any = document.documentElement;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
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
    } else {
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
</script>

<template>
    <div class="plugin-box">
        <ElButton @click="end">点击进入全屏</ElButton>
    </div>
</template>