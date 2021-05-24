import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  username:String = '';
  products:Array<{name:String, description:String, price:Number, quantity:Number}> = [];

  constructor(private connectionService: ConnectionService, private router: Router) { }


  logout() {
    this.router.navigate(['/login']);
  }

  delFromCart(product: {name:String, description:String, price:Number, quantity:Number}) {
    //TODO decrement quantity
    //add object back into list
    //if quantity = 0 del object from db
  }

  buy() {
    //TODO everything goes to orders
  }

  goToList() {
    this.router.navigate(['/list']);
  }

  goToOrders() {
    this.router.navigate(['/order/'+localStorage.getItem('user')]);
  }


  ngOnInit(): void {
    this.connectionService.getCart().subscribe(data => {
      for(var x of JSON.parse(data)) {
        this.products.push(x);
      }
    },err => {
      console.log("Ures a kosar!");
      this.connectionService.createCart();
    });
  }
}
