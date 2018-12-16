import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { TableDataModel } from '../model/table-data.model';
import { map, switchMap } from 'rxjs/operators';
import { results } from "../data-table/data-table-test-data";

@Injectable()
export class DataService {

  private readonly API_URL: string = 'https://randomuser.me/api/?results=87&nat=gb,us';
  dataChange: BehaviorSubject<TableDataModel[]> = new BehaviorSubject<TableDataModel[]>([]);
  private mapped: TableDataModel[] = [];

  constructor(private httpClient: HttpClient) { 
    console.log('####DataService constructor this.mapped: ', this.mapped);
    this.mapped = results;
    console.log('####DataService constructor this.mapped: ', this.mapped);
  }

  get data(): TableDataModel[] {
    return this.dataChange.value;
  }

  getAllIssues(): void {
    this.httpClient.get<TableDataModel[]>(this.API_URL).subscribe(data => {
      console.log('####DataService getAllIssues data:', data);
      console.log('####DataService getAllIssues mapped:', this.mapped);
      this.dataChange.next(this.mapped);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  public getData(): Observable<TableDataModel[]> {
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
  }

 /*  public getTestData(): Observable<TableDataModel[]> {
    return of(results);
  } */
}
