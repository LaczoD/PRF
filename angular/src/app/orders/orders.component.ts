import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConnectionService } from '../utils/connection.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  username:String = '';
  products:Array<{name:String, description:String, price:Number, quantity:Number}> = [];
  carts:Array<{username:String, products:Array<{name:String, description:String, price:Number, quantity:Number}>}> = [];

  constructor(private connectionService: ConnectionService, private router: Router) { }


  goToList() {
    this.router.navigate(['/list']);
  }

  goToCart() {
    this.router.navigate(['/cart/'+localStorage.getItem('user')]);
  }
  
  logout() {
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
  }

}
