import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog'; // Use DialogModule for p-dialog
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ApiService } from '../../../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule, Location } from '@angular/common';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastService } from '../../../services/toast.service'; // Import ToastService
import { ToastComponent } from '../../../shared/components/toast/toast.component'; // Import ToastComponent
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component'; // Import LoadingSpinnerComponent
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';

@Component({
  selector: 'app-generic',
  imports: [
    TableModule,
    AddFormComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PaginatedTableComponent,
    TieredMenuModule,
    ToastComponent, // Add ToastComponent to imports
    DialogModule, // Add DialogModule to imports
    LoadingSpinnerComponent, // Add LoadingSpinnerComponent to imports
    DeleteConfirmationModalComponent,
    ViewDetailsComponent
  ],
  templateUrl: './generic.component.html',
  styleUrl: './generic.component.css',
})
export class GenericComponent {
  searchText: string = '';
  departments: any = [];
  title: string = 'Add new Generic';
  isFormOpen: boolean = false;
  deptdisplayModal: boolean = false;
  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;
  showDeleteDialog: boolean = false;
  filtredTypes: any[] = [];
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit Gneric';
  isLoading: boolean = false; // New property for loading state

  newDepartment = {
    code: '',
    type: null,
    sr_no: null,
    active: 1, // Add the active field with a default value
  };
  selectedDept: any = {
    code: '',
    type: null,
    sr_no: null,
    active: 1,
  };
  formConfigForNewDetails = [
    {
      label: 'Code',
      key: 'code',
      type: 'text',
      required: true,
    },
    {
      label: 'Type',
      key: 'type',
      type: 'select',
      options: this.filtredTypes,
      required: true,
    },
    {
      label: 'Sr Number',
      key: 'sr_no',
      type: 'number',
      required: false,
    },
  ];
  filteredDepartments: any = [];
  toggleForm(open: boolean) {
    this.isFormOpen = open;
  }

  constructor(
    private apiService: ApiService,
    private location: Location,
    private toastService: ToastService // Inject ToastService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getTypes();
  }
  goBack() {
    this.location.back();
  }
  getTypes(): void {
    this.apiService.get<any[]>('master/equipment-type/?is_dropdown=true').subscribe({
      next: (data) => {
        console.log(data);
        this.filtredTypes = data.map((details: any) => ({
          label: details.name,
          value: details.id,
        }));
        const typeField = this.formConfigForNewDetails.find(
          (field) => field.key === 'type'
        );

        if (typeField) {
          typeField.options = this.filtredTypes;
        }
      },
      error: (error) => {
        console.error('Error fetching types:', error);
        this.toastService.showError('Error fetching types');
      },
    });
  }

  getDepartments(): void {
    this.isLoading = true;
    this.apiService
      .get<any>('master/generic/') // Changed to handle paginated response
      .subscribe({
        next: (response) => {
          // Handle paginated response structure
          if (response && response.results) {
            this.departments = response.results;
            this.filteredDepartments = [...this.departments];
          } else {
            // Fallback for non-paginated response
            this.departments = response;
            this.filteredDepartments = [...this.departments];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching generics:', error);
          this.isLoading = false;
          this.toastService.showError('Error fetching generic data');
        },
      });
  }
  // Search function
  filterDepartments() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.departments = [...this.filteredDepartments];
      return;
    }

    this.departments = this.filteredDepartments.filter(
      (dept: { code: string; type: any; sr_no: number }) =>
        dept.code.toLowerCase().includes(search) ||
        (dept.type && dept.type.toLowerCase().includes(search)) ||
        (dept.sr_no && dept.sr_no.toString().includes(search))
    );
  }
  openAddDept() {
    this.deptdisplayModal = true;
  }

  closeDialog() {
    this.isFormOpen = false;
    this.isEditFormOpen = false;
    this.viewdisplayModal = false;
    this.showDeleteDialog = false;
    this.newDepartment = {
      code: '',
      type: null,
      sr_no: null,
      active: 1,
    };
    this.selectedDept = {
      code: '',
      type: null,
      sr_no: null,
      active: 1,
    };
  }

  handleSubmit(data: any) {
    this.isLoading = true;
    const newGeneric = {
      ...this.newDepartment,
      ...data,
      active: 1
    };

    this.apiService.post(`master/generic/`, newGeneric).subscribe({
      next: (res: any) => {
        // Refresh the data after successful addition
        this.getDepartments();
        this.closeDialog();
        this.isLoading = false;
        this.toastService.showSuccess(res.message || 'Generic added successfully');
      },
      error: (err) => {
        this.isLoading = false;
        const errorMsg = err?.error?.error || 'Something went wrong';
        this.toastService.showError(errorMsg);
      },
    });
  }
  viewDeptDetails(dept: any) {
    this.viewdisplayModal = true;
    this.selectedDept = dept;
  }
  editDetails(dept: any, open: boolean) {
    this.isEditFormOpen = open;
    this.selectedDept = { ...dept };
  }
  deleteDeptDetails(dept: any) {
    this.showDeleteDialog = true;
    this.selectedDept = dept;
  }

  confirmDeletion() {
    this.isLoading = true;
    this.apiService
      .delete(`master/generic/${this.selectedDept.id}/`)
      .subscribe({
        next: (data: any) => {
          // Refresh the data after successful deletion
          this.getDepartments();
          this.showDeleteDialog = false;
          this.isLoading = false;
          this.toastService.showSuccess('Generic deleted successfully');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error:', error);
          this.toastService.showError('Error deleting generic');
        },
      });
  }

  cancelDeletion() {
    this.showDeleteDialog = false;
  }

  handleEditSubmit(data: any) {
    this.isLoading = true;
    this.selectedDept = { ...this.selectedDept, ...data };
    this.apiService
      .put(`master/generic/${this.selectedDept.id}/`, this.selectedDept)
      .subscribe({
        next: (res: any) => {
          // Refresh the data after successful edit
          this.getDepartments();
          this.closeDialog();
          this.isLoading = false;
          this.toastService.showSuccess(res.message || 'Generic updated successfully');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error:', error);
          this.toastService.showError('Error updating generic');
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
  // cols = [
  //   { field: 'code', header: 'Code' },
  //   { field: 'type', header: 'Type' }, // Updated to use type_name if available
  //   { field: 'sr_no', header: 'Sr Number' },
  //   { field: 'active', header: 'Active', transform: (value: number) => (value === 1 ? 'Y' : 'N') },
  // ];
  cols = [
    { field: 'code', header: 'Generic Code' },
    { field: 'type', header: 'Generic Type' }, // Updated to use type_name if available
    { field: 'active', header: 'Active'  },
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
    this.exportPDFEvent.emit();
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.cols.map((col) => col.header)],
      // body: this.departments.map((row: { [x: string]: any }) =>
        // this.cols.map((col) => {
        //   if (col.transform) {
        //     return col.transform(row[col.field]);
        //   }
        //   return row[col.field] || '';
        // })
      // ),
    });
    doc.save(`${this.tableName || 'generic'}.pdf`);
  }
  @Input() tableName: string = '';
  exportExcel() {
    console.log('Exporting as Excel...');
    this.exportCSVEvent.emit();
    const headers = this.cols.map((col) => col.header);
    // const rows = this.departments.map((row: { [x: string]: any }) =>
    //   this.cols.map((col) => {
    //     if (col.transform) {
    //       return col.transform(row[col.field]);
    //     }
    //     return row[col.field] || '';
    //   })
    // );
    // const csv = [
    //   headers.join(','),
    //   ...rows.map((row: any[]) => row.join(',')),
    // ].join('\n');
    // const blob = new Blob([csv], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = `${this.tableName || 'generic'}.csv`;
    // link.click();
    // window.URL.revokeObjectURL(url);
  }
}