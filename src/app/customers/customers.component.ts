import { Component, signal } from '@angular/core';
import { RealTimeClientService } from '../services/real-time-client.service';
import { FoodItem, Order } from '../models/data'
import { firstValueFrom, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgOptimizedImage,
    JsonPipe,
    FormsModule
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  availableFood = signal<Array<FoodItem>>([]);
  activeOrders = signal<Array<Order>>([]);
  activeOrdersSubscription?: Subscription;
  showActiveOrders = false;
  tableNumber?: number;

  constructor(private realtime: RealTimeClientService, private http: HttpClient) { }

  async ngOnInit() {
    let food = await firstValueFrom(this.http.get<Array<FoodItem>>("http://localhost:4200/api/fooditems"));
    this.availableFood.set([...food]);

    let orders = await firstValueFrom(this.http.get<Array<Order>>("http://localhost:4200/api/kitchen"));
    this.activeOrders.set([...orders]);

    this.activeOrdersSubscription = this.realtime.ordersUpdated$.subscribe(orders => {
      this.activeOrders.set([...orders]);
    })

    this.realtime.connect();
  }

  async sendOrder(foodId: number, tableNumber: number) {
    await this.realtime.orderFoodItem(foodId, tableNumber);
  }

  showActiveOrdersToggle() {
    this.showActiveOrders = !this.showActiveOrders;
  }
}
