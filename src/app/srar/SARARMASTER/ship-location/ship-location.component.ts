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

  // Static Ship State Data for Dropdown
  ship_state_options_data = [
  {
    "id": 101,
    "active": 1,
    "code": "PRT",
    "name": "In Port",
    "created_by": 1,
    "active_display": "Active"
  },
  {
    "id": 102,
    "active": 1,
    "code": "DEP",
    "name": "Deployed at Sea",
    "created_by": 2,
    "active_display": "Active"
  },
  {
    "id": 103,
    "active": 0,
    "code": "RPR",
    "name": "Under Repair",
    "created_by": 3,
    "active_display": "Inactive"
  },
  {
    "id": 104,
    "active": 1,
    "code": "OPR",
    "name": "Operational Readiness",
    "created_by": 4,
    "active_display": "Active"
  },
  {
    "id": 105,
    "active": 0,
    "code": "MNT",
    "name": "Scheduled Maintenance",
    "created_by": 5,
    "active_display": "Inactive"
  }
];


  // Static Ship Location Data
 ship_location_data = [
  {
    "id": 21,
    "name": "Naval Dockyard East",
    "code": "NDE",
    "ship_state": 51,
    "ship_state_name": "Under Maintenance",
    "ship_state_code": "UMT",
    "created_by_name": "SYSTEM",
    "modified_by_name": "ADMINSUP",
    "active": 1,
    "active_display": "Active"
  },
  {
    "id": 22,
    "name": "Deep Sea Zone",
    "code": "DSZ",
    "ship_state": 52,
    "ship_state_name": "On Patrol",
    "ship_state_code": "OPT",
    "created_by_name": "OPS",
    "modified_by_name": "CONTROL",
    "active": 1,
    "active_display": "Active"
  },
  {
    "id": 23,
    "name": "Shipyard West",
    "code": "SYW",
    "ship_state": 53,
    "ship_state_name": "In Dry Dock",
    "ship_state_code": "IDD",
    "created_by_name": "MAINT",
    "modified_by_name": "DOCKMASTER",
    "active": 0,
    "active_display": "Inactive"
  },
  {
    "id": 24,
    "name": "Harbour North",
    "code": "HBN",
    "ship_state": 54,
    "ship_state_name": "Awaiting Deployment",
    "ship_state_code": "AWD",
    "created_by_name": "EPPS",
    "modified_by_name": "NAVSUP",
    "active": 1,
    "active_display": "Active"
  }
];

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

  // Load ship states for dropdown from static data
  loadShipStates(): void {
    this.loading = true;
    
    // Use static data instead of API call
    this.shipStateOptions = this.ship_state_options_data;
    this.loading = false;
    
    console.log('Ship states loaded from static data for dropdown:', this.shipStateOptions.length, 'records');
  }

  // Load ship locations from static data
  loadShipLocations(): void {
    this.loading = true;
    
    // Use static data instead of API call
    this.tableData = this.ship_location_data;
    this.loading = false;
    
    console.log('Ship locations loaded from static data:', this.tableData.length, 'records');
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
      
      // Remove item from static data
      const index = this.ship_location_data.findIndex(item => item.id === this.itemToDelete!.id);
      if (index > -1) {
        this.ship_location_data.splice(index, 1);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Ship location deleted successfully'
        });
        this.loadShipLocations(); // Reload data
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Ship location not found'
        });
        this.loading = false;
        this.showDeleteModal = false;
        this.itemToDelete = null;
      }
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

      // No loading needed for static data operations

      if (this.isEdit && this.selectedShipLocationId) {
        // Update existing ship location in static data
        const index = this.ship_location_data.findIndex(item => item.id === this.selectedShipLocationId);
        if (index > -1) {
          const shipState = this.shipStateOptions.find(state => state.id === selectedShipStateId);
          this.ship_location_data[index] = {
            ...this.ship_location_data[index],
            name: formValue.ship_location,
            code: formValue.code,
            ship_state: selectedShipStateId,
            ship_state_name: shipState?.name || '',
            ship_state_code: shipState?.code || '',
            active: formValue.status ? 1 : 0,
            active_display: formValue.status ? 'Active' : 'Inactive'
          };
          
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Ship location updated successfully'
          });
          this.closeDialog();
          this.loadShipLocations(); // Reload data
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ship location not found for update'
          });
        }
      } else {
        // Create new ship location in static data
        const shipState = this.shipStateOptions.find(state => state.id === selectedShipStateId);
        const newId = Math.max(...this.ship_location_data.map(item => item.id || 0)) + 1;
        
        const newLocation = {
          id: newId,
          name: formValue.ship_location,
          code: formValue.code,
          ship_state: selectedShipStateId,
          ship_state_name: shipState?.name || '',
          ship_state_code: shipState?.code || '',
          created_by_name: 'EPPS',
          modified_by_name: 'EPPS',
          active: formValue.status ? 1 : 0,
          active_display: formValue.status ? 'Active' : 'Inactive'
        };
        
        this.ship_location_data.push(newLocation);
        
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Ship location created successfully'
        });
        this.closeDialog();
        this.loadShipLocations(); // Reload data
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

