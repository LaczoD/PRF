import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {


  constructor(private http: HttpClient) { }

  greet() {
    console.log('Hello from this humble service');
    return this.http.get(environment.serverUrl + '/status', {responseType: 'text', withCredentials: true}); //aszinkronitas
  }

  getTodos() {
    return this.http.get(environment.springUrl + '/todos');
  }

  getProducts() {
   return this.http.get(environment.serverUrl+'/product',{responseType: 'text', withCredentials: true}); 
  }

  putProduct(prod : {name:String, description:String, price:Number, quantity:Number}) {
    return this.http.put(environment.serverUrl+'/product',{product: prod},{responseType: 'text', withCredentials: true});
  }


  getCart() {
    let usr = JSON.stringify(localStorage.getItem('user'));
    usr = usr.replace('"','');
    usr = usr.replace('"','');
    let params = new HttpParams().set('username', usr);

    console.log(environment.serverUrl+'/cart/'+localStorage.getItem('user') + ' - username: '+ usr);
    return this.http.get(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{params: params, responseType: 'text', withCredentials: true});
  }

  createCart() {
    return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'),  responseType: 'text', withCredentials: true});
  }

  putCart(obj: {name:String, description:String, price:Number, quantity:Number} ) {
    /**
     * -Dekrementálom a product quantityt quantity: old.data.quantity
     * -rákeresek a product nevére a kosárban
     * -Ha van már olyanom, akkor put és inkrementalom a quantityt a kosárban
     * -Ha nincs olyanom, akkor létrehozom a productot benne
     * **/

    //Dekrementálom a product quantityt quantity: old.data.quantity -> putProduct
    var inCart = false;
    var prod:any;
    prod = obj;
    //prod.quantity = prod.quantity-1;
    if(prod.quantity == 0) {
      console.log('Nincs tobb arucikk a raktarban!');
      return throwError("Nincs tobb arucikk a raktarban!");
    }

    //Rákeresek a product nevére a kosárban
    var products:Array<{name:String, description:String, price:Number, quantity:Number}> = [];
  
    this.getCart().subscribe((data) => {
          
      for(var x of JSON.parse(data)[0].product) { 
        //Ha van már olyanom, akkor put és inkrementalom a quantityt a kosárban
        if(x.name == prod.name) {
          inCart = true;
          x.quantity = x.quantity+1;
        }
        products.push(x);
      }

          //Ha nincs olyanom, akkor létrehozom a productot benne
    if(!inCart) {
      prod.quantity = 1;
      products.push(prod);
    }

    }, error => {
      console.log('Hiba getCart-ban, a product tömb olvasásánál: ', error);
    });
    
    //TODO valahogy megvarni azt a szajbabaszott getCartot
    console.log(environment.serverUrl+'/cart/'+localStorage.getItem('user') + ' username: '+ localStorage.getItem('user') +' -> PUT: product: '+ JSON.stringify(products));
    return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: prod},{responseType: 'text', withCredentials: true});
  
  }

  delCart(prod: any) {
    let usr = JSON.stringify(localStorage.getItem('user'));
    usr = usr.replace('"','');
    usr = usr.replace('"','');
    let params = new HttpParams().set('username', usr);
    
    //TODO: params-ba beletenni a prodot valahogy, mert így nem jó:
    
    params.set('product', prod);
    if(prod.quantity == 0) {
      return this.http.delete(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{params: params, responseType: 'text', withCredentials: true});
    } else {
      return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: prod},{responseType: 'text', withCredentials: true});
    }
  }

  getOrder() {
    return this.http.get(environment.serverUrl+'/order',{responseType: 'text', withCredentials: true});
  }

}
