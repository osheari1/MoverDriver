import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  Platform,
  normalizeURL
} from 'ionic-angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import {EquipmentOptionsPage} from "../equipment-options/equipment-options";

/**
 * Generated class for the RequestDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//TODO: Update image picker to convert to string64

@Component({
  selector: 'page-request-details',
  templateUrl: 'request-details.html',
})
export class RequestDetailsPage {

  jobRequest: any;
  form: FormGroup;
  selected_image: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public cropService: Crop,
    public imagePicker: ImagePicker,
    public platform: Platform

  ) {
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

    // Keep job request from previous page
    this.jobRequest = navParams.data;


  }

  openImagePicker(){
   this.imagePicker.hasReadPermission().then(
     (result) => {
       if(result == false){
         // no callbacks required as this opens a popup which returns async
         this.imagePicker.requestReadPermission();
       }
       else if(result == true){
         this.imagePicker.getPictures({ maximumImagesCount: 1 }).then(
           (results) => {
             for (var i = 0; i < results.length; i++) {
               this.cropService.crop(results[i], {quality: 75}).then(
                 newImage => {
                   this.selected_image = normalizeURL(newImage);
                 },
                 error => console.error("Error cropping image", error)
               );
             }
           }, (err) => console.log(err)
         );
       }
     }
   )
  }

  passJobRequest() {
    // Merge request data into single object
    const form_data = this.form.getRawValue();
    const jobRequest = {
      ...this.jobRequest,
      ...form_data,
      ...{image: this.selected_image}
    };

    this.navCtrl.push(EquipmentOptionsPage, jobRequest);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestDetailsPage');
  }

}
