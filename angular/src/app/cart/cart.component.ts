import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../utils/connection.service';
import { Router } from '@angular/router';
import { isEmptyExpression } from '@angular/compiler';

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

    var prod:any = product;
    prod.quantity = prod.quantity-1;
    if (prod.quantity <= 0) {
      //del - eltavolitom a kosarelemet, majd inkrementalom az aruhazi darabszamot
      this.connectionService.getCart().subscribe((data) => {
        for(var cart of JSON.parse(data)) {
          var i = cart.product.findIndex((x:any) => x.name === product.name);
          
          cart.product.splice(i,1);
          this.connectionService.putCart(cart.product).subscribe((data) => {

            this.connectionService.getProducts().subscribe((data) => {
              i = JSON.parse(data).findIndex((x:any) => x.name === product.name);
              var prod = JSON.parse(data)[i];
              prod.quantity++;
              this.connectionService.putProduct(prod).subscribe((data) => {
              }, err => {
                console.log('Hiba a putProductban: '+err);
              });
            }, err => {
              console.log(err);
            });
            this.reloadCart();
          }, err => {
            console.log(err);
          });
        }
      }, err => {
        console.log(err);
      });

    } else {
      //put - dekrementalom a kosarelemet, majd inkrementalom az aruhazi darabszamot
      this.connectionService.putCart(prod).subscribe(data => {
        this.connectionService.getProducts().subscribe((data) => {
          var i = JSON.parse(data).findIndex((x:any) => x.name === product.name);
          var prod = JSON.parse(data)[i];
          prod.quantity++;
          this.connectionService.putProduct(prod).subscribe((data) => {
          }, err => {
            console.log('Hiba a putProductban: '+err);
          });
        }, err => {
          console.log(err);
        });

      },err => {
        console.log("Hiba az arucikk dekrementalasa kozben: ", err);
        this.connectionService.createCart();
      });
    }

  }

  buy() {
    //lekerem az eddigi ordereket, hozzafuzom a jelenlegi kosaramat
    this.connectionService.getCart().subscribe(c => {
      this.connectionService.getOrder().subscribe(d => {
        var orders = JSON.parse(d)[0].product;
        for(var prod of JSON.parse(c)[0].product) {
          orders.push(prod);
        }
        //eltarolom az uj orderemet
        this.connectionService.putOrder(orders).subscribe(data => {
          //kiuritem a jelenlegi kosaramat
          this.connectionService.putCart([]).subscribe(data => {
            this.reloadCart();
          }, err => {
            console.log(err);
          });
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    }, err => {
      console.log(err);
    });
  }

  goToList() {
    this.router.navigate(['/list']);
  }

  goToOrders() {
    this.router.navigate(['/order/'+localStorage.getItem('user')]);
  }

  reloadCart() {
    this.carts = [];
    this.connectionService.getCart().subscribe(data => {
      var received =  JSON.parse(data);     
      for(var x of received) {
        this.carts.push(x);
        for(var prod of x.product) {
          this.sumToPay += prod.price*prod.quantity;
        }
      }
    },err => {
      this.connectionService.createCart().subscribe(error => {
        console.log("Hiba a kosar betoltese kozben! "+error+" "+err);
      });
    });
  }

  ngOnInit(): void {    
    this.reloadCart();
  }
}
