import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Country, CountryLong } from '../interfaces/countries.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private _regions= ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  private _endPoint = `https://restcountries.com/v3.1`;
  get regions(): string[] {
    return [...this._regions];
  }
  constructor(private http:HttpClient) { }

  getCountriesByRegion(region:string): Observable<Country[]>{
    const url = `${this._endPoint}/region/${region}?fields=cca2,name`
    return this.http.get<Country[]>(url);
  }

  getCountryByCode(code:string): Observable<CountryLong[] | null>{
    if (!code) {
      return of(null);
    }

    const url = `${this._endPoint}/alpha/${code}`;
    return this.http.get<CountryLong[]>(url);

  }

  getCountriesByCodeSmall(code:string): Observable<Country>{
    const url = `${this._endPoint}/alpha/${code}?fields=cca2,name`;

    return this.http.get<Country>(url);
  }

  getCountriesByCodes(borders:string[]): Observable<Country[]>{
    console.log("entree");

    if (!borders)
      return of([]);
    const requests: Observable<Country>[]=[];
    borders.forEach(code => {
      console.log(code);

      const request = this.getCountriesByCodeSmall(code);
      requests.push(request);
    });

    return combineLatest(requests);
  }


}
