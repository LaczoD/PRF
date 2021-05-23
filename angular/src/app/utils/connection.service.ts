import { HttpClient } from '@angular/common/http';
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
    //TODO: kell neki egy username mező küldés
    return this.http.get(environment.serverUrl+'/cart',{responseType: 'text', withCredentials: true});
  }

  putCart(prod: {name:String, description:String, price:Number, quantity:Number} ) {
    const product:Array<{name:String, description:String, price:Number, quantity:Number}> = [];
    this.getCart().subscribe((data) => {
      for(var x of JSON.parse(data)) {
        product.push(x);
      }
    }, error => {
      console.log('Hiba putCart-ban, a product tömb olvasásánál: ', error);
    });
    product.push(prod);
    return this.http.put(environment.serverUrl+'/cart',{username: localStorage.getItem('user'), product: product},{responseType: 'text', withCredentials: true});
  }

}
