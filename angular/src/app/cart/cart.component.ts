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
  carts:Array<{username:String, product:[{
      name:String,
      description:String,
      price:Number,
      quantity:Number}]}> = [];
  sumToPay:number = 0;

  constructor(private connectionService: ConnectionService, private router: Router) { }


  logout() {
    this.router.navigate(['/login']);
  }

  delFromCart(product: {name:String, description:String, price:Number, quantity:Number}) {
    //decrement quantity
    //add object back into list
    //if quantity = 0 del object from db
    var prod:any = product;
    prod.quantity = prod.quantity-1;
    if (prod.quantity == 0) {
      //del
      this.connectionService.delCart(prod).subscribe(data => {
        console.log("Arucikk sikeres uritese a kosarbol!");
      },err => {
        console.log("Hiba az arucikk uritese kozben: ", err);
        this.connectionService.createCart();
      });
    } else {
      //put
      this.connectionService.putCart(prod).subscribe(data => {
        console.log("Arucikk dekrementalasa!");
      },err => {
        console.log("Hiba az arucikk dekrementalasa kozben: ", err);
        this.connectionService.createCart();
      });
    }

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
      var received =  JSON.parse(data);     
      for(var x of received) {
        this.carts.push(x);
        for(var prod of x.product) {
          this.sumToPay += prod.price*prod.quantity;
        }
      }
      
      
    },err => {
      console.log("Hiba a kosar betoltese kozben!");
      this.connectionService.createCart();
    });
  }
}
