export type ClassLineItem = {
    date: Date,
    dayOfWeek: string,
    dateString: string,
    time: string,
    price: number,
    className: string,
};

export enum RegularServices {
    AerialHoopImprovers = 'Aerial Hoop Improvers',
    AerialHoopConditioning = 'Aerial Hoop Conditioning',
    AerialHoopMixed = 'Aerial Hoop Mixed',
    Irregular = 'Irregular',
};

export const standardPrice = 25;

export const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const MONTHS = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const YEARS = ["2022", "2023", "2024"];