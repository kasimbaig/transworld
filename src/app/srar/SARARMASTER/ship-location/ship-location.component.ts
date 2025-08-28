import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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

interface ShipLocation {
  id?: number;
  name: string;
  status: string;
  ship_state: number;
  ship_state_name: string;
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
  results: any[];
}

@Component({
  selector: 'app-ship-location',
  standalone: false,
  templateUrl: './ship-location.component.html',
  styleUrl: './ship-location.component.css'
})
export class ShipLocationComponent implements OnInit {
  displayDialog: boolean = false;
  isMaximized: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  selectedShipLocationId: number | null = null;
  selectedShipStateId: number | null = null;

  sararMasterForm: FormGroup = new FormGroup({
    ship_location: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
    ship_state: new FormControl('', [Validators.required]),
    status: new FormControl(false),
  });

  // Ship State Options for Dropdown
  shipStateOptions: ShipState[] = [];

  // Table Columns Configuration
  tableColumns = [
    { field: 'name', header: 'Ship Location', type: 'text', sortable: true, filterable: true },
    { field: 'code', header: 'Code', type: 'text', sortable: true, filterable: true },
    { field: 'ship_state_name', header: 'Ship State', type: 'text', sortable: true, filterable: true },
    { field: 'active', header: 'Status', type: 'status', sortable: true, filterable: true },
  ];

  // Table Data
  tableData: any[] = [];

  // Delete confirmation modal properties
  showDeleteModal: boolean = false;
  itemToDelete: ShipLocation | null = null;

  constructor(private apiService: ApiService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadShipStates();
    this.loadShipLocations();
  }

  // Load ship states for dropdown
  loadShipStates(): void {
    this.loading = true;
    this.apiService.get('srar/ship-states/?is_dropdown=true').subscribe({
      next: (response) => {
        // Handle paginated response structure
        this.shipStateOptions = response.results || response|| [];
        this.loading = false;
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

  // Load ship locations from API
  loadShipLocations(): void {
    this.loading = true;
    this.apiService.get('srar/ship-locations/').subscribe({
      next: (response) => {
        // Handle paginated response structure
        this.tableData = response.results || [];
        this.loading = false;
        console.log('Ship locations loaded:', this.tableData.length, 'records');
      },
      error: (error) => {
        console.error('Error loading ship locations:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load ship locations'
        });
        this.loading = false;
      }
    });
  }

  // Helper method to get ship state name by ID
  getShipStateName(shipStateId: number): string {
    const shipState = this.shipStateOptions.find(state => state.id === shipStateId);
    return shipState ? shipState.name : 'Unknown';
  }

  // Helper method to get ship state ID by name
  getShipStateId(shipStateName: string): number | null {
    const shipState = this.shipStateOptions.find(state => state.name === shipStateName);
    return shipState ? shipState.id || null : null;
  }

  crudName = 'Add';

  openDialog(): void {
    this.isEdit = false;
    this.selectedShipLocationId = null;
    this.selectedShipStateId = null;
    this.sararMasterForm.reset();
    this.sararMasterForm.enable();
    this.crudName = 'Add';
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.sararMasterForm.reset();
    this.sararMasterForm.enable();
    this.crudName = 'Add';
    this.isEdit = false;
    this.selectedShipLocationId = null;
    this.selectedShipStateId = null;
  }

  // Event Handlers
  onView(data: ShipLocation): void {
    this.crudName = 'View';
    this.isEdit = false;
    this.selectedShipLocationId = data.id || null;
    this.selectedShipStateId = data.ship_state;
    
    // Reset form first, then set values
    this.sararMasterForm.reset();
    this.sararMasterForm.patchValue({
      ship_location: data.name,
      code: data.code,
      ship_state: data.ship_state_name, // Use the API's ship_state_name directly
      status: data.active === 1
    });
    this.sararMasterForm.disable();
    this.displayDialog = true;
  }

  onEdit(data: ShipLocation): void {
    this.isEdit = true;
    this.crudName = 'Edit';
    this.selectedShipLocationId = data.id || null;
    this.selectedShipStateId = data.ship_state;
    
    // Reset form first, then set values
    this.sararMasterForm.reset();
    this.sararMasterForm.patchValue({
      ship_location: data.name,
      code: data.code,
      ship_state: data.ship_state_name, // Use the API's ship_state_name directly
      status: data.active === 1
    });
    this.sararMasterForm.enable();
    this.displayDialog = true;
  }

  onDelete(data: ShipLocation): void {
    console.log('Delete Ship Location:', data);
    this.itemToDelete = data;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete && this.itemToDelete.id) {
      this.loading = true;
      this.apiService.delete(`srar/ship-locations/${this.itemToDelete.id}/`).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Ship location deleted successfully'
          });
          this.loadShipLocations(); // Reload data
          this.showDeleteModal = false;
          this.itemToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting ship location:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete ship location'
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
      const selectedShipStateId = this.getShipStateId(formValue.ship_state);
      
      if (!selectedShipStateId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a valid ship state'
        });
        return;
      }

      const payload = {
        name: formValue.ship_location,
        code: formValue.code,
        status: formValue.status ? 'active' : 'inactive',
        ship_state: selectedShipStateId
      };

      this.loading = true;

      if (this.isEdit && this.selectedShipLocationId) {
        // Update existing ship location
        this.apiService.put(`srar/ship-locations/${this.selectedShipLocationId}/`, payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Ship location updated successfully'
            });
            this.closeDialog();
            this.loadShipLocations(); // Reload data
          },
          error: (error) => {
            console.error('Error updating ship location:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update ship location'
            });
            this.loading = false;
          }
        });
      } else {
        // Create new ship location
        this.apiService.post('srar/ship-locations/', payload).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Ship location created successfully'
            });
            this.closeDialog();
            this.loadShipLocations(); // Reload data
          },
          error: (error) => {
            console.error('Error creating ship location:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create ship location'
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

