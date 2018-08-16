import {Component, ViewChild} from '@angular/core';
import {
  NavController,
  NavParams,
  Navbar,
  AlertController,
  Platform,
  // normalizeURL
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {EquipmentOptionsPage} from "../equipment-options/equipment-options";
import {MapsPage} from "../maps/maps";

/**
 * Generated class for the RequestDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-details',
  templateUrl: 'request-details.html',
})
export class RequestDetailsPage {
  @ViewChild(Navbar) navbar: Navbar;

  jobRequest: any;
  form: FormGroup;
  selected_image: any = "";

  constructor(
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public imagePicker: ImagePicker,
    private platform: Platform
  ) {

    // Keep job request from previous page
    this.jobRequest = navParams.data;

    this.form = new FormGroup({
      description: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      weight: new FormControl(100),
      comments: new FormControl(''),
      requiresBreakdown: new FormControl(false),
      needHelper: new FormControl(false),
      canUseElevator: new FormControl(false),
      hasHardwood: new FormControl(false)
    });

  }

  openImagePicker(): void {
    //setup camera options
    this.platform.ready().then(() => {
      const cameraOptions: CameraOptions = {
        quality: 50,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
      };

      this.camera.getPicture(cameraOptions).then((imageData) => {
        let base64Image = 'data:image/jpeg;base64,' + imageData;
        if (base64Image) {
          this.selected_image = base64Image;
        } else {
          console.log('Could not take picture');
        }
      }, err => {
        console.log('Could not load image');
        console.log(err);
      });
    });
  }

  // openImagePicker(){
  //  this.imagePicker.hasReadPermission().then(
  //    (result) => {
  //      if(result == false){
  //        // no callbacks required as this opens a popup which returns async
  //        this.imagePicker.requestReadPermission();
  //      }
  //      else if(result == true){
  //        this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
  //          (results) => {
  //            for (var i = 0; i < results.length; i++) {
  //              this.cropService.crop(results[i], {quality: 75}).then(
  //                newImage => {
  //                  this.selected_image = normalizeURL(newImage);
  //                },
  //                error => console.error("Error cropping image", error)
  //              );
  //            }
  //          }, (err) => console.log(err)
  //        );
  //      }
  //    }
  //  )
  // }


  passJobRequest() {
    // Merge request data into single object
    console.log("passing Job Request");
    const form_data = this.form.getRawValue();
    const jobRequest = {
      ...this.jobRequest,
      ...form_data,
      ...{image: this.selected_image}
    };
    this.navCtrl.push(EquipmentOptionsPage, jobRequest);
  }

  ionViewDidLoad() {
    this.navbar.backButtonClick = () => {
      this.navCtrl.setRoot(MapsPage);
    };
    console.log('ionViewDidLoad RequestDetailsPage');
  }

}
