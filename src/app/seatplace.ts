export class Seatplace
{
  public readonly id: number | null = null;
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
