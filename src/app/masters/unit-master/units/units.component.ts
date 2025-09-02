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
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule, Location } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastService } from '../../../services/toast.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';

@Component({
  selector: 'app-units',
  imports: [
    TableModule,
    AddFormComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PaginatedTableComponent,
    TieredMenuModule,
    DialogModule,
    // Dialog,
    FileUploadModule,
    TieredMenuModule,
    InputTextModule,
    TooltipModule,
    ToastModule,
    ProgressBarModule,
    ToastComponent,
    DeleteConfirmationModalComponent,
    ViewDetailsComponent
  ],
  templateUrl: './units.component.html',
  styleUrl: './units.component.css',
})
export class UnitsComponent {
  filteredUnits() {
    throw new Error('Method not implemented.');
  }
  searchText: string = '';
  units: any = [];
  title: string = 'Add new Unit';
  isFormOpen: boolean = false;
  deptdisplayModal: boolean = false;
  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;
  showDeleteDialog: boolean = false;
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit Unit';

  newUnits = {
    name: '',
    code: '',
    description: '',
    active: 1,
  };
  selectedDeatils: any = {
    name: '',
    code: '',
    description: '',
    active: 1,
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
      label: 'Description',
      key: 'description',
      type: 'textarea',
      required: true,
    },
  ];
  toggleForm(open: boolean) {
    this.isFormOpen = open;
  }
  filteredunits: any = [];

  constructor(private apiService: ApiService, private toastService: ToastService, private location: Location
  ) { }

  ngOnInit(): void {
    this.getUnits();
  }

unitStaticData = [
  {
    id: 11,
    active: 1,
    name: "ECR",
    code: "ECR",
    description: "Engineering Change Request",
    created_by: 2
  },
  {
    id: 12,
    active: 1,
    name: "PIR",
    code: "PIR",
    description: "Post Implementation Review",
    created_by: 3
  },
  {
    id: 13,
    active: 1,
    name: "BRD",
    code: "BRD",
    description: "Business Requirement Document",
    created_by: 4
  },
  {
    id: 14,
    active: 1,
    name: "FMEA",
    code: "FMEA",
    description: "Failure Mode and Effects Analysis",
    created_by: 5
  },
  {
    id: 15,
    active: 1,
    name: "RAID",
    code: "RAID",
    description: "Risks, Assumptions, Issues, and Dependencies Log",
    created_by: 2
  },
  {
    id: 16,
    active: 1,
    name: "CAB",
    code: "CAB",
    description: "Change Advisory Board Record",
    created_by: 3
  },
  {
    id: 17,
    active: 1,
    name: "UAT",
    code: "UAT",
    description: "User Acceptance Testing Report",
    created_by: 4
  },
  {
    id: 18,
    active: 1,
    name: "NDA",
    code: "NDA",
    description: "Non-Disclosure Agreement",
    created_by: 5
  }
];

  goBack() {
    this.location.back();
  }
  getUnits(): void {
    this.apiService
      .get<any>('master/unit/') // Changed to handle paginated response
      .subscribe({
        next: (response) => {
          //console.log(response);
          // Handle paginated response structure
          if (response && response.results) {
            this.units = response.results;
            this.filteredunits = [...this.units];
          } else {
            // Fallback for non-paginated response
            this.units = response;
            this.filteredunits = [...this.units];
          }
        },
        error: (error) => {
          console.error('Error fetching unit:', error);
        },
      });
  }
  // Search function
  filterUnits() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.units = [...this.filteredunits]; // Reset to original list if search is empty
      return;
    }

    this.units = this.filteredunits.filter(
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
    this.newUnits = { ...this.newUnits, ...data };

    this.apiService.post(`master/unit/`, this.newUnits).subscribe({
      next: (res: any) => {
        //console.log(res);
        this.toastService.showSuccess(res.message || 'Unit added successfully');
        // Refresh the data after successful addition
        this.getUnits();
        this.closeDialog();
      },
      error: (err) => {
        console.error('API error:', err);
        const errorMsg = err?.error?.error || 'Something went wrong';
        this.toastService.showError(errorMsg);
      },
    });
  }

  viewDetails(unit: any) {
    this.viewdisplayModal = true;
    this.selectedDeatils = unit;
  }
  editDetails(unit: any, open: boolean) {
    this.isEditFormOpen = open;
    this.selectedDeatils = { ...unit };
  }

  deleteDetails(dept: any): void {
    this.showDeleteDialog = true;
    this.selectedDeatils = dept;
  }

  confirmDeletion() {
    this.apiService
      .delete(`master/unit/${this.selectedDeatils.id}/`)
      .subscribe({
        next: (data: any) => {
          //console.log(data);
          this.toastService.showSuccess(data.message || 'Unit deleted successfully');
          // Refresh the data after successful deletion
          this.getUnits();
          this.showDeleteDialog = false;
        },
        error: (error) => {
          console.error('Error:', error);
          const errorMsg = error?.error?.error || 'Failed to delete unit';
          this.toastService.showError(errorMsg);
        },
      });
  }

  cancelDeletion() {
    this.showDeleteDialog = false;
  }

  handleEditSubmit(data: any) {
    this.selectedDeatils = { ...this.selectedDeatils, ...data };
    this.apiService
      .put(`master/unit/${this.selectedDeatils.id}/`, this.selectedDeatils)
      .subscribe({
        next: (data: any) => {
          //console.log(data);
          this.toastService.showSuccess('Updated Unit successfully');
          // Refresh the data after successful edit
          this.getUnits();
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
    { field: 'description', header: 'Description' },
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
      body: this.units.map((row: { [x: string]: any }) =>
        this.cols.map((col) => row[col.field] || '')
      ),
    });
    doc.save(`${this.tableName || 'units'}.pdf`); // ✅ Use backticks
  }
  @Input() tableName: string = '';
  exportExcel() {
    //console.log('Exporting as Excel...');
    // Your Excel export logic here
    this.exportCSVEvent.emit(); // Emit event instead of direct call
    const headers = this.cols.map((col) => col.header);
    const rows = this.units.map((row: { [x: string]: any }) =>
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
    link.download = `${this.tableName || 'units'}.csv`; // ✅ Use backticks
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
