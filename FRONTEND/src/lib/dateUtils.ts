export const getTodayDate = () => new Date().toISOString().slice(0, 10);

export const getTodayWeekday = () => new Date().getDay(); // 0-6
