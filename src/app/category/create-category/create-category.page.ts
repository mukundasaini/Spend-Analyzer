import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonHeader, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonToolbar, IonIcon, IonTitle, IonContent, IonButton, IonInput, IonItem, IonLabel,
  IonModal,
  IonAlert,
  IonButtons,
  IonText,
  IonFabButton,
  IonFab,
  IonItemSliding,
  IonItemOptions,
  IonGrid,
  IonRow,
  IonCol,
  IonItemOption, IonChip,
  IonPopover,
  IonCheckbox,
  AlertController
} from '@ionic/angular/standalone';
import { CardDetails } from '../../Models/card-details.model';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { addIcons } from 'ionicons';
import { business } from 'ionicons/icons';
import { Category } from 'src/app/Models/category.model';

@Component({
  selector: 'app-create-category',
  templateUrl: 'create-category.page.html',
  styleUrls: ['create-category.page.scss'],
  standalone: true,
  imports: [IonHeader, IonGrid, IonPopover, IonCol, IonRow, IonChip,
    IonText, IonItemOptions, IonItemOption, IonCheckbox,
    IonFabButton, IonFab, IonButtons, IonAlert, IonModal, IonIcon, IonList, CommonModule, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
    IonCardTitle, IonItemSliding, IonCardSubtitle, IonCardContent, IonButton, IonItem, IonInput, IonLabel, ReactiveFormsModule]
})
export class CreateCategoryPage {
  firestore: Firestore = inject(Firestore);
  categoryCollection = AppConstants.collections.category;
  logPrefix: string = 'CREATECATEGORY_PAGE::: ';

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
    addIcons({ business });
  }

  categoryFG = new FormGroup({
    name: new FormControl(''),
  });
 
  onSubmit() {
    var name = this.categoryFG.controls.name.value?.toString()?.trim()?.toUpperCase();
    let category = <Category>{ id: UUID.UUID(), name: name };

    setDoc(doc(this.firestore, this.categoryCollection, category.id), category).then(x => {
      console.log("Category saved successfully");
      this.presentAlert('Success', "category saved successfully");

    }).catch(x => {
      console.log("Category saving failed");
      this.presentAlert('Warning', "Category updating failed");
    });
    this.onClear();
  }

  onClear() {
    this.categoryFG.controls.name.setValue('');
  }

  async presentAlert(alertHeader: string, alertMessage: string,) {
    const alert = await this.alertController.create({
      header: alertHeader,
      message: alertMessage,
      buttons: ['Close'],
      cssClass: 'alert-custom',
    });

    await alert.present();
  }
}