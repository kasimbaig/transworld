import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

interface ShipState {
  id?: number;
  name: string;
  code: string;
  active: number;
  created_by_name?: string;
  modified_by_name?: string;
  active_display?: string;
  created_on?: string;
  modified_on?: string;
  created_ip?: string;
  modified_ip?: string;
  created_by?: number;
  modified_by?: number;
}

interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShipState[];
}

@Component({
  selector: 'app-ship-state',
  standalone: false,
  templateUrl: './ship-state.component.html',
  styleUrl: './ship-state.component.css'
})
export class ShipStateComponent implements OnInit {
  displayDialog: boolean = false;
  isMaximized: boolean = false;
  loading: boolean = false;
  sararMasterForm: FormGroup = new FormGroup({
    ship_state: new FormControl(''),
    code: new FormControl(''),
    status: new FormControl(true),
  });

  // Table Columns Configuration
  tableColumns = [
    { field: 'name', header: 'Ship State', type: 'text', sortable: true, filterable: true },
    { field: 'code', header: 'Code', type: 'text', sortable: true, filterable: true },
    { field: 'active', header: 'Status', type: 'status', sortable: true, filterable: true },
  ];

  // Table Data
  tableData: any[] = [];

  // Delete confirmation modal properties
  showDeleteModal: boolean = false;
  itemToDelete: ShipState | null = null;

  crudName = 'Add';

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadShipStates();
    console.log('Ship State Component initialized with', this.tableData.length, 'records');
  }

  // Load all ship states from API
  loadShipStates(): void {
    this.loading = true;
    this.apiService.get('srar/ship-states/').subscribe({
      next: (response) => {
        // Handle paginated response structure
        this.tableData = response.results || [];
        this.loading = false;
        console.log('Ship states loaded:', this.tableData.length, 'records');
      },
      error: (error) => {
        console.error('Error loading ship states:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load ship states'
        });
        this.loading = false;
      }
    });
  }

  openDialog(): void {
    this.isEdit = false;
    this.isView = false;
    this.crudName = 'Add';
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.sararMasterForm.reset();
    this.sararMasterForm.enable();
    this.crudName = 'Add';
    this.isEdit = false;
    this.isView = false;
  }

  // Event Handlers
  onView(data: ShipState): void {
    this.crudName = 'View';
    this.isView = true;
    this.isEdit = false;
    this.sararMasterForm.patchValue({
      ship_state: data.name,
      code: data.code,
      status: data.active === 1
    });
    this.displayDialog = true;
    this.sararMasterForm.disable();
  }

  isEdit: boolean = false;
  isView: boolean = false;
  selectedShipStateId: number | null = null;

  onEdit(data: ShipState): void {
    this.crudName = 'Edit';
    this.isEdit = true;
    this.isView = false;
    this.selectedShipStateId = data.id || null;
    this.sararMasterForm.patchValue({
      ship_state: data.name,
      code: data.code,
      status: data.active === 1
    });
    this.displayDialog = true;
  }

  onDelete(data: ShipState): void {
    console.log('Delete Ship State:', data);
    this.itemToDelete = data;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete && this.itemToDelete.id) {
      this.loading = true;
      this.apiService.delete(`srar/ship-states/${this.itemToDelete.id}/`).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Ship state deleted successfully'
          });
          this.loadShipStates(); // Reload data
          this.showDeleteModal = false;
          this.itemToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting ship state:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete ship state'
          });
          this.loading = false;
          this.showDeleteModal = false;
          this.itemToDelete = null;
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  save(): void {
    if (this.sararMasterForm.valid) {
      const formValue = this.sararMasterForm.value;
      const payload = {
        name: formValue.ship_state,
        code: formValue.code,
        status: formValue.status ? 'active' : 'inactive'
      };

      this.loading = true;

      if (this.isEdit && this.selectedShipStateId) {
        // Update existing ship state
        this.apiService.put(`srar/ship-states/${this.selectedShipStateId}/`, payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Ship state updated successfully'
            });
            this.closeDialog();
            this.loadShipStates(); // Reload data
          },
          error: (error) => {
            console.error('Error updating ship state:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update ship state'
            });
            this.loading = false;
          }
        });
      } else {
        // Create new ship state
        this.apiService.post('srar/ship-states/', payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Ship state created successfully'
            });
            this.closeDialog();
            this.loadShipStates(); // Reload data
          },
          error: (error) => {
            console.error('Error creating ship state:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create ship state'
            });
            this.loading = false;
          }
        });
      }
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
    }
  }
}
