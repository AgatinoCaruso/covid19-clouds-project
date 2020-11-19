import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit {
  Slug: string;
  Path: string;

  constructor(private service: DataService, private actRoute: ActivatedRoute) {
  this.Slug = this.actRoute.snapshot.params.Slug;
  if(this.Slug != null)
    this.Path = " > " + this.Slug[0].toUpperCase() + this.Slug.substr(1).toLowerCase();
  else
    this.Path = "";
}


  ngOnInit(): void {
  }

}
