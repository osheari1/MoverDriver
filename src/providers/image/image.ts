import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ImageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ImageProvider {

  constructor(public http: Http) {}

  getData(): Promise<any> {
    // return this.http.get('./assets/example_data/listing.json')
    return this.http.get('./assets/data/listing.json')
     .toPromise()
     .then(response => response.json() as any)
     .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }



}
