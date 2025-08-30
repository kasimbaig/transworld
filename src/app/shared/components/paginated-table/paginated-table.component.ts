import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { Table } from 'primeng/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Menu } from 'primeng/menu';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';


import { ButtonModule } from 'primeng/button';
import { NestedValuePipe } from '../../../../nested-value.pipe';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-paginated-table',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    PaginatorModule,
    CommonModule,
    NestedValuePipe,
    Menu,
    ButtonModule,
    InputSwitchModule,
    LoadingSpinnerComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './paginated-table.component.html',
  styleUrl: './paginated-table.component.css',
  
})
export class PaginatedTableComponent implements OnInit,OnChanges {

  @Input() columns: any[] = [];
  @Input() extraHeaderColumns: any[] = [];
  @Input() extraColumns: any[] = [];
  @Input() data: any[] = [];
  @Input() tableName: string = '';
  @Input() showStartActions: boolean = true;
  @Input() customHeaderNameStart: string = '';
  @Input() showEndActions: boolean = true;
  @Input() customHeaderNameEnd: string = '';
  @Input() showViewAction: boolean = true; // default is true
  @Input() dropdown: boolean = false;
  @Input() showAcquiredFrom: boolean = false;
  @Input() selectionEnabled: boolean = false;
  @Input() selectedRows: any[] = [];
  @Output() selectedRowsChange = new EventEmitter<any[]>();
  @Input() isLoading: boolean = false;
  @Input() isShearchDisable: string = 'T';
  @Input() apiUrl: string = '';
  @Input() totalCount: number = 0;
  @Input() rowsPerPage: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20, 50, 100];
  @Input() showFirstLastIcon: boolean = true;
  @Input() showPageLinks: boolean = true;
  @Input() showCurrentPageReport: boolean = true;
  @Input() showJumpToPageDropdown: boolean = false;

  searchValue: string = '';
  globalFilterFields: string[] = [];
 
  @Output() pageChange = new EventEmitter<{ page: number; rows: number }>();
  @Output() exportCSVEvent = new EventEmitter<void>();
  @Output() exportPDFEvent = new EventEmitter<void>();
  @Output() viewEvent = new EventEmitter<any>();
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() acquiredFromEvent = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<any[]>();
  rowClicked(row: any) {
    this.rowClick.emit(row);
  }
  @ContentChild('actions') actionsTemplate!: TemplateRef<any>;
  // Optional full override for empty state content
  @ContentChild('emptyState') emptyStateTemplate?: TemplateRef<any>;
  currentPage: number = 1;
  // filterData:any[]=[];
constructor(private apiService: ApiService){}

  ngOnInit(): void {
    // this.cdr.detectChanges();
    if(this.data.length === 0 ){
      // this.isLoading=true;
      this.onPageChange({first:0,rows:this.rowsPerPage})
    } else {
      // If data is already provided, emit it
      this.dataLoaded.emit(this.data);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!changes['data']){
      this.onPageChange({first:0,rows:this.rowsPerPage})
    }
  }



  onPageChange(event: any): void {
    const rows=event.rows;
    const first=event.first;
    const page=first/rows+1;
    let apiUrl=this.apiUrl+`?page=${page}&page_size=${rows}`;
    this.apiService.get<any>(apiUrl).subscribe((response: any) => {
      this.isLoading=false;
      this.data = [ ...response.results];
      this.totalCount=response.count;
      // Emit the loaded data to parent component
      this.dataLoaded.emit(this.data);
    });
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
    table.filterGlobal('', 'contains');
  }
  exportCSV() {
    this.exportCSVEvent.emit(); // Emit event instead of direct call
    const headers = this.columns.map((col) => col.header);
    const rows = this.data.map((row) =>
      this.columns.map((col) => row[col.field] || '')
    );
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join(
      '\n'
    );
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableName || 'table'}.csv`; // ✅ Use backticks
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private actionItemsCache = new Map<any, any[]>();

  getActionItems(rowData: any): any[] {
    if (this.actionItemsCache.has(rowData)) {
      return this.actionItemsCache.get(rowData)!;
    }

    const actions = [];

    if (this.showViewAction) {
      actions.push({
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => this.viewEvent.emit(rowData),
      });
    }

    actions.push(
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editEvent.emit(rowData),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteEvent.emit(rowData),
      }
    );

    if (this.showAcquiredFrom) {
      actions.push({
        label: 'Acquired From',
        icon: 'pi pi-briefcase',
        command: () => this.acquiredFromEvent.emit(rowData),
      });
    }

    this.actionItemsCache.set(rowData, actions);
    return actions;
  }



  onStatusChange(row: any) {
    //console.log('Status changed:', row);
    // Additional logic can be added here
  }


  exportPDF() {
    this.exportPDFEvent.emit(); // Emit event instead of direct call
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.columns.map((col) => col.header)],
      body: this.data.map((row) =>
        this.columns.map((col) => row[col.field] || '')
      ),
    });
    doc.save(`${this.tableName || 'table'}.pdf`); // ✅ Use backticks
  }
  activeRow: any = null;
  items = [
    // {
    //     // label: 'Options',
    //     items: [
    {
      label: 'View',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Edit',
      icon: 'pi pi-refresh',
    },
    {
      label: 'Delete',
      icon: 'pi pi-upload',
    },
    //     ]
    // }
  ];
  menuOpen: boolean = false;
  toggleMenu(e: Event, rowData: any) {
    this.activeRow = this.activeRow === rowData ? null : rowData;
    this.menuOpen = this.menuOpen === rowData ? null : rowData;
    //console.log(this.activeRow);
  }

  view(row: any) {
    this.viewEvent.emit(row); // Emit to SFD component
    this.activeRow = null;
  }

  edit(row: any) {
    this.editEvent.emit(row); // Emit to SFD component
    this.activeRow = null;
  }

  delete(row: any) {
    this.deleteEvent.emit(row); // Emit to SFD component
    this.activeRow = null;
  }
  isMenuOpen = false;

  // toggleMenu() {
  //   this.isMenuOpen = !this.isMenuOpen;
  // }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest('.menu-container')) {
      this.closeMenu();
    }
  }

  onSearchInput(value: string): string {
    return value.toLowerCase();
  }
}
