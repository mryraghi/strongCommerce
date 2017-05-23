import {Component, OnInit} from "@angular/core";
import {APIService} from "./services/api.service";
import {User} from "./objects/user.object";
import {Product} from "./objects/product.object";
import {AuthService} from "./services/auth.service";
import * as _ from "lodash";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  cart: Product[] = [];

  constructor(public authService: AuthService, private apiService: APIService) {
  }

  ngOnInit(): void {
    console.log(localStorage.getItem('profile'));

    if (!_.isNull(localStorage.getItem('profile'))) {
      this.apiService.getUser().then((user: User) => {
        this.cart = user.user_metadata.cart;
      });
    }
  }

  isCartEmpty(): boolean {
    return (_.isUndefined(this.cart) ? true : _.isEmpty(this.cart));
  }
}
