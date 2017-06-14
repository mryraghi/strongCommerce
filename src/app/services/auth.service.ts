import {Injectable} from "@angular/core";
import {tokenNotExpired} from "angular2-jwt";
import {Router} from "@angular/router";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import "rxjs/add/operator/filter";
import {default as swal} from "sweetalert2";
import {Headers, Http} from "@angular/http";

import {AUTH_CONFIG} from "../services/auth0-variables";
import {ErrorObject} from "../objects/error.object";

// Avoid name not found warnings
declare const auth0: any;
declare const auth0Manage: any;

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN
  });

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(public router: Router, public http: Http) {

    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.setLoggedIn(true);
    }

    setInterval(this.authenticated, 1000);
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  /**
   * The purpose of this call is to obtain consent from
   * the user to invoke the API (specified in audience)
   * and do certain things (specified in scope) on behalf
   * of the user. Auth0 will authenticate the user and
   * obtain consent, unless consent has been previously given.
   */
  login() {
    // Auth0 authorize request
    // Note: nonce is automatically generated: https://auth0.com/docs/libraries/auth0js/v8#using-nonce
    this.auth0.authorize({
      responseType: 'token',
      redirectUri: AUTH_CONFIG.REDIRECT,
      client_id: AUTH_CONFIG.CLIENT_ID,
      audience: AUTH_CONFIG.AUDIENCE,
      scope: AUTH_CONFIG.SCOPE,
      state: 'test' // used to prevent CSRF
    });
  }

  /**
   * Parse and handle hash received after a successful authentication
   */
  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken) {
        window.location.hash = '';
        this.router.navigate(['/profile']);
        this._getProfile(authResult);
      } else if (err) {
        this.router.navigate(['/']);
        swal({
          title: 'Error!',
          text: err.error,
          type: 'error',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  /**
   * Retrieve user's profile after successful authentication
   * @param authResult
   * @private
   */
  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  /**
   * Save authentication and profile tokens into localStorage
   * @param authResult
   * @param profile
   * @private
   */
  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    this.setLoggedIn(true);

    this._getAccessToken();
  }

  /**
   * Once authenticated retrieve access_token needed to make authorized requests
   * @private
   */
  private _getAccessToken() {
    // equal to apiService.getToken()
    // had to copy because otherwise there's a circular dependency

    // get access_token needed to make authorized API requests
    const token = localStorage.getItem('token');
    const headers: Headers = new Headers();
    headers.append('content-type', 'application/json');
    headers.append('authorization', `Bearer ${token}`);

    return this.http.get('/secure/authenticate', {
      headers: headers
    }).map(res => res.json()).subscribe(
      response => {
        localStorage.setItem('access_token', response.access_token);
      },
      err => {
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
            this.logout();
          }
        });
      }
    );
  }

  /**
   * Logout by removing every token
   */
  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.router.navigate(['/']);
    this.setLoggedIn(false);
  }

  /**
   * Check whether the authentication token is expired or invalid
   * @returns {boolean}
   */
  get authenticated() {
    // Check if there's an unexpired access token
    return tokenNotExpired('token');
  }
}
