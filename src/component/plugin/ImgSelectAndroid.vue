<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { JsPsych } from '../../utils/jsPsych/jsPsych';

let invalidClick = 0; // 无效点击次数统计
let startTime = 0;
let ready: { img: HTMLImageElement, pos: "left" | "right" }[] = [];

const props = defineProps({
    imgL: { type: String, default: "" },
    imgR: { type: String, default: "" }
});

const canvasWidth = ref(800);
const canvasHeight = ref(300);
const isPortrait = ref(false); // 是不是横屏
const resizeCanvas = () => {
    const { clientWidth, clientHeight } = document.documentElement;
    canvasWidth.value = Math.min(clientWidth * 0.8, 800);
    canvasHeight.value = clientHeight * 0.8;
    // 根据设备屏幕尺寸调整画布大小
    if (clientHeight > clientWidth) {
        // 竖屏模式
        isPortrait.value = true;
    } else {
        // 横屏模式
        isPortrait.value = false;
    }
    // 更新 canvas 元素的大小
    if (render.value) {
        render.value.width = canvasWidth.value;
        render.value.height = canvasHeight.value;
    }
    // 更新绘制
    drawImg();
};

const render = ref<HTMLCanvasElement>();
const mouseClick = (e: MouseEvent) => {
    const rt = new Date().getTime() - startTime;
    const { top, left } = render.value!.getBoundingClientRect();
    const { clientX, clientY } = e;

    const { x, y } = {
        x: clientX - left,
        y: clientY - top
    }; // 偏移量

    if (startTime === 0 || rt < 100) {
        invalidClick += 1;
        return;
    }
    const detectPos = clickDetect(x, y);
    if (detectPos) {
        JsPsych.instance.currTrial.finish({
            trial_type: "img_select",
            rt: rt,
            response: detectPos,
            invalid_click: invalidClick
        });
    } else {
        invalidClick += 1;
    }
}
const keyboardClick = (e: KeyboardEvent) => {
    const {key} = e;
    const rt = new Date().getTime() - startTime;
    if (startTime === 0 || rt < 100) {
        invalidClick += 1;
        return;
    }
    if (key == "ArrowLeft") {
        JsPsych.instance.currTrial.finish({
            trial_type: "img_select",
            rt: rt,
            response: "left",
            invalid_click: invalidClick
        });
    } else if (key == "ArrowRight") {
        JsPsych.instance.currTrial.finish({
            trial_type: "img_select",
            rt: rt,
            response: "right",
            invalid_click: invalidClick
        });
    } else {
        invalidClick += 1;
    }
}
JsPsych.plugin.keyboard.addListener(keyboardClick);
const clickDetect = (x: number, y: number) => {
    const leftPos = calcImgPos("left");
    const rightPos = calcImgPos("right");
    if (
        x > leftPos.x && x < leftPos.x + leftPos.w &&
        y > leftPos.y && y < leftPos.y + leftPos.h
    ) {
        return "left"
    }
    if (
        x > rightPos.x && x < rightPos.x + rightPos.w &&
        y > rightPos.y && y < rightPos.y + rightPos.h
    ) {
        return "right"
    }
    return undefined;
}
const calcImgPos = (pos: "left" | "right") => {
    const offset = 100;
    const avaW = (isPortrait.value ? canvasHeight.value : canvasWidth.value) - offset; // canvas的宽
    const avaH = (isPortrait.value ? canvasWidth.value : canvasHeight.value); // canvas的可用高

    if (avaW / 2 >= avaH) {
        // 可以呈现完全
        return {
            x: isPortrait.value ? 0 : (pos == "left" ? 0 : avaW - avaH + offset),
            y: isPortrait.value ? (pos == "left" ? 0 : avaW - avaH + offset) : 0,
            w: avaH,
            h: avaH
        }
    } else {
        // 不能完全呈现，需要缩放
        return {
            x: isPortrait.value ? (avaH - avaW / 2) / 2 : (pos == "left" ? 0 : avaW / 2 + offset),
            y: isPortrait.value ? (pos == "left" ? 0 : avaW / 2 + offset) : (avaH - avaW / 2) / 2,
            w: avaW / 2,
            h: avaW / 2
        }
    }
}
const drawImg = () => {
    if (ready.length < 2) return;
    if (!render.value) return;
    const ctx = render.value.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    const offset = 10;
    ready.forEach(item => {
        const { img, pos } = item;
        const l = calcImgPos(pos);
        ctx.drawImage(img, offset, offset, img.width - offset * 2, img.height - offset * 2, l.x, l.y, l.w, l.h);
    });
}
onMounted(() => {
    document.documentElement.addEventListener("pointerdown", mouseClick);
    window.addEventListener("resize", resizeCanvas);

    const imgL = new Image();
    imgL.src = props.imgL;
    imgL.onload = () => {
        ready.push({ img: imgL, pos: "left" });
        startTime = new Date().getTime();
        drawImg();
    }
    const imgR = new Image();
    imgR.src = props.imgR;
    imgR.onload = () => {
        ready.push({ img: imgR, pos: "right" });
        startTime = new Date().getTime();
        drawImg();
    }
    resizeCanvas();
});
onUnmounted(() => {
    document.documentElement.removeEventListener("pointerdown", mouseClick);
    window.removeEventListener("resize", resizeCanvas);
});
</script>

<template>
    <div class="plugin-box">
        <canvas ref="render"></canvas>
    </div>
</template>

<style scoped>
canvas {
    display: block;
    margin: auto;
}
</style>