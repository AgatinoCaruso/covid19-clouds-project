import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { WeeklyData, CountryData } from '../models';
import { ActivatedRoute } from '@angular/router';


import * as pluginAnnotations from 'chartjs-plugin-annotation';
@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {
  weeklyData: WeeklyData;
  Slug: string;
  today: Date;
  lastWeek: Date;
  countryData: Array<CountryData>;


  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      // removes labels on data
        datalabels: {
            display: false,
      },
    }
  };
  public barChartLabels: Label[] = ['01', '02', '03', '04', '05', '06', '07'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartColors: Color[] = [
    { backgroundColor: '#f5c6cb' },
    { backgroundColor: '#bee5eb' },
    { backgroundColor: '#ffeeba' }
  ];
  public barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Daily Deaths' },
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Daily Recovered' },
    { data: [0, 0, 0, 0, 0, 0, 0], label: 'Daily New Cases' },
  ];

  constructor(private service: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

  ngOnInit(): void {
    this.getWeeklyData();
  }

  getWeeklyData() {

     if(this.Slug) { //in a country
        this.actRoute.params.subscribe(params => {
          if(params['Slug']) {

            this.service.getWeeklyData(params['Slug']).subscribe(
              response => {
              //     console.log("getWeeklyData, country, Slug: " + this.Slug);
                   this.weeklyData = response;
                    this.setCurrentDates();
                    this.setCountryData();
              }
            )
          }
      })
    }
    else { // in dashboard
      this.service.getDataApril().subscribe(
        response => {
        //  console.log("getWeeklyData, dashboard, Slug: " + this.Slug);
          this.weeklyData = response;
          this.setCurrentDates();
          this.setGlobalData();
        }
      )
    }

//  console.log("getWeeklyData, End");
}

  public setCountryData() {

    if (typeof  this.countryData !== 'undefined' &&   this.countryData.length > 0) {

      this.barChartData[0].data = [
        this.countryData[0].TotalDeaths,
        this.countryData[1].TotalDeaths,
        this.countryData[2].TotalDeaths,
        this.countryData[3].TotalDeaths,
        this.countryData[4].TotalDeaths,
        this.countryData[5].TotalDeaths,
        this.countryData[6].TotalDeaths ];

      this.barChartData[1].data = [
        this.countryData[0].TotalRecovered,
        this.countryData[1].TotalRecovered,
        this.countryData[2].TotalRecovered,
        this.countryData[3].TotalRecovered,
        this.countryData[4].TotalRecovered,
        this.countryData[5].TotalRecovered,
        this.countryData[6].TotalRecovered ];

      this.barChartData[2].data = [
        this.countryData[0].TotalConfirmed,
        this.countryData[1].TotalConfirmed,
        this.countryData[2].TotalConfirmed,
        this.countryData[3].TotalConfirmed,
        this.countryData[4].TotalConfirmed,
        this.countryData[5].TotalConfirmed,
        this.countryData[6].TotalConfirmed ];
      }
      else {
        console.log("Country Bar Diagram no data!");
      }
    }

    public setGlobalData() {

      this.barChartData[0].data = [
        this.weeklyData[0].TotalDeaths,
        this.weeklyData[1].TotalDeaths,
        this.weeklyData[2].TotalDeaths,
        this.weeklyData[3].TotalDeaths,
        this.weeklyData[4].TotalDeaths,
        this.weeklyData[5].TotalDeaths,
        this.weeklyData[6].TotalDeaths ];

      this.barChartData[1].data = [
        this.weeklyData[0].TotalRecovered,
        this.weeklyData[1].TotalRecovered,
        this.weeklyData[2].TotalRecovered,
        this.weeklyData[3].TotalRecovered,
        this.weeklyData[4].TotalRecovered,
        this.weeklyData[5].TotalRecovered,
        this.weeklyData[6].TotalRecovered ];

      this.barChartData[2].data = [
        this.weeklyData[0].TotalConfirmed,
        this.weeklyData[1].TotalConfirmed,
        this.weeklyData[2].TotalConfirmed,
        this.weeklyData[3].TotalConfirmed,
        this.weeklyData[4].TotalConfirmed,
        this.weeklyData[5].TotalConfirmed,
        this.weeklyData[6].TotalConfirmed ];
  }

  getCountryData() {
    for (let i = 0; i < 7; i++) {
      this.countryData[i] = this.weeklyData[i].Countries.find(x => x.Slug == this.Slug);
    }
  }

  setCurrentDates() {
    this.today = new Date();
    this.lastWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);

    for (let i = 0; i < 7; i++) {
          this.barChartLabels[i] = this.service.getReverseAPIFormatDate(new Date(this.lastWeek.getFullYear(), this.lastWeek.getMonth(), this.lastWeek.getDate() + i));
        }
  }

}
