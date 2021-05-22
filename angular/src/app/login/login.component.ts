import { Component, OnInit } from '@angular/core';
import { LoginService } from '../utils/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  accessLevel: string;

  constructor(private loginService: LoginService, private router: Router) {
    this.username = '';
    this.password = '';
    this.accessLevel = '';
  }

  login() {
    if (this.username != '' && this.password != '') {
      //TODO: iderakni egy accesslevel lekerest
      this.loginService.login(this.username, this.password, this.accessLevel).subscribe(msg => {
        console.log(msg);
        localStorage.setItem('user', this.username);
        this.router.navigate(['/first']);
      }, error => {
        console.log(error);
      })
    }
  }

  ngOnInit(): void {
    if (localStorage.getItem('user')) {
      localStorage.setItem('access', this.accessLevel);
      localStorage.removeItem('user');
      this.loginService.logout().subscribe(msg => {
        console.log(msg);
      }, error => {
        console.log(error);
      })
    }
  }

}
