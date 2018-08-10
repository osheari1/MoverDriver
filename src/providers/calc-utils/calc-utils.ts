import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

/*
  Generated class for the CalcUtilsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CalcUtilsProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CalcUtilsProvider Provider');
  }

  static convertMetersToMiles(meters: number): number {
    return meters / 1609.34
  }

  static calculatePriceViaMiles(
    baseFee: number,
    minimumFee: number,
    feePerMile: number,
    miles: number
  ): number {
    var fee = baseFee + feePerMile * miles
    if (fee < minimumFee) {
      fee = minimumFee
    }
    return fee
  }


}
