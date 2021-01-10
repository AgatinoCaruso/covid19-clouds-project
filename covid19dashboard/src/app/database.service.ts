import { Injectable } from '@angular/core';
import { User, News, CountryData } from './models'
import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public user: User;
  private adminCheck: any;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  public async signInWithGoogle(): Promise<Boolean>{
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    
    this.user = {
     uid: credentials.user.uid,
     displayName: credentials.user.displayName,
     email: credentials.user.email,
     admin: false
    };

    this.checkAdmin(this.user);
    return true;
  }

  async checkAdmin(user: User) {
    
    const result = await this.getAdmin(this.user).toPromise().then( async(res: any) => {
      let tmp = res;
      console.log("getAdmin - email: " + tmp.get("email"));
      if (tmp.get("email") == this.user.email) {
        this.user.admin = true;
        console.log("getAdmin - admin true: " + this.user.admin);
     //   localStorage.setItem("admin", "true");
      } else {
        this.user.admin = false;
        console.log("getAdmin - admin false: " + this.user.admin);
     //   localStorage.setItem("admin", "false");
      }
    })

    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    return result;
}
  getAdmin(user: User) {
    return this.firestore.collection("admins").doc(user.uid).get();
  }
  // if user login again we just update the data
  private updateUserData() {
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email,
      admin: this.user.admin
    }, { merge: true})
  }

  public getLoggedUser() {
    if(this.user == null && this.userSignedIn()) {
      this.user = JSON.parse(localStorage.getItem("user"));
    }

    return this.user;
  }

  public userSignedIn() : boolean {
    return JSON.parse(localStorage.getItem("user")) != null;
  }

  public signOut(): Boolean {
    this.afAuth.signOut();
    localStorage.removeItem("user");
    this.user = null;
    return false;
  }

  async updateCountry(country: CountryData) {
    this.firestore.collection("Countries").doc(country.Slug).set({
      Slug: country.Slug,
      Country: country.Country,
      CountryCode: country.CountryCode,
      TotalConfirmed: country.TotalConfirmed,
      TotalDeaths: country.TotalDeaths,
      TotalRecovered: country.TotalRecovered,
      Date: country.Date,
      NewConfirmed: country.NewConfirmed,
      NewDeaths: country.NewDeaths,
      NewRecovered: country.NewRecovered
    }, { merge: true });
  }

  getCountry(slug: string) {
    return this.firestore.collection("Countries").doc(slug).valueChanges();
  }

  getNews(Slug: string) {
    return this.firestore.collection("Countries").doc(Slug).collection("News").valueChanges();
  }

  addNews(Slug: string, news: News) {
    this.firestore.collection("Countries").doc(Slug).collection("News")
    .add(JSON.parse(JSON.stringify(news))); // workaround: worldwide fix
  }

}
