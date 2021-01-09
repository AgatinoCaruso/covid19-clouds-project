import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [DatePipe]
})
export class NewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
