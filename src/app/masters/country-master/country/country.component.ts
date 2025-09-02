import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule , Location} from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-country',
  imports: [
    TableModule,
    // Dialog,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TieredMenuModule,
    PaginatedTableComponent,
    AddFormComponent,
    CommonModule,
    ToastComponent,
    DeleteConfirmationModalComponent
  ],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css'
})
export class CountryComponent implements OnInit {
  searchText: string = '';
  departments: any = [];
  deptdisplayModal: boolean = false;
  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;
  showDeleteDialog: boolean = false;
  isFormOpen: boolean = false;
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit Country Master';
  title: string = 'Add New Country Master';
  newDepartment = {
    code: '',
    name: '',  
    active: 1,
  };
  selectedDept: any = {
    code: '',
    name: '',
  };

  formConfigForNewDetails = [
 
    {
      label: 'Name',
      key: 'name',
      type: 'text',
      required: true,
    },
    {
      label: 'Code',
      key: 'code',
      type: 'text',
      required: true,
    },
  ];
  filteredDepartments: any = [];
  toggleTable: boolean = true;

  // New properties for pagination
  apiUrl: string = 'master/country/';
  totalCount: number = 0;

  constructor(
    private apiService: ApiService,
    private toastService: ToastService, private location: Location, private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //console.log('🚢 Country Component Initializing...');
    //console.log('API URL:', this.apiUrl);
    //console.log('Total Count:', this.totalCount);
    //console.log('Enable URL Fetching: true');
    
    // Note: Table data will be loaded by the paginated table component
    // No need to call getDepartments() here
  }
countryStaticData = [
  {
    id: 30,
    active: 1,
    name: "INDIA",
    code: "IN",
    created_by: 2
  },
  {
    id: 31,
    active: 1,
    name: "AUSTRALIA",
    code: "AU",
    created_by: 3
  },
  {
    id: 32,
    active: 1,
    name: "ITALY",
    code: "IT",
    created_by: 4
  },
  {
    id: 33,
    active: 1,
    name: "SOUTH AFRICA",
    code: "ZA",
    created_by: 5
  },
  {
    id: 34,
    active: 1,
    name: "MEXICO",
    code: "MX",
    created_by: 6
  },
  {
    id: 35,
    active: 1,
    name: "NORWAY",
    code: "NO",
    created_by: 7
  },
  {
    id: 36,
    active: 1,
    name: "SPAIN",
    code: "ES",
    created_by: 8
  },
  {
    id: 37,
    active: 1,
    name: "UNITED KINGDOM",
    code: "GB",
    created_by: 9
  },
  {
    id: 38,
    active: 1,
    name: "UNITED STATES",
    code: "US",
    created_by: 10
  },
  {
    id: 39,
    active: 1,
    name: "SOUTH KOREA",
    code: "KR",
    created_by: 11
  }
];


  goBack(){
    this.location.back();
  }
  getDepartments(): void {
    this.apiService
      .get<any>('master/country/') // Changed to handle paginated response
      .subscribe({
        next: (response) => {
          //console.log(response);
          // Handle paginated response structure
          if (response && response.results) {
            this.departments = response.results;
            this.filteredDepartments = [...this.departments];
          } else {
            // Fallback for non-paginated response
            this.departments = response;
            this.filteredDepartments = [...this.departments];
          }
        },
        error: (error) => {
          console.error('Error fetching departments:', error);
        },
      });
  }
  // Search function
  filterDepartments() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.departments = [...this.filteredDepartments]; // Reset to original list if search is empty
      return;
    }

    this.departments = this.filteredDepartments.filter(
      (dept: { name: string; code: string }) =>
        dept.name.toLowerCase().includes(search) ||
        dept.code.toLowerCase().includes(search)
    );
  }
  openAddDept() {
    this.deptdisplayModal = true;
  }

  closeDialog() {
    this.deptdisplayModal = false;
    this.viewdisplayModal = false;
    this.showDeleteDialog = false;
    this.editdisplayModal = false;
    this.isFormOpen = false;
    this.isEditFormOpen = false;
    this.selectedDept = {
      code: '',
      name: '',
      description: '',
    };
  }
  handleSubmit(data: any) {
    this.newDepartment = { ...this.newDepartment, ...data };  
    this.apiService.post(`master/country/`, this.newDepartment).subscribe({
      next: (res: any) => {
        this.toastService.showSuccess(res.message || 'Country added successfully');
        // Toggle table to refresh paginated table view
        this.toggleTable = false;
        setTimeout(() => {
          this.toggleTable = true;
        }, 100);
        this.closeDialog();
      },
      error: (err) => {
        const errorMsg = err?.error?.error || 'Something went wrong';
        this.toastService.showError(errorMsg);
      },
    });  
  }
  

  toggleForm(open: boolean) {
    this.isFormOpen = open;
  }
  viewDeptDetails(dept: any) {
    this.viewdisplayModal = true;
    //console.log(dept);
    this.selectedDept = dept;
  }
  editDeptDetails(dept: any) {
    this.isEditFormOpen = true;
    this.selectedDept = { ...dept };
  }
  deleteDeptDetails(dept: any): void {
    this.showDeleteDialog = true;
    this.selectedDept = dept;
  }

  confirmDeletion() {
    this.apiService
      .delete(`master/country/${this.selectedDept.id}/`)
      .subscribe({
        next: (data: any) => {
          this.toastService.showSuccess('Country deleted successfully');
          // Toggle table to refresh paginated table view
          this.toggleTable = false;
          setTimeout(() => {
            this.toggleTable = true;
          }, 100);
          this.showDeleteDialog = false;
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }

  cancelDeletion() {
    this.showDeleteDialog = false;
  }
  
  handleEditSubmit(data: any) {
    this.selectedDept = { ...this.selectedDept, ...data };
    this.selectedDept.sfd_applicable = 1;
  
    this.apiService
      .put(`master/country/${this.selectedDept.id}/`, this.selectedDept)
      .subscribe({
        next: (data: any) => {
          //console.log(data);
          this.toastService.showSuccess('Updated Country successfully');
          // Toggle table to refresh paginated table view
          this.toggleTable = false;
          setTimeout(() => {
            this.toggleTable = true;
          }, 100);
          this.closeDialog();
        },
        error: (error) => {
          console.error('Error:', error);
        },
      });
  }
  
  exportOptions = [
    {
      label: 'Export as PDF',
      icon: 'pi pi-file-pdf',
      command: () => this.exportPDF(),
    },
    {
      label: 'Export as Excel',
      icon: 'pi pi-file-excel',
      command: () => this.exportExcel(),
    },
  ];
  cols = [
    { field: 'name', header: 'Name', filterType: 'text' },
    { field: 'code', header: 'Code', filterType: 'text' },
  ];
  @ViewChild('dt') dt!: Table;
  value: number = 0;
  stateOptions: any[] = [
    { label: 'Equipment Specification', value: 'equipment' },
    { label: 'HID Equipment', value: 'hid' },
    { label: 'Generic Specification', value: 'generic' },
  ];
  tabvalue: string = 'equipment';
  @Output() exportCSVEvent = new EventEmitter<void>();
  @Output() exportPDFEvent = new EventEmitter<void>();
  exportPDF() {
    //console.log('Exporting as PDF...');
    // Your PDF export logic here
    this.exportPDFEvent.emit(); // Emit event instead of direct call
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.cols.map((col) => col.header)],
      body: this.departments.map((row: { [x: string]: any }) =>
        this.cols.map((col) => row[col.field] || '')
      ),
    });
    doc.save(`${this.tableName || 'country'}.pdf`); // ✅ Use backticks
  }
  @Input() tableName: string = '';
  exportExcel() {
    //console.log('Exporting as Excel...');
    // Your Excel export logic here
    this.exportCSVEvent.emit(); // Emit event instead of direct call
    const headers = this.cols.map((col) => col.header);
    const rows = this.departments.map((row: { [x: string]: any }) =>
      this.cols.map((col) => row[col.field] || '')
    );
    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableName || 'country'}.csv`; // ✅ Use backticks
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Handle data loaded from paginated table
  onDataLoaded(data: any[]): void {
    //console.log('🚢 Data loaded from paginated table:', data);
    //console.log('🚢 Data length:', data?.length);
    //console.log('🚢 Data type:', typeof data);
    //console.log('🚢 First record:', data?.[0]);
    
    this.departments = data || [];
    this.filteredDepartments = [...(data || [])];
    
    //console.log('🚢 Departments array updated:', this.departments);
    //console.log('🚢 Filtered departments updated:', this.filteredDepartments);
    
    // Force change detection
    this.cdr.detectChanges();
  }
}
