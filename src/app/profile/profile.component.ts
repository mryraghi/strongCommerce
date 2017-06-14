import {Component, OnInit} from "@angular/core";
import * as moment from "moment";
import * as _ from "lodash";

import {AUTH_CONFIG} from "../services/auth0-variables";
import {User} from "../objects/user.object";
import {APIService} from "../services/api.service";
import {Product} from "../objects/product.object";
import {AuthService} from "app/services/auth.service";
import {ErrorObject} from "app/objects/error.object";
import {InfoObject} from "app/objects/info.object";

// Avoid name not found warnings
declare const auth0: any;
declare const swal: any;

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
  info: InfoObject;
  cart: Product[] = [];
  fav: Product[] = [];
  total = 0;

  constructor(private apiService: APIService, private authService: AuthService) {
  }

  ngOnInit() {
    this.apiService.getToken().subscribe(
      response => {
        // save access_token
        localStorage.setItem('access_token', response.access_token);

        // if access_token has been retrieved then get user info
        this.apiService.getUser().subscribe(
          (user: User) => {
            this.cart = user.user_metadata.cart || [];
            this.fav = user.user_metadata.fav || [];
            this.info = user.user_metadata.info || new InfoObject();
            delete user.user_metadata.cart;
            delete user.user_metadata.fav;
            delete user.user_metadata.info;
            this.user = user;

            // once authenticated, get logs
            this.apiService.getLogs().subscribe(
              logs => this.logs = logs,
              err => this.throwError
            );
          },
          err => this.throwError
        );
      },
      err => this.throwError
    );
  }

  removeItem(type: 'cart' | 'fav', listing_id: number) {
    const product: Product = new Product(listing_id);

    this.apiService.updateUserMetadata(type, 'remove', product)
      .subscribe(
        (user: User) => {
          this.fav = user.user_metadata.fav;
          this.cart = user.user_metadata.cart;
        },
        err => this.throwError
      );
  }

  addToUserMetadata() {
    console.log(this.info);
    this.apiService.updateUserInfoMetadata(this.info)
      .subscribe(
        (user: User) => {
          this.fav = user.user_metadata.fav || [];
          this.cart = user.user_metadata.cart || [];
          this.info = user.user_metadata.info || new InfoObject();
        },
        err => this.throwError
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

  unescape(string: string) {
    return _.unescape(string);
  }

  private throwError(err) {
    const error: ErrorObject = err.json();
    swal({
      title: `${error.error} [${error.statusCode}]`,
      text: error.message,
      type: 'error',
      showCancelButton: true,
      confirmButtonText: 'Reload page',
      cancelButtonText: 'Logout'
    }).then(() => {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }, (dismiss) => {
      if (dismiss === 'cancel') {
        this.authService.logout();
      }
    });
  }

  onChange(listing_id: number, quantity_to_buy: number) {
    _.forEach(this.cart, (item: Product) => {
      if (_.isEqual(item.listing_id, listing_id)) {
        item.quantity_to_buy = _.toNumber(quantity_to_buy);
      }
    });
  }

  calculateTotal() {
    let total = 0;
    _.forEach(this.cart, (item: Product) => {
      total += (_.toNumber(item.price) * (item.quantity_to_buy || 1));
    });
    this.total = total;
  }

}
