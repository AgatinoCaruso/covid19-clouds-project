import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private url: string = "https://api.covid19api.com/summary";
  private urlDates: string = "https://api.covid19api.com/world?from=2020-09-15T00:00:00Z&to=2020-09-22T00:00:00Z";
  private urlApril: string = "https://api.covid19api.com/world?from=2020-04-13T00:00:00Z";

  constructor(private http: HttpClient) {}


  getData(): Observable<any> {
    return this.http.get(this.url)
      .pipe((response) => response);
  }

  getWeeklyData(): Observable<any> {
    return this.http.get(this.urlDates)
      .pipe((response) => response);
  }

  getDataApril(): Observable<any> {
    return this.http.get(this.urlApril)
      .pipe((response) => response);
  }
}
