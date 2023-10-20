<script setup lang="ts">

interface AppInputProps {
    id: string;
    modelValue: string | number;
    label?: string;
    placeholder?: string;
}

defineProps<AppInputProps>();

const emits = defineEmits<{
  (eventName: 'update:modelValue', value: string | number): void;
}>();

function onInput($event: Event): void {
  let value = ($event.target as HTMLInputElement).value;
  emits('update:modelValue', value);
}

</script>

<template>
    <label for="time">{{label}}</label>
    <input
        class="border-black border rounded m-2 p-2"
        :id="id"
        type="text"
        :value="modelValue"
        :placeholder="placeholder"
        @input="onInput"
    />
</template>



function emit(arg0: string, value: string) {
  throw new Error("Function not implemented.");
}
