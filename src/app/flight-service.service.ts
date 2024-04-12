import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Flight} from "./flight";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:8080/api/v1';
  }

  public getFlights(): Observable<Flight[]> {
    return this.http.get<Flight[]>(`${this.baseUrl}/flights`);
  }

  public getFlight(id: number): Observable<Flight> {
    return this.http.get<Flight>(`${this.baseUrl}/flights/${id}`);
  }

  public updateFlight(flight: Flight) {
    this.http.put(`${this.baseUrl}/flights`, flight).subscribe();
  }

}
