import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Dialog, DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CommonModule, Location } from '@angular/common';

import { DepartmentService } from '../ship-services/department.service'; // Correct path
import { SectionService } from '../ship-services/section.service'; // Correct path
import { FileUploadModule } from 'primeng/fileupload';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { catchError, of } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; // Import ProgressSpinnerModule for loading indicator
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';
import { ToastService } from '../../../services/toast.service';

// Static dataset for sections
const STATIC_SECTIONS: any[] = [
  {
    id: 41,
    department_name: 'Engineering',
    department_code: 'ENG55',
    active: 1,
    code: '61',
    name: 'PROPULSION SYSTEMS',
    created_by: '7',
    department: 31
  },
  {
    id: 42,
    department_name: 'Engineering',
    department_code: 'ENG55',
    active: 1,
    code: '62',
    name: 'POWER GENERATION',
    created_by: '7',
    department: 31
  },
  {
    id: 43,
    department_name: 'Electrical',
    department_code: 'ELE22',
    active: 1,
    code: '71',
    name: 'CONTROL CIRCUITS',
    created_by: '8',
    department: 32
  },
  {
    id: 44,
    department_name: 'Electrical',
    department_code: 'ELE22',
    active: 1,
    code: '72',
    name: 'LIGHTING SYSTEMS',
    created_by: '8',
    department: 32
  },
  {
    id: 45,
    department_name: 'Communications',
    department_code: 'COM91',
    active: 1,
    code: '81',
    name: 'SATELLITE LINKS',
    created_by: '9',
    department: 33
  },
  {
    id: 46,
    department_name: 'Communications',
    department_code: 'COM91',
    active: 1,
    code: '82',
    name: 'SECURE RADIO',
    created_by: '9',
    department: 33
  },
  {
    id: 47,
    department_name: 'Damage Control',
    department_code: 'DCT12',
    active: 1,
    code: '91',
    name: 'FIRE SUPPRESSION',
    created_by: '10',
    department: 34
  },
  {
    id: 48,
    department_name: 'Damage Control',
    department_code: 'DCT12',
    active: 1,
    code: '92',
    name: 'FLOOD CONTROL',
    created_by: '10',
    department: 34
  },
  {
    id: 49,
    department_name: 'Training & Drills',
    department_code: 'TRN90',
    active: 1,
    code: '101',
    name: 'CREW DRILLS',
    created_by: '11',
    department: 35
  }
];

// Static department options for dropdown
const STATIC_DEPARTMENT_OPTIONS = [
  { label: 'Engineering', value: 31 },
  { label: 'Medical', value: 32 },
  { label: 'Communications', value: 33 },
  { label: 'Damage Control', value: 34 },
  // { label: 'Training & Drills', value: 35 }
];


@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    AddFormComponent,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DropdownModule,
    TieredMenuModule,
    PaginatedTableComponent,
    CommonModule,
    ToastComponent, // Make sure ToastComponent is imported
    FileUploadModule,
    DeleteConfirmationModalComponent,
    ViewDetailsComponent,
    ProgressSpinnerModule // For the loading spinner
  ],
  // IMPORTANT: Provide ToastService here so it can be injected and used by ToastComponent
  providers: [ToastService],
  templateUrl: './section.component.html',
  styleUrl: './section.component.css',
})
export class SectionComponent implements OnInit {
  searchText: string = '';
  sections: any = [];
  isFormOpen: boolean = false;
  title: string = 'Add new section';
  isBulkUploadPopup: boolean = false;
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit section';
  isDeleteConfirmationVisible: boolean = false;
  isLoading: boolean = false; // Property to control loading spinner visibility

  isViewDetailsOpen: boolean = false;
  detailsForViewComponent: any = {};
  viewDetailsTitle: string = 'Section Details';

  newDetails: any;

  selectedDetails: any = {
    active: true,
  };

  formConfigForNewDetails: any[];

  filteredDepartments: any[] = [];

  // New properties for pagination
  apiUrl: string = 'master/section/';
  totalCount: number = 0;

  constructor(
    private toastService: ToastService, // Inject ToastService
    private location: Location,
    private departmentService: DepartmentService,
    private sectionService: SectionService,
    private cdr: ChangeDetectorRef
  ) {
    this.formConfigForNewDetails = [
      {
        label: 'Section Name',
        key: 'name',
        type: 'text',
        required: true,
      },
      {
        label: 'Section Code',
        key: 'code',
        type: 'text',
        required: true,
      },
      {
        label: 'Section Department',
        key: 'department',
        type: 'select',
        options: this.filteredDepartments, // Options will be loaded dynamically
        required: true,
      },
      {
        label: 'Status',
        key: 'active',
        type: 'checkbox',
        required: false,
        placeholder: 'Active',
      },
    ];

    this.resetNewDetails();
  }

  ngOnInit(): void {
    // Use static data instead of API
    this.apiUrl = '';
    this.sections = [...STATIC_SECTIONS] as any;
    this.totalCount = STATIC_SECTIONS.length;
    this.filteredDepartments = [...STATIC_DEPARTMENT_OPTIONS] as any;
    
    // Update form config with static department options
    const departmentField = this.formConfigForNewDetails.find(
      (field) => field.key === 'department'
    );
    if (departmentField) {
      departmentField.options = this.filteredDepartments;
    }
  }

  resetNewDetails() {
    this.newDetails = {
      code: '',
      name: '',
      department_name: null,
      sfd_hierarchy: null, // Added sfd_hierarchy and defaulted to null
      active: true, // Default to active
    };
  }

  toggleForm(open: boolean) {
    this.isFormOpen = open;
    if (open) {
      this.resetNewDetails();
    }
  }

  getSections(): void {
    this.isLoading = true;
  
    this.sectionService.getSections().subscribe({
      next: (data: any) => {  // ✅ make sure it's `any`, not `any[]`
        const sections = (data?.results || []) as any[]; // ✅ ensure it's treated as an array
  
      
  
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching sections:', error);
        this.toastService.showError('Failed to fetch sections.');
        this.isLoading = false;
      },
    });
  }
  
  

  handleSubmit(data: any) {
    // this.isLoading = true; // Show loading spinner
    // const payload = { ...data };

    // // Ensure department is sent as just the ID if it's an object from the dropdown
    // if (payload.department && typeof payload.department === 'object' && payload.department.value) {
    //   payload.department = payload.department.value;
    // } else if (payload.department === '') {
    //   payload.department = null;
    // }
    // payload.active = Number(1);

    // // Explicitly add sfd_hierarchy as null
    // payload.sfd_hierarchy = null;

    // this.sectionService.addSection(payload).subscribe({
    //   next: (response: any) => {
    //     this.toastService.showSuccess('Section added successfully!'); // Show success message
    //     this.closeDialog();
    //     this.isLoading = false; // Hide loading spinner on success
    //   },
    //   error: (error) => {
    //     console.error('Error adding section:', error);
    //     let errorMessage = 'Failed to add section.';
    //     if (error.error && typeof error.error === 'object') {
    //       // Attempt to extract specific error messages from the backend response
    //       const errorMessages = Object.values(error.error).flat();
    //       // Check for specific "Code already exists" error
    //       if (errorMessages.some((msg: any) => typeof msg === 'string' && msg.includes('section with this code already exists'))) {
    //         errorMessage = 'Code: A section with this code already exists.';
    //       } else {
    //         errorMessage = errorMessages.join(' ');
    //       }
    //     } else if (error.message) {
    //       errorMessage = error.message;
    //     }
    //     this.toastService.showError(`Error: ${errorMessage}`); // Show error message
    //     this.isLoading = false; // Hide loading spinner on error
    //   },
    // });

    // Static implementation - just show success and close dialog
    this.toastService.showSuccess('Section added successfully!');
    this.closeDialog();
  }

  deleteSectionDetails(details: any) {
    this.selectedDetails = details;
    this.isDeleteConfirmationVisible = true;
  }

  confirmDeletion() {
    // if (this.selectedDetails?.id) {
    //   this.isLoading = true; // Show loading spinner
    //   this.sectionService.deleteSection(this.selectedDetails.id).subscribe({
    //     next: () => {
    //       this.toastService.showSuccess('Section deleted successfully!'); // Show success message
    //       this.closeDialog();
    //       this.isLoading = false; // Hide loading spinner on success
    //     },
    //     error: (error) => {
    //       console.error('Error deleting section:', error);
    //       let errorMessage = 'Failed to delete section.';
    //       if (error.error && typeof error.error === 'object') {
    //         errorMessage = Object.values(error.error).flat().join(' ');
    //       } else if (error.message) {
    //         errorMessage = error.message;
    //       }
    //       this.toastService.showError(`Error: ${errorMessage}`); // Show error message
    //       this.closeDialog();
    //       this.isLoading = false; // Hide loading spinner on error
    //     },
    //   });
    // }

    // Static implementation - just show success and close dialog
    this.toastService.showSuccess('Section deleted successfully!');
    this.closeDialog();
  }

  handleEditSubmit(data: any) {
    // this.isLoading = true; // Show loading spinner
    // const payload = { ...data };

    // // Ensure department is sent as just the ID if it's an object from the dropdown
    // if (payload.department && typeof payload.department === 'object' && payload.department.value) {
    //   payload.department = payload.department.value;
    // } else if (payload.department === '') {
    //   payload.department = null;
    // }

    // // Set 'active' to 1 or 0 (number) using Number() for robust conversion
    // // This will convert boolean true/false, or string "1"/"0" to the desired 1 or 0 integer.
    // payload.active = Number(payload.active);

    // // Explicitly add sfd_hierarchy as null (or retain existing if it's an edit)
    // // For simplicity, setting to null here. If sfd_hierarchy can be edited,
    // // it would need to be part of formConfig and formData.
    // payload.sfd_hierarchy = null;

    // if (this.selectedDetails?.id) {
    //   this.sectionService.updateSection(this.selectedDetails.id, payload).subscribe({
    //     next: () => {
    //       this.toastService.showSuccess('Section updated successfully!'); // Show success message
    //       this.closeDialog();
    //       this.isLoading = false; // Hide loading spinner on success
    //     },
    //     error: (error) => {
    //       console.error('Error updating section:', error);
    //       let errorMessage = 'Failed to update section.';
    //       if (error.error && typeof error.error === 'object') {
    //         // Attempt to extract specific error messages from the backend response
    //         const errorMessages = Object.values(error.error).flat();
    //         // Check for specific "Code already exists" error
    //         if (errorMessages.some((msg: any) => typeof msg === 'string' && msg.includes('section with this code already exists'))) {
    //           errorMessage = 'Code: A section with this code already exists.';
    //         } else {
    //           errorMessage = errorMessages.join(' ');
    //         }
    //       } else if (error.message) {
    //         errorMessage = error.message;
    //       }
    //       this.toastService.showError(`Error: ${errorMessage}`); // Show error message
    //       this.isLoading = false; // Hide loading spinner on error
    //     },
    //   });
    // }

    // Static implementation - just show success and close dialog
    this.toastService.showSuccess('Section updated successfully!');
    this.closeDialog();
  }

  goBack() {
    this.location.back();
  }

  loadDepartmentOptions(): void {
    this.departmentService.getDepartmentOptions().subscribe({
      next: (departments) => {
        this.filteredDepartments = departments;
        const departmentField = this.formConfigForNewDetails.find(
          (field) => field.key === 'department'
        );
        if (departmentField) {
          departmentField.options = this.filteredDepartments;
        }
      },
      error: (error: any) => {
        console.error('Error loading department options:', error);
        this.toastService.showError('Failed to load department options.'); // Show error message
      },
    });

    this.departmentService.loadAllDepartmentsData();
  }

  filterSections() {
    const search = this.searchText.toLowerCase().trim();
    if (!search) {
      this.getSections(); // Reload all sections if search is empty
      return;
    }
    this.isLoading = true; // Show loading spinner for filter
    this.sectionService.getSections().subscribe({
      next: (data: any[]) => {
        this.sections = data.map((section) => ({
          ...section,
          department_name: section.department_name || 'N/A',
          active_status: section.active === 1 ? 'Y' : 'N',
        })).filter(
          (section: { name: string; code: string; department_name: string }) =>
            section.name.toLowerCase().includes(search) ||
            section.code.toLowerCase().includes(search) ||
            section.department_name.toLowerCase().includes(search)
        );
        this.isLoading = false; // Hide loading spinner
      },
      error: (error) => {
        console.error('Error fetching sections for filter:', error);
        this.toastService.showError('Failed to filter sections.'); // Show error message
        this.isLoading = false; // Hide loading spinner
      }
    });
  }

  handleBulkUpload(event: any) {
    this.toastService.showSuccess('File uploaded successfully!'); // Show success message
    this.isBulkUploadPopup = false;
    // this.getSections(); // Commented out for static data
  }

  closeDialog() {
    this.isDeleteConfirmationVisible = false;
    this.isEditFormOpen = false;
    this.isFormOpen = false;
    this.isBulkUploadPopup = false;
    this.isViewDetailsOpen = false;
    this.selectedDetails = { active: true };
    this.resetNewDetails();
    // this.getSections(); // Refresh data after any action - commented out for static data
  }

  viewDetails(details: any) {
    this.detailsForViewComponent = { ...details };
    this.isViewDetailsOpen = true;
  }

  editDetails(details: any) {
    this.selectedDetails = {
      ...details,
      // This logic correctly maps the department object to a value the dropdown expects (the department ID)
      department: this.filteredDepartments.find(d => d.value === details.department?.id || d.value === details.department) || null,
    };
    this.isEditFormOpen = true;
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
    { field: 'code', header: 'Code', filterType: 'text' },
    { field: 'name', header: 'Name', filterType: 'text' },
    { field: 'department_name', header: 'Department', filterType: 'text' },
    { field: 'active', header: 'Active', filterType: 'text' },
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

  // tableName is an Input, so it should be available.
  @Input() tableName: string = 'sections';

  // Handle data loaded from paginated table
  onDataLoaded(data: any[]): void {
    //console.log('🚢 Data loaded from paginated table:', data);
    //console.log('🚢 Data length:', data?.length);
    //console.log('🚢 Data type:', typeof data);
    //console.log('🚢 First record:', data?.[0]);
    
    this.sections = data || [];
    
    //console.log('🚢 Sections array updated:', this.sections);
    
    // Force change detection
    this.cdr.detectChanges();
  }

  exportPDF() {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.cols.map((col) => col.header)],
      body: this.sections.map((row: { [x: string]: any }) =>
        this.cols.map((col) => row[col.field] || '')
      ),
    });
    doc.save(`${this.tableName || 'table'}.pdf`);
    this.toastService.showSuccess('Exported as PDF successfully!'); // Show success message
  }

  exportExcel() {
    const headers = this.cols.map((col) => col.header);
    const rows = this.sections.map((row: { [x: string]: any }) =>
      this.cols.map((col) => row[col.field] || '')
    );
    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableName || 'table'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    this.toastService.showSuccess('Exported as Excel successfully!'); // Show success message
  }
}
