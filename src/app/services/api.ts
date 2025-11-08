import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleRequest {
  licensePlate: string;
  type: 'BIKE' | 'VAN' | 'TRUCK';
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  
  private http = inject(HttpClient);
  private backendUrl = 'https://logisticsapp-env.eu-west-3.elasticbeanstalk.com';

  
  public getVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.backendUrl}/vehicles`);
  }


  public addVehicle(vehicle: VehicleRequest): Observable<any> {
    return this.http.post(`${this.backendUrl}/vehicles`, vehicle);
  }


  public deleteVehicle(id: number): Observable<any> {
    return this.http.delete(`${this.backendUrl}/vehicles/${id}`);
  }
}