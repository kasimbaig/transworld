import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';


@Component({
  selector: 'app-eqpt-nomenclature-location',
  standalone: false,
  templateUrl: './eqpt-nomenclature-location.component.html',
  styleUrl: './eqpt-nomenclature-location.component.css'
})
export class EqptNomenclatureLocationComponent  implements OnInit {

  departmentOptions: any[] = [];
  shipOptions: any[] = [];
  unitTypeOptions: any[] = [];
  
  searchValue: string = '';
  // Selected Values
  selectedUnitType: any = null;
  selectedShip: any = null;
  selectDepartment: any = null;

  // Table Data
  tableData: any[] = [];
  
  constructor(private apiService: ApiService) {}
  
  ngOnInit(): void {
    this.apiCall();
    // Don't load all data initially - wait for filters
    console.log('Equipment Nomenclature Component initialized - waiting for filter selection');
  }
  
  currentPageApi(page: number, pageSize: number){
    // Only load data if both unit and ship are selected
    if (this.selectedUnitType && this.selectedShip) {
      this.loadTableData(this.selectedUnitType.id, this.selectedShip.id, this.selectDepartment?.id);
    }
  }

  apiCall(){
    // Only load unit types initially - ships will be loaded when unit is selected
    this.apiService.get('master/unit-type/').subscribe((res: any) => {
      this.unitTypeOptions = res.results;
    });
    
    // Load other independent dropdowns
    this.apiService.get('master/department/?is_dropdown=true').subscribe((res: any) => {
      this.departmentOptions = res.results || res;
    });
  }

  // Event Handlers
  onView(data: any): void {
    console.log('View Equipment:', data);
  }

  onUnitTypeChange(): void {
    console.log('Unit Type changed to:', this.selectedUnitType);
    let id = this.selectedUnitType.id;
    console.log("idCheck", id);
    
    // Fetch ships for selected unit
    this.apiService.get(`master/ship/?unit_type=${id}`).subscribe((res: any) => {
      this.shipOptions = res.results;
      console.log("response is ", res);
      console.log("shipOption data", this.shipOptions);
    });
    
    // Clear ship selection and table data when unit changes
    this.selectedShip = null;
    this.selectDepartment = null;
    this.tableData = [];
  }

  onShipChange(): void {
    console.log('Ship changed to:', this.selectedShip);
    // Clear table data when ship changes
    this.tableData = [];
    
    // Automatically load data if both unit and ship are selected
    if (this.selectedUnitType && this.selectedShip) {
      console.log('Both unit and ship selected, loading data...');
      this.loadTableData(this.selectedUnitType.id, this.selectedShip.id, this.selectDepartment?.id);
    }
  }

  onDepartmentChange(): void {
    // Only load data if both unit and ship are selected
    if (this.selectedUnitType && this.selectedShip) {
      this.loadTableData(this.selectedUnitType.id, this.selectedShip.id, this.selectDepartment?.id);
    }
  }

  // Load table data for selected Unit + Ship + Department
  loadTableData(unitId: number, shipId: number, departmentId?: number) {
    console.log('Loading table data for Unit ID:', unitId, 'Ship ID:', shipId, 'Department ID:', departmentId);
    
    let apiUrl = `sfd/equipment-nomenclature/?ship=${shipId}`;
    if (departmentId) {
      apiUrl += `&department=${departmentId}`;
    }
    
    this.apiService.get(apiUrl).subscribe((res: any) => {
      console.log('API Response:', res);
      if (res.results && res.results.length > 0) {
        this.tableData = res.results;
        console.log('Table data loaded:', this.tableData.length, 'records');
      } else {
        this.tableData = [];
        // You can add a toast message here if you want to show "No data found"
        console.log('No data found for the selected filters.');
      }
    }, (error) => {
      console.error('Error loading data:', error);
      this.tableData = [];
      // You can add a toast message here if you want to show error
      console.error('Failed to load data. Please try again.');
    });
  }

  onSearchInput(value: string): string {
    const val = value.trim();
    return val || '';
  }
}
