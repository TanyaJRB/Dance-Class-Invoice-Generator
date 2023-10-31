import { createSharedComposable } from '@vueuse/core';
import { Ref, ref } from 'vue';
import { YEARS, InvoiceMonthData, MONTHS } from '../classes/invoice';

interface UseInvoiceReturn {
    invoiceMonthData: Ref<InvoiceMonthData[]>;
    year: Ref<string>;
    selectedMonth: Ref<string>;
    invoiceTotal: Ref<number>;
}

const year = ref(YEARS[1]);
const selectedMonth = ref(MONTHS[0]);

function useInvoiceComposable(): UseInvoiceReturn {
  
    const invoiceTotal = ref(0);
    const invoiceMonthData = ref<InvoiceMonthData[]>([]);

  return {
      invoiceMonthData,
      year,
      selectedMonth,
      invoiceTotal
  };
}

export const useInvoice = createSharedComposable(useInvoiceComposable);
