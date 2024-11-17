import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  IonToolbar, IonContent, IonButton, IonInput, IonItem, 
  IonModal,
  IonButtons
  ,
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
  imports: [ReactiveFormsModule, IonModal, IonContent, IonToolbar, IonButton, IonButtons, IonInput,
    IonItem
  ]
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