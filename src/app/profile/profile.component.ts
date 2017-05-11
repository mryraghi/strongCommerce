import {Component, OnInit} from '@angular/core';
import {AUTH_CONFIG} from '../services/auth0-variables';

// Avoid name not found warnings
declare const auth0: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  auth0Manage = new auth0.Management({
    domain: 'rbellon.eu.auth0.com',
    token: AUTH_CONFIG.CLIENT_ID
  });
  user: any = localStorage.getItem('profile');

  constructor() {
  }

  ngOnInit() {
  }

  updateUser() {
    this.auth0Manage.getUser(JSON.parse(this.user).sub, (user) => {
      console.log(user);
    });
  }

}
