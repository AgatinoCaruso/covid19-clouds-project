import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { DatabaseService } from '../database.service';
import { User } from '../models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loggedUser: User;
  userLoggedIn: Boolean;

  constructor(private dataService: DataService, public databaseService: DatabaseService) { }

  ngOnInit(): void {
    this.userLoggedIn = false;  
   
    this.loggedUser = this.databaseService.getLoggedUser();
   
    this.userLoggedIn = this.isUserLoggedIn();
  }

  isUserLoggedIn() : Boolean{
    if(this.loggedUser)
      return true;
    this.loggedUser = null;
    return false;
  }

  setUserIsLoggedIn(isLogged: Boolean) {
    this.userLoggedIn = isLogged;
    this.isUserLoggedIn(); //set logged user to null if not logged
  }

  async signInWithGoogle() {
    this.setUserIsLoggedIn(await this.databaseService.signInWithGoogle());
    this.loggedUser = this.databaseService.getLoggedUser();
   }

   async signOut() {
     this.setUserIsLoggedIn(await this.databaseService.signOut());
     this.loggedUser = this.databaseService.getLoggedUser();
   }

}
