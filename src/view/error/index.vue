<template>
    <div class="error-box">
        <div class="text">
            <div class="code">{{ errCode }}</div>
            <div class="desc">{{ errMsg }}</div>
        </div>
        <div class="footer">
            &copy; Mupsy 技术支持
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();
const errCode = route.params.pathMatch?.[0] || "404";
const errMsg = route.params.pathMatch?.[1] || "未知页面";
</script>

<style scoped>
.text .code {
    font-size: 48px;
    line-height: 48px;
    color: var(--fc-error-color);
}
.text .desc {
    font-size: 24px;
    line-height: 36px;
    color: var(--font-desc);
}
.error-box .footer {
    text-align: center;
    color: var(--font-desc);
}
</style>