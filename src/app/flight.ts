import {Seatplace} from "./seatplace";

export class Flight
{
  public readonly id: number | undefined;
  name: string;
  seats: Seatplace[];
  totalSeatsCount: number;
  bookedSeatsCount: number;

  constructor(name: string, seats: Seatplace[]) {
    this.name = name;
    this.seats = seats;
    this.totalSeatsCount = seats.length;
    this.bookedSeatsCount = seats.filter(s => s.isReserved).length;
  }
}
