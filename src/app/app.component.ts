import {Component} from '@angular/core';
import {ColDef, ValueGetterParams, GridApi, GridReadyEvent} from 'ag-grid-community';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  themeClass = "ag-theme-quartz";
  private gridApi!: GridApi;
  rowData: any[] = [
    {
      decimal: 123456.2345,
      percentage: "0.7834",
      alphaNumeric: "123 Cape Canaveral",
      date: "2015-12-22T12:23:23",
      time: "2015-12-22T18:33:23",
      nullData: null
    },
    {
      decimal: 876543.4234,
      percentage: "0.2312",
      alphaNumeric: "432 Kennedy Space Center",
      date: "2007-09-20T12:23:23",
      time: "2007-09-20T13:43:23",
      nullData: null

    },
    {
      decimal: 765432.1234,
      percentage: "0.8789",
      alphaNumeric: "987 Cape Canaveral",
      date: "2020-04-24T12:23:23",
      time: "2020-04-24T16:53:23",
      nullData: null
    },
  ];

  colDefs: ColDef<any>[] = [
    {
      field: "decimal",
      filter: "agNumberColumnFilter",
      valueFormatter: (params: any) => {
        return parseFloat(params?.data.decimal).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
      valueGetter: (params: any) => {
        return parseFloat(params.data.decimal.toFixed(2));
      },
    },
    {
      field: "percentage",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value + "%",
      valueGetter: (params: any) => {
        return parseFloat((params.data.percentage * 100).toFixed(2));
      },
    },
    { field: "alphaNumeric", filter: "agTextColumnFilter" },
    {
      field: "date",
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterDate: Date, cellValue: any) => {
          const cellDate = new Date(cellValue);
          const filterDateValue = new Date(
            filterDate.getFullYear(),
            filterDate.getMonth(),
            filterDate.getDate()
          );

          const cellDateValue = new Date(
            cellDate.getFullYear(),
            cellDate.getMonth(),
            cellDate.getDate()
          );

          return cellDateValue.getTime() === filterDateValue.getTime()
            ? 0
            : cellDateValue < filterDateValue
              ? -1
              : 1;
        },
      },
      valueFormatter: (params) => this.formatDateTime(params.value, this.dateOptions),
      valueParser: (params) => {
        const dateParts = params.newValue.split("-").map(Number);
        return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      },
    },
    {
      field: "time",
      valueFormatter: (params) => this.formatDateTime(params.value, this.timeOptions),
    },
    {
      field: "nullData"
    }
  ];
  onBtnExport() {
    this.gridApi.exportDataAsCsv();
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  dateOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };
  private formatDateTime(
    dateString: string,
    options: Intl.DateTimeFormatOptions
  ): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", options);
  }
}
