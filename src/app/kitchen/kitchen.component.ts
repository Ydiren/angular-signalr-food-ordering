import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Component, signal } from '@angular/core';
import { firstValueFrom, Subscription } from 'rxjs';
import { Order, OrderState } from '../models/data';
import { RealTimeClientService } from '../services/real-time-client.service';

@Component({
  selector: 'app-kitchen',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.css'
})
export class KitchenComponent {

  foodStates = ['Ordered', 'Preparing', 'AwaitingDelivery', 'Completed'];

  orders = signal<Order[]>([]);
  orderSubscription?: Subscription;

  constructor(private realtime: RealTimeClientService, private http: HttpClient) { }

  async ngOnInit() {
    this.realtime.connect();
    // Load existing orders (static data)
    let existingOrders = await firstValueFrom(this.http.get<Array<Order>>("http://localhost:4200/api/kitchen"));
    this.orders.set([...existingOrders]);

    // Subscribe to future order updates
    this.orderSubscription = this.realtime.ordersUpdated$.subscribe((orders) => this.orders.set([...orders]));
  }

  async updateState(id: number, $event: Event) {
    let value = ($event.target as HTMLSelectElement).value;
    await this.realtime.updateFoodItem(id, value as OrderState);
  }
}
