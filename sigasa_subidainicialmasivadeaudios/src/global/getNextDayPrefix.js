export const getNextDayPrefix = (currentDate) => {
    //Genera la fecha de mañana en formato YYYYMMDD partiendo de currentDate
    
    const tomorrow = new Date(currentDate.slice(0, 4), currentDate.slice(4, 6) - 1, currentDate.slice(6, 8));
    tomorrow.setDate(tomorrow.getDate() + 1);
    const year = tomorrow.getFullYear();
    const month = tomorrow.getMonth() + 1;
    const day = tomorrow.getDate();
    const prefix = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    return prefix;
}