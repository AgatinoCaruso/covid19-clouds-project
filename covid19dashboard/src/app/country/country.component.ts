import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SummaryData, CountryData } from '../models';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {
    title = 'covid19countrydashboard';
    summaryData: SummaryData;
    countryData: CountryData;
    Slug: string;
    activeCases: number;
    recoveryRate: number;
    mortalityRate: number;

    constructor(private service: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

    ngOnInit() {
      this.getAllData();
    }

    getAllData() {
      this.actRoute.params.subscribe(params => {
        if(params['Slug']) {
      this.service.getDataParam(params['Slug']).subscribe(
        response => {
          this.summaryData = response;
          this.getCountryData();
          this.getActiveCases();
          this.getRecoveryRate();
          this.getMortalityRate();
        }
      )
    }
  })
}

    getCountryData() {
      this.countryData = this.summaryData.Countries.find(x => x.Slug == this.Slug);
    }

    getActiveCases() {
      this.activeCases = ((this.countryData?.TotalConfirmed)
                         -(this.countryData?.TotalRecovered)
                         -(this.countryData?.TotalDeaths));
    }

    getRecoveryRate() {
      this.recoveryRate =

                             this.countryData?.TotalRecovered
                                                /
                            this.countryData?.TotalConfirmed * 100;
    }

    getMortalityRate() {
      this.mortalityRate =

                             this.countryData?.TotalDeaths
                                                /
                            this.countryData?.TotalConfirmed * 100;
    }


}
