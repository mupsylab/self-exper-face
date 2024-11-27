<script setup lang="ts">
const emits = defineEmits(["end"]);
</script>

<template>
    <div class="end-exp" @click="emits('end');">
        <div class="content-box">
            <div class="title">实验结束</div>
            <div class="desc">点击下载数据</div>
        </div>
        <div class="footer">
            &copy; Mupsy 技术支持
        </div>
    </div>
</template>

<style scoped>
.end-exp {
    text-align: left;
    cursor: pointer;
}
.end-exp .content-box .title {
    font-size: 48px;
    line-height: 64px;
}
.end-exp .content-box .desc {
    font-size: 20px;
    line-height: 32px;
}

.end-exp .footer {
    color: var(--font-desc);
}
</style>