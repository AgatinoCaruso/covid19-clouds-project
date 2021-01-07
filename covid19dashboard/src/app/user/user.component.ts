import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  loggedUser: User;
  userLoggedIn: Boolean;

  constructor(public service: DataService) { }

  ngOnInit(): void {
    this.userLoggedIn = false;  
   
    this.loggedUser = this.service.getLoggedUser();
   
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
    this.setUserIsLoggedIn(await this.service.signInWithGoogle());
    this.loggedUser = this.service.getLoggedUser();
   }

   async signOut() {
     this.setUserIsLoggedIn(await this.service.signOut());
     this.loggedUser = this.service.getLoggedUser();
   }

}
