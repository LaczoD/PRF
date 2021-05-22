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

  example = ['1_elem'];

  goToSecond() {
    this.router.navigate(['/second', 'PRF', {message: this.title}]);
  }

  hello() {
    console.log('Hello World!');
    if(this.title === 'PRF') {
      this.title = 'NOT PRF';
    } else {
      this.title = 'PRF';
    }

    this.connectionService.greet().subscribe(data => {
      console.log('This came from the server: ', data);
    }, error => {
      console.log('Sorry we encountered an error: ', error);
    });

    this.connectionService.getTodos().subscribe(res => {
      console.log('spring response', res);
    }, error => {
      console.log('error on the spring part', error);
    })
  }

  helloFrom(st: string) {
    console.log('Hello from ' + st);
  }

  ngOnInit(): void {
  }

  /**
   * title = 'Áruház';
  example = ['1_elem'];

  hello() {
    console.log('Hello world!');
    if(this.title == 'PRF') {
      this.title = 'NOT PRF';
    } else {
      this.title = 'PRF';
    }
    this.example.push(Math.floor(Math.random()*100)+'_elem');
    this.connectionService.greet().subscribe(data => {
      console.log('This came from the server: '+ data);
    }, error => {
      console.log('Sorry we encountered an error: '+ error);
    });
  }

  helloFrom(st: string) {
    console.log('Hello from '+ st +'!');
  }

   */
}
