import { Component, signal } from '@angular/core';
import { RealTimeClientService } from '../../../dotnet/FoodOrdering/real-time-client.service';
import { HttpClient } from '@microsoft/signalr';
import { FoodItem, Order } from '../models/data'
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomersComponent {
  availableFood = signal<Array<FoodItem>>([]);
  activeOrders = signal<Array<Order>>([]);
  activeOrdersSubscription?: Subscription;

  constructor(private realtime: RealTimeClientService, private http: HttpClient) { }

  async ngOnInit() {
    let food = await firstValueFrom(this.http.get<Array<FoodItem>>("http://localhost:4200/api/fooditems"));
    this.availableFood.set([...food]);

    let orders = await firstValueFrom(this.http.get<Array<Order>>("http://localhost:4200/api/kitchen"));
    this.activeOrders.set([...orders]);

    this.activeOrdersSubscription = this.realtime.ordersUpdated$.subscribe(orders => {
      this.activeOrders.set([...orders]);
    })
  }
}
