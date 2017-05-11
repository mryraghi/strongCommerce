import {ProductsService} from '../services/products.service';

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
  tags: string[];
  MainImage: {
    listing_id: number;
    url_75x75: string;
    url_170x135: string;
    url_570xN: string;
    url_fullxfull: string;
  };

  constructor(private id: number, private productsService: ProductsService) {
    this.productsService.getOneProduct(id).then(product => this.fillFields(product.results[0]));
  }

  private fillFields(product: Product) {
    this.listing_id = product.listing_id;
    this.state = product.state;
    this.user_id = product.user_id;
    this.category_id = product.category_id;
    this.title = product.title;
    this.description = product.description;
    this.price = product.price;
    this.currency_code = product.currency_code;
    this.quantity = product.quantity;
    this.tags = product.tags;
    this.MainImage = product.MainImage;
  }
}
