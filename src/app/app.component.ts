import {Component} from '@angular/core';
import {ColDef, GridApi, GridReadyEvent} from 'ag-grid-community';
import {rowData} from "./data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  themeClass = "ag-theme-quartz";
  private gridApi!: GridApi;
  private formatDateColDef(
    headerName: string,
    valueFormatter: (params: any) => string,
    valueParser: (params: any) => Date
  ) {
    return {
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
      valueFormatter,
      valueParser,
      headerName,
    };
  }
  colDefs: ColDef<any>[] = [
    this.formatDateColDef(
      "Formatted Date (without seconds)",
      (params) => this.formatDate(params.value, false, true),
      (params) => this.parseDate(params.newValue)
    ),
    this.formatDateColDef(
      "Formatted Date (with seconds)",
      (params) => this.formatDate(params.value, true),
      (params) => this.parseDate(params.newValue)
    ),
    this.formatDateColDef(
      "Formatted Date (dd/mm/yy)",
      (params) => this.formatDateDDMMYY(params.value),
      (params) => this.parseDateDDMMYY(params.newValue)
    ),
    {
      field: "percentage",
      filter: "agNumberColumnFilter",
      valueFormatter: (params) => params.value + "%",
      valueGetter: (params: any) => {
        return parseFloat((params.data.percentage * 100).toFixed(2));
      },
    },
    {
      field: "decimal",
      filter: "agNumberColumnFilter",
      cellClassRules: {
        "negative-value": (params: any) => params?.data.decimal < 0,
      },
      valueFormatter: (params: any) => {
        // @ts-ignore
        return parseFloat(params?.data.decimal).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      },
      valueGetter: (params: any) => {
        return parseFloat(params.data.decimal.toFixed(2));
      },
    },
    { field: "alphaNumeric", filter: "agTextColumnFilter" },

  ];
  data = rowData;
  private formatToTime(
    dateString: string,
  ): string {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {hour:"numeric", minute: "2-digit", second: "2-digit", hour12: false});
  }
  private formatDate(
    dateString: string,
    includeSeconds: boolean = false,
    use12HourFormat: boolean = false
  ): string {
    const options: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: use12HourFormat ? "numeric" : "2-digit",
      minute: "2-digit",
      second: includeSeconds ? "2-digit" : undefined,
      hour12: use12HourFormat,
    };

    const date = new Date(dateString);
    return date.toLocaleString("en-IN", options);
  }
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }
  private parseDate(dateString: string): Date {
    const dateParts = dateString.split("-").map(Number);
    return new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  }

  private parseDateDDMMYY(dateString: string): Date {
    const dateParts = dateString.split("/").map(Number);
    return new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
  }
  private formatDateDDMMYY(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    };
    return date.toLocaleString("en-IN", options);
  }
}
