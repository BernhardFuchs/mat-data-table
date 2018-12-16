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
    private dataBase: DataService,
    private paginator: MatPaginator,
    private sort: MatSort) {
    super();
    console.log('####DataSource constructor FilterChange: ', this._filterChange);
    console.log('####DataSource constructor FilterChangeValue: ', this._filterChange.value);
    this._filterChange.subscribe(() => this.paginator.pageIndex = 0);
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
      this.dataBase.dataChange,
      this.sort.sortChange,
      this._filterChange,
      this.paginator.page
    ];
    console.log('####DataSource connect displayDataChanges: ,', dataMutations);
    console.log('####DataSource connect exampleDatabase: ,', this.dataBase);
    this.dataBase.getAllIssues();

    return merge(...dataMutations).pipe(map(() => {
      // Filter data
      this.filteredData = this.dataBase.data.slice().filter((item: TableDataModel) => {
        const searchStr = (item.gender + item.name + item.age).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });
      console.log('####DataSource connect merge filteredData: ', this.filteredData);
      // this.filteredData = this.dataBase.data;
      // Sort filtered data
      const sortedData = this.getSortedData(this.filteredData.slice());
      console.log('####DataSource connect merge sortedData: ', sortedData);

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this.paginator.pageSize);
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
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: TableDataModel[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'gender': return compare(a.gender, b.gender, isAsc);
        case 'age': return compare(+a.age, +b.age, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
