import { Injectable } from '@angular/core';
import { User } from './user.model'
import firebase from 'firebase/app'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore} from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private user: User;

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) { }

  public async signInWithGoogle(): Promise<Boolean>{
    const credentials = await this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    
    this.user = {
     uid: credentials.user.uid,
     displayName: credentials.user.displayName,
     email: credentials.user.email
    };

    localStorage.setItem("user", JSON.stringify(this.user));
    this.updateUserData();
    return true;
  }

  // if user login again we just update the data
  private updateUserData() {
    this.firestore.collection("users").doc(this.user.uid).set({
      uid: this.user.uid,
      displayName: this.user.displayName,
      email: this.user.email
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
    //TODO hide button
    return false;
  }

}
