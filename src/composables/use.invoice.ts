import { createSharedComposable } from '@vueuse/core';
import { Ref, ref, computed, ComputedRef } from 'vue';
import { YEARS, InvoiceMonthData, MONTHS } from '../classes/invoice';

interface UseInvoiceReturn {
    invoiceMonthData: Ref<InvoiceMonthData[]>;
    year: Ref<string>;
    selectedMonth: Ref<string>;
    invoiceTotal: Ref<number>;
    getMonthTotal(lineItems: ClassLineItem[]): number;
    datePickerOpenDate: ComputedRef<Date>;
}

const year = ref(YEARS[1]);
const selectedMonth = ref(MONTHS[0]);

function useInvoiceComposable(): UseInvoiceReturn {
  
    const invoiceMonthData = ref<InvoiceMonthData[]>([]);
    const invoiceTotal = computed(() => {
        let total = 0;
        invoiceMonthData.value.forEach(id => {
            const monthTotal = getMonthTotal(id.lineItems);
            total += monthTotal;
        });
        return total;
    });

    const datePickerOpenDate = computed(()=> {
        const monthIndex = MONTHS.indexOf(selectedMonth.value);
        const yearNum = parseInt(year.value);
        return new Date(yearNum, monthIndex, 1);
    })

    function getMonthTotal(lineItems: ClassLineItem[]): number {
        let monthTotal = 0;
        for (const item of lineItems) {
            monthTotal += item.price;
        }
        return monthTotal;
    }

  return {
      invoiceMonthData,
      year,
      selectedMonth,
      invoiceTotal,
      getMonthTotal,
      datePickerOpenDate
  };
}

export const useInvoice = createSharedComposable(useInvoiceComposable);
