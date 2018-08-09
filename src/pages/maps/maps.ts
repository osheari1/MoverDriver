import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Keyboard } from '@ionic-native/keyboard';

import { RequestDetailsPage } from '../request-details/request-details';

import { Observable } from 'rxjs/Observable';

import { GoogleMap } from "../../components/google-map/google-map";
import { GoogleMapsService } from "./maps.service";
import { MapsModel, MapPlace } from './maps.model';
import {CalcUtilsProvider} from "../../providers/calc-utils/calc-utils";

// TODO: ADD directions for multi stop.

@Component({
  selector: 'maps-page',
  templateUrl: 'maps.html'
})
export class MapsPage implements OnInit {
  @ViewChild(GoogleMap) _GoogleMap: GoogleMap;
  map_model: MapsModel = new MapsModel();
  toast: any;

  constructor(
    public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public GoogleMapsService: GoogleMapsService,
    public geolocation: Geolocation,
    public keyboard: Keyboard
  ) {
  }

  ngOnInit() {
    let _loading = this.loadingCtrl.create();
    _loading.present();

    this._GoogleMap.$mapReady.subscribe(map => {
      this.map_model.init(map);
      _loading.dismiss();
    });
  }

  locationsValid(): boolean {
    let env = this;
    for (let location of env.map_model.locations) {
      if (location.location) {
        continue
      }
      return false
    }
    return true
  }


  searchPlacesPredictions(searchQueryIdx: number) {
    let env = this;

    var query: string = env.map_model.searchQueries[searchQueryIdx];

    if (query !== "") {
      env.GoogleMapsService.getPlacePredictions(query).subscribe(
        places_predictions => {
          env.map_model.searchPlacesPredictions[searchQueryIdx] = places_predictions;
        },
        e => {
          console.log('onError: %s', e);
        },
        () => {
          console.log('onCompleted');
        }
      );
    } else {
      env.map_model.searchPlacesPredictions[searchQueryIdx] = [];
    }
  }


  setDestination(
    location: google.maps.LatLng,
    searchQueryIdx: number
  ) {
    let env = this;

    // Clean map
    if (env.map_model.searchQueries[searchQueryIdx] != '') {
      env.map_model.cleanMap(searchQueryIdx);
    }

    // Set the origin for later directions
    env.map_model.locations[searchQueryIdx].location = location;

    // Add initial location to map and fit
    env.map_model.addPlaceToMap(location, '#00e9d5');
    env.map_model.updateBounds();

    if (env.map_model.locations[0].location
      && env.map_model.locations[1].location) {
      this.getDirections(
        env.map_model.locations[0],
        env.map_model.locations[1])
    }

  }

  selectSearchResult(
    place: google.maps.places.AutocompletePrediction,
    searchQueryIdx: number
  ) {
    let env = this;
    env.map_model.searchQueries[searchQueryIdx] = place.description;
    env.map_model.searchPlacesPredictions[searchQueryIdx] = [];
    env.map_model.locations[searchQueryIdx].address = place.description;

    // We need to get the location from this place. Let's geocode this place!
    env.GoogleMapsService.geocodePlace(place.place_id).subscribe(
      place_location => {
        env.setDestination(place_location, searchQueryIdx);
        // env.setOrigin(place_location);
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('onCompleted');
      }
    );
  }


  clearSearch() {
    let env = this;
    this.keyboard.close();
    // Clean map
    env.map_model.cleanMapFull();
  }

  geolocateMe(searchQueryIdx: number) {
    let env = this,
      _loading = env.loadingCtrl.create();

    _loading.present();

    this.geolocation.getCurrentPosition().then((position) => {
      let current_location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      env.map_model.searchQueries[searchQueryIdx] = position.coords.latitude.toFixed(2) + ", " + position.coords.longitude.toFixed(2);
      // env.setOrigin(current_location);
      env.setDestination(current_location, searchQueryIdx);
      env.map_model.using_geolocation = true;

      _loading.dismiss();
    }).catch((error) => {
      console.log('Error getting location', error);
      _loading.dismiss();
    });
  }

  getDirections(origin: MapPlace, destination: MapPlace) {
    let env = this;

    let directions_obs = env.GoogleMapsService.getDirections(
      origin.location, destination.location
    );
    let distance_obs = env.GoogleMapsService.getDistanceMatrix(
      origin.location, destination.location
    );

    Observable.forkJoin(directions_obs, distance_obs).subscribe(
      data => {
        let directions = data[0],
          distance = data[1].rows[0].elements[0].distance,
          duration = data[1].rows[0].elements[0].duration;

        env.map_model.directions_display.setDirections(directions);

        // Currently only allows 1 distance value
        env.map_model.distance = distance.value;
        env.map_model.duration = duration.value;

        if (env.toast) {
          env.toast.dismiss();
        }

        env.toast = this.toastCtrl.create({
          message: 'That\'s ' + distance.text + ' away and will take ' + duration.text,
          duration: 2000
        });
        env.toast.present();
      },
      e => {
        console.log('onError: %s', e);
      },
      () => {
        console.log('getDirections onCompleted');
      }
    )
  }

  goToJobRequest(): void {
    let env = this;
    this.nav.push(
      RequestDetailsPage,
      {
        locations: env.map_model.locations,
        distance: CalcUtilsProvider.convertMetersToMiles(env.map_model.distance),
        duration: env.map_model.duration
      }
    );
  }

}
