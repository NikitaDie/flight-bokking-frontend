import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Flight} from "./flight";

@Injectable({
  providedIn: 'root'
})
export class FlightService {

  private readonly flightsUrl: string;

  constructor(private http: HttpClient) {
    this.flightsUrl = 'http://localhost:8080/api/v1/flights';
  }

  public findAll(): Observable<Flight[]> {
    return this.http.get<Flight[]>(this.flightsUrl);
  }

  public save(flight: Flight) {
    return this.http.post<Flight>(this.flightsUrl, flight);
  }

}
