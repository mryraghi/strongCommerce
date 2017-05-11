import {Component, OnInit} from '@angular/core';
import {ProductsService} from '../services/products.service';
import {Product} from '../objects/product';
import * as _ from 'lodash';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  // instantiate posts to an empty array
  products: Product[] = [];
  cart: Product[] = [];

  // TODO: investigate over PUBLIC authService
  constructor(private productsService: ProductsService, public authService: AuthService) {
  }

  ngOnInit() {
    // Retrieve posts from the API
    this.productsService.getAllProducts().then(products => this.products = products.results);
  }

  isCartEmpty(): boolean {
    return (_.isUndefined(this.cart) ? true : _.isEmpty(this.cart));
  }

  addToCart(listing_id: number) {
    const product: Product = new Product(listing_id, this.productsService);
    this.cart.push(product);
  }

  addToFavourites(listing_id: number) {

  }

  // move to utilities.service.ts
  transform(text: string, chars: number): string {
    return (_.isUndefined(text) ? '–' : (text.length > chars ? text.substring(0, chars) + '...' : text));
  }
}
