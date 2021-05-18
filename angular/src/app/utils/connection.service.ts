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
}
