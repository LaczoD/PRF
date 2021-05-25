import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
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

  putCart(prod: {name:String, description:String, price:Number, quantity:Number} ) {

    /** TODO:
     * -Dekrementálom a product quantityt quantity: old.data.quantity
     * -rákeresek a product nevére
     * --Ha van már olyanom, akkor put és inkrementalom a quantityt a kosárban
     * --Ha nincs olyanom, akkor post és létrehozom a productot benne
     * 
     * **/

    var product:Array<{name:String, description:String, price:Number, quantity:Number}> = [];
    this.getCart().subscribe((data) => {
      for(var x of JSON.parse(data)) {
        product.push(x);
      }
    }, error => {
      console.log('Hiba getCart-ban, a product tömb olvasásánál: ', error);
    });
    product.push(prod);

    //TODO: inkrementalni hogy ha van már olyanom
    return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: product},{responseType: 'text', withCredentials: true});
  }


  getOrder() {
    return this.http.get(environment.serverUrl+'/order',{responseType: 'text', withCredentials: true});
  }

}
