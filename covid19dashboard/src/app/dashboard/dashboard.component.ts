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
    //highlyConfirmedData: Array<CountryData>;
    //highlyDeathData: Array<CountryData>;
    //highlyRecoveredData: Array<CountryData>;
    Slug: string;

    constructor(private service: DataService, private actRoute: ActivatedRoute) {
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
          //this.getSortedData();
        }
      )
    }

    getActiveCases() {
      this.activeCases = ((this.summaryData?.Global?.TotalConfirmed)
                         -(this.summaryData?.Global?.TotalRecovered)
                         -(this.summaryData?.Global?.TotalDeaths));
    }
    /*getSortedData() {
      let data = JSON.parse(JSON.stringify(this.summaryData.Countries));
      this.highlyConfirmedData = data.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).slice(0, 10);
      this.highlyDeathData = data.sort((a, b) => b.TotalDeaths - a.TotalDeaths).slice(0, 10);
      this.highlyRecoveredData = data.sort((a, b) => b.TotalRecovered - a.TotalRecovered).slice(0, 10);
    }*/

}
