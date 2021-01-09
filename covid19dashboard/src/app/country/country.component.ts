import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DatabaseService } from '../database.service';
import { SummaryData, CountryData } from '../models';
import { ActivatedRoute } from '@angular/router';
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  providers: [DatePipe]
})
export class CountryComponent implements OnInit {
    title = 'covid19countrydashboard';
    summaryData: SummaryData;
    countryData: CountryData;
    Slug: string;
    activeCases: number;
    recoveryRate: number;
    mortalityRate: number;


    constructor(private dataService: DataService, private actRoute: ActivatedRoute,
                private databaseService: DatabaseService,  private datePipe: DatePipe) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

    async ngOnInit() : Promise<void>{
      await this.tryGetDataFromDB();
    }

    async tryGetDataFromDB(){
      this.databaseService.getCountry(this.Slug).subscribe(async (country: CountryData) => {
        if (country) {
          let today = new Date();
          let storageDate = new Date(country.Date);
          if (this.datePipe.transform(today, 'dd-MM-yyyy') == this.datePipe.transform(storageDate, 'dd-MM-yyyy')) {
            console.log("Country tryGetDataFromDB - updated country data received");
            this.countryData = country;
            this.getActiveCases();
            this.getRecoveryRate();
            this.getMortalityRate();

          } else {
            console.log("Country tryGetDataFromDB - not updated country data received");
            await this.getAllData();
          }
        }
        else {
          console.log("Country tryGetDataFromDB - no country data received");
          await this.getAllData();
        }
      });
    }

    async getAllData() {
      this.actRoute.params.subscribe(params => {
        if(params['Slug']) {
      this.dataService.getSummaryData().subscribe(
        async response => {
          this.summaryData = response;
          this.getCountryData();
          await this.databaseService.updateCountry(this.countryData);
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
