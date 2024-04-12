import {Seatplace} from "./seatplace";

export class Flight
{
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly seats: Seatplace[],
    public readonly totalSeatsCount: number,
    public readonly bookedSeatsCount: number,
  ) {}
}
