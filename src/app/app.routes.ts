import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NgModule} from "@angular/core";
import {FlightDetailsComponent} from "./flight-details/flight-details.component";

export const routes: Routes = [
  { path: '', redirectTo: '/flights', pathMatch: 'full' },
  { path: 'flights', component: HomeComponent },
  { path: 'flights/:id', component:  FlightDetailsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
