import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Api, VehicleRequest } from './services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  
  private apiService = inject(Api);

  public vehicles: any[] = [];
  public isLoading = true;
  public error: string | null = null;
  public generalMessage: string | null = null;

  public newVehicle: VehicleRequest = {
    licensePlate: '',
    type: 'VAN'
  };
  
 
  public vehicleTypes: ('BIKE' | 'VAN' | 'TRUCK')[] = ['BIKE', 'VAN', 'TRUCK'];

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.isLoading = true;
    this.error = null;
    this.apiService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data; 
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load vehicles from backend. Is CORS configured?'; 
        this.isLoading = false;
      }
    });
  }


  onSubmit(): void {
    this.isLoading = true;
    this.generalMessage = null;
    this.error = null;

    this.apiService.addVehicle(this.newVehicle).subscribe({
      next: (createdVehicle) => {
        this.vehicles.push(createdVehicle);
        this.generalMessage = `Successfully added vehicle ${createdVehicle.licensePlate}`;
        
        this.newVehicle = { licensePlate: '', type: 'VAN' };
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to create vehicle.';
        this.isLoading = false;
      }
    });
  }

 
  onDelete(id: number): void {
    if (!confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    this.isLoading = true;
    this.generalMessage = null;
    this.error = null;

    this.apiService.deleteVehicle(id).subscribe({
      next: () => {
        this.vehicles = this.vehicles.filter(v => v.id !== id);
        this.generalMessage = `Successfully deleted vehicle ID ${id}`;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to delete vehicle.';
        this.isLoading = false;
      }
    });
  }
}