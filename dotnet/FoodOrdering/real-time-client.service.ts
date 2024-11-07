import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr'
import { Subject, Observable } from 'rxjs';
import { FoodRequest, Order, OrderState } from '../../src/app/models/data';

@Injectable({
  providedIn: 'root'
})
export class RealTimeClientService {

  private hubConnection: signalR.HubConnection;
  private pendingFoodUpdatedSubject = new Subject<Order[]>();
  ordersUpdated$: Observable<Order[]> = this.pendingFoodUpdatedSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:4200/foodhub")
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("Connected to SignalR hub"))
      .catch((err) => console.error("Error connecting to SignalR hub:", err));

    this.hubConnection.on("PendingFoodUpdated", (orders: Order[]) => {
      this.pendingFoodUpdatedSubject.next(orders);
    })
  }

  async orderFoodItem(foodId: number, table: number) {
    console.log("Ordering");

    await this.hubConnection.invoke("OrderFoodItem", {
      foodId,
      table
    } as FoodRequest);
  }

  async updateFoodItem(orderId: number, state: OrderState) {
    await this.hubConnection.invoke("UpdateFoodItem", orderId, state)
  }
}
