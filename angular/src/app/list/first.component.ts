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

  helloFrom(st: String) {
    console.log('Hello from ' + st);
  }

  toCart(product: {name:String, description:String, price:Number, quantity:Number}) {
    console.log('Kosarba dobva: ' + product.name);
    this.connectionService.putCart(product).subscribe(data => {
      for(var x of JSON.parse(data)) {
        this.products.push(x);
        console.log(this.products);
      }
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

  /**
   * title = 'Áruház';
  example = ['1_elem'];

  hello() {
    console.log('Hello world!');
    if(this.title == 'PRF') {
      this.title = 'NOT PRF';
    } else {
      this.title = 'PRF';
    }
    this.example.push(Math.floor(Math.random()*100)+'_elem');
    this.connectionService.greet().subscribe(data => {
      console.log('This came from the server: '+ data);
    }, error => {
      console.log('Sorry we encountered an error: '+ error);
    });
  }

  helloFrom(st: string) {
    console.log('Hello from '+ st +'!');
  }

   */
}
