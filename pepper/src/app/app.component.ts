import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  cuisines: FirebaseListObservable<any[]>;
  restaurants: Observable<any[]>;
  exists;
  user: Observable<firebase.User>;
  error: string;

  constructor(
    private af: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private http: Http) {
  }

  ngOnInit() {
    // Get cuisines
    this.cuisines = this.af.list('/cuisines', {
      query: {
        orderByValue: true
      }
    });

    // Get restaurants
    this.restaurants = this.af.list('/restaurants', {
      query: {
        orderByChild: 'rating',
        equalTo: 5,
        limitToFirst: 50
      }
    })
    .map(restaurants => {
      restaurants.map(restaurant => {
        // Get cuisine type
        restaurant.cuisineType = this.af.object('/cuisines/' + restaurant.cuisine);

        // Get features
        restaurant.featureTypes = [];
        for (const f in restaurant.features) {
          restaurant.featureTypes.push(this.af.object('/features/' + f));
        }
      });
      return restaurants;
    });

    // Check existance of /restaurants/1/features/1
    this.exists = this.af.object('/restaurants/1/features/1');
    this.exists.take(1).subscribe(x => {
      if (x && x.$value) { console.log('Exists'); }
      else { console.log('Doesn\'t exist'); }
    });


    // Auth
    this.afAuth.auth.onAuthStateChanged(user => {
      console.log('User', user);
      if (!user) {
        this.user = null;
        return;
      }

      this.user = user;

      // Update from Facebook
      if (user.providerData && user.providerData.lengh > 0 && user.providerData[0].providerId && user.providerData[0].providerId === 'facebook.com') {
        const userRef = this.af.object('/users/' + user.uid);
        userRef.subscribe(u => {
          let url = `https://graph.facebook.com/v2.10/${user.providerData[0].uid}?fields=first_name,last_name,gender&access_token=${u.accessToken}`;
          console.log(url)
          this.http.get(url).subscribe(response => {
            let user = response.json();
            userRef.update({
              firstName: user.first_name,
              lastName: user.last_name
            });
          });
        });
      }
    })
  }

  onAddRestaurant() {
    // /restaurants
    // /restaurants-by-city/camberwell

    this.af.list('/restaurants').push({ name: '' })
      .then(x => {
        // x.key
        const restaurant = { name: 'My New Restaurant' };

        const update = {};
        update['restaurants/' + x.key] = restaurant;
        update['restaurants-by-city/camberwell/' + x.key] = restaurant;

        this.af.object('/').update(update);
      });
  }

  register() {
    this.afAuth.auth.createUserWithEmailAndPassword('matthew.walker@turnbuckle.co.za', 'testing123')
      .then(authState => {
        console.log('REGISTER-THEN', authState);
        authState.auth.sendEmailVerification();
      })
      .catch(error => {
        console.log('REGISTER-ERROR', error);
      })
  }

  login() {
    const fb = new firebase.auth.FacebookAuthProvider();
    fb.addScope('public_profile');
    fb.addScope('user_friends');

    this.afAuth.auth.signInWithPopup(fb)
      .then(authState => {
        console.log('authState', authState);
        this.af.object('/users/' + authState.user.uid).update({
          accessToken: authState.credential.accessToken
        })
      })
  }

  loginEmail() {
    this.error = null;

    this.afAuth.auth.signInWithEmailAndPassword('matthew.walker@turnbuckle.co.za', 'testing123')
      .then(authState => {
        console.log('LOGIN-THEN', authState);
      })
      .catch(error => {
        console.log('LOGIN-ERROR', error);
        this.error = error.message;
      })
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  ngOnDestroy() {
    // this.exists.unsubscribe();
  }
}
