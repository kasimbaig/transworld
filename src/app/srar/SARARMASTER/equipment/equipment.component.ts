import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-equipment',
standalone:false,
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css'
})
export class EquipmentComponent 
implements OnInit {
  displayDialog: boolean = false;
  isMaximized: boolean = false;
     sararMasterForm: FormGroup = new FormGroup({
     id: new FormControl(''),
     ship: new FormControl(''),
     ship_name: new FormControl(''),
     ship_id: new FormControl(''),
     equipment_code: new FormControl(''),
     equipment_name: new FormControl(''),
     equipment_id: new FormControl(''),
     nomenclature: new FormControl(''),
     oem_part_number: new FormControl(''),
     no_of_fits: new FormControl(''),
     location_name: new FormControl(''),
     location_id: new FormControl(''),
     equipment_type: new FormControl(''),
     active: new FormControl(''),
   });
       // Table Columns Configuration
   tableColumns = [
    { field: 'ship_name', header: 'Ship Name', type: 'text', sortable: true, filterable: true },
    { field: 'equipment_code', header: 'Equipment Code', type: 'text', sortable: true, filterable: true },
    { field: 'equipment_name', header: 'Equipment Name', type: 'text', sortable: true, filterable: true },
    { field: 'nomenclature', header: 'Nomenclature', type: 'text', sortable: true, filterable: true },
    { field: 'location_name', header: 'Location', type: 'text', sortable: true, filterable: true },
    { field: 'active', header: 'Active', type: 'status', sortable: true, filterable: true },
    // { field: '', header: 'Link Equipment', type: 'text', sortable: true, filterable: true },
    { field: 'removal_date', header: 'Removal Date', type: 'text', sortable: true, filterable: true },
  ];

  


     // Static Ship Options (reusing from ship-master component)
// Updated Ship Options
shipOptions = [
  { id: 1, name: "INS Chennai", code: "CHN001" },
  { id: 2, name: "INS Shivalik", code: "SHV001" },
  { id: 3, name: "INS Arihant", code: "ARI001" },
  { id: 4, name: "INS Trikand", code: "TRK001" },
  { id: 5, name: "INS Vela", code: "VEL001" },
  { id: 6, name: "INS Kamorta", code: "KAM001" },
  { id: 7, name: "INS Khanderi", code: "KDR001" },
  { id: 8, name: "INS Satpura", code: "SAT001" },
  { id: 9, name: "INS Teg", code: "TEG001" },
  { id: 10, name: "INS Chakra", code: "CHK001" }
];

// Updated Static SRAR Equipment Data
srar_equipment_data = [
  {
    id: 3201,
    ship_name: "INS Chennai",
    ship_code: "CHN001",
    equipment_name: "MISSILE LAUNCH SYSTEM",
    equipment_code: "EQP-901122",
    location_name: "Forward Missile Bay",
    location_code: "LOC-10-MB",
    equipment_details: {
      id: 3001,
      manufacturer_name: "Larsen & Toubro Defence",
      manufacturer_address: "Mumbai, India",
      supplier_name: "Mazagon Dock Shipbuilders",
      supplier_address: "Mumbai, India",
      active: 1,
      code: "EQP-901122",
      name: "MISSILE LAUNCH SYSTEM",
      model: "MLS-X400",
      country: "India",
      manufacturer: 101,
      supplier: 202
    },
    active: 1,
    nomenclature: "VERTICAL LAUNCHER",
    no_of_fits: 2,
    installation_date: "2022-09-12",
    service_life: "20 years",
    authority_of_installation: "Naval Dockyard",
    is_srar_equipment: true,
    ship: 1,
    equipment: 3001,
    location: 10,
    department: "Weapons"
  },
  {
    id: 3202,
    ship_name: "INS Shivalik",
    ship_code: "SHV001",
    equipment_name: "PROPULSION CONTROL SYSTEM",
    equipment_code: "EQP-903344",
    location_name: "Engine Control Room",
    location_code: "LOC-14-ECR",
    equipment_details: {
      id: 3002,
      manufacturer_name: "Kirloskar Electric Co",
      manufacturer_address: "Hubballi, India",
      supplier_name: "Cochin Shipyard Ltd",
      supplier_address: "Kochi, India",
      active: 1,
      code: "EQP-903344",
      name: "PROPULSION CONTROL SYSTEM",
      model: "PCS-900",
      country: "India",
      manufacturer: 102,
      supplier: 203
    },
    active: 1,
    nomenclature: "ENGINE PROPULSION SYSTEM",
    no_of_fits: 3,
    installation_date: "2021-11-05",
    service_life: "15 years",
    authority_of_installation: "Cochin Shipyard",
    is_srar_equipment: true,
    ship: 2,
    equipment: 3002,
    location: 14,
    department: "Engineering"
  },
  {
    id: 3203,
    ship_name: "INS Arihant",
    ship_code: "ARI001",
    equipment_name: "NUCLEAR REACTOR CONTROL UNIT",
    equipment_code: "EQP-905566",
    location_name: "Reactor Compartment",
    location_code: "LOC-50-RC",
    equipment_details: {
      id: 3003,
      manufacturer_name: "Bhabha Atomic Research Centre",
      manufacturer_address: "Mumbai, India",
      supplier_name: "Shipbuilding Centre",
      supplier_address: "Visakhapatnam, India",
      active: 1,
      code: "EQP-905566",
      name: "NUCLEAR REACTOR CONTROL UNIT",
      model: "NRC-2000",
      country: "India",
      manufacturer: 103,
      supplier: 204
    },
    active: 1,
    nomenclature: "REACTOR CONTROL",
    no_of_fits: 1,
    installation_date: "2018-03-22",
    service_life: "25 years",
    authority_of_installation: "Shipbuilding Centre",
    is_srar_equipment: true,
    ship: 3,
    equipment: 3003,
    location: 50,
    department: "Reactor Operations"
  },
  {
    id: 3204,
    ship_name: "INS Trikand",
    ship_code: "TRK001",
    equipment_name: "TORPEDO TUBE SYSTEM",
    equipment_code: "EQP-907788",
    location_name: "Torpedo Bay",
    location_code: "LOC-18-TB",
    equipment_details: {
      id: 3004,
      manufacturer_name: "Bharat Dynamics Ltd",
      manufacturer_address: "Hyderabad, India",
      supplier_name: "Garden Reach Shipbuilders",
      supplier_address: "Kolkata, India",
      active: 1,
      code: "EQP-907788",
      name: "TORPEDO TUBE SYSTEM",
      model: "TTS-1500",
      country: "India",
      manufacturer: 104,
      supplier: 205
    },
    active: 1,
    nomenclature: "TT SYSTEM",
    no_of_fits: 2,
    installation_date: "2020-07-10",
    service_life: "12 years",
    authority_of_installation: "GRSE Kolkata",
    is_srar_equipment: true,
    ship: 4,
    equipment: 3004,
    location: 18,
    department: "ASW"
  },
  {
    id: 3205,
    ship_name: "INS Vela",
    ship_code: "VEL001",
    equipment_name: "SONAR SUITE",
    equipment_code: "EQP-909911",
    location_name: "Sonar Room",
    location_code: "LOC-22-SONAR",
    equipment_details: {
      id: 3005,
      manufacturer_name: "Bharat Electronics Ltd",
      manufacturer_address: "Bengaluru, India",
      supplier_name: "NSRY Mumbai",
      supplier_address: "Mumbai, India",
      active: 1,
      code: "EQP-909911",
      name: "SONAR SUITE",
      model: "SS-800",
      country: "India",
      manufacturer: 105,
      supplier: 206
    },
    active: 1,
    nomenclature: "SONAR SYSTEM",
    no_of_fits: 1,
    installation_date: "2019-01-18",
    service_life: "10 years",
    authority_of_installation: "NSRY Mumbai",
    is_srar_equipment: true,
    ship: 5,
    equipment: 3005,
    location: 22,
    department: "Submarine Ops"
  }
];

     // Table Data
   tableData: any[] = [];
  constructor(private apiService: ApiService, private toast: MessageService) {}
  ngOnInit(): void {
    // Don't load data initially - wait for ship selection
    console.log('SRAR Equipment Component initialized - waiting for ship selection');
    // Ship options are now static data, no need for API call
  }
  
  currentPageApi(page: number, pageSize: number, shipId?: number){
    if (!shipId) {
      // If no ship is selected, clear the table
      this.tableData = [];
      return;
    }
    
    // Use static data instead of API call
    this.tableData = this.srar_equipment_data.filter(equipment => equipment.ship === shipId);
    console.log('SRAR Equipment Data loaded from static data for ship:', shipId, 'with', this.tableData.length, 'records');
  }
  
 // apiCall method removed - ship options are now static data

  crudName='Add'
  openDialog(): void {
    this.displayDialog = true;
    // Reset form when opening for new record (not for view mode)
    if (!this.isEdit && this.crudName !== 'View') {
      this.sararMasterForm.reset();
      this.sararMasterForm.patchValue({
        active: true
      });
      // Enable form for new record
      this.sararMasterForm.enable();
      // Initially disable auto-fill fields
      this.sararMasterForm.get('equipment_code')?.disable();
      this.sararMasterForm.get('nomenclature')?.disable();
      this.sararMasterForm.get('oem_part_number')?.disable();
      this.sararMasterForm.get('location_name')?.disable();
      this.sararMasterForm.get('equipment_type')?.disable();
    }
  }

  closeDialog(): void {
    this.displayDialog = false;
    // Only reset form if not in view mode
    if (this.crudName !== 'View') {
      this.sararMasterForm.reset();
      this.sararMasterForm.enable();
    }
    // Reset equipment options when closing
    this.equipmentOptions = [];
    this.crudName='Add'
  }


  // Event Handlers
  onView(data: any): void {
    this.crudName='View'
    
    // Use static data for equipment options
    if (data.ship) {
      const equipmentData = this.srar_equipment_data.filter(equipment => equipment.ship === data.ship);
        // Format equipment options to show "Equipment Code - Equipment Name" in dropdown
        this.equipmentOptions = equipmentData.map((equipment: any) => ({
          ...equipment,
          displayName: `${equipment.equipment_code} - ${equipment.equipment_name}`
        }));
        
        // Now set the form values after equipment options are loaded
        this.setViewFormData(data);
    } else {
      // If no ship data, set form directly
      this.setViewFormData(data);
    }
  }

  private setViewFormData(data: any): void {
    // Map API data to form fields
    const formData = {
      id: data.id,
      ship: data.ship,
      ship_name: data.ship_name,
      ship_id: data.ship,
      equipment_code: data.equipment_code,
      equipment_name: data.equipment_name,
      equipment_id: data.equipment,
      nomenclature: data.nomenclature,
      oem_part_number: data.oem_part_number,
      no_of_fits: data.no_of_fits,
      location_name: data.location_name,
      location_id: data.location,
      equipment_type: data.type || '',
      active: data.active
    };
    this.sararMasterForm.patchValue(formData);
    this.sararMasterForm.get('active')?.setValue(data.active == 1 ? true : false);
    // Disable form for view mode
    this.sararMasterForm.disable();
    this.openDialog();
  }
  isEdit: boolean = false;
  onEdit(data: any): void {
    this.isEdit = true;
    this.crudName='Edit'
    
    // Use static data for equipment options
    if (data.ship) {
      const equipmentData = this.srar_equipment_data.filter(equipment => equipment.ship === data.ship);
        // Format equipment options to show "Equipment Code - Equipment Name" in dropdown
        this.equipmentOptions = equipmentData.map((equipment: any) => ({
          ...equipment,
          displayName: `${equipment.equipment_code} - ${equipment.equipment_name}`
        }));
        
        // Now set the form values after equipment options are loaded
        this.setEditFormData(data);
    } else {
      // If no ship data, set form directly
      this.setEditFormData(data);
    }
  }

  private setEditFormData(data: any): void {
    // Map API data to form fields
    const formData = {
      id: data.id,
      ship: data.ship,
      ship_name: data.ship_name,
      ship_id: data.ship,
      equipment_code: data.equipment_code,
      equipment_name: data.equipment_name,
      equipment_id: data.equipment,
      nomenclature: data.nomenclature,
      oem_part_number: data.oem_part_number,
      no_of_fits: data.no_of_fits,
      location_name: data.location_name,
      location_id: data.location,
      equipment_type: data.type || '',
      active: data.active
    };
    this.sararMasterForm.patchValue(formData);
    this.sararMasterForm.get('active')?.setValue(data.active === 1 ? true : false);
    // Enable form for edit mode
    this.sararMasterForm.enable();
    // Keep auto-fill fields disabled even in edit mode
    this.sararMasterForm.get('equipment_code')?.disable();
    this.sararMasterForm.get('nomenclature')?.disable();
    this.sararMasterForm.get('oem_part_number')?.disable();
    this.sararMasterForm.get('location_name')?.disable();
    this.sararMasterForm.get('equipment_type')?.disable();
    this.openDialog();
  }

  // Delete confirmation modal properties
  showDeleteModal: boolean = false;
  itemToDelete: any = null;

  onDelete(data: any): void {
    console.log('Delete Equipment:', data);
    this.itemToDelete = data;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      // Remove item from static data
      const index = this.srar_equipment_data.findIndex(item => item.id === this.itemToDelete.id);
      if (index > -1) {
        this.srar_equipment_data.splice(index, 1);
        this.toast.add({severity:'success', summary: 'Success', detail: 'Equipment Deleted Successfully'});
        console.log('Equipment deleted from static data');
        // Refresh data for the currently selected ship
        this.currentPageApi(0, 0, this.selectedShip?.id);
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } else {
        this.toast.add({severity:'error', summary: 'Error', detail: 'Equipment not found'});
        this.showDeleteModal = false;
        this.itemToDelete = null;
      }
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.itemToDelete = null;
  }

           save(){
      console.log('Form values:', this.sararMasterForm.value);
      
      if (this.sararMasterForm.valid) {
        const formData = this.sararMasterForm.value;
        
        if (this.isEdit && this.sararMasterForm.value.id) {
          // Update existing equipment in static data
          const index = this.srar_equipment_data.findIndex(item => item.id === this.sararMasterForm.value.id);
          if (index > -1) {
            this.srar_equipment_data[index] = {
              ...this.srar_equipment_data[index],
              ship_name: formData.ship_name,
              equipment_code: formData.equipment_code,
              equipment_name: formData.equipment_name,
              nomenclature: formData.nomenclature,
              // oem_part_number: formData.oem_part_number,
              no_of_fits: formData.no_of_fits,
              location_name: formData.location_name,
              active: formData.active ? 1 : 0
            };
            
        this.toast.add({severity:'success', summary: 'Success', detail: 'Equipment Updated Successfully'});
            this.closeDialog();
        // Refresh data for the currently selected ship
        this.currentPageApi(0, 0, this.selectedShip?.id);
          } else {
            this.toast.add({severity:'error', summary: 'Error', detail: 'Equipment not found for update'});
          }
    } else {
           // Create new equipment in static data
           const newId = Math.max(...this.srar_equipment_data.map(item => item.id || 0)) + 1;
           
           const newEquipment = {
             id: newId,
             ship_name: formData.ship_name,
             ship_code: this.shipOptions.find(ship => ship.id === formData.ship)?.code || '',
             equipment_name: formData.equipment_name,
             equipment_code: formData.equipment_code,
             location_name: formData.location_name,
             location_code: `LOC-${formData.location_id || 'NEW'}`,
             equipment_details: {
               id: formData.equipment_id || newId,
               group: null,
               manufacturer_name: "Default Manufacturer",
               manufacturer_address: "Default Address",
               supplier_name: "Default Supplier",
               supplier_address: "Default Address",
               active: 1,
               code: formData.equipment_code,
               name: formData.equipment_name,
               image: null,
               model: "Default Model",
               obsolete: "",
               authority: "",
               generic_code: null,
               ilms_equipment_code: null,
               acquaint_issued: null,
               maintop_number: null,
               created_by: 1,
               country: "India",
               manufacturer: 1,
               supplier: 1,
               parent: null,
               type: null
             },
             active: formData.active ? 1 : 0,
             nomenclature: formData.nomenclature,
             oem_part_number: formData.oem_part_number,
             no_of_fits: formData.no_of_fits,
             installation_date: new Date().toISOString().split('T')[0],
             removal_date: null,
             service_life: "10 years",
             authority_of_removal: null,
             authority_of_installation: "Default Authority",
             is_srar_equipment: true,
             removal_remarks: null,
             included_in_dl: false,
             created_by: 1,
             ship: formData.ship,
             equipment: formData.equipment_id || newId,
             location: formData.location_id || 1,
             supplier: null,
             parent_equipment: null,
             child_equipment: null,
             department: "Default Department"
           };
           
           this.srar_equipment_data.push(newEquipment);
          
        this.toast.add({severity:'success', summary: 'Success', detail: 'Equipment Added Successfully'});
          this.closeDialog();
        // Refresh data for the currently selected ship
        this.currentPageApi(0, 0, this.selectedShip?.id);
        }
      } else {
        this.toast.add({severity:'warn', summary: 'Warning', detail: 'Please fill all required fields'});
      }
  }
  
   equipmentOptions: any[] = [];
   selectedShip: any;
onShipChange(): void {
  // Get ship ID from either the filter dropdown or the form
  const shipId = this.selectedShip?.id || this.sararMasterForm.value.ship;
  
  if (shipId) {
    // Use static data for equipment options
    const equipmentData = this.srar_equipment_data.filter(equipment => equipment.ship === shipId);
      // Format equipment options to show "Equipment Code - Equipment Name" in dropdown
      this.equipmentOptions = equipmentData.map((equipment: any) => ({
        ...equipment,
        displayName: `${equipment.equipment_code} - ${equipment.equipment_name}`
      }));
    console.log('Equipment options loaded from static data:', this.equipmentOptions);
    
    console.log('Selected Ship:', shipId);
    
    // Find the selected ship object from the options array
    const selectedShip = this.shipOptions.find(ship => ship.id === shipId);
    if (selectedShip) {
      // Update form with ship details
      this.sararMasterForm.patchValue({
        ship: shipId,
        ship_name: selectedShip.name,
        ship_id: selectedShip.id
      });
      console.log('Updated ship_name to:', selectedShip.name);
      console.log('Updated ship_id to:', selectedShip.id);
    }
    
    // Load equipment data for the selected ship
    this.currentPageApi(0, 0, shipId);
  } else {
    // If no ship is selected, clear the table and equipment options
    this.tableData = [];
    this.equipmentOptions = [];
    console.log('No ship selected - clearing table data');
    
    // Clear the form when no ship is selected
    this.clearForm();
  }
}

// Method to clear the form when ship selection changes
private clearForm(): void {
  this.sararMasterForm.patchValue({
    ship: '',
    ship_name: '',
    ship_id: '',
    equipment_code: '',
    equipment_name: '',
    equipment_id: '',
    nomenclature: '',
    oem_part_number: '',
    no_of_fits: '',
    location_name: '',
    location_id: '',
    equipment_type: '',
    active: true
  });
  
  // Re-enable all fields when clearing
  this.sararMasterForm.get('equipment_code')?.enable();
  this.sararMasterForm.get('nomenclature')?.enable();
  this.sararMasterForm.get('oem_part_number')?.enable();
  this.sararMasterForm.get('location_name')?.enable();
  this.sararMasterForm.get('equipment_type')?.enable();
}

// Method to clear ship selection (can be called from template if needed)
clearShipSelection(): void {
  this.selectedShip = null;
  this.tableData = [];
  this.equipmentOptions = [];
  this.clearForm();
  console.log('Ship selection cleared');
}

  onEquipmentChange(event: any): void {
  console.log('Equipment changed to:', event);
  if (event) {
    // Find the selected equipment object from the options array by equipment_name
    const selectedEquipment = this.equipmentOptions.find(equipment => equipment.equipment_name === event);
    if (selectedEquipment) {
             // Auto-fill all the required fields
       this.sararMasterForm.patchValue({
         equipment_name: selectedEquipment.equipment_name,
         equipment_code: selectedEquipment.equipment_code,
         equipment_id: selectedEquipment.equipment,
         nomenclature: selectedEquipment.nomenclature,
         oem_part_number: selectedEquipment.oem_part_number,
         location_name: selectedEquipment.location_name,
         location_id: selectedEquipment.location,
         equipment_type: selectedEquipment.type || ''
       });
      
             console.log('Auto-filled equipment details:', {
         equipment_name: selectedEquipment.equipment_name,
         equipment_code: selectedEquipment.equipment_code,
         nomenclature: selectedEquipment.nomenclature,
         oem_part_number: selectedEquipment.oem_part_number,
         location_name: selectedEquipment.location_name,
         equipment_type: selectedEquipment.type
       });
      
      // Disable the auto-filled fields to make them read-only
      this.sararMasterForm.get('equipment_code')?.disable();
      this.sararMasterForm.get('nomenclature')?.disable();
      this.sararMasterForm.get('oem_part_number')?.disable();
      this.sararMasterForm.get('location_name')?.disable();
      this.sararMasterForm.get('equipment_type')?.disable();
    }
  } else {
    // Clear the fields if no equipment is selected
    this.sararMasterForm.patchValue({
      equipment_name: '',
      equipment_code: '',
      equipment_id: '',
      nomenclature: '',
      oem_part_number: '',
      location_name: '',
      location_id: '',
      equipment_type: ''
    });
    
    // Re-enable the fields when clearing
    this.sararMasterForm.get('equipment_code')?.enable();
    this.sararMasterForm.get('nomenclature')?.enable();
    this.sararMasterForm.get('oem_part_number')?.enable();
    this.sararMasterForm.get('location_name')?.enable();
    this.sararMasterForm.get('equipment_type')?.enable();
  }
}



 
}

