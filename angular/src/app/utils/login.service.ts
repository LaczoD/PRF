import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(environment.serverUrl + '/login', {username: username, password: password}, 
    {withCredentials: true, 
    responseType: 'text', observe: 'response' as 'response'});
  }

  logout() {
    return this.http.post(environment.serverUrl + '/logout', 
    {withCredentials: true, responseType: 'text'});
  }
}
