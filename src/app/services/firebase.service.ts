import { Injectable } from '@angular/core';
import { Category } from '../Models/category.model';
import { Observable } from 'rxjs';
import { collection, collectionData, deleteDoc, doc, Firestore, getDoc, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { AppConstants } from '../app.constants';
import { CardDetails } from '../Models/card-details.model';
import { UtilityService } from './utility.service';
import { LoggerService } from './logger.service';
import { Expense } from '../Models/expense-model';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(private firestore: Firestore, private logger: LoggerService,
    private utility: UtilityService,) { }

  getCategoriesOrderByID(): Observable<Category[]> {
    this.logger.trackEventCalls(FirebaseService.name, 'getCategoriesOrderByID')
    return collectionData(
      query(collection(this.firestore, AppConstants.collections.category),
        orderBy('id', 'desc'))) as Observable<Category[]>;
  }

  getCardsOrderByID(): Observable<CardDetails[]> {
    this.logger.trackEventCalls(FirebaseService.name, 'getCardsOrderByID')
    return collectionData(
      query(collection(this.firestore, AppConstants.collections.cards),
        orderBy('id', 'desc'))) as Observable<CardDetails[]>
  }

  getExpensesOrderByID(): Observable<Expense[]> {
    this.logger.trackEventCalls(FirebaseService.name, 'getExpensesOrderByID')
    return collectionData(
      query(collection(this.firestore, AppConstants.collections.expense),
        orderBy('id', 'desc')
      )) as Observable<Expense[]>
  }

  getIncludeExpenses(): Observable<Expense[]> {
    this.logger.trackEventCalls(FirebaseService.name, 'getIncludeExpenses')
    return collectionData(
      query(collection(this.firestore, AppConstants.collections.expense),
      where('isInclude', '==', true)
      )) as Observable<Expense[]>
  }

  saveRecordDetails(collection: string, record: any, index?: number) {
    this.logger.trackEventCalls(FirebaseService.name, 'saveRecordDetails')
    setDoc(doc(this.firestore, collection, record.id), record).then(x => {
      if (index === undefined || index == 1)
        this.utility.presentAlert(AppConstants.alertHeader.SUCCESS, AppConstants.alertMessage.save.success);
    }).catch(ex => {
      if (index === undefined || index == 1)
        this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.save.failed, ex);
    });
  }

  updateRecordDetails(collection: string, record: any) {
    this.logger.trackEventCalls(FirebaseService.name, 'updateRecordDetails')
    updateDoc(doc(this.firestore, collection, record.id), record).then(() => {
      this.utility.presentAlert(AppConstants.alertHeader.SUCCESS, AppConstants.alertMessage.update.success);
    }).catch(ex => {
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.update.failed, ex);
    });
  }

  getRecordDetails(collection: string, id: string) {
    this.logger.trackEventCalls(FirebaseService.name, 'getRecordDetails')
    return getDoc(doc(this.firestore, collection, id));
  }

  deleteRecordDetails(collection: string, id: string) {
    this.logger.trackEventCalls(FirebaseService.name, 'deleteRecordDetails')
    return deleteDoc(doc(this.firestore, collection, id)).then(() => {
      this.utility.presentAlert(AppConstants.alertHeader.SUCCESS, AppConstants.alertMessage.delete.success);
    }).catch(ex => {
      this.utility.presentAlert(AppConstants.alertHeader.FAILED, AppConstants.alertMessage.delete.failed, ex);
    });

  }
}
