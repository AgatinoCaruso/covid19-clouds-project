import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { DataService } from '../data.service';
import { GlobalData, CountryDataFromZero } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  dataSinceApril: Array<GlobalData>;
  today: Date;
  AprilThirt: Date;
  Slug: string;
  countryAllDataFromZero: Array<CountryDataFromZero>;
  //   { data: [], pointRadius: 0, label: 'Total Deaths' },
  // pointRadius=0 removes dots on data
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Deaths' },
    { data: [], label: 'Total Recovered' },
    { data: [], label: 'Total Cases' }
  ];
  public lineChartLabels: Label[] = ["1"];
  public lineChartOptions: (ChartOptions) = {
    // removes labels on data
    plugins: {
      datalabels: {
          display: false,
      },
    },
    responsive: true,
  };


  public lineChartColors: Color[] = [
    { backgroundColor: '#f5c6cb' },
    { backgroundColor: '#bee5eb' },
    { backgroundColor: '#ffeeba' }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private dataService: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

  ngOnInit(): void {

    this.getDataFromDate();

  }

  public getDataFromDate() {
    this.actRoute.params.subscribe(params => {
      if(params['Slug']) { //in a country
        this.dataService.getDataCountryFromFirstCase(params['Slug']).subscribe(
          response => {
            this.countryAllDataFromZero = response;
            //console.log(this.countryAllDataFromZero);
            this.setCurrentDates();
            this.setDataCountry();
      // console.log("getDataCountryFromFirstCase, country, Slug: " + this.Slug);
          }
          )
        }

        else {
          this.dataService.getDataApril().subscribe(
            response => {
              this.dataSinceApril = response;
             // console.log("Line chart - get data dashboard: " + this.dataSinceApril);
              this.setCurrentDates();
              this.setData();
          //console.log("getDataApril, dashboard, Slug: " + this.Slug);
            }
          )
        }
      })
  }

  
  public setDataCountry() {
    
    var firstCaseString = this.countryAllDataFromZero[0].Date;
    var firstCaseDate = this.dataService.getDateFromAPIDate(firstCaseString);
    var daysFromTheFirstCase = this.getDaysFromDate(firstCaseDate);
    this.lineChartLabels[0] = this.dataService.getReverseAPIFormatDate(firstCaseDate);


    for (let j = 0; j < daysFromTheFirstCase-1; j++) {
      this.lineChartLabels[j] = this.dataService.getReverseAPIFormatDate(
        new Date(firstCaseDate.getFullYear(), firstCaseDate.getMonth(), firstCaseDate.getDate() + j));

        if(this.countryAllDataFromZero[j].Province == "") { //ignore provinces and overseas territories
            this.lineChartData[0].data[j] = this.countryAllDataFromZero[j].Deaths;
            this.lineChartData[1].data[j] = this.countryAllDataFromZero[j].Recovered;
            this.lineChartData[2].data[j] = this.countryAllDataFromZero[j].Confirmed;
        }
    }
    this.chart.update();
  }

  public setData() {

    let TotalConfirmed = [];
    let TotalRecovered = [];
    let TotalDeaths = [];
    this.dataSinceApril.forEach(element => {
      TotalConfirmed.push(element.TotalConfirmed);
      TotalRecovered.push(element.TotalRecovered);
      TotalDeaths.push(element.TotalDeaths);
    });
     TotalConfirmed = TotalConfirmed.sort((a, b) => a - b)
     TotalRecovered = TotalRecovered.sort((a, b) => a - b)
     TotalDeaths = TotalDeaths.sort((a, b) => a - b)

    this.lineChartLabels[0] = this.dataService.getReverseAPIFormatDate(this.AprilThirt);

    
    for (let j = 0; j < this.getDaysFromAprilThirt()-1; j++) {
      this.lineChartLabels[j] = this.dataService.getReverseAPIFormatDate(new Date(this.AprilThirt.getFullYear(), this.AprilThirt.getMonth(), this.AprilThirt.getDate() + j));
      this.lineChartData[0].data[j] = TotalDeaths[j];
      this.lineChartData[1].data[j] = TotalRecovered[j];
      this.lineChartData[2].data[j] = TotalConfirmed[j];
    }

    this.chart.update();
  }

  private setCurrentDates() {
    this.today = new Date();
    this.AprilThirt = new Date(2020, 3, 13); // January is zero!!
  }

  private getDaysFromAprilThirt() {

   return this.getDaysFromDate(this.AprilThirt);

  }

  private getDaysFromDate(date: Date) {
    // To calculate the time difference of two dates
    var Difference_In_Time = this.today.getTime() - date.getTime();

    // To calculate the no. of days between two dates
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;

  }

}
