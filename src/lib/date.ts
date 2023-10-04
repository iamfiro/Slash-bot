export function getYesterdayDate() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
}

export function getTodayDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
}

export function getTodayStringDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return `${date.getFullYear()}${date.getMonth()}${date.getDate()}`;
}