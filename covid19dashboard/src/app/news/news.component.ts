import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { News, CountryData, SummaryData } from '../models';
import { DataService } from '../data.service';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [DatePipe]
})
export class NewsComponent implements OnInit {

  news: News[] = [];
  selectedCountry: CountryData;
  description: string;
  countries: CountryData[];
  Slug: string;

  constructor(
    private actRoute: ActivatedRoute,
    private dataService: DataService,
    public databaseService: DatabaseService) {
      this.Slug = this.actRoute.snapshot.params.Slug;
    }

  ngOnInit(): void {
    this.getSummaryData();
  }

  getSummaryData() {
    this.dataService.getSummaryData().subscribe((res: SummaryData) => {
      let summaryData = res;
      this.countries = summaryData.Countries;
      let worldwide = new CountryData;
      worldwide.Country = "Worldwide";
      worldwide.Slug = "worldwide";
      this.countries.push(worldwide);
      this.getNews();
    })
  }

  showAddNews(): boolean {
    //console.log("showAddNews() - User: " +this.databaseService.user?.displayName);
    //console.log("Admin: " +this.databaseService.user?.admin);
   if(this.databaseService.user?.admin == true)
      return true;
    else
      return false;
  }


  async getNews() {
    // In Dashboard Component
    if (!this.Slug) {
      this.news = [];
      this.countries.forEach(async (element) => {
        this.databaseService.getNews(element.Slug).subscribe((news: News[]) => {
          news.forEach(elem => {
            this.news.push(elem)
          });
        });
      });
      console.log("getNews() Dashboard");
    } 
    // In Country Component
    else {
      this.databaseService.getNews(this.Slug).subscribe((news: News[]) => {
        this.news = news;
      });
      console.log("getNews() Country");
    }
  }

  
  addNews() {

    let date = new Date();
    let news: News = {
      CountryData: this.selectedCountry,
      Date: date.toISOString(),
      uid: this.databaseService.user.uid,
      displayName: this.databaseService.user.displayName,
      Description: this.description
    };
    console.log("add News: " + news.Description);
    this.databaseService.addNews(this.selectedCountry.Slug, news);
    this.selectedCountry = undefined;
    this.description = undefined;
  }

}
