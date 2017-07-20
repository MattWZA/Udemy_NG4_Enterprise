import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  cuisines: FirebaseListObservable<any[]>;
  restaurants: Observable<any[]>;

  constructor(private af: AngularFireDatabase){
  }

  ngOnInit() {
    this.cuisines = this.af.list('/cuisines');

    this.restaurants = this.af.list('/restaurants')
      .map(restaurants => {
        restaurants.map(restaurant => {
          // Get cuisine type
          restaurant.cuisineType = this.af.object('/cuisines/' + restaurant.cuisine);

          // Get features
          restaurant.featureTypes = [];
          for (var f in restaurant.features) {
            restaurant.featureTypes.push(this.af.object('/features/' + f));
          }
        });
        return restaurants;
      });
  }
}
