import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Trip {
  id: number;
  startPoint: string;
  endPoint: string;
  level?: number;
  isContinued?: boolean;
  position?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'travel-itinerary-visualizer';
  tripForm: FormGroup;
  trips: Trip[] = [];
  nextId = 1;

  constructor(private fb: FormBuilder) {
    this.tripForm = this.fb.group({
      startPoint: ['', [Validators.required, Validators.minLength(3)]],
      endPoint: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  addTrip() {
    if (this.tripForm.valid) {
      const startPoint = this.tripForm.get('startPoint')?.value;
      const endPoint = this.tripForm.get('endPoint')?.value;

      const newTrip: Trip = {
        id: this.nextId++,
        startPoint,
        endPoint,
      };

      this.trips.push(newTrip);
      this.calculateTripLevels();
      this.tripForm.reset();
    }
  }

  deleteTrip(tripId: number) {
    this.trips = this.trips.filter((trip) => trip.id !== tripId);
    this.calculateTripLevels();
  }

  calculateTripLevels() {
    this.trips.forEach((trip) => {
      trip.level = 1;
      trip.isContinued = false;
    });

    for (let i = 0; i < this.trips.length; i++) {
      const currentTrip = this.trips[i];

      if (i > 0) {
        const previousTrip = this.trips[i - 1];
        if (previousTrip.endPoint === currentTrip.startPoint) {
          currentTrip.isContinued = true;
        }
      }

      for (let j = 0; j < i; j++) {
        const otherTrip = this.trips[j];
        if (
          currentTrip.startPoint === otherTrip.startPoint &&
          currentTrip.endPoint === otherTrip.endPoint
        ) {
          currentTrip.level = 2;
          break;
        }
      }
    }
  }

  getStartPointCode(trip: Trip): string {
    return trip.startPoint.substring(0, 3).toUpperCase();
  }

  getEndPointCode(trip: Trip): string {
    return trip.endPoint.substring(0, 3).toUpperCase();
  }
}
