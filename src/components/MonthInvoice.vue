<script setup lang="ts">
import { computed, Ref, toRefs } from 'vue'
import '@vuepic/vue-datepicker/dist/main.css'
import { ClassLineItem } from '../classes/invoice';
import { useInvoice } from '../composables/use.invoice';

const { getMonthTotal } = useInvoice();

interface MonthInvoiceProps {
  month: string;
  year: string;
  lineItems: Ref<ClassLineItem[]>;
}

const props = defineProps<MonthInvoiceProps>();

const { month, year, lineItems } = toRefs(props);

const lineItemsSorted = computed(() => {
  return lineItems.value.sort((a, b) => {
    return a.date - b.date;
  })
})

const monthTotal = computed(() => {
    const mt = lineItems.value.length ? getMonthTotal(lineItems.value) : 0;
    return mt;
  });


</script>

<template>
    <div class="border border-black text-center py-4 rounded my-4"> 
        <div class="m-3 font-bold text-xl">{{ month + ' ' + year}}</div>
        <div v-for="item, id in lineItemsSorted" :key="id">
        <div class="grid grid-cols-4 gap-x-10">
            <div>{{ item.dayOfWeek }}</div>
            <div>{{  item.dateString }}</div>
            <div>{{ item.className }}</div>
            <div>£{{ item.price }}</div>
        </div>
        </div>
        <div class="font-bold my-2 text-md"><span>Total: £</span><span>{{ monthTotal }}</span></div>
    </div>
</template>

