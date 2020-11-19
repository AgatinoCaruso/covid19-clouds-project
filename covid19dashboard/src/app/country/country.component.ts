import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DatePipe } from '@angular/common';
import { SummaryData, CountryData } from '../models';
import { ActivatedRoute } from '@angular/router';

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
    selectedCountryData: CountryData;
    highlyConfirmedData: Array<CountryData>;
    highlyDeathData: Array<CountryData>;
    highlyRecoveredData: Array<CountryData>;
    currentDate: string;
    Slug: string;

    constructor(private service: DataService, private datePipe: DatePipe, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
    if(this.Slug == null)
      this.Slug = "france";
  }

    ngOnInit() {
      let date = new Date();
      this.currentDate = this.datePipe.transform(date,'dd-MMM-yyyy');
      this.getAllData();
    }

    getAllData() {
      this.service.getData().subscribe(
        response => {
          this.summaryData = response;
          this.getCountryData();
          this.getSortedData();
        }
      )
    }

    getCountryData() {
      this.countryData = this.summaryData.Countries.find(x => x.Slug == this.Slug);
    }

    getSortedData() {
      let data = JSON.parse(JSON.stringify(this.summaryData.Countries));
      this.highlyConfirmedData = data.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).slice(0, 10);
      this.highlyDeathData = data.sort((a, b) => b.TotalDeaths - a.TotalDeaths).slice(0, 10);
      this.highlyRecoveredData = data.sort((a, b) => b.TotalRecovered - a.TotalRecovered).slice(0, 10);
    }

}
