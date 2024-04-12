export class Seatplace
{
  //reservedBy?: string;
  name: string;
  row: number;
  column: number;
  reserved: boolean;

  constructor(name: string, row: number, column: number, reserved: boolean) {
    this.name = name;
    this.reserved = reserved;
    this.row = row;
    this.column = column;
  }
}
