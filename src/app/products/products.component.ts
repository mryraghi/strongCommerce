import {Component, OnInit} from "@angular/core";
import {APIService} from "../services/api.service";
import {Product} from "../objects/product.object";
import * as _ from "lodash";
import {AuthService} from "../services/auth.service";
import {default as swal} from "sweetalert2";
import {User} from "../objects/user.object";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // instantiate posts to an empty array
  products: Product[] = [];
  cart: Product[] = [];
  fav: Product[] = [];

  // TODO: investigate over PUBLIC authService
  constructor(private apiService: APIService, public authService: AuthService) {
  }

  ngOnInit() {
    // Retrieve posts from the API
    this.apiService.getAllProducts().then(products => this.products = products.results);
  }

  isCartEmpty(): boolean {
    return (_.isUndefined(this.cart) ? true : _.isEmpty(this.cart));
  }

  addToUserMetadata(type: 'fav' | 'cart', listing_id: number) {
    if (this.authService.authenticated) {

      this.apiService.getOneProduct(listing_id)
        .then(newProduct => {
          const product: Product = new Product();
          product.copyProduct(newProduct.results[0]);

          this.apiService.updateUserMetadata(type, 'add', product).then(
            (user: User) => {
              this.fav = user.user_metadata.fav;
              this.cart = user.user_metadata.cart;
            }
          );
        });

    } else {
      swal('strongCommerce', 'You must be logged in!', 'warning');
    }
  }

  // move to utilities.service.ts
  transform(text: string, chars: number): string {
    return (_.isUndefined(text) ? '–' : (text.length > chars ? text.substring(0, chars) + '...' : text));
  }
}
