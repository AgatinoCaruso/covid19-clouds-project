import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { News, CountryData, SummaryData } from '../models';
import { DataService } from '../data.service';
import { DatabaseService } from '../database.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [DatePipe]
})
export class NewsComponent implements OnInit {

  Slug: string;
  selectedCountry: CountryData;
  description: string;
  news: News[] = [];
  countries: CountryData[];
  
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
      let global = new CountryData;
      global.Country = "Worldwide";
      global.Slug = "worldwide";
      this.countries.push(global);
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

  addNews() {
    let myDate = new Date();
    let news: News = {
      CountryData: this.selectedCountry,
      Date: myDate.toISOString(),
      uid: this.databaseService.user.uid,
      displayName: this.databaseService.user.displayName,
      Description: this.description
    };
    console.log("add News: " + news.Description);
    console.log("Country: " + news.CountryData);
    console.log("Date: " + news.Date);
    console.log("Slug: " + this.selectedCountry.Slug);
    this.databaseService.addNews(this.selectedCountry.Slug, news);
    this.description = undefined;
    this.selectedCountry = undefined;
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


}
