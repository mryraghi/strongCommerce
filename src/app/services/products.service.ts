import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Product} from '../objects/product';

@Injectable()
export class ProductsService {

  // Implement a method to handle errors if any
  static handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  constructor(private http: Http) {
  }

  // Get all posts from the API
  getAllProducts() {
    return this.http.get('/api/products/trending')
      .toPromise()
      .then(response => response.json() as Product[])
      .catch(ProductsService.handleError);
  }

  // Get one post from the API
  getOneProduct(listing_id: number) {
    return this.http.get(`/api/products/${listing_id}`)
      .toPromise()
      .then(response => response.json() as Product)
      .catch(ProductsService.handleError);
  }
}
