import * as _ from "lodash";

export class Product {
  listing_id: number;
  state: string;
  user_id: string;
  category_id: string;
  title: string;
  description: string;
  price: string;
  currency_code: string;
  quantity: number;
  views: number;
  when_made: string;
  tags: string[];
  MainImage: object;

  constructor(product: Product) {
    this.listing_id = product.listing_id;
    this.state = product.state;
    this.user_id = product.user_id;
    this.category_id = product.category_id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.currency_code = product.currency_code;
    this.quantity = product.quantity;
    this.views = product.views;
    this.when_made = product.when_made;
    this.tags = product.tags;
    this.MainImage = _.omitBy(product.MainImage, _.isNull);
  }
}
