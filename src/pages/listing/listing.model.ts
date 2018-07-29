export class LandingModel {
  services: Array<LandingItemModel>;
  banner_title: string;
  banner_image: string;

  constructor(
    services: Array<LandingItemModel>,
    banner_title: string,
    banner_image: string) {
    this.services = services;
    this.banner_title = banner_title;
    this.banner_image = banner_image;
  }
}

export class LandingItemModel {
  title: string;
  image: string;
  toPage: any;

  constructor(title: string, image: string, toPage: any) {
    this.title = title;
    this.image = image;
    this.toPage = toPage;

  }

}
