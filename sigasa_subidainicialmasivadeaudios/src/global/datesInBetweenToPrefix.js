export const datesInBetweenToPrefix = (start, end) => {
    // Tomar los números start y end que están en formato 'YYYYMMDD' y transformarlas en fechas validas en startDate y endDate

    const startDate = new Date(start.slice(0, 4), start.slice(4, 6) - 1, start.slice(6, 8));
    const endDate = new Date(end.slice(0, 4), end.slice(4, 6) - 1, end.slice(6, 8));

    console.log('startDate: ', startDate);
    console.log('endDate: ', endDate);

    if (startDate instanceof Date && !isNaN(startDate.getTime()) && endDate instanceof Date && !isNaN(endDate.getTime())) {
        const datePrefix = [];
        let currentDate = new Date(startDate); // Crear una nueva instancia para evitar mutación
        while (currentDate <= endDate) {
            datePrefix.push(currentDate.toISOString().slice(0, 10).replace(/-/g, ''));
            currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Crear una nueva instancia para la siguiente iteración
        }
        return datePrefix;
    } else {
        console.log('startDate and endDate must be valid dates');
        return [];
    }
}