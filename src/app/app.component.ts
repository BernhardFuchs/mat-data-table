import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataTableDataSource } from './service/data-table-datasource';
import { DataService } from './service/data.service';
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  displayedColumns = ['gender', 'name', 'age'];
  dataSource: DataTableDataSource | null;
  exampleDatabase: DataService | null;

  constructor(public httpClient: HttpClient,
    public dataService: DataService
    ) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  ngOnInit() {
    console.log('####AppComponent onInit this.exampleDataBase: ', this.exampleDatabase);
    console.log('####AppComponent onInit this.dataSource: ', this.dataSource);
    console.log('####AppComponent onInit this.displayedColumns: ', this.displayedColumns);
    console.log('####AppComponent onInit this.filter: ', this.filter);
    console.log('####AppComponent onInit this.paginator: ', this.paginator);
    console.log('####AppComponent onInit this.sort: ', this.sort);
    this.loadData();
  }

  refresh(): void {
    console.log('####AppComponent refresh this.exampleDataBase: ', this.exampleDatabase);
    console.log('####AppComponent refresh this.dataSource: ', this.dataSource);
    console.log('####AppComponent refresh this.displayedColumns: ', this.displayedColumns);
    console.log('####AppComponent refresh this.filter: ', this.filter);
    console.log('####AppComponent refresh this.paginator: ', this.paginator);
    console.log('####AppComponent refresh this.sort: ', this.sort);
    this.loadData();
  }

  public loadData(): void {
    this.exampleDatabase = new DataService(this.httpClient);
    console.log('####AppComponent loadData this.exampleDataBase: ', this.exampleDatabase);
    this.dataSource = new DataTableDataSource(this.exampleDatabase, this.paginator, this.sort);
    console.log('####AppComponent loadData this.dataService: ', this.dataService);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        console.log('####AppComponent loadData fromEvent subscribe this.dataService: ', this.dataService);
        if (!this.dataSource) {
          console.log('####AppComponent loadData fromEvent subscribe in if');
          return;
        }
        console.log('####AppComponent loadData fromEvent subscribe this.filter.nativeElement.value: ', this.filter.nativeElement.value);
        this.dataSource.filter = this.filter.nativeElement.value;
        console.log('####AppComponent loadData fromEvent subscribe this.dataSource.filter: ', this.dataSource.filter);
      });
  }
}
