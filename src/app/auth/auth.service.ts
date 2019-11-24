import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Auth } from './auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  createUser(email: string, password: string) {
    const authData: Auth = { email, password };
    this.http
      .post('http://localhost:3000/api/users/signup', authData, this.httpOptions)
      .subscribe(data => {
        console.log(data);
      });
  }

  loginUser(email: string, password: string) {
    const authData: Auth = { email, password };
    this.http
      .post(
        'http://localhost:3000/api/users/login',
        authData,
        this.httpOptions
      )
      .subscribe(data => {
        console.log(data);
      });
  }
}
