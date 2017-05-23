import {Component, OnInit} from "@angular/core";
import * as moment from "moment";

import {AUTH_CONFIG} from "../services/auth0-variables";
import {User} from "../objects/user.object";
import {APIService} from "../services/api.service";
import {Product} from "../objects/product.object";

// Avoid name not found warnings
declare const auth0: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  auth0Manage = new auth0.Management({
    domain: 'rbellon.eu.auth0.com',
    token: AUTH_CONFIG.CLIENT_ID
  });

  user: User;
  logs: any;
  cart: Product[];
  fav: Product[];

  constructor(private apiService: APIService) {
  }

  ngOnInit() {
    this.apiService.getUser().then((user: User) => {
      this.cart = user.user_metadata.cart;
      this.fav = user.user_metadata.fav;
      delete user.user_metadata.cart;
      delete user.user_metadata.fav;
      this.user = user;
    });

    this.apiService.getLogs().then((logs: any) => this.logs = logs);
  }

  removeItem(type: 'cart' | 'fav', listing_id: number) {
    const product: Product = new Product(listing_id);

    this.apiService.updateUserMetadata(type, 'remove', product).then(
      (user: User) => {
        this.fav = user.user_metadata.fav;
        this.cart = user.user_metadata.cart;
      }
    );
  }

  parseDate(date: Date) {
    return moment(date).format('dd/mm/YYYY');
  }

  parseDateFromNow(date: Date) {
    return moment(date).fromNow();
  }

  newArray(number: number) {
    return Array(number).fill(1);
  }

}
