import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, merge, BehaviorSubject } from 'rxjs';
import { DataService } from '../service/data.service';
import { TableDataModel } from '../model/table-data.model';
import { Injectable } from '@angular/core';
/**
 * Data source for the DataTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
@Injectable()
export class DataTableDataSource extends DataSource<TableDataModel> {
  _dataChange: BehaviorSubject<TableDataModel[]> = new BehaviorSubject<TableDataModel[]>([]);
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    console.log('####DataSource getFilter FilterChange: ', this._filterChange);
    console.log('####DataSource getFilter FilterChangeValue: ', this._filterChange.value);
    return this._filterChange.value;
  }

  set filter(filter: string) {
    console.log('####DataSource setFilter FilterChange: ', this._filterChange);
    console.log('####DataSource setFilter FilterChangeValue: ', this._filterChange.value);
    this._filterChange.next(filter);
  }

  filteredData: TableDataModel[];
  renderedData: TableDataModel[];

  constructor(
    private _dataService: DataService,
    private _paginator: MatPaginator,
    private _sort: MatSort) {
    super();
    console.log('####DataSource constructor FilterChange: ', this._filterChange);
    console.log('####DataSource constructor FilterChangeValue: ', this._filterChange.value);
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TableDataModel[]> {
    console.log('####DataSource connect FilterChange: ', this._filterChange);
    console.log('####DataSource connect FilterChangeValue: ', this._filterChange.value);
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this._dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];
    console.log('####DataSource connect displayDataChanges: ,', dataMutations);
    console.log('####DataSource connect exampleDatabase: ,', this._dataService);
    this._dataService.getAllIssues().subscribe(data => {
      console.log('####DataService getAllIssues this.dataChange: ', this._dataChange);
      console.log('####DataService getAllIssues this.dataChange.value: ', this._dataChange.value);
      console.log('####DataService getAllIssues data:', data);
      this._dataChange.next(data);
    });

    return merge(...dataMutations).pipe(map(() => {
      // Filter data
      this.filteredData = this._dataChange.value.slice().filter((item: TableDataModel) => {
        const searchStr = (item.gender + item.name + item.age).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      console.log('####DataSource connect merge filteredData: ', this.filteredData);
      // this.filteredData = this.dataBase.data;
      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());
      console.log('####DataSource connect merge sortedData: ', sortedData);

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      console.log('####DataSource connect merge renderedData: ', this.renderedData);
      return this.renderedData;
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: TableDataModel[]) {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  /** Returns a sorted copy of the database data. */
  sortData(data: TableDataModel[]): TableDataModel[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'gender': [propertyA, propertyB] = [a.gender, b.gender]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'age': [propertyA, propertyB] = [+a.age, +b.age]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
} 
