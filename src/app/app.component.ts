import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { DataTableDataSource } from './data-table/data-table-datasource';
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
  dataBase: DataService | null;

  constructor(public dataService: DataService,
    public httpClient: HttpClient) {}

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filter: ElementRef;
  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  ngOnInit() {
    this.loadData();
  }

  refresh(): void {
    this.loadData();
  }

  loadData(): void {
    this.dataBase = new DataService(this.httpClient);
    this.dataSource = new DataTableDataSource(this.dataBase, this.paginator, this.sort);
    fromEvent(this.filter.nativeElement, 'keyup')
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
  }
}
