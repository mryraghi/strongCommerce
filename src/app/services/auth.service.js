"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var angular2_jwt_1 = require('angular2-jwt');
var BehaviorSubject_1 = require('rxjs/BehaviorSubject');
require('rxjs/add/operator/filter');
var sweetalert2_1 = require('sweetalert2');
var auth0_variables_1 = require('../services/auth0-variables');
var AuthService = (function () {
    function AuthService(router) {
        this.router = router;
        // Create Auth0 web auth instance
        this.auth0 = new auth0.WebAuth({
            clientID: auth0_variables_1.AUTH_CONFIG.CLIENT_ID,
            domain: auth0_variables_1.AUTH_CONFIG.CLIENT_DOMAIN
        });
        this.loggedIn$ = new BehaviorSubject_1.BehaviorSubject(this.loggedIn);
        // If authenticated, set local profile property and update login status subject
        if (this.authenticated) {
            this.setLoggedIn(true);
        }
    }
    AuthService.getToken = function () {
        return localStorage.getItem('token');
    };
    AuthService.prototype.setLoggedIn = function (value) {
        // Update login status subject
        this.loggedIn$.next(value);
        this.loggedIn = value;
    };
    AuthService.prototype.login = function () {
        // Auth0 authorize request
        // Note: nonce is automatically generated: https://auth0.com/docs/libraries/auth0js/v8#using-nonce
        this.auth0.authorize({
            responseType: 'token',
            redirectUri: auth0_variables_1.AUTH_CONFIG.REDIRECT,
            audience: auth0_variables_1.AUTH_CONFIG.AUDIENCE,
            scope: auth0_variables_1.AUTH_CONFIG.SCOPE
        });
    };
    AuthService.prototype.handleAuth = function () {
        var _this = this;
        // When Auth0 hash parsed, get profile
        this.auth0.parseHash(function (err, authResult) {
            if (authResult && authResult.accessToken) {
                window.location.hash = '';
                _this._getProfile(authResult);
                _this.router.navigate(['/profile']);
            }
            else if (err) {
                _this.router.navigate(['/']);
                sweetalert2_1["default"]({
                    title: 'Error!',
                    text: err.error,
                    type: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        });
    };
    AuthService.prototype._getProfile = function (authResult) {
        var _this = this;
        // Use access token to retrieve user's profile and set session
        this.auth0.client.userInfo(authResult.accessToken, function (err, profile) {
            _this._setSession(authResult, profile);
        });
    };
    AuthService.prototype._setSession = function (authResult, profile) {
        // Save session data and update login status subject
        localStorage.setItem('token', authResult.accessToken);
        localStorage.setItem('profile', JSON.stringify(profile));
        this.setLoggedIn(true);
    };
    AuthService.prototype.logout = function () {
        // Remove tokens and profile and update login status subject
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
        this.router.navigate(['/']);
        this.setLoggedIn(false);
    };
    Object.defineProperty(AuthService.prototype, "authenticated", {
        get: function () {
            // Check if there's an unexpired access token
            return angular2_jwt_1.tokenNotExpired('token');
        },
        enumerable: true,
        configurable: true
    });
    AuthService = __decorate([
        core_1.Injectable()
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
module.exports.AuthService = AuthService;
