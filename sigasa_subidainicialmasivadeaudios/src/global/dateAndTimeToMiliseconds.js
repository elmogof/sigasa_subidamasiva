export const dateAndTimeFromStringToMiliseconds = (date, time) => {
    // console.log(date, time);
    const year = date.slice(0, 4);
    const month = date.slice(4, 6) - 1;
    const day = date.slice(6, 8);

    const hour = time.slice(0, 2);
    const minutes = time.slice(2, 4);
    const seconds = time.slice(4, 6);

    const dateAndTime = new Date(year, month, day, hour, minutes, seconds);

    return dateAndTime.getTime();
}