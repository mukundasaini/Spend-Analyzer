import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
} from '@ionic/angular/standalone';
import { UUID } from 'angular2-uuid';
import { AppConstants } from '../../app.constants';
import { Category } from 'src/app/Models/category.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LoggerService } from 'src/app/services/logger.service';

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

  categoryFG = new FormGroup({
    name: new FormControl(''),
  });

  constructor(private logger: LoggerService,
    private firebase: FirebaseService) {
  }

  onSubmit() {
    this.logger.trackEventCalls(CreateCategoryPage.name, "onSubmit");
    let category = <Category>{
      id: UUID.UUID(),
      name: this.categoryFG.controls.name.value?.toString()?.trim()?.toUpperCase()
    };

    this.firebase.saveRecordDetails(AppConstants.collections.category, category);
    this.onClear();
  }

  onClear() {
    this.logger.trackEventCalls(CreateCategoryPage.name, "onClear");
    this.categoryFG.controls.name.setValue('');
  }
}