import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { DataService } from '../data.service';
import { SummaryData, CountryData } from '../models';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  summaryData: SummaryData;
  activeCases: number;
  Slug: string;
  countryData: CountryData;

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

  constructor(private service: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

  ngOnInit(): void {
    this.getAllData();
    setTimeout(() => { //to update the graph
      this.thisSetDataOnChart();

     this.chart.chart.update()
    }, 2000);
  }

  getCountryData() {
    this.countryData = this.summaryData.Countries.find(x => x.Slug == this.Slug);
  }

  getAllData() {
    this.service.getData().subscribe(
      response => {
        if(this.Slug) { //in a country
          //  console.log("getAllData country, Slug: " + this.Slug);
            this.summaryData = response;
            this.getCountryData();
            this.getActiveCasesCountry();
        }
        else { // in dashboard
        //  console.log("getAllData dashboard, Slug: " + this.Slug);
          this.summaryData = response;
          this.getActiveCasesGlobally();
        }
      }
    )
  }
  thisSetDataOnChart() {
    if(this.Slug) { // in a country
      this.chart.chart.data.datasets[0].data =
        [this.countryData.TotalDeaths,
         this.countryData.TotalRecovered,
         this.activeCases]
    }
    else { // in dashboard
      this.chart.chart.data.datasets[0].data =
        [this.summaryData.Global.TotalDeaths,
         this.summaryData.Global.TotalRecovered,
         this.activeCases]
    }
  }
  
  getActiveCasesCountry() {
    this.activeCases = ((this.countryData?.TotalConfirmed)
                       -(this.countryData?.TotalRecovered)
                       -(this.countryData?.TotalDeaths));
  }

  getActiveCasesGlobally() {
    this.activeCases = ((this.summaryData?.Global?.TotalConfirmed)
                       -(this.summaryData?.Global?.TotalRecovered)
                       -(this.summaryData?.Global?.TotalDeaths));
  }
}
