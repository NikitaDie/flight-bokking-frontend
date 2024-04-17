export class Seatplace
{
  //reservedBy?: string;
  private _name: string;
  private _row: number;
  private _column: number;
  private _reserved: boolean;

  constructor(name: string, row: number, column: number, reserved: boolean) {
    this._name = name;
    this._reserved = reserved;
    this._row = row;
    this._column = column;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get row(): number {
    return this._row;
  }

  set row(value: number) {
    this._row = value;
  }

  get column(): number {
    return this._column;
  }

  set column(value: number) {
    this._column = value;
  }

  get reserved(): boolean {
    return this._reserved;
  }

  set reserved(value: boolean) {
    this._reserved = value;
  }

}
