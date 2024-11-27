<template>
    <div>
        <table>
            <thead>
                <th>属性</th>
                <th>值</th>
            </thead>
            <tbody>
                <tr v-for="val, key in browser">
                    <td>{{ key }}</td>
                    <td>{{ val }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCheckBrowserInfo } from "../store/browserCheck";

const cbi = useCheckBrowserInfo();
const { browser } = storeToRefs(cbi);
</script>

<style scoped>
tr:nth-child(odd) {
    background-color: var(--dashboard-layout);
}
td:nth-child(even) {
    max-width: 250px;
}
</style>