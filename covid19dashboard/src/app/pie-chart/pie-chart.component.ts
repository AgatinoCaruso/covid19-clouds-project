import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, SingleDataSet } from 'ng2-charts';
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
    // Removes labels on data
    plugins: {
      datalabels: {
          display: false,
      },
    },
  };
  public pieChartLabels: Label[] = ['Dead Cases', 'Recovered Cases', 'Active Cases'];
  public pieChartData: SingleDataSet;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#f5c6cb', '#bee5eb', '#ffeeba'],
    },
  ];

  constructor(private dataService: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

  async ngOnInit(): Promise<void> {
    await this.getSummaryData();   
  }

  getCountryData() {
    this.countryData = this.summaryData.Countries.find(x => x.Slug == this.Slug);
  }

  async getSummaryData() {
    const promise = new Promise((resolve, reject) =>  {
      this.dataService.getSummaryData().toPromise().then( 
        (response:any) => {
        this.summaryData = response;
        // In Country component  
        if(this.Slug) {        
          this.getCountryData();
          this.getActiveCasesCountry();
          this.setDataOnChart();
        }
        // In Dashboard component  
        else { 
          this.getActiveCasesGlobally();
          this.setDataOnChart();
        }
      })
    })
    return promise;
  }

  setDataOnChart() {
    if(this.Slug) { // in a country
      this.pieChartData =
        [this.countryData.TotalDeaths,
         this.countryData.TotalRecovered,
         this.activeCases]
    }
    else { // in dashboard
      this.pieChartData =
        [this.summaryData.Global.TotalDeaths,
         this.summaryData.Global.TotalRecovered,
         this.activeCases]
    }
  }
  
  getActiveCasesCountry() {
    this.activeCases = ((this.countryData.TotalConfirmed)
                       -(this.countryData.TotalRecovered)
                       -(this.countryData.TotalDeaths));
  }

  getActiveCasesGlobally() {
    this.activeCases = ((this.summaryData.Global.TotalConfirmed)
                       -(this.summaryData.Global.TotalRecovered)
                       -(this.summaryData.Global.TotalDeaths));
  }
}
