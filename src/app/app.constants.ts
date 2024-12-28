export enum APPCOLORS {
    primary = "primary",
    secondary = "secondary",
    tertiary = "tertiary",
    success = "success",
    danger = "danger",
    warning = "warning",
    light = "light",
    medium = "medium",
    dark = "dark",
}

export enum GROUPBY {
    card = "card",
    cat = "category",
    month = "month",
    year = "year",
    day = "day"
}
export const AppConstants = {
    settings: {
        EDA: 'Enable Daily Analytics',
        EMA: 'Enable Monthly Analytics',
        EYA: 'Enable Yearly Analytics',
        ECDA: 'Enable Cards Analytics',
        ECTA: 'Enable Categories Analytics',
    },
    alertHeader: {
        SUCCESS: 'success',
        FAILED: 'failed',
        WARNING: 'warning'
    },
    alertMessage: {
        save: {
            success: 'saved successfully',
            failed: 'saving failed',
            warning: 'record already existed'
        },
        update: {
            success: 'updaed successfully',
            failed: 'updating failed',
            warning: 'record is existed with same name'
        },
        delete: {
            success: 'deleted successfully',
            failed: 'deleting failed',
            warning: 'no of records effected(0)'
        },
        get: {
            failed: 'fetching failed'
        }
    },
    collections: {
        cards: 'cardTypes',
        expense: 'expense',
        category: 'categories',
        settings: 'settings',
        bank: 'bank',
        cardType: 'cardType',
    },
    Months: [
        { name: 'JAN', value: '01' },
        { name: 'FEB', value: '02' },
        { name: 'MAR', value: '03' },
        { name: 'APR', value: '04' },
        { name: 'MAY', value: '05' },
        { name: 'JUN', value: '06' },
        { name: 'JUL', value: '07' },
        { name: 'AUG', value: '08' },
        { name: 'SEP', value: '09' },
        { name: 'OCT', value: '10' },
        { name: 'NOV', value: '11' },
        { name: 'DEC', value: '12' }
    ],
    CardTypes: [{ name: 'All', value: 'A' },
    { name: 'Credit', value: 'C' },
    { name: 'Debit', value: 'D' }]
}