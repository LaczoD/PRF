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

  products:Array<{name:String, description:String, price:number, quantity:number}> = [];


  goToCart() {
    this.router.navigate(['/cart/'+localStorage.getItem('user')]);
  }

  goToOrders() {
    this.router.navigate(['/order/'+localStorage.getItem('user')]);
  }

  logout() {
    this.router.navigate(['/login']);
  }


  toCart(obj: {name:String, description:String, price:number, quantity:number}) {
    console.log('obj quantity: '+obj.quantity);
    
    /**
     * -Dekrementálom a product quantityt quantity: old.data.quantity
     * -rákeresek a product nevére a kosárban
     * -Ha van már olyanom, akkor put és inkrementalom a quantityt a kosárban
     * -Ha nincs olyanom, akkor létrehozom a productot benne
      */

    //Dekrementálom a product quantityt quantity: old.data.quantity -> putProduct
    var inCart = false;
    var prod:any;
    prod = JSON.parse(JSON.stringify(obj));
    
    if(prod.quantity == 0) {
      console.log('Nincs tobb arucikk a raktarban!');
      return;
    }

    //Rákeresek a product nevére a kosárban
    let products:Array<{name:String, description:String, price:number, quantity:number}> = [];

    this.connectionService.getCart().subscribe((data) => {
      
      for(var cart of JSON.parse(data)) {

        for(var x of cart.product) {

        //Ha van már olyanom, akkor put és inkrementalom a quantityt a kosárban
          if(x.name == prod.name) {
            inCart = true;
            x.quantity = x.quantity+1;
          }
          products.push(x);
        }
      }

      //Ha nincs olyanom, akkor létrehozom a productot benne
      if(!inCart) {
        prod.quantity = 1;
        products.push(prod);
      }

      this.connectionService.putCart(products).subscribe((data) => {
        console.log('obj qtty: '+obj.quantity);
        
        console.log('putCart sikeres');
        
        obj.quantity--;
        this.connectionService.putProduct(obj).subscribe((data) => {
          console.log('product dekrementalas sikeres');
          
        }, err => {
          console.log(err);
          
        });

      }, err => {
        console.log(err);
      });
    }, error => {
      console.log('Hiba getCart-ban, a product tömb olvasásánál: ', error);
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
