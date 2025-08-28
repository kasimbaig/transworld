import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule, Location } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { Group, NewGroupFormData } from '../../../shared/models/group.model';
import { Option } from '../ship.model';
import { SectionService } from '../ship-services/section.service';
import { GenericService } from '../ship-services/generic.service';
import { GroupService } from '../ship-services/group.service';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { ViewDetailsComponent } from '../../../shared/components/view-details/view-details.component';
import { FileUpload } from "primeng/fileupload";

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    AddFormComponent,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PaginatedTableComponent,
    TieredMenuModule,
    ToastComponent,
    DeleteConfirmationModalComponent,
    ViewDetailsComponent,
    FileUpload
],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupComponent implements OnInit {
  title: string = 'Add new Group';
  isFormOpen: boolean = false;
  searchText: string = '';
  groups: Group[] = [];
  // Inside GroupComponent class
isLoading: boolean = false;
  isDeleteConfirmationVisible: boolean = false;
  isBulkUploadPopup: boolean = false;

  viewdisplayModal: boolean = false;
  editdisplayModal: boolean = false;

  filteredSections: Option[] = [];
  filteredGenerics: Option[] = [];
  isEditFormOpen: boolean = false;
  editTitle: string = 'Edit Group';

  newGroup: NewGroupFormData = {
    code: '',
    name: '',
    section: null,
    generic: null,
    active: 1,
  };

  selectedGroup: Group = {
    name: '',
    code: '',
    section: null,
    generic: null,
    active: 1,
  };

  isViewDetailsOpen: boolean = false;
  detailsForViewComponent: any = {};
  viewDetailsTitle: string = 'Group Details';

  // "equipment_count" has been removed
  cols = [
    { field: 'name', header: 'Name' },
    { field: 'code', header: 'Code' },
    { field: 'section_name', header: 'Section' },
    { field: 'generic_type', header: 'Generic' },
    { field: 'active', header: 'Active', transform: (value: number) => (value === 1 ? 'Y' : 'N') },
  ];

  // "equipment_count" has been removed
  formConfigForNewDetails = [
    {
      label: 'Name',
      key: 'name',
      type: 'text',
      required: true,
      placeholder: 'Enter Group Name'
    },
    {
      label: 'Code',
      key: 'code',
      type: 'text',
      required: true,
      placeholder: 'Enter Group Code'
    },
    {
      label: 'Section',
      key: 'section',
      type: 'select',
      options: this.filteredSections,
      required: false,
      placeholder: 'Select Section'
    },
    {
      label: 'Generic',
      key: 'generic',
      type: 'select',
      options: this.filteredGenerics,
      required: false,
      placeholder: 'Select Generic'
    },
  ];

  filteredGroups: Group[] = [];

  constructor(
    private groupService: GroupService,
    private sectionService: SectionService,
    private genericService: GenericService,
    private toastService: ToastService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.getGroups();
    this.getSectionLookupDetails();
    this.getGenericLookupDetails();
  }

  goBack(): void {
    this.location.back();
  }

  getSectionLookupDetails(): void {
    this.sectionService.getSectionOptions().subscribe({
      next: (data: Option[]) => {
        this.filteredSections = data;
        const sectionField = this.formConfigForNewDetails.find(
          (field) => field.key === 'section'
        );
        if (sectionField) {
          sectionField.options = this.filteredSections;
        }
      },
      error: (error) => {
        console.error('Error fetching section options:', error);
        this.toastService.showError('Failed to load sections.');
      },
    });
  }

  getGenericLookupDetails(): void {
    this.genericService.getGenericOptions().subscribe({
      next: (data: Option[]) => {
        this.filteredGenerics = data;
        const genericField = this.formConfigForNewDetails.find(
          (field) => field.key === 'generic'
        );
        if (genericField) {
          genericField.options = this.filteredGenerics;
        }
      },
      error: (error) => {
        console.error('Error fetching generic options:', error);
        this.toastService.showError('Failed to load generics.');
      },
    });
  }

  getGroups(): void {
    this.groupService.getGroups().subscribe({
      next: (response: any) => {
        // Handle the paginated response format
        if (response && response.results) {
          this.groups = response.results;
        } else {
          this.groups = response;
        }
        this.filteredGroups = [...this.groups];
      },
      error: (error) => {
        console.error('Error fetching groups:', error);
        this.toastService.showError('Failed to fetch groups.');
      },
    });
  }

  filterGroups(): void {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.groups = [...this.filteredGroups];
      return;
    }

    this.groups = this.filteredGroups.filter(
      (group: Group) =>
        group.name.toLowerCase().includes(search) ||
        group.code.toLowerCase().includes(search) ||
        (typeof group.section === 'object' && group.section !== null && group.section.name?.toLowerCase().includes(search)) ||
        (typeof group.generic === 'object' && group.generic !== null && group.generic.code?.toLowerCase().includes(search))
    );
  }

  openAddGroup(): void {
    this.isFormOpen = true;
    this.isEditFormOpen = false;
    this.newGroup = {
      code: '',
      name: '',
      section: null,
      generic: null,
      active: 1,
    };
  }

  handleSubmit(data: any): void {
      this.isLoading = true;

    const payload: NewGroupFormData = {
      code: data.code,
      name: data.name,
      section: data.section,
      generic: data.generic,
      active: 1,
    };

    this.groupService.addGroup(payload).subscribe({
      next: (response: Group) => {
        this.toastService.showSuccess('Group added successfully');
        this.groups.push(response);
        this.filteredGroups.push(response);
        this.closeDialog();
              this.isLoading = false;

      },
      error: (error) => {
        console.error('Error adding group:', error);
        const errorMessage = error.error?.message || 'Failed to add group.';
        this.toastService.showError(errorMessage);
              this.isLoading = false;

      },
    });
  }

  editGroupDetails(group: Group): void {
    this.isEditFormOpen = true;
    this.selectedGroup = {
      ...group,
      section: typeof group.section === 'object' && group.section !== null ? group.section.id : group.section,
      generic: typeof group.generic === 'object' && group.generic !== null ? group.generic.id : group.generic,
    };
    // this.isFormOpen = true;
  }

  handleEditSubmit(data: any): void {
    if (this.selectedGroup.id === undefined) {
      this.toastService.showError('Group ID is missing for update.');
      this.closeDialog();
      return;
    }
    const updatedGroup: Group = {
      ...this.selectedGroup,
      name: data.name,
      code: data.code,
      section: data.section,
      generic: data.generic,
      active: this.selectedGroup.active,
    };

    this.groupService.updateGroup(updatedGroup.id!, updatedGroup).subscribe({
      next: (response: Group) => {
        this.toastService.showSuccess('Group updated successfully');
        const index = this.groups.findIndex((g) => g.id === response.id);
        if (index !== -1) {
          this.groups[index] = response;
        }
        this.filteredGroups = [...this.groups];
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating group:', error);
        const errorMessage = error.error?.message || 'Failed to update group.';
        this.toastService.showError(errorMessage);
      },
    });
  }

  deleteGroupDetails(group: Group): void {
    this.isDeleteConfirmationVisible = true;
    this.selectedGroup = group;
  }

  confirmDeletion(): void {
    if (this.selectedGroup.id === undefined) {
      this.toastService.showError('Group ID is missing for deletion.');
      this.closeDialog();
      return;
    }

    this.groupService.deleteGroup(this.selectedGroup.id).subscribe({
      next: () => {
        this.toastService.showSuccess('Group deleted successfully');
        this.groups = this.groups.filter(
          (grp) => grp.id !== this.selectedGroup.id
        );
        this.filteredGroups = [...this.groups];
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error deleting group:', error);
        const errorMessage = error.error?.message || 'Failed to delete group.';
        this.toastService.showError(errorMessage);
      },
    });
  }

  viewGroupDetails(group: Group): void {
    this.detailsForViewComponent = { ...group };
    this.isViewDetailsOpen = true;
  }

  closeDialog(): void {
    this.isDeleteConfirmationVisible = false;
    this.isFormOpen = false;
    this.isEditFormOpen = false;
    this.isBulkUploadPopup = false;
    this.isViewDetailsOpen = false;
    this.selectedGroup = {
      code: '',
      name: '',
      section: null,
      generic: null,
      active: 1,
    };
    this.newGroup = {
      code: '',
      name: '',
      section: null,
      generic: null,
      active: 1,
    };
    this.getGroups();
  }

  handleBulkUpload(event: any): void {
    console.log('Bulk Upload event:', event);
    this.toastService.showSuccess('Bulk upload initiated (placeholder).');
    this.isBulkUploadPopup = false;
    this.getGroups();
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

  exportPDF(): void {
    console.log('Exporting as PDF...');
    this.exportPDFEvent.emit();
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.cols.map((col) => col.header)],
      body: this.groups.map((row: Group) =>
        this.cols.map((col) => {
          let value = this.getNestedValue(row, col.field);
          if (col.transform) {
            value = col.transform(value);
          }
          return value || '';
        })
      ),
    });
    doc.save(`${this.tableName || 'table'}.pdf`);
  }

  @Input() tableName: string = '';

  exportExcel(): void {
    console.log('Exporting as Excel...');
    this.exportCSVEvent.emit();
    const headers = this.cols.map((col) => col.header);
    const rows = this.groups.map((row: Group) =>
      this.cols.map((col) => {
        let value = this.getNestedValue(row, col.field);
        if (col.transform) {
          value = col.transform(value);
        }
        return value || '';
      })
    );
    const csv = [
      headers.join(','),
      ...rows.map((row: any[]) => row.join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.tableName || 'table'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private getNestedValue(obj: any, field: string): any {
    if (!obj || !field) {
      return null;
    }
    const fields = field.split('.');
    let value = obj;
    for (const f of fields) {
      if (value === null || value === undefined) {
        return null;
      }
      value = value[f];
    }
    return value;
  }
}