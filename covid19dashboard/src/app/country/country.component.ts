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

    constructor(private service: DataService, private actRoute: ActivatedRoute) {
    this.Slug = this.actRoute.snapshot.params.Slug;
  }

    ngOnInit() {
      this.getAllData();
    }

    getAllData() {
      this.service.getData().subscribe(
        response => {
          this.summaryData = response;
          this.getCountryData();
        }
      )
    }

    getCountryData() {
      this.countryData = this.summaryData.Countries.find(x => x.Slug == this.Slug);
    }

}
