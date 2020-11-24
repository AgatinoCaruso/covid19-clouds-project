import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private url: string = "https://api.covid19api.com/summary";
  private urlDates: string;
  private urlApril: string;
  private today: any;
  private lastWeek: any;

  constructor(private http: HttpClient) {}

  public getAPIFormatDate(date: Date) {

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var result = yyyy + '-' + mm + '-' + dd;

    return result;
  }

  public getReverseAPIFormatDate(date: Date) {

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var result = dd + '-' + mm + '-' + yyyy;

    return result;
  }

  private setCurrentDates() {
    this.today = new Date();
    this.lastWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);

    this.today = this.getAPIFormatDate(this.today);
    this.lastWeek = this.getAPIFormatDate(this.lastWeek);
  }

  getData(): Observable<any> {
    return this.http.get(this.url)
      .pipe((response) => response);
  }

  getWeeklyData(): Observable<any> {

    this.setCurrentDates();
    this.urlDates = "https://api.covid19api.com/world?from=" + this.lastWeek +"T00:00:00Z&to=" + this.today + "T00:00:00Z";

    return this.http.get(this.urlDates)
      .pipe((response) => response);
  }

  getDataApril(): Observable<any> {

    this.setCurrentDates();
    this.urlApril ="https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to=" + this.today + "T00:00:00Z";

    return this.http.get(this.urlApril)
      .pipe((response) => response);
  }
}
