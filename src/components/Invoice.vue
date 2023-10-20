<script setup lang="ts">
import { computed, ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ClassLineItem, RegularServices, standardPrice, WEEKDAYS, MONTHS, YEARS } from '../classes/invoice';
import { fullName, niNumber, bankDetails, disclaimer, signature } from '../classes/user';
import AppModal from './AppModal.vue';
import AppInput from './AppInput.vue';
import AppDropdown from './AppDropdown.vue';

defineProps({
  msg: String,
})

const lineItems = ref<ClassLineItem[]>([]);

const lineItemsSorted = computed(() => {
  return lineItems.value.sort((a, b) => {
    return a.date - b.date;
  })
})

const month = ref(MONTHS[2]);
const year = ref(YEARS[1]);
const showIrregularServiceModal = ref(false);

const irregularLineItem = ref<ClassLineItem>({
    date: new Date(),
    dayOfWeek: '',
    dateString: '',
    time: '',
    price: 25,
    className: '',
});

function submitIrregularLineItem(): void {
  const classItem = {
    date: irregularLineItem.value.date,
    dayOfWeek: irregularLineItem.value.dayOfWeek,
    dateString: irregularLineItem.value.dateString,
    time: irregularLineItem.value.time,
    price: irregularLineItem.value.price,
    className: irregularLineItem.value.className
  }
  lineItems.value.push(classItem);
  showIrregularServiceModal.value = false;
  irregularLineItem.value = {
    date: new Date(),
    dayOfWeek: '',
    dateString: '',
    time: '',
    price: 0,
    className: ''
  };
}

function getDateString(date: Date): { dayOfWeek: string, dateString: string} {
  const dayOfWeek = WEEKDAYS[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
  const dateString = `${day}/${month}/${year}`;
  return { dayOfWeek, dateString };
}

function addDateToList($event: Date | Date[], service: RegularServices) {
  if (service === RegularServices.Irregular) {
    const { dayOfWeek, dateString } = getDateString($event as Date);
    irregularLineItem.value.date = $event as Date;
    irregularLineItem.value.dateString = dateString
    irregularLineItem.value.dayOfWeek = dayOfWeek;
    showIrregularServiceModal.value = true;
  } else {
    ($event as Date[]).forEach(dateSelection => {
      const { dayOfWeek, dateString } = getDateString(dateSelection);
      const classItem: ClassLineItem = {
      date: dateSelection,
      dayOfWeek: dayOfWeek,
      dateString: dateString,
      time: 'todo',
      price: standardPrice,
      className: service,
    }
    lineItems.value.push(classItem);
    })
  }
}

const monthTotal = computed(() => {
  let counter = 0;
  for (const item of lineItems.value) {
    counter += item.price;
  }
  return counter;
  });


</script>

<template>
  <div class="px-80 py-20">
    
    <div class="flex flex-row justify-center align-middle m-4">
      <AppDropdown id="month" :selection-list="MONTHS" v-model="month" label="Select a Month:"></AppDropdown>
      <AppDropdown id="year" :selection-list="YEARS" v-model="year" label="Select a Year:"></AppDropdown>
    </div>
    
    <div class="font-bold m-2 text-center">Regular Classes</div>
    <div class="grid grid-cols-3 gap-x-4 text-center">
      <div v-for="service in RegularServices" :key="service">
        <div v-if="service !== RegularServices.Irregular">
          <div>{{ service }}</div>
        <VueDatePicker @update:model-value="addDateToList($event, service)" multi-dates></VueDatePicker>
        </div>
    </div>
    <div>
      <div class="font-bold m-2 text-center">One-Off Classes:</div>
    <div>
      <VueDatePicker @update:model-value="addDateToList($event, RegularServices.Irregular)"></VueDatePicker>
    </div>
    </div>
    <AppModal v-model="showIrregularServiceModal" title="Add One-Off Class Details" class="justify-center">
      <div>
        <div class="text-center font-bold m-2">{{ irregularLineItem.dayOfWeek + ' ' + irregularLineItem.dateString }}</div>
      </div>
      <div class="flex flex-col">
       <AppInput :label="'Class Name'" id="className" v-model="irregularLineItem.className"></AppInput>
        <AppInput :label="'Price (£)'" id="price" v-model.number="irregularLineItem.price"></AppInput>
       <AppInput :label="'Time'" id="time" v-model="irregularLineItem.time" placeholder="1:15pm"></AppInput>
        <button class="text-slate-600 font-bold rounded-lg p-3 mt-10 w-full bg-sky-200 hover:bg-cyan-900 hover:text-white" @click="submitIrregularLineItem()">Submit</button>
      </div>
  </AppModal>
  </div>
  
  <div class="p-20 border border-2 border-black m-5 mt-20 text-center flex">
    <div class="flex flex-col w-full">
      <div class="text-xl font-bold mt-2 mb-10">INVOICE</div>
      <div class="flex flex-row w-full justify-end">
        <div class="grid grid-cols-2 text-end w-1/3">
          <div class="font-bold">Full Name</div><div>{{ fullName }}</div>
          <div class="font-bold">NI Number</div><div>{{ niNumber }}</div>
          <div class="font-bold">Bank Name</div><div>{{ bankDetails.bankName }}</div>
          <div class="font-bold">Account Holder</div><div>{{ bankDetails.acHolder }}</div>
          <div class="font-bold">Account Number</div><div>{{ bankDetails.acNumber }}</div>
          <div class="font-bold">Sort Code</div><div>{{ bankDetails.sortCode }}</div>
          <div class="font-bold text-pink-950 my-3">Invoice Total</div><div class="font-bold text-pink-950 my-3">{{ monthTotal }}</div>
        </div>
      </div>
    
    <div class="m-3 font-bold text-xl">{{ month + ' ' + year}}</div>
    <div v-for="item, id in lineItemsSorted" :key="id">
      <div class="grid grid-cols-4 gap-x-10">
        <div>{{ item.dayOfWeek }}</div>
        <div>{{  item.dateString }}</div>
        <div>{{ item.className }}</div>
        <div>£{{ item.price }}</div>
      </div>
    </div>
  <div class="font-bold my-2"><span>Total: £</span><span>{{ monthTotal }}</span></div>
  </div>
    </div>
    
  
  </div>
  
  
</template>

