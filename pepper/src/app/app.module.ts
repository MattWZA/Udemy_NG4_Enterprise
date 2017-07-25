import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2'
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpModule } from '@angular/http';

export const firebaseConfig = {
  apiKey: 'AIzaSyCmEB35VElifskh2H0g1jOTxrQLCKtTD7w',
  authDomain: 'pepper-23c11.firebaseapp.com',
  databaseURL: 'https://pepper-23c11.firebaseio.com',
  projectId: 'pepper-23c11',
  storageBucket: '',
  messagingSenderId: '1047408030573'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [AngularFireDatabase, AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
