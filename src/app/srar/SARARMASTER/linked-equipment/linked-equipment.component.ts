import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-linked-equipment',
  standalone:false,
  templateUrl: './linked-equipment.component.html',
  styleUrl: './linked-equipment.component.css'
})
export class LinkedEquipmentComponent implements OnInit {
  displayDialog: boolean = false;
  isMaximized: boolean = false;
  sararMasterForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    ship: new FormControl(''),
    ship_name: new FormControl(''),
    ship_id: new FormControl(''),
    equipment_name: new FormControl(''),
    equipment_id: new FormControl(''),
    sarar_equipemnt: new FormControl(''),
    sarar_equipment_id: new FormControl(''),
    location_name: new FormControl(''),
    location_id: new FormControl(''),
    location_on_board: new FormControl(''),
    status: new FormControl(''),
    active: new FormControl(''),
  });
 // Table Columns Configuration
 tableColumns = [
  { field: 'ship_name', header: 'Ship Name', type: 'text', sortable: true, filterable: true },
  { field: 'equipment_code', header: 'Equipment Code', type: 'text', sortable: true, filterable: true },
  { field: 'equipment_name', header: 'Equipment Name', type: 'text', sortable: true, filterable: true },
  { field: 'srar_equipment_nomenclature', header: 'Nomenclature', type: 'text', sortable: true, filterable: true },
  { field: 'location_name', header: 'Location', type: 'text', sortable: true, filterable: true },
  { field: 'active', header: 'Active', type: 'status', sortable: true, filterable: true },
];

  


  // Static Ship Options (same as equipment component)
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
// 🔹 Static Location Options
locationOptions = [
  { id: 1, name: "Missile Control Room" },
  { id: 2, name: "Helicopter Hangar" },
  { id: 3, name: "Sonar Operations Centre" },
  { id: 4, name: "Torpedo Bay" },
  { id: 5, name: "Reactor Compartment" },
  { id: 6, name: "Command Bridge" },
  { id: 7, name: "Damage Control Locker" },
  { id: 8, name: "CIC (Combat Information Centre)" },
  { id: 9, name: "Flight Operations Control" },
  { id: 10, name: "Radar Mast Compartment" }
];

// 🔹 Static Equipment Options
equipmentOptions = [
  { id: 1, name: "Gas Turbine Engine" },
  { id: 2, name: "Diesel Generator" },
  { id: 3, name: "Torpedo Launcher" },
  { id: 4, name: "Vertical Missile Launcher" },
  { id: 5, name: "Nuclear Reactor Core" },
  { id: 6, name: "Sonar Dome Array" },
  { id: 7, name: "Navigation Radar" },
  { id: 8, name: "Fire Suppression Pump" },
  { id: 9, name: "Electronic Warfare Console" },
  { id: 10, name: "Helicopter Lift System" }
];

// 🔹 Static Equipment Type Options (SRAR Equipment)
equipmentTypeOptions = [
  { id: 1, equipment_name: "MISSILE GUIDANCE SYSTEM", nomenclature: "VLS Fire Control" },
  { id: 2, equipment_name: "PROPULSION TURBINE", nomenclature: "Gas Turbine Module" },
  { id: 3, equipment_name: "NUCLEAR REACTOR UNIT", nomenclature: "Pressurized Reactor" },
  { id: 4, equipment_name: "SONAR SUITE", nomenclature: "Hull Mounted Sonar" },
  { id: 5, equipment_name: "TORPEDO LAUNCH SYSTEM", nomenclature: "Heavy Torpedo Tubes" },
  { id: 6, equipment_name: "SATELLITE COMM SYSTEM", nomenclature: "SATCOM Module" },
  { id: 7, equipment_name: "RADAR SYSTEM", nomenclature: "3D Air Search Radar" },
  { id: 8, equipment_name: "ELECTRONIC WARFARE SUITE", nomenclature: "EW Jammer" },
  { id: 9, equipment_name: "DAMAGE CONTROL SYSTEM", nomenclature: "Automated Fire Control" },
  { id: 10, equipment_name: "AVIATION SUPPORT SYSTEM", nomenclature: "Helicopter Handling Gear" }
];

// 🔹 Static SRAR Equipment Details Data
srar_equipment_details_data = [
  { id: 1, equipment_name: "MISSILE GUIDANCE SYSTEM", nomenclature: "VLS Fire Control", code: "MGS001", active: 1 },
  { id: 2, equipment_name: "PROPULSION TURBINE", nomenclature: "Gas Turbine Module", code: "PT001", active: 1 },
  { id: 3, equipment_name: "NUCLEAR REACTOR UNIT", nomenclature: "Pressurized Reactor", code: "NRU001", active: 1 },
  { id: 4, equipment_name: "SONAR SUITE", nomenclature: "Hull Mounted Sonar", code: "SON001", active: 1 },
  { id: 5, equipment_name: "TORPEDO LAUNCH SYSTEM", nomenclature: "Heavy Torpedo Tubes", code: "TLS001", active: 1 },
  { id: 6, equipment_name: "SATELLITE COMM SYSTEM", nomenclature: "SATCOM Module", code: "SAT001", active: 1 },
  { id: 7, equipment_name: "RADAR SYSTEM", nomenclature: "3D Air Search Radar", code: "RAD001", active: 1 },
  { id: 8, equipment_name: "ELECTRONIC WARFARE SUITE", nomenclature: "EW Jammer", code: "EWS001", active: 1 },
  { id: 9, equipment_name: "DAMAGE CONTROL SYSTEM", nomenclature: "Automated Fire Control", code: "DCS001", active: 1 },
  { id: 10, equipment_name: "AVIATION SUPPORT SYSTEM", nomenclature: "Helicopter Handling Gear", code: "AVN001", active: 1 }
];

// 🔹 Static Linked Equipment Data
linked_equipment_data = [
  {
    id: 5001,
    ship_name: "INS Chennai",
    equipment_code: "EQP-101",
    equipment_name: "Gas Turbine Engine",
    srar_equipment_nomenclature: "Gas Turbine Module",
    location_name: "Missile Control Room",
    active: 1,
    ship: 1,
    equipment: 1,
    srar_equipment: 2,
    location: 1
  },
  {
    id: 5002,
    ship_name: "INS Shivalik",
    equipment_code: "EQP-102",
    equipment_name: "Diesel Generator",
    srar_equipment_nomenclature: "Automated Fire Control",
    location_name: "Damage Control Locker",
    active: 1,
    ship: 2,
    equipment: 2,
    srar_equipment: 9,
    location: 7
  },
  {
    id: 5003,
    ship_name: "INS Arihant",
    equipment_code: "EQP-103",
    equipment_name: "Nuclear Reactor Core",
    srar_equipment_nomenclature: "Pressurized Reactor",
    location_name: "Reactor Compartment",
    active: 1,
    ship: 3,
    equipment: 5,
    srar_equipment: 3,
    location: 5
  },
  {
    id: 5004,
    ship_name: "INS Trikand",
    equipment_code: "EQP-104",
    equipment_name: "Torpedo Launcher",
    srar_equipment_nomenclature: "Heavy Torpedo Tubes",
    location_name: "Torpedo Bay",
    active: 1,
    ship: 4,
    equipment: 3,
    srar_equipment: 5,
    location: 4
  },
  {
    id: 5005,
    ship_name: "INS Vela",
    equipment_code: "EQP-105",
    equipment_name: "Sonar Dome Array",
    srar_equipment_nomenclature: "Hull Mounted Sonar",
    location_name: "Sonar Operations Centre",
    active: 1,
    ship: 5,
    equipment: 6,
    srar_equipment: 4,
    location: 3
  },
  {
    id: 5006,
    ship_name: "INS Kamorta",
    equipment_code: "EQP-106",
    equipment_name: "Navigation Radar",
    srar_equipment_nomenclature: "3D Air Search Radar",
    location_name: "Radar Mast Compartment",
    active: 1,
    ship: 6,
    equipment: 7,
    srar_equipment: 7,
    location: 10
  },
  {
    id: 5007,
    ship_name: "INS Khanderi",
    equipment_code: "EQP-107",
    equipment_name: "Vertical Missile Launcher",
    srar_equipment_nomenclature: "VLS Fire Control",
    location_name: "CIC (Combat Information Centre)",
    active: 1,
    ship: 7,
    equipment: 4,
    srar_equipment: 1,
    location: 8
  },
  {
    id: 5008,
    ship_name: "INS Satpura",
    equipment_code: "EQP-108",
    equipment_name: "Electronic Warfare Console",
    srar_equipment_nomenclature: "EW Jammer",
    location_name: "EW Operations Compartment",
    active: 1,
    ship: 8,
    equipment: 9,
    srar_equipment: 8,
    location: 10
  },
  {
    id: 5009,
    ship_name: "INS Teg",
    equipment_code: "EQP-109",
    equipment_name: "Helicopter Lift System",
    srar_equipment_nomenclature: "Helicopter Handling Gear",
    location_name: "Helicopter Hangar",
    active: 1,
    ship: 9,
    equipment: 10,
    srar_equipment: 10,
    location: 2
  },
  {
    id: 5010,
    ship_name: "INS Chakra",
    equipment_code: "EQP-110",
    equipment_name: "Fire Suppression Pump",
    srar_equipment_nomenclature: "Automated Fire Control",
    location_name: "Flight Operations Control",
    active: 1,
    ship: 10,
    equipment: 8,
    srar_equipment: 9,
    location: 9
  }
];

  // Table Data
  tableData: any[]   = [];
  
  constructor(private apiService: ApiService, private toast: MessageService) {}
  ngOnInit(): void {
    // Don't load data initially - wait for ship selection
    console.log('Linked Equipment Component initialized - waiting for ship selection');
    // All options are now static data, no need for API call
  }
  currentPageApi(page: number, pageSize: number, shipId?: string){
    if (!shipId) {
      // If no ship is selected, clear the table
      this.tableData = [];
      return;
    }
    
    // Use static data instead of API call
    this.tableData = this.linked_equipment_data.filter(equipment => equipment.ship === parseInt(shipId));
    console.log('Linked Equipment Data loaded from static data for ship:', shipId, 'with', this.tableData.length, 'records');
  }
// apiCall method removed - all options are now static data

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
    }
  }

  closeDialog(): void {
    this.displayDialog = false;
    // Only reset form if not in view mode
    if (this.crudName !== 'View') {
      this.sararMasterForm.reset();
      this.sararMasterForm.enable();
    }
    this.crudName='Add'
  }


  // Event Handlers
  onView(data: any): void {
    this.crudName='View'
    // Find the SRAR equipment details for proper dropdown population
    const srarEquipmentDetails = this.srar_equipment_details_data.find(item => item.id === data.srar_equipment);
    
    // Map API data to form fields
    const formData = {
      id: data.id,
      ship: data.ship,
      ship_name: data.ship_name,
      ship_id: data.ship,
      equipment_name: data.equipment_name,
      equipment_id: data.equipment,
      sarar_equipemnt: srarEquipmentDetails ? srarEquipmentDetails.equipment_name : data.srar_equipment_nomenclature,
      sarar_equipment_id: data.srar_equipment,
      location_name: data.location_name,
      location_id: data.location,
      location_on_board: data.location_name,
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
    // Find the SRAR equipment details for proper dropdown population
    const srarEquipmentDetails = this.srar_equipment_details_data.find(item => item.id === data.srar_equipment);
    
    // Map API data to form fields
    const formData = {
      id: data.id,
      ship: data.ship,
      ship_name: data.ship_name,
      ship_id: data.ship,
      equipment_name: data.equipment_name,
      equipment_id: data.equipment,
      sarar_equipemnt: srarEquipmentDetails ? srarEquipmentDetails.equipment_name : data.srar_equipment_nomenclature,
      sarar_equipment_id: data.srar_equipment,
      location_name: data.location_name,
      location_id: data.location,
      location_on_board: data.location_name,
      active: data.active
    };
    this.sararMasterForm.patchValue(formData);
    this.sararMasterForm.get('active')?.setValue(data.active === 1 ? true : false);
    // Enable form for edit mode
    this.sararMasterForm.enable();
    this.openDialog();
  }

  // Delete confirmation modal properties
  showDeleteModal: boolean = false;
  itemToDelete: any = null;

  onDelete(data: any): void {
    console.log('Delete Linked Equipment:', data);
    this.itemToDelete = data;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.itemToDelete) {
      // Remove item from static data
      const index = this.linked_equipment_data.findIndex(item => item.id === this.itemToDelete.id);
      if (index > -1) {
        this.linked_equipment_data.splice(index, 1);
        this.toast.add({severity:'success', summary: 'Success', detail: 'Linked Equipment Deleted Successfully'});
        console.log('Linked equipment deleted from static data');
        // Refresh data for the currently selected ship
        const currentShipId = this.selectedShip?.id;
        if (currentShipId) {
          this.currentPageApi(0, 0, currentShipId);
        }
        this.showDeleteModal = false;
        this.itemToDelete = null;
      } else {
        this.toast.add({severity:'error', summary: 'Error', detail: 'Linked equipment not found'});
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
        // Update existing linked equipment in static data
        const index = this.linked_equipment_data.findIndex(item => item.id === this.sararMasterForm.value.id);
        if (index > -1) {
          const selectedShip = this.shipOptions.find(ship => ship.id === formData.ship);
          const selectedEquipment = this.equipmentOptions.find(equipment => equipment.id === formData.equipment_id);
          const selectedLocation = this.locationOptions.find(location => location.id === formData.location_id);
          const selectedSRAREquipment = this.equipmentTypeOptions.find(equipment => equipment.id === formData.sarar_equipment_id);
          
          this.linked_equipment_data[index] = {
            ...this.linked_equipment_data[index],
            ship_name: selectedShip?.name || '',
            equipment_code: `EQP-${formData.equipment_id?.toString().padStart(3, '0')}`,
            equipment_name: selectedEquipment?.name || '',
            srar_equipment_nomenclature: selectedSRAREquipment?.nomenclature || '',
            location_name: selectedLocation?.name || '',
            active: formData.active ? 1 : 0
          };
          
          this.toast.add({severity:'success', summary: 'Success', detail: 'Linked Equipment Updated Successfully'});
          this.closeDialog();
          // Refresh data for the currently selected ship
          const currentShipId = this.selectedShip?.id || this.sararMasterForm.value.ship;
          if (currentShipId) {
            this.currentPageApi(0, 0, currentShipId);
          }
        } else {
          this.toast.add({severity:'error', summary: 'Error', detail: 'Linked equipment not found for update'});
        }
      } else {
        // Create new linked equipment in static data
        const newId = Math.max(...this.linked_equipment_data.map(item => item.id || 0)) + 1;
        
        const selectedShip = this.shipOptions.find(ship => ship.id === formData.ship);
        const selectedEquipment = this.equipmentOptions.find(equipment => equipment.id === formData.equipment_id);
        const selectedLocation = this.locationOptions.find(location => location.id === formData.location_id);
        const selectedSRAREquipment = this.equipmentTypeOptions.find(equipment => equipment.id === formData.sarar_equipment_id);
        
        const newLinkedEquipment = {
          id: newId,
          ship_name: selectedShip?.name || '',
          equipment_code: `EQP-${formData.equipment_id?.toString().padStart(3, '0')}`,
          equipment_name: selectedEquipment?.name || '',
          srar_equipment_nomenclature: selectedSRAREquipment?.nomenclature || '',
          location_name: selectedLocation?.name || '',
          active: formData.active ? 1 : 0,
          ship: formData.ship,
          equipment: formData.equipment_id,
          srar_equipment: formData.sarar_equipment_id,
          location: formData.location_id
        };
        
        this.linked_equipment_data.push(newLinkedEquipment);
        
        this.toast.add({severity:'success', summary: 'Success', detail: 'Linked Equipment Added Successfully'});
        this.closeDialog();
        // Refresh data for the currently selected ship
        const currentShipId = this.selectedShip?.id || this.sararMasterForm.value.ship;
        if (currentShipId) {
          this.currentPageApi(0, 0, currentShipId);
        }
      }
    } else {
      this.toast.add({severity:'warn', summary: 'Warning', detail: 'Please fill all required fields'});
    }
  }
  
     selectedShip: any;
  
  onShipChange(event: any): void {
    // Extract the ship ID from the selected ship object
    const shipId = event?.id || event;
    
    if (shipId) {
      // Find the selected ship object to get additional details
      const selectedShip = this.shipOptions.find(ship => ship.id === shipId);
      
      if (selectedShip) {
        // Update form with ship details
        this.sararMasterForm.patchValue({
          ship: shipId,
          ship_name: selectedShip.name,
          ship_id: shipId
        });
        
        // Equipment options are already static data, no need to fetch
        // Fetch linked equipment data for the selected ship
        this.currentPageApi(0, 0, shipId);
      }
    } else {
      // If no ship is selected (dropdown cleared), clear the table data
      this.selectedShip = null;
      this.clearTableData();
      // Also clear the form ship-related fields
      this.sararMasterForm.patchValue({
        ship: '',
        ship_name: '',
        ship_id: ''
      });
    }
  }

  // Method to clear table data and equipment options when no ship is selected
  clearTableData(): void {
    this.tableData = [];
    this.equipmentOptions = [];
    console.log('No ship selected - clearing table data and equipment options');
  }

  onLocationOnBoardChange(event: any): void {
    console.log('Location changed to:', event);
    if (event) {
      // Find the selected location object from the options array
      const selectedLocation = this.locationOptions.find(location => location.name === event);
      if (selectedLocation) {
        this.sararMasterForm.patchValue({
          location_name: selectedLocation.name,
          location_id: selectedLocation.id,
          location_on_board: selectedLocation.name
        });
      }
    }
  }

  onEquipmentChange(event: any): void {
    const selectedEquipment = this.equipmentOptions.find(equipment => equipment.name === event);
    if (selectedEquipment) {
      this.sararMasterForm.patchValue({
        equipment_id: selectedEquipment.id
      });
    }
  }

  onEquipmentTypeChange(event: any): void {
    // Handle equipment type selection change
    console.log('Equipment type changed:', event);
    
    // Find the selected equipment to get additional details if needed
    const selectedEquipment = this.srar_equipment_details_data.find(equipment => equipment.equipment_name === event);
    if (selectedEquipment) {
      // Store the equipment ID in the form
      this.sararMasterForm.patchValue({
        sarar_equipment_id: selectedEquipment.id
      });
      console.log('Selected equipment details:', selectedEquipment);
    }
  }

 
}

