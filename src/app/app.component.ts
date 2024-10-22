import { Component, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { IonApp, IonButton, IonContent, IonRouterOutlet } from '@ionic/angular/standalone';
import { getAuth, signInWithRedirect, getRedirectResult, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonContent, IonButton, IonRouterOutlet],
})
export class AppComponent {
  isAuthenticated: boolean = false;
  // firestore: Firestore = inject(Firestore);
  constructor(private auth: Auth, private router: Router) {
    // const auth = getAuth(this.firestore.app);
    // const provider = new GoogleAuthProvider();


    // getRedirectResult(auth)
    //   .then((result: any) => {
    //     // This gives you a Google Access Token. You can use it to access Google APIs.
    //     const credential = GoogleAuthProvider.credentialFromResult(result);
    //     //const token = credential.accessToken;

    //     // The signed-in user info.
    //     //const user = result.user;
    //     // IdP data available using getAdditionalUserInfo(result)
    //     // ...
    //   }).catch((error) => {
    //     // Handle Errors here.
    //     // const errorCode = error.code;
    //     //const errorMessage = error.message;
    //     // The email of the user's account used.
    //     //const email = error.customData.email;
    //     // The AuthCredential type that was used.
    //     const credential = GoogleAuthProvider.credentialFromError(error);
    //     // ...
    //   });



    //  signInWithPopup(auth, provider)
    // .then((result:any) => {
    //   // This gives you a Google Access Token. You can use it to access the Google API.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential?.accessToken;
    //   // The signed-in user info.
    //   const user = result.user;
    //   // IdP data available using getAdditionalUserInfo(result)
    //   // ...
    // }).catch((error) => {
    //   console.log(error);
    //   // Handle Errors here.
    //   // const errorCode = error.code;
    //   // const errorMessage = error.message;
    //   // // The email of the user's account used.
    //   // const email = error.customData.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // });
  }

  onLogin() {
    signInWithPopup(this.auth, new GoogleAuthProvider()).then((x: any) => {
      console.log('success login')
      this.isAuthenticated = true;
    });
  }
}
