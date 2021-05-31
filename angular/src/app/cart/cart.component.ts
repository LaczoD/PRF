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
    var products: {name:String, description:String, price:number, quantity:number}[];
    if (prod.quantity <= 0) {
      //del
 
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
      //put
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

    this.connectionService.getCart().subscribe(c => {
      this.connectionService.getOrder().subscribe(d => {
        var orders = JSON.parse(d)[0].product;
        for(var prod of JSON.parse(c)[0].product) {
          orders.push(prod);
        }

        this.connectionService.putOrder(orders).subscribe(data => {
          console.log('Sikeres putOrder');
          this.connectionService.putCart([]).subscribe(data => {
            console.log('Sikeres kosar torles');
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

    /*
    this.connectionService.getOrder().subscribe(data => {

      if (JSON.parse(data).product != '') {
        this.connectionService.putOrder(this.products).subscribe(data => {
          console.log("VASARLAS");
          this.connectionService.createCart().subscribe(data => {
            console.log("Kosar uritve");
          }, err => {
            console.log("Hiba kosar uritese kozben: ", err);
            this.connectionService.createCart();
          });
        }, err => {
          console.log("Hiba tovabbi vasarlas kozben: ", err);
          this.connectionService.createCart();
        });
      } else {
        this.connectionService.createOrder(this.products).subscribe(data => {
          console.log("ELSO VASARLAS");
        }, err => {
          console.log("Hiba elso vasarlas kozben: ", err);
          this.connectionService.createCart();
        });
        this.connectionService.createCart().subscribe(data => {
          console.log("Kosar uritve");
        }, err => {
          console.log("Hiba kosar uritese kozben: ", err);
          this.connectionService.createCart();
        });
      }
    }, err => {
      console.log("Hiba a getOrder kozben: ", err);
      this.connectionService.createCart();
    });
    */
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
      console.log("Hiba a kosar betoltese kozben!");
      this.connectionService.createCart();
    });
  }

  ngOnInit(): void {    
    this.reloadCart();
  }
}
