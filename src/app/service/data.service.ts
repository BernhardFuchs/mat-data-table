import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableDataModel } from '../model/table-data.model';
import { map } from 'rxjs/operators';
import { results } from './data-table-test-data';

@Injectable()
export class DataService {

  private readonly API_URL: string = 'https://randomuser.me/api/?results=87&nat=gb,us';
  
  private mapped: TableDataModel[] = [];

  constructor(private httpClient: HttpClient) { 
    console.log('####DataService constructor this.mapped: ', this.mapped);
    this.mapped = results;
    /* console.log('####DataService constructor this.mapped: ', this.mapped);
    console.log('####DataService constructor this.dataChange: ', this.dataChange);
    console.log('####DataService constructor this.dataChange.value: ', this.dataChange.value);
    console.log('####DataService constructor this.data.values: ', this.data.values); */
  }

  /* get data(): TableDataModel[] {
    return this.dataChange.value;
  } */

  getAllIssues(): Observable<TableDataModel[]> {
    return this.httpClient.get<any>(this.API_URL).pipe(
      map(() => this.mapped));
    /* .subscribe(data => {
      console.log('####DataService getAllIssues this.dataChange: ', this.dataChange);
      console.log('####DataService getAllIssues this.dataChange.value: ', this.dataChange.value);
      console.log('####DataService getAllIssues this.data.values: ', this.data.values);
      console.log('####DataService getAllIssues data:', data);
      console.log('####DataService getAllIssues mapped:', this.mapped);
      this.dataChange.next(data);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      }); */
  }

  /* public getData(): Observable<TableDataModel[]> {
    const mapped: TableDataModel[] = [];
    return this.httpClient.get('https://randomuser.me/api/?results=87&nat=gb,us').pipe(
      map((res: any) => {
        console.log(res.results);
        res.results.forEach(entry => {
          console.log(entry.gender);
          console.log(entry.name.first);
          console.log(entry.dob.age);
          mapped.push({
          gender: entry.gender,
          name: entry.name.first,
          age: entry.dob.age
        });
      });
    }),
      switchMap(() => of(mapped))
    );
  } */

 /*  public getTestData(): Observable<TableDataModel[]> {
    return of(results);
  } */
}
