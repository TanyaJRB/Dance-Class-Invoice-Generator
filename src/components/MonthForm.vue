<script setup lang="ts">
import { ref, toRefs, watch } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ClassLineItem, RegularServices, standardPrice, WEEKDAYS, MONTHS, InvoiceMonthData } from '../classes/invoice';
import AppModal from './AppModal.vue';
import AppInput from './AppInput.vue';
import AppDropdown from './AppDropdown.vue';
import IconEdit from '../components/icons/IconEdit.vue';
import { useInvoice } from '../composables/use.invoice';

const { invoiceMonthData, selectedMonth } = useInvoice();


interface MonthFormProps {
  month: string;
}

const props = defineProps<MonthFormProps>();

const { month } = toRefs(props);

const lineItems = ref<ClassLineItem[]>([]);

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

watch((lineItems.value), (newVal) => {
    const md = invoiceMonthData.value.find((x: InvoiceMonthData) => x.month === month.value);
    if (md) {
        md.lineItems = newVal;
    }
})

function editMonth(month: string) {
    selectedMonth.value = month;
}

</script>

    
<template>
    <div class="bg-slate-300 rounded p-4 m-4">
        <button v-if="month !== selectedMonth" class="text-center text-lg font-bold bg-slate-400 flex flex-row justify-center gap-x-2 p-1 rounded"
        @click="editMonth(month)">
            <div>{{ month }}</div>
            <IconEdit class="w-6 h-6"/>
        </button>
        <div v-if="month === selectedMonth"> 
            <div class="text-center text-lg font-bold bg-slate-400">{{ month }}</div>
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
        </div>
    </div>
</template>
