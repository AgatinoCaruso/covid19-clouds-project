import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { SummaryData, CountryData } from '../models';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  summaryData: SummaryData;
  activeCases: number;
  Slug: string;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    // removes labels on data
    plugins: {
      datalabels: {
          display: false,
      },
    },
  };
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: number[] = [33, 33, 33];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#f5c6cb', '#bee5eb', '#ffeeba'],
    },
  ];

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.getAllData();
    setTimeout(() => { //to update the graph
    this.chart.chart.data.datasets[0].data =
      [this.summaryData.Global.TotalDeaths,
       this.summaryData.Global.TotalRecovered,
       this.activeCases]
     this.chart.chart.update()
    }, 2000);
  }

  getAllData() {
    this.service.getData().subscribe(
      response => {
        this.summaryData = response;
        this.getActiveCases();
      }
    )
  }
  getActiveCases() {
    this.activeCases = ((this.summaryData?.Global?.TotalConfirmed)
                       -(this.summaryData?.Global?.TotalRecovered)
                       -(this.summaryData?.Global?.TotalDeaths));
  }
}
