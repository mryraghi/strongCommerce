import {Injectable} from "@angular/core";
import {Headers, Http, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import * as _ from "lodash";

import {Product} from "../objects/product.object";
import {AUTH_CONFIG} from "../services/auth0-variables";
import {User} from "../objects/user.object";

@Injectable()
export class APIService {
  BASE_URL = 'https://rbellon.eu.auth0.com/';
  cart: Product[] = [];
  fav: Product[] = [];

  // Implement a method to handle errors if any
  static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) {
    this.getToken();

    if (!_.isNull(localStorage.getItem('profile'))) {
      this.getUser().then((user: User) => {
        this.cart = user.user_metadata.cart;
        this.fav = user.user_metadata.fav;
      });
    }
  }

  private getToken() {
    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');

    this.http.post(this.BASE_URL + 'oauth/token', {
      grant_type: 'client_credentials',
      client_id: AUTH_CONFIG.CLIENT_ID,
      client_secret: AUTH_CONFIG.CLIENT_SECRET,
      audience: 'https://rbellon.eu.auth0.com/api/v2/'
    }, {
      headers: headers
    }).toPromise()
      .then(response => localStorage.setItem('access_token', response.json().access_token))
      .catch(APIService.handleError);
  }

  getUser() {
    const user: User = JSON.parse(localStorage.getItem('profile'));

    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    const params: URLSearchParams = new URLSearchParams();
    params.set('audience', AUTH_CONFIG.AUDIENCE);

    return this.http.get(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}`, {
      headers: headers,
      search: params
    }).toPromise()
      .then(response => response.json())
      .catch(APIService.handleError);
  }

  updateUserMetadata(type: 'cart' | 'fav', action: 'add' | 'remove', product: Product) {

    switch (action) {
      case 'add':
        let found = false;
        _.forEach(this[type], (item) => {
          if (_.isEqual(item.listing_id, product.listing_id)) {
            found = true;
          }
        });
        if (!found) {
          this[type].push(product);
        }
        break;

      case 'remove':
        _.remove(this[type], (item: Product) => {
          return _.isEqual(item.listing_id, product.listing_id);
        });
        break;

      default:
        break;
    }

    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    const user: User = JSON.parse(localStorage.getItem('profile'));

    const params: URLSearchParams = new URLSearchParams();
    params.set('audience', AUTH_CONFIG.AUDIENCE);

    return this.http.patch(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}`, JSON.stringify({
      'user_metadata': {
        'fav': this.fav,
        'cart': this.cart
      }
    }), {
      headers: headers,
      search: params
    }).toPromise()
      .then(response => {
        const updatedUser: User = response.json();

        this.fav = (_.has(updatedUser.user_metadata, 'fav') ? updatedUser.user_metadata.fav : []);
        this.cart = (_.has(updatedUser.user_metadata, 'cart') ? updatedUser.user_metadata.cart : []);

        return updatedUser;
      })
      .catch(APIService.handleError);
  }

  getLogs() {
    const user: User = JSON.parse(localStorage.getItem('profile'));

    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

    const params: URLSearchParams = new URLSearchParams();
    params.set('audience', AUTH_CONFIG.AUDIENCE);

    return this.http.get(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}/logs`, {
      headers: headers,
      search: params
    }).toPromise()
      .then(response => response.json())
      .catch(APIService.handleError);
  }

  // Get all posts from the API
  getAllProducts() {
    return this.http.get('/api/products/trending')
      .toPromise()
      .then(response => response.json() as Product[])
      .catch(APIService.handleError);
  }

  // Get one post from the API
  getOneProduct(listing_id: number) {
    return this.http.get(`/api/products/${listing_id}`)
      .toPromise()
      .then(response => response.json() as Product)
      .catch(APIService.handleError);
  }

  getLocalUser() {
    return this.cart || [];
  }
}
