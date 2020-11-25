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
  private urlCountryFromFirstCase: string;

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

  public getDateFromAPIDate(date: String) { //returns a Date from yyyy-mm-dd
    var yyyy = date[0] + date[1] + date[2] + date[3];
    var mm = date[5] + date[6];
    var dd = date[8] + date[9];

    return new Date(parseInt(yyyy), parseInt(mm)-1, parseInt(dd));
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

  getDataParam(Slug): Observable<any> {

//    console.log(Slug);

    if(Slug) { // country page
      return this.http.get(this.url)
        .pipe((response) => response);
    }
    else { // dashboard
      return this.http.get(this.url)
        .pipe((response) => response);
    }
  }

  getWeeklyData(Slug): Observable<any> {

//  console.log("Service - getWeeklyData, Slug: " + Slug);
    this.setCurrentDates();
  //  https://api.covid19api.com/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z


    if(Slug) { // country page
        this.urlDates = "https://api.covid19api.com/live/country/"+Slug+"/status/confirmed/date/" + this.lastWeek + "T13:13:30Z";
      //  https://api.covid19api.com/live/country/south-africa/status/confirmed/date/2020-03-21T13:13:30Z
      //  console.log("Service - getWeeklyData, urlDates: " + this.urlDates);
      return this.http.get(this.urlDates)
        .pipe((response) => response);
    }
   else {
      this.urlDates = "https://api.covid19api.com/world?from=" + this.lastWeek +"T00:00:00Z&to=" + this.today + "T00:00:00Z";
  //      console.log("Service - getWeeklyData, urlDates: " + this.urlDates);
      return this.http.get(this.urlDates)
        .pipe((response) => response);

   }

  }

  getDataCountryFromFirstCase(Slug): Observable<any> {


    this.urlCountryFromFirstCase ="https://api.covid19api.com/dayone/country/" + Slug;

    return this.http.get(this.urlCountryFromFirstCase)
      .pipe((response) => response);
  }

  getDataApril(): Observable<any> {

    this.setCurrentDates();
    this.urlApril ="https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to=" + this.today + "T00:00:00Z";

    return this.http.get(this.urlApril)
      .pipe((response) => response);
  }

}
