import { ProductCategory } from './../common/product-category';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8081/api/products';
  private categoryUrl = 'http://localhost:8081/api/product-category';

  constructor(private httpClient: HttpClient) {}

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;

    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate( thePage: number,
                          thePageSize: number,
                          theCategoryId: number): Observable<GetResponseProducts> {
    //need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                    + `&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    //need to build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getPtoducts(searchUrl);
  }

  searchProducts(theKeyWord: string): Observable<Product[]> {
    //need to build url based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

    return this.getPtoducts(searchUrl);
  }

  searchProductsPaginate( thePage: number,
    thePageSize: number,
    theKeyWord: string): Observable<GetResponseProducts> {
//need to build url based on category id
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
+ `&page=${thePage}&${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}

  private getPtoducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient
      .get<GetResponseProducts>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
