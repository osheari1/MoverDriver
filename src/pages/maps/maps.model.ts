export class MapsModel {
  map: google.maps.Map;
	map_options: google.maps.MapOptions = {
    // center: {lat: 40.785091, lng: -73.968285},
    center: {lat: 32.7157, lng: -117.1611},
    zoom: 13,
    disableDefaultUI: true
  };

	map_places: Array<MapPlace> = [];

	// search_query: string = '';
	// search_places_predictions: Array<google.maps.places.AutocompletePrediction> = [];

  // Customizations
  // Need to define 2 emptly lists by default, 1 for start 1 for end
  searchQueries: Array<string> = ['', ''];
  searchPlacesPredictions: Array<Array<google.maps.places.AutocompletePrediction>> = [[], []];
  locations: Array<MapPlace> = [new MapPlace(), new MapPlace()];
  bound: google.maps.LatLngBounds = new google.maps.LatLngBounds();

  distance: number;
  duration: number;


	directions_origin: MapPlace = new MapPlace();
	directions_display: google.maps.DirectionsRenderer;

	using_geolocation: boolean = false;

	// https://developers.google.com/maps/documentation/javascript/reference#Map
	init(map: google.maps.Map) {
		this.map = map;
		// https://developers.google.com/maps/documentation/javascript/reference#DirectionsRenderer
		this.directions_display = new google.maps.DirectionsRenderer({
			map: this.map,
			suppressMarkers: true,
			preserveViewport: true
		});
	}

  updateBounds() {
    var bound = new google.maps.LatLngBounds();
    // for (let location of this.locations) {
    //   bound.extend(location.location);
    // }
    this.locations.forEach(location => {
      if (location.location) {
        bound.extend(location.location);
      }
    });
    this.bound = bound;
    this.map.fitBounds(this.bound);
  }


	cleanMap(searchQueryIdx: number) {
		// Empty nearby places array
    if (this.map_places[searchQueryIdx] == null) {
      return
    }
		// To clear previous directions
		this.directions_display.setDirections({routes: []});

		// To remove all previous markers from the map
    this.map_places[searchQueryIdx].marker.setMap(null);

		// Empty markers array
		// this.map_places = [];
    if (searchQueryIdx != 0) {
  		this.using_geolocation = false;
    }
	}

  cleanMapFull() {
		// To clear previous directions
		this.directions_display.setDirections({routes: []});

		// To remove all previous markers from the map
		this.map_places.forEach((place) => {
      place.marker.setMap(null);
    });

		// Empty markers array
		this.map_places = [];

		this.using_geolocation = false;

  }


	addPlaceToMap(location: google.maps.LatLng, color: string = '#333333') : MapPlace {
		let _map_place = new MapPlace();

		_map_place.location = location;
		_map_place.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: MapPlace.createIcon(color)
    });

		this.map_places.push(_map_place);

		return _map_place;
	}

}

export class MapPlace {
	marker: google.maps.Marker;
	location: google.maps.LatLng;
	selected: boolean = false;
	// This is an extra attribute for nearby places only
	details: google.maps.places.PlaceResult;

	// https://developers.google.com/maps/documentation/javascript/reference#Symbol
	static createIcon(color: string) : google.maps.Symbol {
    let _icon: google.maps.Symbol = {
      path: "M144 400c80 0 144 -60 144 -134c0 -104 -144 -282 -144 -282s-144 178 -144 282c0 74 64 134 144 134zM144 209c26 0 47 21 47 47s-21 47 -47 47s-47 -21 -47 -47s21 -47 47 -47z",
      fillColor: color,
      fillOpacity: .6,
      anchor: new google.maps.Point(0,0),
      strokeWeight: 0,
      scale: 0.08,
      rotation: 180
    }
    return _icon;
  }

	setIcon(color: string) : void {
		this.marker.setIcon(MapPlace.createIcon(color));
	}

	deselect() {
		this.selected = false;
    this.setIcon('#666666');
	}

	select() {
		this.selected = true;
    this.setIcon('#ae75e7');
	}
}
