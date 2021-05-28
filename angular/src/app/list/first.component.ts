import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ConnectionService } from '../utils/connection.service';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.css']
})
export class FirstComponent implements OnInit {

  constructor(private connectionService: ConnectionService, private router: Router) {
    console.log(environment);
  }

  title = 'Webshop';

  products:Array<{name:String, description:String, price:Number, quantity:Number}> = [];


  goToCart() {
    this.router.navigate(['/cart/'+localStorage.getItem('user')]);
  }

  goToOrders() {
    this.router.navigate(['/order/'+localStorage.getItem('user')]);
  }

  logout() {
    this.router.navigate(['/login']);
  }


  toCart(obj: {name:String, description:String, price:Number, quantity:Number}) {

    var prod:any;
    prod = obj;
    prod.quantity = prod.quantity-1;
    console.log('Kosarba dobva: ' + prod.name);

    this.connectionService.putProduct(prod).subscribe(data => {
      for(var x of JSON.parse(data)) {
        this.products.push(x);
      }
    });

    this.connectionService.putCart(prod).subscribe(data => {
      for(var x of JSON.parse(data).product) {
        this.products.push(x);
        console.log(this.products);
      }

      this.connectionService.getProducts().subscribe(data => {
        for(var x of JSON.parse(data)) {
          this.products.push(x);
        }
      });
    }, error => {
      console.log('Hiba kosarba adas soran: ', error);
    });
  }

  ngOnInit(): void {
    this.connectionService.getProducts().subscribe(data => {
      for(var x of JSON.parse(data)) {
        this.products.push(x);
      }
    });

  }

}
