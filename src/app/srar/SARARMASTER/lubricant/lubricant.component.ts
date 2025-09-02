import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

interface Lubricant {
  id?: number;
  name: string;
  code: string;
  description: string;
  type: string;
  type_display?: string;
  active: number;
  active_display?: string;
  created_by?: number;
  modified_by?: number;
  created_on?: string;
  modified_on?: string;
  created_ip?: string;
  modified_ip?: string;
}

interface ApiResponse {
  success: boolean;
  data: Lubricant[];
  count: number;
  message: string;
  filters?: any;
}

@Component({
  selector: 'app-lubricant',
  standalone:false,
  templateUrl: './lubricant.component.html',
  styleUrl: './lubricant.component.css'
})
export class LubricantComponent implements OnInit {
  displayDialog: boolean = false;
  isMaximized: boolean = false;
  loading: boolean = false;
  sararMasterForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    code: new FormControl(''),
    description: new FormControl(''),
    type: new FormControl(''),
    active: new FormControl(true),
  });
 // Table Columns Configuration
 tableColumns = [
  { field: 'name', header: 'Lubricant Name', type: 'text', sortable: true, filterable: true },
  { field: 'code', header: 'Lubricant Code', type: 'text', sortable: true, filterable: true },
  { field: 'description', header: 'Unit', type: 'text', sortable: true, filterable: true },
  { field: 'type_display', header: 'Type', type: 'text', sortable: true, filterable: true },
  { field: 'active', header: 'Status', type: 'status', sortable: true, filterable: true },
];

  // Static Lubricant Data
  lubricant_data = [
  {
    "id": 1,
    "name": "Mobilgard M440",
    "code": "MGM440",
    "description": "High-performance marine diesel engine oil",
    "type": "oil",
    "type_display": "Oil",
    "active": 1,
    "active_display": "Active"
  },
  {
    "id": 2,
    "name": "Total Lubmarine Aurelia TI 4030",
    "code": "TLAT4030",
    "description": "Cylinder oil for two-stroke marine engines",
    "type": "oil",
    "type_display": "Oil",
    "active": 0,
    "active_display": "Inactive"
  },
  {
    "id": 3,
    "name": "BP Energol CLP 320",
    "code": "BPE320",
    "description": "Gear oil for heavy-duty marine gear systems",
    "type": "grease",
    "type_display": "Grease",
    "active": 1,
    "active_display": "Active"
  },
  {
    "id": 4,
    "name": "Chevron Marine Lubricants Veritas 800",
    "code": "CMLV800",
    "description": "System oil for slow-speed marine diesel engines",
    "type": "oil",
    "type_display": "Oil",
    "active": 1,
    "active_display": "Active"
  },
  {
    "id": 5,
    "name": "ExxonMobil Teresstic 68",
    "code": "EMT68",
    "description": "Turbine and circulating oil for marine machinery",
    "type": "oil",
    "type_display": "Oil",
    "active": 0,
    "active_display": "Inactive"
  }
];


  // Table Data
  tableData: any[] = [];
  
  // Delete confirmation modal properties
  showDeleteModal: boolean = false;
  itemToDelete: Lubricant | null = null;
  
  constructor(private apiService: ApiService, private toast: MessageService) {}
  
  ngOnInit(): void {
    this.loadLubricants();
    console.log('Lubricant Component initialized');
  }
  
  loadLubricants(): void {
    // Use static data instead of API call
    this.tableData = this.lubricant_data;
    
    console.log('Lubricants loaded from static data:', this.tableData.length, 'records');
  }

  crudName='Add'
  openDialog(): void {
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
    this.sararMasterForm.reset();
    this.sararMasterForm.enable();
    this.crudName='Add'
    this.isEdit = false;
    this.selectedLubricantId = null;
  }

  // Event Handlers
  onView(data: Lubricant): void {
    this.crudName='View'
    this.sararMasterForm.patchValue(data);
    this.sararMasterForm.get('active')?.setValue(data.active == 1 ? true : false);
    this.sararMasterForm.disable();
    this.openDialog();
  }
  
  isEdit: boolean = false;
  selectedLubricantId: number | null = null;
  
  onEdit(data: Lubricant): void {
    this.isEdit = true;
    this.selectedLubricantId = data.id || null;
    this.crudName='Edit'
    this.sararMasterForm.get('active')?.setValue(data.active === 1 ? true : false);
    this.sararMasterForm.patchValue(data);
    this.openDialog();
  }

  onDelete(data: Lubricant): void {
    console.log('Delete Lubricant:', data);
    this.itemToDelete = data;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete && this.itemToDelete.id) {
      // Remove item from static data
      const index = this.lubricant_data.findIndex(item => item.id === this.itemToDelete!.id);
      if (index > -1) {
        this.lubricant_data.splice(index, 1);
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Lubricant deleted successfully'
        });
        this.loadLubricants(); // Reload data
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } else {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Lubricant not found'
        });
        this.showDeleteModal = false;
        this.itemToDelete = null;
      }
    } else {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Invalid lubricant ID for deletion'
      });
      this.showDeleteModal = false;
      this.itemToDelete = null;
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

  save(){
    if (this.sararMasterForm.valid) {
      const formData = this.sararMasterForm.value;
      
      // Convert active boolean to number for static data
      const payload = {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        active: formData.active ? 1 : 0,
        type: formData.type
      };

      if (this.isEdit && this.selectedLubricantId) {
        // Handle edit - update existing lubricant in static data
        const index = this.lubricant_data.findIndex(item => item.id === this.selectedLubricantId);
        if (index > -1) {
          this.lubricant_data[index] = {
            ...this.lubricant_data[index],
            name: formData.name,
            code: formData.code,
            description: formData.description,
            active: formData.active ? 1 : 0,
            type: formData.type,
            type_display: formData.type === 'oil' ? 'Oil' : formData.type,
            active_display: formData.active ? 'Active' : 'Inactive'
          };
          
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Lubricant updated successfully'
          });
          this.closeDialog();
          this.loadLubricants(); // Reload data
        } else {
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Lubricant not found for update'
          });
        }
      } else {
        // Handle add - create new lubricant in static data
        const newId = Math.max(...this.lubricant_data.map(item => item.id || 0)) + 1;
        
        const newLubricant = {
          id: newId,
          name: formData.name,
          code: formData.code,
          description: formData.description,
          active: formData.active ? 1 : 0,
          type: formData.type,
          type_display: formData.type === 'oil' ? 'Oil' : formData.type,
          active_display: formData.active ? 'Active' : 'Inactive'
        };
        
        this.lubricant_data.push(newLubricant);
        
        this.toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Lubricant created successfully'
        });
        this.closeDialog();
        this.loadLubricants(); // Reload data
      }
    } else {
      this.toast.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill all required fields'
      });
    }
  }

 
}

