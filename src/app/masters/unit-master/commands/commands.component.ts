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
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TieredMenuModule } from 'primeng/tieredmenu';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule , Location} from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';

@Component({
  selector: 'app-commands',
  imports: [
    // Dialog,
    TableModule,
    AddFormComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    TieredMenuModule,
    PaginatedTableComponent,
    ToastComponent,
    DeleteConfirmationModalComponent,
    ViewDetailsComponent
],
  templateUrl: './commands.component.html',
  styleUrl: './commands.component.css',
})
export class CommandsComponent implements OnInit {
  title: string = 'Add new Command';
  searchText: string = '';
  departments: any = [];
  isFormOpen: boolean = false;
  deptdisplayModal: boolean = false;
  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;
  showDeleteDialog: boolean = false;
  filteredSFDHierarchy: any[] = [];
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit command';
  showConfirmDialog: boolean = false;
  newDepartment = {
    name: '',
    code: '',
    ref: '',
    sfd_hierarchy: null,
    active: 1,
  };
  selectedDept: any = {
    name: '',
    code: '',
    ref: '',
    sfd_hierarchy: null,
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
    {
      label: 'Reference',
      key: 'ref',
      type: 'text',
      required: false,
    },
  ];
  toggleForm(open: boolean) {
    this.isFormOpen = open;
  }
  filteredDepartments: any = [];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,private location: Location
  ) {}

  ngOnInit(): void {
    this.getCommands();
    // this.getSFDHierarchyDetails();
  }
  goBack(){
    this.location.back();
  }
  getCommands(): void {
    this.apiService
      .get<any>('master/command/') // Changed to handle paginated response
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
  // getSFDHierarchyDetails(): void {
  //   this.apiService.get<any[]>('master/sfd-hierarchy/').subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.filteredSFDHierarchy = data.map((details: any) => ({
  //         label: details.name,
  //         value: details.id,
  //       }));
  //       const sfdHierarchyField = this.formConfigForNewDetails.find(
  //         (field) => field.key === 'sfd_hierarchy'
  //       );

  //       if (sfdHierarchyField) {
  //         sfdHierarchyField.options = this.filteredSFDHierarchy;
  //       }
  //     },
  //     error: (error) => {
  //       console.error('Error fetching departments:', error);
  //     },
  //   });
  // }
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

  closeDialog() {
    this.deptdisplayModal = false;
    this.viewdisplayModal = false;
    this.showDeleteDialog = false;
    this.editdisplayModal = false;
    this.isFormOpen = false;
    this.isEditFormOpen = false;
    this.selectedDept = {
      name: '',
      code: '',
      ref: '',
      sfd_hierarchy: '',
    };
  }
  handleSubmit(data: any) {
    this.newDepartment = data;
    this.newDepartment.active = 1;
    console.log('New Department:', this.newDepartment);

    this.apiService.post(`master/command/`, this.newDepartment).subscribe({
      next: (response: any) => {
        console.log(response);
        this.toastService.showSuccess('Added new Command');
        // Refresh the data after successful addition
        this.getCommands();
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
    console.log(dept);
    this.selectedDept = dept;
  }
  editDetails(details: any) {
    this.selectedDept = { ...details };
    console.log(this.selectedDept);
    this.isEditFormOpen = true;
  }

  deleteDeptDetails(dept: any): void {
    this.showDeleteDialog = true;
    this.selectedDept = dept;
  }
  
  confirmDeletion() {
    this.apiService
      .delete(`master/command/${this.selectedDept.id}/`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.toastService.showSuccess('Command deleted successfully');
          // Refresh the data after successful deletion
          this.getCommands();
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

    this.apiService
      .put(`master/command/${this.selectedDept.id}/`, this.selectedDept)
      .subscribe({
        next: (updatedData: any) => {
          console.log(updatedData);
          this.toastService.showSuccess('Successfully updated command');
          // Refresh the data after successful edit
          this.getCommands();
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
    { field: 'ref', header: 'Reference' },
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
    doc.save(`${this.tableName || 'commands'}.pdf`); // ✅ Use backticks
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
    link.download = `${this.tableName || 'commands'}.csv`; // ✅ Use backticks
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
