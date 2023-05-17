export class Convertors {

  convertNumberToTimeValue ( timeNumber: number ) {
    return new Date(0,0,0,0, timeNumber, 0);
}

  transformDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Pad single digit month/day with leading zero if needed
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();

    return `${year}-${formattedMonth}-${formattedDay}`;
  }


}
