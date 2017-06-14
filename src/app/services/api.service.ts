import {Injectable} from "@angular/core";
import {Headers, Http, URLSearchParams} from "@angular/http";
import "rxjs/add/operator/toPromise";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import * as _ from "lodash";

import {Product} from "../objects/product.object";
import {AUTH_CONFIG} from "../services/auth0-variables";
import {User} from "../objects/user.object";
import {AuthService} from "../services/auth.service";
import {InfoObject} from "../objects/info.object";

@Injectable()
export class APIService {
  cart: Product[] = [];
  fav: Product[] = [];
  info: InfoObject;
  init = false;

  static handleError(error: any): Promise<any> {
    return Promise.reject(error);
  }

  constructor(private http: Http, private authService: AuthService) {
  }

  /**
   * When a client application wants to access protected endpoints on an API
   * it needs to present an access token as proof that it has the required
   * permissions for make the call to the endpoint.
   *
   * An access token is obtained by authenticating the user with
   * AuthService.login() and the user can then in turn authorize the
   * application to access the API on their behalf.
   *
   * An API can enforce fine grained control over who can access the various
   * endpoints exposed by the API. These permissions are expressed as scopes.
   *
   * When a user authorizes a client application, the application can also
   * indicate which permissions it requires. The user is then allowed to review
   * and grant these permissions. These permissions are then included in the
   * access token as part of the scope claim.
   *
   * Subsequently when the client passes along the access token when making
   * requests to the API, the API can query the scope claim to ensure that the
   * required permissions were granted in order to call the particular API endpoint.
   */
  getToken() {
    const token = localStorage.getItem('token');

    return this.http.get('/secure/authenticate', {
      headers: this.getHeaders('token')
    }).map(res => res.json());
  }

  getUser() {
    const user: User = JSON.parse(localStorage.getItem('profile'));

    return this.http.get(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}#asd`, {
      headers: this.getHeaders(),
      search: this.getParams()
    }).map(res => res.json())
      .do(res => {
          this.cart = res.user_metadata.cart;
          this.fav = res.user_metadata.fav;
          return res;
        }
      );
  }

  updateUserInfoMetadata(info: InfoObject) {
    this.info = info;

    const user: User = JSON.parse(localStorage.getItem('profile'));

    return this.http.patch(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}`, JSON.stringify({
      'user_metadata': {
        'fav': this.fav,
        'cart': this.cart,
        'info': info
      }
    }), {
      headers: this.getHeaders(),
      search: this.getParams()
    }).map(res => res.json());
  }

  /**
   * Update logged user's metadata on Auth0
   * @param type cart/fav
   * @param action add/remove
   * @param product The product the user wants to save
   * @returns {Observable<>}
   */
  updateUserMetadata(type: 'cart' | 'fav', action: 'add' | 'remove', product: Product) {
    switch (action) {
      case 'add':
        let found = false;

        // check whether the product is already on the local list
        _.forEach(this[type], (item) => {
          if (_.isEqual(item.listing_id, product.listing_id)) {
            found = true;
          }
        });

        // if not found then add it
        if (!found) {
          this[type].push(product);
        }
        break;

      case 'remove':

        // remove product from local list if present
        _.remove(this[type], (item: Product) => {
          return _.isEqual(item.listing_id, product.listing_id);
        });
        break;
    }

    const user: User = JSON.parse(localStorage.getItem('profile'));

    return this.http.patch(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}`, JSON.stringify({
      'user_metadata': {
        'fav': this.fav,
        'cart': this.cart
      }
    }), {
      headers: this.getHeaders(),
      search: this.getParams()
    }).map(res => res.json())
      .do(
        (newUser: User) => {
          const updatedUser: User = newUser;

          this.fav = (_.has(updatedUser.user_metadata, 'fav') ? updatedUser.user_metadata.fav : []);
          this.cart = (_.has(updatedUser.user_metadata, 'cart') ? updatedUser.user_metadata.cart : []);

          return updatedUser;
        }
      );
  }

  getLogs() {
    const user: User = JSON.parse(localStorage.getItem('profile'));

    return this.http.get(`https://rbellon.eu.auth0.com/api/v2/users/${user.sub}/logs`, {
      headers: this.getHeaders(),
      search: this.getParams(),
    }).map(res => res.json());
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

  getLocalCart() {
    if (!this.init) {
      this.getUser().subscribe(
        res => {
          return this.cart || [];
        },
        err => {
          return [];
        }
      );
      this.init = true;
    }

    return this.cart || [];
  }

  private getHeaders(type?: 'token' | 'access_token') {
    const token = type || 'access_token';
    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('Authorization', `Bearer ${localStorage.getItem(token)}`);

    return headers;
  }

  private getParams() {
    const params: URLSearchParams = new URLSearchParams();
    params.set('audience', AUTH_CONFIG.AUDIENCE);

    return params;
  }

  // Connect to MongoDB
  connectDB() {
    const token = localStorage.getItem('token');
    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('authorization', `Bearer ${token}`);

    return this.http.get('/secure/connect', {
      headers: headers
    }).map(res => res.json());
  }

  // Close connection to MongoDB
  closeDB() {
    const token = localStorage.getItem('token');
    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('authorization', `Bearer ${token}`);

    return this.http.get(`/secure/api/close-db`, {
      headers: headers
    }).map(res => res.json());
  }
}
