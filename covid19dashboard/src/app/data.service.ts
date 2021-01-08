import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  private url: string = "https://api.covid19api.com/summary";
  private today: any;
  private lastWeek: any;

  constructor(private http: HttpClient) {}

  /*** Data retrieval functionalities ***/

  // Get all summary data
  getSummaryData(): Observable<any> {
    console.log("Data Service - getSummaryData(): " + this.url);
  
    return this.http.get(this.url)
      .pipe((response) => response);
  }

  getWeeklyData(Slug): Observable<any> {
    //https://api.covid19api.com/country/south-africa/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
    this.setCurrentDates(); 

    // Requested by country component
    if(Slug) {
      var urlDates = "https://api.covid19api.com/live/country/" + Slug + "/status/confirmed/date/" + this.lastWeek + "T00:00:00Z";
      console.log("Data Service - getWeeklyData country: " + urlDates);
      return this.http.get(urlDates)
        .pipe((response) => response);
    }
     // Requested by dashboard component
    else {
      var urlDates = "https://api.covid19api.com/world?from=" + this.lastWeek +"T00:00:00Z&to=" + this.today + "T00:00:00Z";
      console.log("Data Service - getWeeklyData world: " + urlDates);
      return this.http.get(urlDates)
        .pipe((response) => response);
   }
  }

  // Used by country component
  getDataCountryFromFirstCase(Slug): Observable<any> {

    var urlCountryFromFirstCase ="https://api.covid19api.com/dayone/country/" + Slug;

    console.log("Data Service - getDataCountryFromFirstCase: " + urlCountryFromFirstCase);
   
    return this.http.get(urlCountryFromFirstCase)
      .pipe((response) => response);
  }

  // Get World Data from 13th of April to today
  getDataApril(): Observable<any> {

    this.setCurrentDates();
    var urlApril ="https://api.covid19api.com/world?from=2020-04-13T00:00:00Z&to=" + this.today + "T00:00:00Z";

    console.log("Data Service - getDataApril: " + urlApril);
   
    return this.http.get(urlApril)
      .pipe((response) => response);
  }

  /*** Date functionalities ***/
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

  public getAPIFormatDate(date: Date) {

    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var result = yyyy + '-' + mm + '-' + dd;

    return result;
  }
  
  private setCurrentDates() {
    this.today = new Date();
    this.lastWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);

    this.today = this.getAPIFormatDate(this.today);
    this.lastWeek = this.getAPIFormatDate(this.lastWeek);
  }

}
