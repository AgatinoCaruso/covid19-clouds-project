import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SummaryData, CountryData } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    summaryData: SummaryData;
    activeCases: number;
    recoveryRate: number;
    mortalityRate: number;
    Slug: string;
    countries: Array<CountryData>;

    constructor(public dataService: DataService, private actRoute: ActivatedRoute) {
      this.Slug = this.actRoute.snapshot.params.Slug;

      if(this.Slug == null)
        this.Slug = "worldwide";
  }

    ngOnInit() {
      this.getSummaryData();
         
    }

    async getSummaryData() {
      const promise = await new Promise((resolve, reject) => {
          this.dataService.getSummaryData().subscribe(
          response => {
            this.summaryData = response;
            this.getActiveCases();
            this.getRecoveryRate();
            this.getMortalityRate();
            this.countries = this.summaryData.Countries;
          }
       )
      })
      return promise;
    }

    getActiveCases() {
      this.activeCases = ((this.summaryData.Global.TotalConfirmed)
                         -(this.summaryData.Global.TotalRecovered)
                         -(this.summaryData.Global.TotalDeaths));
    }

    getRecoveryRate() {
      this.recoveryRate =

                             this.summaryData.Global.TotalRecovered
                                                /
                            this.summaryData.Global.TotalConfirmed * 100;
    }

    getMortalityRate() {
      this.mortalityRate =

                             this.summaryData.Global.TotalDeaths
                                                /
                            this.summaryData.Global.TotalConfirmed * 100;
    }

}
