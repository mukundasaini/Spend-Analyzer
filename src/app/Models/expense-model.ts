

export interface Expense {
    id: string;
    cardTypeId: string;
    amount: number;
    categoryId: string;
    date: string;
    month: string;
    year: string;
    fullDate: string;
    isInclude: boolean;
    note: string;
    emiMonths: number;
}