import { RequestBasicJobPage } from '../../pages/request-basic-job/request-basic-job';
import { LandingModel, LandingItemModel } from './listing.model';
export const data = new LandingModel(
  [new LandingItemModel(
    "Basic Move",
    "./assets/images/landing/couch.png",
    RequestBasicJobPage
  )],
  "How can we help?",
  "./assets/images/listing/banner.png"
);
