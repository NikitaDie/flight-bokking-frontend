export class Seatplace
{
  //reservedBy?: string;
  name: string;
  isReserved: boolean;
  row: number;
  column: number;

  constructor(name: string, isReserved: boolean, row: number, column: number) {
    this.name = name;
    this.isReserved = isReserved;
    this.row = row;
    this.column = column;
  }
}
