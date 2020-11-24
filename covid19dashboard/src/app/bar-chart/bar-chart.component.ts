import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { WeeklyData } from '../models';


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
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Daily Deaths' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Daily Recovered' },
    { data: [10, 20, 25, 50, 45, 60, 70], label: 'Daily New Cases' },
  ];

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getWeeklyData();
  }

  getWeeklyData() {
    this.service.getWeeklyData().subscribe(
      response => {
        this.weeklyData = response;
        this.setCurrentDates();
        this.setData();

      }
    )
  }

  public setData() {

  for (let i = 0; i < 7; i++) {
        this.barChartLabels[i] = this.service.getReverseAPIFormatDate(new Date(this.lastWeek.getFullYear(), this.lastWeek.getMonth(), this.lastWeek.getDate() + i));
      }

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

  private setCurrentDates() {
    this.today = new Date();
    this.lastWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - 7);
  }

}
