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
    title = 'covid19dashboard';
    summaryData: SummaryData;
    activeCases: number;
    recoveryRate: number;
    mortalityRate: number;
    //highlyConfirmedData: Array<CountryData>;
    //highlyDeathData: Array<CountryData>;
    //highlyRecoveredData: Array<CountryData>;
    Slug: string;
    countries: Array<CountryData>;

    constructor(public service: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
    if(this.Slug == null)
      this.Slug = "worldwide";
  }

    ngOnInit() {
            
      this.getAllData();
         
    }

    getAllData() {
      this.service.getData().subscribe(
        response => {
          this.summaryData = response;
          this.getActiveCases();
          this.getRecoveryRate();
          this.getMortalityRate();
          this.countries = this.summaryData.Countries;
        }
      )
    }

    getActiveCases() {
      this.activeCases = ((this.summaryData?.Global?.TotalConfirmed)
                         -(this.summaryData?.Global?.TotalRecovered)
                         -(this.summaryData?.Global?.TotalDeaths));
    }

    getRecoveryRate() {
      this.recoveryRate =

                             this.summaryData?.Global?.TotalRecovered
                                                /
                            this.summaryData?.Global?.TotalConfirmed * 100;
    }

    getMortalityRate() {
      this.mortalityRate =

                             this.summaryData?.Global?.TotalDeaths
                                                /
                            this.summaryData?.Global?.TotalConfirmed * 100;
    }

}
