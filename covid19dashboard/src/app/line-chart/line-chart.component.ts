import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { DataService } from '../data.service';
import { WeeklyData } from '../models';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  dataSinceApril: WeeklyData;

  // pointRadius=0 removes dots on data
  public lineChartData: ChartDataSets[] = [
    { data: [], pointRadius: 0, label: 'Total Deaths' },
    { data: [], pointRadius: 0, label: 'Total Recovered' },
    { data: [], pointRadius: 0, label: 'Total Cases' }
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

  constructor(private service: DataService) { }

  ngOnInit(): void {
    for (let j = 0; j < 222; j++) {
        this.lineChartLabels[j]=""+j;
    }
    this.getDataSinceApril();

  }

  public getDataSinceApril() {
    this.service.getDataApril().subscribe(
      response => {
        this.dataSinceApril = response;
        this.setData();
      }

    )

  }

  public setData() {

      // set first value to zero
      this.lineChartData[0].data[0] = 0;
      this.lineChartData[1].data[0] = 0;
      this.lineChartData[2].data[0] = 0;

      for (let j = 1; j < 222; j++) {
        this.lineChartData[0].data[j] = this.dataSinceApril[j].TotalDeaths + this.lineChartData[0].data[j-1];
      }

       for (let j = 1; j < 222; j++) {
         this.lineChartData[1].data[j] = this.dataSinceApril[j].TotalRecovered + this.lineChartData[1].data[j-1];
       }

       for (let j = 1; j < 222; j++) {
         this.lineChartData[2].data[j] = this.dataSinceApril[j].TotalConfirmed + this.lineChartData[2].data[j-1];
       }

    this.chart.update();
  }
}
