export class LandingModel {
  services: Array<ListingItemModel>;
  banner_title: string;
  banner_image: string;
}

export class LandingItemModel {
  title: string;
  image: string;
  toPage: any;
}


export class ListingModel {
  populars: Array<ListingItemModel>;
  categories: Array<ListingItemModel>;
  banner_title: string;
  banner_image: string;
}

export class ListingItemModel {
  title: string;
  image: string;
  toPage: any;
}
