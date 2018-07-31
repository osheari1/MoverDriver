import { MapsPage } from '../maps/maps';
import { LandingModel, LandingItemModel } from './listing.model';
export const data = new LandingModel(
  [new LandingItemModel(
    "Basic Move",
    "./assets/images/landing/couch.png",
    MapsPage
  )],
  "How can we help?",
  "./assets/images/listing/banner.png"
);
