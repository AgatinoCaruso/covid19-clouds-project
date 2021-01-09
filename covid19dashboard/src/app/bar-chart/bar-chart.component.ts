import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { GlobalData, CountryData, CountryDataFromZero } from '../models';
import { ActivatedRoute } from '@angular/router';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})

export class BarChartComponent implements OnInit {
  weeklyData: Array<GlobalData>;
  Slug: string;
  today: Date;
  lastWeek: Date;
  countryAllDataFromZero: Array<CountryDataFromZero>;
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

  constructor(private dataService: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

  async ngOnInit(): Promise<void> {
    await this.getWeeklyData();
  }

  async getWeeklyData() {
    const promise = new Promise((resolve, reject) =>  {
      
          // In Country Component
          if(this.Slug) {
            this.dataService.getDataCountryFromFirstCase(this.Slug).toPromise().then(
              response => {
                this.countryAllDataFromZero = response;
                this.setCountryData();
              })
            }
        // In Dashboard Component
        else {
          this.dataService.getDataApril().toPromise().then(
            response => {
              this.weeklyData = response;
              this.setGlobalData();
            })
        }
      })
    return promise;
}
  public setCountryData() {
    //console.log("Bar Diagram Country: " + this.countryAllDataFromZero);
    if (typeof  this.countryAllDataFromZero !== 'undefined' &&   this.countryAllDataFromZero.length > 0) {
      var len = this.countryAllDataFromZero.length;
      console.log("Bar Chart setCountryData, len: " + len);

      let DeathsWExtra = [];
      let RecoveredWExtra = [];
      let ConfirmedWExtra = [];

     // console.log(this.countryAllDataFromZero);
      
      this.countryAllDataFromZero.forEach(element => {
        if(element.Province == "") { //ignore provinces and overseas territories
          DeathsWExtra.push(element.Deaths);
          RecoveredWExtra.push(element.Recovered);
          ConfirmedWExtra.push(element.Confirmed);
        }
      });
      
      let Deaths = [];
      let Recovered = [];
      let Confirmed = [];

      len = DeathsWExtra.length;

      // console.log(DeathsWExtra, RecoveredWExtra, ConfirmedWExtra)

      // console.log("Len: " + len + " full: " + DeathsWExtra.length);
      for (var j=7; j>0; j--) {
    
          Deaths.push(DeathsWExtra[len - j]);
          Recovered.push(RecoveredWExtra[len - j]);
          Confirmed.push(ConfirmedWExtra[len - j]);
    
      }
        
     
      this.setCurrentDates();

        this.barChartData = [
          { data: Deaths, label: 'Daily Deaths' },
          { data: Recovered, label: 'Daily Recovered' },
          { data: Confirmed, label: 'Daily New Cases' },
        ];
    }
    else {
      console.log("Bar Diagram Country - no data!");
    }
  }

  public setGlobalData() {

    if (typeof  this.weeklyData !== 'undefined' &&   this.weeklyData.length > 0) {
      var len = this.weeklyData.length;
      console.log("Bar Chart setGlobalData, len: "  + len);

      let NewDeaths = [];
      let NewRecovered = [];
      let NewConfirmed = [];
      
      for (var j=7; j>0; j--) {
          NewDeaths.push(this.weeklyData[len - j].NewDeaths);
          NewRecovered.push(this.weeklyData[len - j].NewRecovered);
          NewConfirmed.push(this.weeklyData[len - j].NewConfirmed);
        }

        // Sort Data since they are not with date
        // NewDeaths = NewDeaths.sort((a, b) => a - b);
        // NewRecovered = NewRecovered.sort((a, b) => a - b);
        // NewConfirmed = NewConfirmed.sort((a, b) => a - b);

        this.setCurrentDates();

        this.barChartData = [
          { data: NewDeaths, label: 'Daily Deaths' },
          { data: NewRecovered, label: 'Daily Recovered' },
          { data: NewConfirmed, label: 'Daily New Cases' },
        ];
      }

      else {
        console.log("Bar Diagram Dashboard - no data!");
      }
  }

 setCurrentDates() {
    this.today = new Date();
    this.lastWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);

    for (let i = 0; i < 7; i++) {
          this.barChartLabels[i] = this.dataService.getReverseAPIFormatDate(
            new Date(this.lastWeek.getFullYear(), this.lastWeek.getMonth(), this.lastWeek.getDate() + i));
        }
  }

}
