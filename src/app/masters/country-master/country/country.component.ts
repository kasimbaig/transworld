import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
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

  constructor(
    private apiService: ApiService,
    private toastService: ToastService, private location: Location
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }
  goBack(){
    this.location.back();
  }
  getDepartments(): void {
    this.apiService
      .get<any>('master/country/') // Changed to handle paginated response
      .subscribe({
        next: (response) => {
          console.log(response);
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
        // Refresh the data after successful addition
        this.getDepartments();
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
    console.log(dept);
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
          // Refresh the data after successful deletion
          this.getDepartments();
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
          console.log(data);
          this.toastService.showSuccess('Updated Country successfully');
          // Refresh the data after successful edit
          this.getDepartments();
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
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
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
    console.log('Exporting as PDF...');
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
    console.log('Exporting as Excel...');
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
}
