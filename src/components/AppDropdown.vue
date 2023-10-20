<script setup lang="ts">
import { toRefs } from "vue";

interface AppDropdownProps {
    id: string;
    selectionList: Array<any>;
    modelValue: string;
    label?: string;
}

defineProps<AppDropdownProps>();

const emits = defineEmits<{
  (eventName: 'update:modelValue', value: string | number): void;
}>();

function onSelect($event): void {
    let value = ($event.target as HTMLInputElement).value;
    emits('update:modelValue', value);
}
</script>

<template>
    <div class="flex flex-col justify-center text-center">
        <label :for=id>{{ label }}</label>
        <select :id="id" class="mx-4 text-lg font-bold border-2 border-black rounded-md p-2 text-center" @change="onSelect" :value="modelValue">
            <option v-for="item in selectionList" :key="item" :value="item">{{ item }}</option>
        </select>
    </div>
</template>