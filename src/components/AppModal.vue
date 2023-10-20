<script setup lang="ts">
import {
  computed,
  CSSProperties,
  reactive,
  ref,
  toRefs,
  watchEffect,
} from 'vue';

interface AppModalProps {
  modelValue: boolean;
  title?: string;
  closeOnBackdrop?: boolean;
  showHideButton?: boolean;
  beforeClose?(handlers: { close(): void; keep(value: unknown): void }): void;
  minWidth?: string | number;
  maxWidth?: string | number;
  loading?: boolean;
  footerClasses?: string;
  fullScreen?: boolean;
  transparentBackdrop?: boolean;
  modalClass?: string;
}

interface AppModalEmits {
  (emitName: 'update:modelValue', newValue: boolean): void;
  (event: 'closed'): void;
  (event: 'closed-animation'): void;
}

const props = withDefaults(defineProps<AppModalProps>(), {
  title: '',
  closeOnBackdrop: false,
  showHideButton: true,
  minWidth: 560,
  maxWidth: 760,
  loading: false,
  footerClasses: '',
  fullScreen: false,
  transparentBackdrop: false,
  modalClass: null,
});
const emit = defineEmits<AppModalEmits>();

const {
  modelValue,
  title,
  closeOnBackdrop,
  showHideButton,
  minWidth,
  maxWidth,
  beforeClose,
  loading,
  footerClasses,
  fullScreen,
  transparentBackdrop,
  modalClass,
} = toRefs(props);

const isOpenSync = computed<boolean>({
  set(value) {
    emit('update:modelValue', value);
  },
  get() {
    return modelValue.value;
  },
});

const modalStyles = computed<CSSProperties>(() => {
  return {
    ...(minWidth.value && { minWidth: `${minWidth.value}px` }),
    ...(maxWidth.value && { maxWidth: `${maxWidth.value}px` }),
  };
});
const modalClasses = computed(() => {
  return {
    'h-full w-full': fullScreen.value,
    'h-auto': !fullScreen.value,
  };
});

const backdropClasses = computed(() => {
  if (transparentBackdrop.value) {
    return 'transparent';
  }
  return 'bg-black';
});

function tryClose(): void {
  if (beforeClose.value) {
    new Promise((resolve, reject) => {
      beforeClose.value({ close: reject, keep: resolve });
    }).catch(close);

    return;
  }

  close();
}

let timeout: ReturnType<typeof setTimeout> = null;
function close(): void {
  clearTimeout(timeout);

  isOpenSync.value = false;
  emit('closed');
  timeout = setTimeout(() => {
    emit('closed-animation');
  }, 200);
}

function keyUpHandler(event: KeyboardEvent): void {
  event.preventDefault();

  switch (event.key) {
    case 'Escape':
      tryClose();
  }
}

watchEffect(() => {
  isOpenSync.value
    ? document.addEventListener('keyup', keyUpHandler)
    : document.removeEventListener('keyup', keyUpHandler);
});

</script>

<template>
  <Teleport to="body">
    <div>
      <transition
        enter-active-class="transform transition duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transform duration-100 transition"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpenSync"
          class="pointer-events-auto fixed inset-0 z-50 h-full w-full bg-opacity-50"
          :class="[backdropClasses]"
          v-on="closeOnBackdrop ? { click: tryClose } : {}"
        />
      </transition>

      <transition
        enter-active-class="transform transition"
        enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transform transition"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-10"
      >
        <div
          v-if="isOpenSync"
          class="pointer-events-none fixed inset-0 z-50 flex justify-center overflow-y-hidden items-center"
        >
          <div
            ref="modalRef"
            class="pointer-events-auto flex max-h-full flex-col overflow-y-auto rounded-lg bg-white pb-6 pt-9 shadow-md"
            :style="{ ...modalStyles }"
            :class="[
              modalClasses,
              modalClass,
            ]"
          >
            <AppLoadingOverlay :loading="loading" />

            <div class="mb-6 flex items-center px-9">
              <slot name="header">
                <h2 class="flex-grow text-2xl">
                  {{ title }}
                </h2>
              </slot>
              <button
                v-if="showHideButton"
                class="flex-grow-0"
                @click="tryClose"
              >
                <!-- <slot name="close"><IconClose class="h-7 w-7" /></slot> -->
              </button>
            </div>
            <div class="flex flex-grow flex-col overflow-y-auto px-9">
              <slot />
            </div>
            <div
              v-if="$slots.footer"
              :class="footerClasses"
              class="mt-6 border-t border-dark-10 px-9 pt-6"
            >
              <slot name="footer" :close="tryClose" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </Teleport>
</template>
