<script setup lang="ts">
import { ref } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { ClassLineItem, RegularServices, standardPrice, WEEKDAYS, MONTHS, YEARS, InvoiceMonthData } from '../classes/invoice';
import { fullName, niNumber, bankDetails, disclaimer, signature } from '../classes/user';
import MonthInvoice from './MonthInvoice.vue';
import MonthForm from './MonthForm.vue';
import { useInvoice } from '../composables/use.invoice';
import AppDropdown from './AppDropdown.vue';

const { invoiceMonthData, invoiceTotal, year, selectedMonth } = useInvoice();
const showAddMonthButton = ref(true);

function addMonth() {
  console.log(selectedMonth);
  const newMonthData: InvoiceMonthData = { month: selectedMonth.value, lineItems: []}
  invoiceMonthData.value.push(newMonthData);
  showAddMonthButton.value = true;
}

function isLastItem(item): boolean {
  const lastItem = invoiceMonthData.value[invoiceMonthData.value.length - 1];
  return item == lastItem;
}

</script>

<template>
  <div class="grid grid-cols-3 bg-slate-700 h-screen">
    <div id="selection-panel" class="bg-slate-400 col-span-1">
      <AppDropdown id="year" :selection-list="YEARS" v-model="year" label="Select year for invoice:" class="m-4"></AppDropdown>
      <div class="flex flex-row justify-center align-middle m-4">
          <button v-if="showAddMonthButton" class="border-2 border-black rounded rounded-lg p-4 font-bold bg-slate-600 text-white" @click="showAddMonthButton = false">+ Add a month</button>
          <div v-else class="flex flex-row border-2 border-black rounded-lg p-2">
            <AppDropdown id="month" :selection-list="MONTHS" v-model="selectedMonth" label="Select a month:"></AppDropdown>
            <button @click="addMonth()" class="border-2 border-black rounded rounded-lg p-2 font-bold bg-green-100">Confirm</button>
          </div>
      </div>
      <MonthForm v-for="md in invoiceMonthData" :key="md.month" :month="md.month"/>
    </div>
    
    <div id="invoice-content" class="p-20 border border-2 border-black m-5 text-center flex col-span-2 bg-white">
      <div class="flex flex-col w-full">
        <div class="text-xl font-bold mt-2 mb-10">INVOICE</div>
        <div class="flex flex-row gap-x-2">
          <div class="font-bold">Invoice Period: </div>
          <div>
            <span v-for="md in invoiceMonthData" :key="md.month">{{ md.month }}<span v-if="!isLastItem(md)">, </span></span>
          </div>
        </div>
        
        <div class="flex flex-row w-full justify-end">
          <div class="grid grid-cols-2 text-end w-1/3">
            <div class="font-bold">Full Name</div><div>{{ fullName }}</div>
            <div class="font-bold">NI Number</div><div>{{ niNumber }}</div>
            <div class="font-bold">Bank Name</div><div>{{ bankDetails.bankName }}</div>
            <div class="font-bold">Account Holder</div><div>{{ bankDetails.acHolder }}</div>
            <div class="font-bold">Account Number</div><div>{{ bankDetails.acNumber }}</div>
            <div class="font-bold">Sort Code</div><div>{{ bankDetails.sortCode }}</div>
            <div class="font-bold text-lg text-red-500 my-3">Invoice Total</div><div class="font-bold text-lg text-red-500 my-3">£{{ invoiceTotal }}</div>
          </div>
        </div>
      
        <div v-for="md in invoiceMonthData" :key="md.month">
          <MonthInvoice :month="md.month" :year="year" :line-items="md.lineItems"/>
        </div>

        <div class="mt-8 text-xs justify-end text-end">{{ disclaimer }}</div>
        <div class="text-xs justify-end text-end font-bold italic">{{ signature }}</div>
        
      </div>
    </div>

  </div>
</template>

