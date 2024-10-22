import { Component, inject, Input } from "@angular/core";
import { deleteDoc, doc, DocumentSnapshot, Firestore, getDoc, updateDoc } from "@angular/fire/firestore";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AlertController } from "@ionic/angular";
import { IonButton, IonButtons, IonContent, IonInput, IonItem, IonModal, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { AppConstants } from "src/app/app.constants";
import { Category } from "src/app/Models/category.model";

@Component({
  selector: 'app-update-category',
  templateUrl: 'update-category.page.html',
  styleUrls: ['update-category.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule,
    IonModal, IonContent, IonToolbar, IonTitle, IonButtons, IonButton,
    IonItem, IonInput
  ]
})
export class UpdateCategoryPage {

  firestore: Firestore = inject(Firestore);
  categoryCollection = AppConstants.collections.category;
  @Input() inputSelectedItemId: string = '';
  logPrefix: string = 'UDATECATEGORY_PAGE::: ';

  constructor(private alertController: AlertController) {
    console.log(this.logPrefix + "constructor");
  }

  updateCategoryFG = new FormGroup({
    name: new FormControl(''),
  });


  onGetCategoryDetails(id: string) {
    getDoc(doc(this.firestore, this.categoryCollection, id)).then((doc: DocumentSnapshot) => {
      let categoryDetils = doc.data() as Category;
      this.updateCategoryFG.controls.name.setValue(categoryDetils.name);
    }).catch(x => {
      this.presentAlert('Warning', "Category updating failed");
      console.log("Category updating failed");
    });
  }

  onUpdateSubmit(id: string) {
    if (id !== '' || id != null || id !== undefined) {
      var name = this.updateCategoryFG.controls.name.value?.toString()?.toUpperCase();
      updateDoc(doc(this.firestore, this.categoryCollection, id), { id: id, name: name }).then(() => {
        this.presentAlert('Success', "category updaed successfully");
        console.log("category updaed successfully");
      }).catch(x => {
        this.presentAlert('Warning', "Category updating failed");
        console.log("Category updating failed");
      });
    }
  }

  onDelete(id: string) {
    deleteDoc(doc(this.firestore, this.categoryCollection, id)).then(() => {
      this.presentAlert('Success', "category deleted successfully");
      console.log("category deleted successfully");
    }).catch(x => {
      this.presentAlert('Warning', "Category deleting failed");
      console.log("Category deleting failed");
    });
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