import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ApiService } from '../../../services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { AddFormComponent } from '../../../shared/components/add-form/add-form.component';
import { CommonModule, Location } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../services/toast.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { PaginatedTableComponent } from '../../../shared/components/paginated-table/paginated-table.component';
import { ToastComponent } from '../../../shared/components/toast/toast.component';
import { DeleteConfirmationModalComponent } from '../../../shared/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { DialogModule } from 'primeng/dialog'; // Import DialogModule for p-dialog
import { PanelModule } from 'primeng/panel'; // Import PanelModule for view details
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [
    TableModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    PaginatedTableComponent,
    TieredMenuModule,
    DialogModule,
    PanelModule,
    DropdownModule,
    InputNumberModule,
    ReactiveFormsModule,
    DeleteConfirmationModalComponent
],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css',
})
export class EquipmentComponent implements OnInit {
  searchText: string = '';
  departments: any = [];
  title: string = 'Add new Equipment';
  isFormOpen: boolean = false;
  viewdisplayModal: boolean = false;
  filteredSection: any[] = [];
  filteredTypes: any[] = [];
  filteredGroups: any[] = [];
  filteredCountries: any[] = [];
  filteredManufacturers: any[] = [];
  filteredSuppliers: any[] = [];
  isLoading: boolean = false;
  isViewFormOpen: boolean = false;
  isEdit = 'Add';
  // Add missing properties for edit functionality
  editTitle: string = 'Edit Equipment';
  isEditFormOpen: boolean = false;
  selectedDetails: any = {};
  
  // Add missing properties for table functionality
  filteredDepartments: any[] = [];

  // New properties for pagination
  apiUrl: string = 'master/equipment/';
  totalCount: number = 0;

  equipmentForm = new FormGroup({
    section: new FormControl('',[Validators.required]),
    group: new FormControl('',[Validators.required]),
    generic_code: new FormControl(''),
    type: new FormControl(''),
    code: new FormControl({value:'',disabled:true}),
    name: new FormControl('',[Validators.required]),
    model: new FormControl(''),
    maintop_number: new FormControl(''),
    acquaint_issued: new FormControl(''),
    authority: new FormControl(''),
    ilms_equipment_code: new FormControl(''),
    obsolete: new FormControl(false),
    total_fits: new FormControl(''),
    ship_applicable: new FormControl(''),
    manufacturer: new FormControl(''),
    country: new FormControl(''),
    supplier: new FormControl(''),
    active: new FormControl('')
  });

  toggleForm(open: boolean) {
    this.isFormOpen = open;
    this.isEdit = 'Add';
    this.equipmentForm.reset();
    this.equipmentForm.enable();
  }

  constructor(private apiService: ApiService, private location: Location, private toastService: ToastService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    console.log('🚢 Equipment Component Initializing...');
    console.log('API URL:', this.apiUrl);
    console.log('Total Count:', this.totalCount);
    console.log('Enable URL Fetching: true');
    
    this.fetchInitialDropdownData();
    // Note: Table data will be loaded by the paginated table component
    // No need to call getEquipments() here
  }
  goBack() {
    this.location.back();
  }
  fetchInitialDropdownData(): void {
    this.isLoading = true;
    forkJoin({
      eqType: this.apiService.get<any>('master/equipment-type/'),
      sections: this.apiService.get<any>('master/section/'),
      groups: this.apiService.get<any>('master/group/'),
      countries: this.apiService.get<any>('master/country/'),
      manufacturers: this.apiService.get<any>('master/manufacturers/'),
      suppliers: this.apiService.get<any>('master/supplier/'),
    }).subscribe({
      next: ({eqType, sections, groups, countries, manufacturers, suppliers }) => {
        this.filteredSection = sections.results|| sections 
        this.filteredTypes = eqType.results || eqType
        this.filteredGroups = groups.results || groups
        this.filteredCountries = countries.results || countries
        this.filteredManufacturers = manufacturers.results || manufacturers
        this.filteredSuppliers = suppliers.results || suppliers
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        console.error('Error fetching initial data:', error);
        this.toastService.showError('Error fetching initial data');
      },
    });
  }

  // Add GET method for equipment data
  getEquipments(): void {
    this.isLoading = true;
    this.apiService
      .get<any>('master/equipment/')
      .subscribe({
        next: (response) => {
          // Handle paginated response structure
          if (response && response.results) {
            this.departments = response.results;
            this.filteredDepartments = [...this.departments];
          } else {
            // Fallback for non-paginated response
            this.departments = response;
            this.filteredDepartments = [...this.departments];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching equipment:', error);
          this.isLoading = false;
          this.toastService.showError('Error fetching equipment data');
        },
      });
  }

  // Add search function for filtering equipment
  filterDepartments() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      this.departments = [...this.filteredDepartments]; // Reset to original list if search is empty
      return;
    }

    this.departments = this.filteredDepartments.filter(
      (dept: { name: string; code: string; equipment_name?: string; first_code?: string }) =>
        (dept.name && dept.name.toLowerCase().includes(search)) ||
        (dept.code && dept.code.toLowerCase().includes(search)) ||
        (dept.equipment_name && dept.equipment_name.toLowerCase().includes(search)) ||
        (dept.first_code && dept.first_code.toLowerCase().includes(search))
    );
  }


  exportOptions = [
    { label: 'Export as PDF', icon: 'pi pi-file-pdf', command: () => this.exportPDF() },
    { label: 'Export as Excel', icon: 'pi pi-file-excel', command: () => this.exportExcel() },
  ];
  cols = [
    { field: 'code', header: 'Code', filterType: 'text' },
    { field: 'name', header: 'Name', filterType: 'text' },
    { field: 'model', header: 'Model', filterType: 'text' },
    { field: 'manufacturer_name', header: 'Manufacture Name', filterType: 'text' },
    { field: 'country_name', header: 'Country Name', filterType: 'text' },
    { field: 'supplier_name', header: 'Supplier Name', filterType: 'text' },
    { field: 'group.name', header: 'Group name', filterType: 'text' },
    { field: 'type_name', header: 'Type', filterType: 'text' },
    { field: 'active', header: 'Active', filterType: 'text' }
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
    console.log('Exporting as PDF...');
    this.exportPDFEvent.emit();
    const doc = new jsPDF();
    autoTable(doc, {
      head: [this.cols.map((col) => col.header)],
      body: this.departments.map((row: { [x: string]: any }) =>
        this.cols.map((col) => row[col.field] || '')
      ),
    });
    doc.save(`${this.tableName || 'table'}.pdf`);
  }
  @Input() tableName: string = '';
  exportExcel() {
    console.log('Exporting as Excel...');
    this.exportCSVEvent.emit();
    const headers = this.cols.map((col) => col.header);
    const rows = this.departments.map((row: { [x: string]: any }) =>
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
    link.download = `${this.tableName || 'table'}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  view(event: any){
    this.isEdit = 'View';
    console.log(event);
    this.selectedDetails = event;
    this.isFormOpen = true;
    this.equipmentForm.patchValue({
      section: event.section || 10,
      group: event.group || 14,
      generic_code: event.generic_code,
      type: event.type_id || event.type,
      code: event.code || event.code,
      name: event.name,
      model: event.model,
      maintop_number: event.maintop_number,
      acquaint_issued: event.acquaint_issued,
      authority: event.authority,
      ilms_equipment_code: event.ilms_equipment_code,
      obsolete: event.obsolete === 'Yes' || event.obsolete === true,
      total_fits: event.total_fits,
      ship_applicable: event.ship_applicable
    });
    this.equipmentForm.disable();
  }
  
  edit(event: any){
    this.isEdit = 'Edit';
    console.log(event);
    this.selectedDetails = { ...event };
    this.isFormOpen = true;
    this.apiService.get<any>('master/group/?is_dropdown=true&section='+event.group.section).subscribe((res:any)=>{
      this.filteredGroups = res
    })
    this.equipmentForm.patchValue(event)
    // Populate form with selected data
    this.equipmentForm.patchValue({
      section: event.group.section,
      group: event.group.id,
      generic_code: event.generic_code,
      type: event.type_id || event.type,
      code: event.code || event.code,
      name: event.name,
      model: event.model,
      maintop_number: event.maintop_number,
      acquaint_issued: event.acquaint_issued,
      authority: event.authority,
      ilms_equipment_code: event.ilms_equipment_code,
      obsolete: event.obsolete === 'Yes' || event.obsolete === true,
      total_fits: event.total_fits,
      ship_applicable: event.ship_applicable
    });
  }
  
  showDeleteDialog: boolean = false;
  
  deleteRow(event: any){
    this.showDeleteDialog = true;
    this.selectedDetails = event;
  }
  
  confirmDeletion() {
    this.apiService
      .delete(`master/equipment/${this.selectedDetails.id}/`)
      .subscribe({
        next: (data: any) => {
          console.log('Equipment deleted successfully:', data);
          this.toastService.showSuccess('Equipment deleted successfully');
          this.getEquipments(); // Refresh the data
          this.showDeleteDialog = false;
        },
        error: (error) => {
          console.error('Error deleting equipment:', error);
          this.toastService.showError('Error deleting equipment');
        },
      });
  }

  cancelDeletion() {
    this.showDeleteDialog = false;
  }
  submit(){
    console.log(this.equipmentForm.value);
    if (this.equipmentForm.valid) {
      this.isLoading = true;
      this.equipmentForm.get('active')?.setValue("1");
      const formData = this.equipmentForm.value;
      
      // Create API payload with proper types
      let apiPayload = {
        code:this.selectedDetails?.code || formData.code,
        ...formData,
        obsolete: formData.obsolete ? 'Yes' : 'No'
      };    
      if(this.isEdit === 'Add'){
        this.apiService
        .post('master/equipment/', apiPayload)
        .subscribe({
          next: (data: any) => {
            console.log('Equipment added successfully:', data);
            this.toastService.showSuccess('Equipment added successfully');
            this.getEquipments(); // Refresh the data
            this.toggleForm(false); // Close the form
            this.equipmentForm.reset(); // Reset form
            this.isLoading = false;
              },
          });
      }
      else{
        this.apiService
        .put(`master/equipment/${this.selectedDetails.id}/`, apiPayload)
        .subscribe({
          next: (data: any) => {
            console.log('Equipment updated successfully:', data);
            this.toastService.showSuccess('Equipment updated successfully');
            this.getEquipments(); // Refresh the data
            this.toggleForm(false); // Close the form
            this.equipmentForm.reset(); // Reset form
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error updating equipment:', error);
            this.toastService.showError('Error updating equipment');
            this.isLoading = false;
          },
        });
      }
    }
    else{
      this.toastService.showError('Please fill all required fields');
    }
  }

  onSectionChange(event: any) {
    console.log(event.value);
    // Clear group selection and equipment code when section changes
    this.equipmentForm.patchValue({
      group: '',
      code: '',
    });
    this.filteredGroups = [];
    
    if (event.value) {
      this.apiService.get<any>('master/group/?section=' + event.value+'&is_dropdown=true').subscribe((res: any) => {
        this.filteredGroups = res
        // this.setFieldOptions('group', this.filteredGroups);
      });
    }
  }

  onGroupChange(event: any) {
    console.log('Group selected:', event.value);
    // Clear equipment code when group changes
    this.equipmentForm.patchValue({
      code: '',
    });
    
    if (event.value) {
      this.generateEquipmentCode(event.value);
    } else {
      // Group was cleared, reset equipment code fields
      this.equipmentForm.patchValue({
        code: ''
      });
    }
  }

  generateEquipmentCode(groupId: number) {
    this.isLoading = true;
    this.apiService.get<any>(`master/equipment-code/?group_id=${groupId}`).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const equipmentCode = res.data.equipment_code;
          console.log('Generated equipment code:', equipmentCode);
          
          // Parse the equipment code and set it in the form fields
          this.setEquipmentCodeFields(equipmentCode);
          
          // Show success message
          this.toastService.showSuccess('Equipment code generated successfully');
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error generating equipment code:', error);
        this.toastService.showError('Error generating equipment code');
        this.isLoading = false;
      }
    });
  }

  setEquipmentCodeFields(equipmentCode: string) {
    // Split the equipment code into parts and set them in the form
    // Assuming the format is like "0005Group 09001" or similar
    // You may need to adjust this logic based on your actual equipment code format
    
    // For now, let's set the entire code in the first_code field
    // You can modify this logic based on your specific requirements
    this.equipmentForm.patchValue({
      code: equipmentCode
    });
  }

  // Handle data loaded from paginated table
  onDataLoaded(data: any[]): void {
    console.log('🚢 Data loaded from paginated table:', data);
    console.log('🚢 Data length:', data?.length);
    console.log('🚢 Data type:', typeof data);
    console.log('🚢 First record:', data?.[0]);
    
    this.departments = data || [];
    this.filteredDepartments = [...(data || [])];
    
    console.log('🚢 Departments array updated:', this.departments);
    console.log('🚢 Filtered departments updated:', this.filteredDepartments);
    
    // Force change detection
    this.cdr.detectChanges();
  }
}