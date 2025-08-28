import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ApiService } from '../../../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule , Location} from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';

@Component({
  selector: 'app-propulsion',
  imports: [
    TableModule,
    AddFormComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TieredMenuModule,
    PaginatedTableComponent,
    ToastComponent,
    // Dialog,
    DeleteConfirmationModalComponent,
    ViewDetailsComponent
  ],
  templateUrl: './propulsion.component.html',
  styleUrl: './propulsion.component.css',
})
export class PropulsionComponent {
  title: string = 'Add new propulation';
  isFormOpen: boolean = false;
  searchText: string = '';
  departments: any = [];
  deptdisplayModal: boolean = false;
  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;
  showDeleteDialog: boolean = false;
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit Propulation';

  newDetails = {
    name: '',
    active: 1,
  };
  selectedDetails: any = {
    name: '',
    description: '',
  };
  formConfigForNewDetails = [
    {
      label: 'Name',
      key: 'name',
      type: 'text',
      required: true,
    },
  ];

  toggleForm(open: boolean) {
    this.isFormOpen = open;
  }

  filteredDepartments: any = [];

  constructor(private apiService: ApiService, private toastService: ToastService, private location: Location  
  ) {}

  ngOnInit(): void {
    this.getDepartments();
  }
  goBack(){
    this.location.back();
  }
  getDepartments(): void {
    this.apiService
      .get<any>('master/propulsion/') // Changed to handle paginated response
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
      (dept: { name: string; description: string }) =>
        dept.name.toLowerCase().includes(search) ||
        dept.description.toLowerCase().includes(search)
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
  }
  handleSubmit(data: any) {
    this.newDetails = { ...this.newDetails, ...data };

    this.apiService.post(`master/propulsion/`, this.newDetails).subscribe({
      next: (data: any) => {
        console.log(data);
        this.toastService.showSuccess('Propulsion added successfully');
        // Refresh the data after successful addition
        this.getDepartments();
        this.closeDialog();
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Invalid login credentials');
      },
    });
  }

  viewDeptDetails(dept: any) {
    this.viewdisplayModal = true;
    this.selectedDetails = { ...dept };
  }
  editDetails(details: any, open: boolean) {
    this.selectedDetails = { ...details };
    this.isEditFormOpen = true;
  }
  deleteDeptDetails(dept: any): void {
    this.showDeleteDialog = true;
    this.selectedDetails = dept;
  }
  
  confirmDeletion() {
    this.apiService
      .delete(`master/propulsion/${this.selectedDetails.id}/`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.toastService.showSuccess('Propulsion deleted successfully');
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
    this.selectedDetails = { ...this.selectedDetails, ...data };  
    this.apiService
      .put(`master/propulsion/${this.selectedDetails.id}/`, this.selectedDetails)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.toastService.showSuccess('Updated Propulsion successfully');
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
    { field: 'name', header: 'Propulsion Name' },
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
    doc.save(`${this.tableName || 'propulsion'}.pdf`); // ✅ Use backticks
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
    link.download = `${this.tableName || 'propulsion'}.csv`; // ✅ Use backticks
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
