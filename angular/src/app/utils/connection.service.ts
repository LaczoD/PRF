import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {


  constructor(private http: HttpClient) { }



//product

  getProducts() {
   return this.http.get(environment.serverUrl+'/product',{responseType: 'text', withCredentials: true}); 
  }

  putProduct(prod : {name:String, description:String, price:Number, quantity:Number}) {
    return this.http.put(environment.serverUrl+'/product',{product: prod},{responseType: 'text', withCredentials: true});
  }


//cart

  getCart() {
    let usr = JSON.stringify(localStorage.getItem('user'));
    usr = usr.replace('"','');
    usr = usr.replace('"','');
    let params = new HttpParams().set('username', usr);

    return this.http.get(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{params: params, responseType: 'text', withCredentials: true});
  }

  createCart() {
    return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'),  responseType: 'text', withCredentials: true});
  }

  putCart(products: {name:String, description:String, price:Number, quantity:Number}[] ) {
    return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: products},{responseType: 'text', withCredentials: true});
  }

  delCart(prod: any) {
    let usr = JSON.stringify(localStorage.getItem('user'));
    usr = usr.replace('"','');
    usr = usr.replace('"','');
    let params = new HttpParams();
    params.set('username', usr);
    params.set('product', prod);
    if(prod.quantity == 0) {
      return this.http.delete(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{params: params, responseType: 'text', withCredentials: true});
    } else {
      return this.http.put(environment.serverUrl+'/cart/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: prod},{responseType: 'text', withCredentials: true});
    }
  }

//order
  
  getOrder() {
    let usr = JSON.stringify(localStorage.getItem('user'));
    usr = usr.replace('"','');
    usr = usr.replace('"','');
    let params = new HttpParams().set('username', usr);
    return this.http.get(environment.serverUrl+'/order/'+localStorage.getItem('user'),{params: params, responseType: 'text', withCredentials: true});
  }

  postOrder(prod : {name:String, description:String, price:Number, quantity:Number}[]) {
    return this.http.post(environment.serverUrl+'/order/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: prod,  responseType: 'text', withCredentials: true});
  }

  putOrder(prod : {name:String, description:String, price:Number, quantity:Number}[]) {
    console.log(environment.serverUrl+'/cart/'+localStorage.getItem('user') + ' username: '+ localStorage.getItem('user') +' -> PUT: products: '+ JSON.stringify(prod));
    return this.http.put(environment.serverUrl+'/order/'+localStorage.getItem('user'),{username: localStorage.getItem('user'), product: prod},{responseType: 'text', withCredentials: true});
  }

}
