export type ClassLineItem = {
    date: Date,
    dayOfWeek: string,
    dateString: string,
    time: string,
    price: number,
    className: string,
};

export enum RegularServices {
    L3 = 'Aerial Hoop Level 3',
    L2 = 'Aerial Hoop Level 2',
    L1 = 'Aerial Hoop Level 1',
    AerialHoopConditioning = 'Aerial Hoop Conditioning',
    Irregular = 'Irregular',
};

export const standardPrice = 27.50;

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const YEARS = ["2022", "2023", "2024"];

export type InvoiceMonthData = {
    month: string,
    lineItems: ClassLineItem[]
};