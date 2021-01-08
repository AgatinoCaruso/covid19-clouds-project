import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { GlobalData, CountryData, SummaryData } from '../models';
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
  summaryData: SummaryData;
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

  ngOnInit(): void {
    this.getWeeklyData();
  }

  getWeeklyData() {

    // In Country Component
     if(this.Slug) { 
        this.actRoute.params.subscribe(params => {
          if(params['Slug']) {

            this.dataService.getSummaryData().subscribe(
              response => {
                this.summaryData = response;
                this.getCountryData();
                this.setCountryData();
              }
            )
          }
      })
    }
    // In Dashboard Component
    else {
      this.dataService.getDataApril().subscribe(
        response => {
          this.weeklyData = response;
          this.setGlobalData();
        }
      )
    }
}

public getCountryData() {
  // console.log("this.summaryData.Countries.length: " + this.summaryData.Countries.length);
  // var j=0;
  // var i= this.summaryData.Countries.length;
  // i = i -1;

  // for(; j<8; i--) {
  //   if(this.Slug == this.summaryData.Countries[i].Slug) {
  //    //this.countryData[j];
  //    console.log("i: " + i + " j: " + j);
  //    console.log(this.summaryData.Countries[i]);
  //    j++;
  //   }
  // }
}

  public setCountryData() {
    console.log("Bar Diagram Country: " + this.countryData);
    if (typeof  this.countryData !== 'undefined' &&   this.countryData.length > 0) {
      var len = this.countryData.length;
      console.log("Bar Chart setCountryData, len: " + len);

      let NewDeaths = [];
      let NewRecovered = [];
      let NewConfirmed = [];
      
      for (var j=7; j>0; j--) {
          NewDeaths.push(this.countryData[len - j].NewDeaths);
          NewRecovered.push(this.countryData[len - j].NewRecovered);
          NewConfirmed.push(this.countryData[len - j].NewConfirmed);
      }
        
      this.setCurrentDates();

        this.barChartData = [
          { data: NewDeaths, label: 'Daily Deaths' },
          { data: NewRecovered, label: 'Daily Recovered' },
          { data: NewConfirmed, label: 'Daily New Cases' },
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
