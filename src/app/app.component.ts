import {Component, OnDestroy, OnInit} from "@angular/core";
import {APIService} from "./services/api.service";
import {Product} from "./objects/product.object";
import {AuthService} from "./services/auth.service";
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  cart: Product[] = [];

  constructor(public authService: AuthService, private apiService: APIService) {
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.authService.authenticated) {
        this.cart = this.apiService.getLocalCart();
      }
    }, 500);
  }

  ngOnDestroy(): void {
  }

  isCartEmpty(): boolean {
    return (_.isUndefined(this.cart) ? true : _.isEmpty(this.cart));
  }

  unescape(string: string) {
    return _.unescape(string);
  }
}
