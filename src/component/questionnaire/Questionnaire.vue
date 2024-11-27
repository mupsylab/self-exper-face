<script setup lang="ts">
import { ElButton, ElForm, ElSelect, ElSlider, ElOption, ElFormItem, ElInput, ElRadioGroup, ElRadio, ElCheckboxGroup, ElCheckbox, ElDivider, ElDatePicker, ElTimePicker, ElConfigProvider, ElRate } from "element-plus";
import type { FormInstance, FormRules, FormItemRule } from 'element-plus'
import { reactive, ref, toRaw } from "vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
const locale = zhCn;

import { Ques } from "./Questionnaire";

const emits = defineEmits(["endTrial"]);
const props = defineProps<{ ques: Ques[] }>();
const propQues: Ques[] = props.ques ?? [];

const form = reactive((function () {
    const obj: { [key: string]: any } = {};
    propQues.forEach(item => {
        if (item.type === "checkbox") {
            obj[item.name] = [];
        } else {
            obj[item.name] = "";
        }
    });
    return obj;
})());
const rules = reactive<FormRules>((function () {
    const obj: { [key: string]: Array<FormItemRule> } = {};
    propQues.forEach(item => {
        obj[item.name] = [];
        item.valid?.forEach(rule => {
            obj[item.name].push(rule);
        });
    });
    return obj;
})());

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            emits("endTrial", toRaw(form));
        } else {
            console.warn(fields)
        }
    })
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}
const formRef = ref<FormInstance>();
</script>

<template>
    <div class="questionnaire">
        <ElForm ref="formRef" status-icon :rules="rules" :model="form" @submit.prevent label-position="top"
            size="large">
            <template v-for="ques in propQues" :key="ques.name">
                <div class="question-title">{{ ques.title }}</div>
                <ElFormItem :prop="ques.name">
                    <template v-if="ques.type == 'desc'">
                        <div class="question-desc" v-html="ques.desc"></div>
                    </template>
                    <template v-if="ques.type == 'text'">
                        <ElInput :name="ques.name" :readonly="ques.readonly ?? false"
                            :show-password="ques.showPassword ?? false" :placeholder="ques.placeholder"
                            v-model="form[ques.name]" />
                    </template>
                    <template v-if="ques.type == 'number'">
                        <ElInput type="number" :name="ques.name" :placeholder="ques.placeholder"
                            v-model="form[ques.name]" />
                    </template>
                    <template v-if="ques.type == 'radio'">
                        <ElRadioGroup v-model="form[ques.name]">
                            <div v-for="choice, _ in ques.choices">
                                <ElRadio size="large" :value="choice" :label="choice" />
                            </div>
                        </ElRadioGroup>
                    </template>
                    <template v-if="ques.type == 'checkbox'">
                        <ElCheckboxGroup v-model="form[ques.name]">
                            <div v-for="choice, _ in ques.choices">
                                <ElCheckbox :value="choice" :label="choice" />
                            </div>
                        </ElCheckboxGroup>
                    </template>
                    <template v-if="ques.type == 'switch'">
                        <ElSelect v-model="form[ques.name]">
                            <ElOption v-for="choice, _ in ques.choices" :label="choice" :value="choice"></ElOption>
                        </ElSelect>
                    </template>
                    <template v-if="ques.type == 'date'">
                        <ElConfigProvider :locale="locale">
                            <ElDatePicker v-model="form[ques.name]" format="YYYY/MM/DD" value-format="YYYY/MM/DD" />
                        </ElConfigProvider>
                    </template>
                    <template v-if="ques.type == 'time'">
                        <ElTimePicker v-model="form[ques.name]" placeholder="选择时间" />
                    </template>
                    <template v-if="ques.type == 'slider'">
                        <ElSlider v-model="form[ques.name]" :min="ques.min" :max="ques.max" :step="ques.step" />
                    </template>
                    <template v-if="ques.type == 'rating'">
                        <ElRate v-model="form[ques.name]" :max="ques.max" />
                    </template>
                </ElFormItem>
                <ElDivider />
            </template>
            <div style="text-align: center;">
                <ElButton type="danger" @click="resetForm(formRef);">{{locale.el.colorpicker.clear}}</ElButton>
                <ElButton type="primary" @click="submitForm(formRef);">{{locale.el.colorpicker.confirm}}</ElButton>
            </div>
        </ElForm>
    </div>
</template>

<style scoped>
.questionnaire {
    max-width: 380px;
    padding: 100px 0;
    text-align: left;
    user-select: none;
}

.question-title {
    margin: 0 0 15px 0;
    font-size: 19px;
    line-height: 1.5em;
}

.question-desc {
    font-size: 16px;
    line-height: 24px;
}
</style>
