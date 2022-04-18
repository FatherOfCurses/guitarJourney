export class Convertors {

  convertNumberToTimeValue ( timeNumber: number ) {
    return new Date(0,0,0,0, timeNumber, 0);
}

}
