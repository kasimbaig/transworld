// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, combineLatest, Subject, of } from 'rxjs';
import { map, takeUntil, startWith } from 'rxjs/operators';
import { Option } from '../../masters/ship-master/ship.model';
import { CommandService } from '../../masters/ship-master/ship-services/command.service';
import { ShipService } from '../../masters/ship-master/ship.service';
import { DepartmentService } from '../../masters/ship-master/ship-services/department.service';
import { MessageService } from 'primeng/api';
import { DefectListComponent } from './defect-list/defect-list.component'; // Correct path
// import { AddFormComponent } from '../../shared/components/add-form/add-form.component'; // No longer needed in TS file

interface OcrcEvent {
  ship: string;
  opStart: Date;
  opEnd: Date;
  refStart: Date;
  refEnd: Date;
  refitType: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

interface KpiCardData {
  value: number | string;
  trend?: number;
  trendDirection?: 'up' | 'down';
  progress?: number;
  progressText?: string;
  severity?: { critical: number; major: number; minor: number };
  overdueTasks?: number;
}

interface FleetStatus {
  ship: string;
  readiness: number; // percentage
  defects: number;
  maintenance: string; // e.g., "Due 2 weeks"
}

interface NewDefect {
  ship: number | null;
  department: number | null;
  title: string;
  description: string;
  defectType: string | null;
  system: string | null;
  equipment: string | null;
  priority: string | null;
  attachments: File[]; // For file upload
}

interface MaintenanceLog {
  maintenanceType: string | null;
  frequency: string | null;
  task: string;
  equipment: string | null;
  assignedPersonnel: string | null;
  hours: number | null;
  completionDate: Date | null;
  sparesUsed: string;
  remarks: string;
}

interface EquipmentItem {
  name: string;
  nsn?: string; // National Stock Number
  partNumber?: string;
  department?: string;
  compartment?: string;
  status: string; // Operational, In Maintenance, etc.
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(DefectListComponent) defectListComponent!: DefectListComponent;

  // Tab and Dropdown Properties
  activeTab: string = 'dashboard';
  showMastersDropdown: boolean = false;
  menuExpanded: boolean = true;
  userInitials = 'JD';
  userName = 'John Doe';
  userRank = 'Commander';
  userRole = 'Maintenance Supervisor';
  isApprover: boolean = true;
  totalEquipment: number = 245;
  activeMaintenanceTasks: number = 87;
  activeMaintenanceProgress: number = 62;
  openDefects: number = 34;
  criticalDefects: number = 8;
  majorDefects: number = 15;
  minorDefects: number = 11;
  equipmentFitProgress: number = 100;
  equipmentFitSystemsCount: string = '191/245 systems';
  taskCompletionRate: number = 92;
  overdueTasks: number = 5;
  timelineData: OcrcEvent[] = [];

  commands$: Observable<Option[]>;
  allShips$: Observable<Option[]>;
  departments$: Observable<Option[]>;

  private _allCommands: Option[] = [];
  private _allShips: Option[] = [];
  private _allDepartments: Option[] = [];

  filteredShips: Option[] = [];
  filteredDepartments: Option[] = [];

  selectedCommand:any='';
  selectedShip:any='';
  selectedDept:any='';
  dateRange: Date[] | undefined; // Keep this if other parts of dashboard use it, but it's not passed to DefectListComponent
  kpiMetrics = [
    {
      title: 'Total Ships',
      value: 128,
      description: 'Fleet size across all commands.',
      iconClass: 'pi pi-ship',
      type: 'TOTAL_SHIPS',
      backgroundColor: '#DBEAFE',   // blue-100
      iconColor: '#1D4ED8',         // blue-700
      titleColor: '#1D4ED8',
      valueColor: '#1D4ED8',
      trendPercentage: '5.6%',
      trendDirection: 'up'
    },
    {
      title: 'Active Crew Members',
      value: 945,
      description: 'Personnel currently on duty.',
      iconClass: 'pi pi-users',
      type: 'ACTIVE_CREW',
      backgroundColor: '#F0FDFA',   // teal-50
      iconColor: '#0F766E',         // teal-700
      titleColor: '#0F766E',
      valueColor: '#0F766E',
      progressBarValue: 78,
    },
    {
      title: 'Pending Repairs',
      value: 21,
      description: 'Defects waiting for resolution.',
      iconClass: 'pi pi-wrench',
      type: 'PENDING_REPAIRS',
      backgroundColor: '#FEF2F2',   // red-50
      iconColor: '#B91C1C',         // red-700
      titleColor: '#B91C1C',
      valueColor: '#B91C1C',
      severityDetails: { critical: 6, major: 10, minor: 5 }
    },
    {
      title: 'Mission Readiness',
      value: '88%',
      description: 'Operational readiness across fleet.',
      iconClass: 'pi pi-bolt',
      type: 'MISSION_READINESS',
      backgroundColor: '#F0FDF4',   // green-50
      iconColor: '#15803D',         // green-700
      titleColor: '#15803D',
      valueColor: '#15803D',
      subText: 'Improved from 82% last month'
    }
  ];
  
  

  taskDistributionData: ChartData = { labels: [], datasets: [] };
  maintenanceTimelineData: ChartData = { labels: [], datasets: [] };
  defectsData: ChartData = { labels: [], datasets: [] };
  frequentDefectData: ChartData = { labels: [], datasets: [] };

  fleetStatus: FleetStatus[] = [];

  // showNewDefectDialog: boolean = false; // No longer needed with reusable form
  newDefect: NewDefect = {
    ship: null, department: null, title: '', description: '',
    defectType: null, system: null, equipment: null, priority: null, attachments: []
  };

  selectedFiles: File[] = [];

  shipsForDefect: Option[] = [];
  departmentsForDefect: Option[] = [];

  defectTypeOptions: Option[] = [
    { label: 'Mechanical', value: 'Mechanical' },
    { label: 'Electrical', value: 'Electrical' },
    { label: 'Software', value: 'Software' },
    { label: 'Structural', value: 'Structural' },
  ];
  systemOptions: Option[] = [
    { label: 'Propulsion System', value: 'Propulsion' },
    { label: 'Navigation System', value: 'Navigation' },
    { label: 'Weapon System', value: 'Weapon' },
    { label: 'Power Generation', value: 'Power' },
  ];
  equipmentOptions: Option[] = [
    { label: 'Main Engine #1', value: 'Main Engine #1' },
    { label: 'Radar System', value: 'Radar System' },
    { label: 'Sonar Array', value: 'Sonar Array' },
    { label: 'HVAC Unit A', value: 'HVAC Unit A' },
  ];
  priorityOptions: Option[] = [
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  showLogMaintenanceDialog: boolean = false;
  maintenanceLog: MaintenanceLog = {
    maintenanceType: null, frequency: null, task: '', equipment: null,
    assignedPersonnel: null, hours: null, completionDate: null, sparesUsed: '', remarks: ''
  };
  maintenanceTypeOptions: Option[] = [
    { label: 'Preventive', value: 'Preventive' },
    { label: 'Corrective', value: 'Corrective' },
    { label: 'Predictive', value: 'Predictive' },
  ];
  maintenanceFrequencyOptions: Option[] = [
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Quarterly', value: 'Quarterly' },
    { label: 'Annually', value: 'Annually' },
  ];
  personnelOptions: Option[] = [
    { label: 'CPO R. Sharma', value: 'R. Sharma' },
    { label: 'LT J. Khan', value: 'J. Khan' },
    { label: 'CDR S. Patel', value: 'S. Patel' },
  ];

  // Remove Fleet Entry Form Properties
  // showAddFleetEntryDialog: boolean = false;
  // newFleetEntry: FleetStatus = {
  //   ship: '',
  //   readiness: 0,
  //   defects: 0,
  //   maintenance: ''
  // };

  showEquipmentFitDialog: boolean = false;
  selectedEFCommand: number | null = null;
  selectedEFShip: number | null = null;
  equipmentList: EquipmentItem[] = [
    { name: 'Main Engine #1', nsn: '1234-56-789-0123', department: 'Engineering', compartment: 'Engine Room A', status: 'Operational' },
    { name: 'Radar System', partNumber: 'XYZ-987', department: 'Operations', compartment: 'Bridge', status: 'Operational' },
    { name: 'HVAC Unit B', nsn: '9876-54-321-0987', department: 'Logistics', compartment: 'Deck 3', status: 'In Maintenance' },
    { name: 'Sonar Array', partNumber: 'ABC-111', department: 'Weapons', compartment: 'Sonar Bay', status: 'Operational' },
    { name: 'Auxiliary Generator', nsn: '5555-44-333-2222', department: 'Engineering', compartment: 'Engine Room B', status: 'Operational' },
  ];

  showApprovePlanDialog: boolean = false;
  approverComments: string = '';

  // Defects Form Configuration for Reusable Form
  showDefectsFormDialog: boolean = false;
  defectsFormConfig: { label: string; key: string; type: string; required: boolean; placeholder?: string; options?: { label: string; value: any }[] }[] = [
    {
      key: 'ship',
      label: 'Ship',
      type: 'select',
      required: true,
      placeholder: 'Select a Ship',
      options: []
    },
    {
      key: 'department',
      label: 'Department',
      type: 'select',
      required: true,
      placeholder: 'Select Department',
      options: []
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Provide detailed description of the defect observed.'
    },
    {
      key: 'defectType',
      label: 'Defect Type',
      type: 'select',
      required: true,
      placeholder: 'Select Type',
      options: []
    }
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private commandService: CommandService,
    private shipService: ShipService,
    private departmentService: DepartmentService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.commands$ = this.commandService.getCommandOptions();
    this.allShips$ = this.shipService.getShipOptions();
    this.departments$ = this.departmentService.getDepartmentOptions();
  }

  ngOnInit(): void {
    this.loadDefaultData();
    combineLatest([
      this.commands$,
      this.allShips$,
      this.departments$,
    ]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(([commands, allShips, departments]) => {
      this._allCommands = commands;
      this._allShips = allShips;
      this._allDepartments = departments;

      this.shipsForDefect = allShips.filter(s => s.value !== null);
      this.departmentsForDefect = departments.filter(d => d.value !== null);

      // Initialize filter dropdowns based on loaded data without triggering applyFilters
      this.applyShipAndDepartmentFilters(this._allShips, this._allCommands, this._allDepartments);

      // IMPORTANT: Trigger applyFilters *once* after all initial data and dropdowns are ready
      // This ensures the initial charts (both mock and API-driven) are populated.
      // This is still needed for initial load.
      this.applyFilters();
    });

    this.commandService.loadAllCommandsData();
    this.shipService.loadAllShipsData();
    this.departmentService.loadAllDepartmentsData();

    // Add document click listener for dropdown
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Remove document click listener
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  loadDefaultData(): void {
    this.fleetStatus = [
      { ship: 'INS Vikrant', readiness: 95, defects: 2, maintenance: 'None' },
      { ship: 'INS Vikramaditya', readiness: 78, defects: 5, maintenance: 'Scheduled (1 week)' },
      { ship: 'INS Chennai', readiness: 88, defects: 1, maintenance: 'None' },
      { ship: 'INS Shivalik', readiness: 65, defects: 8, maintenance: 'In Progress' },
      { ship: 'INS Kamorta', readiness: 92, defects: 0, maintenance: 'None' },
    ];

    const allShipNames = this.fleetStatus.map(fs => fs.ship);
    this.timelineData = this.getMockTimelineData(allShipNames);
  }

  // New method to apply filters only for the mock charts (not for the defect-list component)
  applyFiltersForMockCharts(): void {
    let selectedShipNames: string[] = [];
    if (this.selectedShip) {
      const foundShip = this._allShips.find(s => s.value === this.selectedShip);
      if (foundShip?.label) {
        selectedShipNames = [foundShip.label];
      }
    } else {
      let shipsToConsider = this._allShips;
      if (this.selectedCommand !== null) {
        // This logic assumes 'Option' for ships might have a 'commandId' or similar
        // If not, you'd need to adjust how ships relate to commands
        shipsToConsider = this._allShips.filter(s => (s as any).commandId === this.selectedCommand);
      }
      selectedShipNames = shipsToConsider.filter(s => s.value !== null).map(s => s.label);
    }
    this.timelineData = this.getMockTimelineData(selectedShipNames);

    this.frequentDefectData = {
      labels: ['Filtered A', 'Filtered B', 'Filtered C'],
      datasets: [{
        label: 'Filtered Frequency',
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726'],
        data: [3, 2, 4]
      }]
    };

    this.taskDistributionData = {
      labels: ['Engineering', 'Operations', 'Logistics', 'Medical', 'Weapons'],
      datasets: [{
        label: 'Filtered Tasks',
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350', '#AB47BC'],
        data: [15, 25, 10, 5, 20]
      }]
    };

    this.maintenanceTimelineData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Filtered Planned',
          backgroundColor: ['#42A5F5'],
          data: [45, 40, 55, 50, 30, 35]
        },
        {
          label: 'Filtered Unplanned',
          backgroundColor: ['#EF5350'],
          data: [25, 35, 20, 15, 50, 20]
        }
      ]
    };

    this.defectsData = {
      labels: ['Engine', 'Navigation', 'Electrical'],
      datasets: [{
        label: 'Filtered Defects',
        backgroundColor: ['#FF6384'],
        data: [6, 2, 4]
      }]
    };
  }

  applyFilters(): void {
    console.log('Applying filters:', {
      command: this.selectedCommand,
      ship: this.selectedShip,
      department: this.selectedDept
    });

    // Update mock charts
    this.applyFiltersForMockCharts();

    // Trigger API call for DefectListComponent only
    if (this.defectListComponent) {
      // Pass the current filter values directly to the child component's method
      // The child component's fetchData will now use these updated values
      this.defectListComponent.fetchData();
    }
  }

  onCommandChange(): void {
    // Reset dependent filters
    this.selectedShip = null;
    this.selectedDept = null;

    // Re-filter ships based on the new command
    this.applyShipAndDepartmentFilters(this._allShips, this._allCommands, this._allDepartments);

    // DO NOT call applyFilters() here.
    // The user must click 'Apply' to trigger data fetching.
  }

  onShipChange(): void {
    // Reset dependent filters
    this.selectedDept = null;
    // DO NOT call applyFilters() here.
  }

  onDeptChange(): void {
    // DO NOT call applyFilters() here.
  }

  clearFilters(): void {
    this.selectedCommand = null;
    this.selectedShip = null;
    this.selectedDept = null;
    this.dateRange = undefined; // Clear the date range
    // Reset dropdowns based on the new null selections
    this.applyShipAndDepartmentFilters(this._allShips, this._allCommands, this._allDepartments);
    // After clearing, trigger the applyFilters to update all charts, including the DefectListComponent
    this.applyFilters();
  }

  applyShipAndDepartmentFilters(allShips: Option[], allCommands: Option[], allDepartments: Option[]): void {
    let filtered = allShips.filter(ship =>
      // This is a crucial line. Assuming your 'Option' type for ships has a 'commandId' property.
      // If not, you need to adjust how your ship options are structured or filtered.
      // For example, if ship.value is the command ID itself for filtering, it would be:
      // this.selectedCommand === null || ship.value === this.selectedCommand
      // But typically, a ship option would have its own ID as `value` and a `commandId` for filtering.
      // Given your current error with type 'number | null' not assignable to type 'string | null',
      // and your API expecting string IDs, it's safer to ensure value is treated as a string for comparison.
      this.selectedCommand === null || (ship as any).value === this.selectedCommand
    )
    this.filteredShips = [{ label: 'All Ships', value: null }, ...filtered];

    this.filteredDepartments = [{ label: 'All Departments', value: null }, ...allDepartments];

    this.shipsForDefect = allShips.filter(s => s.value !== null);
    this.departmentsForDefect = allDepartments.filter(d => d.value !== null);
  }

  getStatusClass(readiness: number): string {
    if (readiness >= 90) return 'operational';
    if (readiness >= 75) return 'limited';
    return 'in-maintenance';
  }

  getStatusClassd(status: string): string {
    switch (status) {
      case 'Operational': return 'status-operational';
      case 'In Maintenance': return 'status-in-maintenance';
      default: return '';
    }
  }

  addNewDefect(): void {
    // Update the form configuration with current options
    this.defectsFormConfig = [
      {
        key: 'ship',
        label: 'Ship',
        type: 'select',
        required: true,
        placeholder: 'Select a Ship',
        options: this.shipsForDefect
      },
      {
        key: 'department',
        label: 'Department',
        type: 'select',
        required: true,
        placeholder: 'Select Department',
        options: this.departmentsForDefect
      },
      {
        key: 'description',
        label: 'Description',
        type: 'text',
        required: true,
        placeholder: 'Provide detailed description of the defect observed.'
      },
      {
        key: 'defectType',
        label: 'Defect Type',
        type: 'select',
        required: true,
        placeholder: 'Select Type',
        options: this.defectTypeOptions
      }
    ];

    this.newDefect = {
      ship: null, department: null, title: '', description: '',
      defectType: null, system: null, equipment: null, priority: null, attachments: []
    };
    this.showDefectsFormDialog = true;
    console.log('Opening Add New Defect Dialog with Reusable Form');
  }

  handleDefectsFormSubmit(data: any): void {
    console.log('Submitting new defect from reusable form:', data);
    
    // Validate required fields
    if (!data.ship || !data.department || !data.description || 
        !data.defectType) {
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please fill in all required fields for the new defect.' 
      });
      return;
    }

    // Process the submitted data
    const newDefectData = {
      ship: data.ship,
      department: data.department,
      title: data.description.substring(0, 50) + (data.description.length > 50 ? '...' : ''), // Use description as title
      description: data.description,
      defectType: data.defectType,
      system: null, // Not provided in the new form
      equipment: null, // Not provided in the new form
      priority: null, // Not provided in the new form
      attachments: []
    };

    // Here you would typically save the defect to your backend
    console.log('Processed defect data:', newDefectData);
    
    setTimeout(() => {
      this.messageService.add({ 
        severity: 'success', 
        summary: 'Success', 
        detail: 'Defect submitted successfully!' 
      });
      this.showDefectsFormDialog = false;
    }, 1000);
  }

  // Keep the old method for backward compatibility but it's no longer used
  submitNewDefect(): void {
    console.log('Submitting new defect:', this.newDefect);
    if (this.newDefect.ship === null || this.newDefect.department === null || !this.newDefect.title || !this.newDefect.description ||
      !this.newDefect.defectType) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields for the new defect.' });
      return;
    }
    setTimeout(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Defect submitted successfully!' });
      // this.showNewDefectDialog = false; // No longer needed
    }, 1000);
  }

  logMaintenance(): void {
    this.maintenanceLog = {
      maintenanceType: null, frequency: null, task: '', equipment: null,
      assignedPersonnel: null, hours: null, completionDate: null, sparesUsed: '', remarks: ''
    };
    this.showLogMaintenanceDialog = true;
    console.log('Opening Log Maintenance Dialog');
  }

  submitMaintenanceLog(): void {
    console.log('Submitting maintenance log:', this.maintenanceLog);
    if (!this.maintenanceLog.maintenanceType || !this.maintenanceLog.frequency || !this.maintenanceLog.task ||
      !this.maintenanceLog.equipment || !this.maintenanceLog.assignedPersonnel || this.maintenanceLog.hours === null ||
      !this.maintenanceLog.completionDate) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields for the maintenance log.' });
      return;
    }
    setTimeout(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Maintenance log submitted successfully!' });
      this.showLogMaintenanceDialog = false;
    }, 1000);
  }

  viewEquipmentFit(): void {
    this.showEquipmentFitDialog = true;
    console.log('Opening View Equipment Fit Dialog');
  }

  approveMaintenancePlan(): void {
    console.log('Approving/Rejecting Maintenance Plan with comments:', this.approverComments);
    setTimeout(() => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Maintenance plan action recorded!' });
      this.showApprovePlanDialog = false;
    }, 1000);
  }

  onChartSelect(event: any): void {
    console.log('Chart segment selected:', event);
  }

  getMockTimelineData(ships: string[]): OcrcEvent[] {
    const refitTypes = ['Major Refit', 'Minor Refit', 'Maintenance', 'Inspection'];
    const events: OcrcEvent[] = [];
    
    ships.forEach((ship, index) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (index * 30));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 14);
      
      events.push({
        ship,
        opStart: startDate,
        opEnd: endDate,
        refStart: new Date(startDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        refEnd: new Date(endDate.getTime() + 7 * 24 * 60 * 60 * 1000),
        refitType: refitTypes[index % refitTypes.length]
      });
    });
    
    return events;
  }

  // Tab and Dropdown Methods
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'dashboard') {
      this.showMastersDropdown = false;
    }
  }

  toggleMastersDropdown(): void {
    this.showMastersDropdown = !this.showMastersDropdown;
  }

  navigateToMasters(route: string): void {
    this.showMastersDropdown = false;
    
    // Navigation logic based on the routing structure
    switch (route) {
      case 'ship-details':
        this.router.navigate(['/masters/ship-group']);
        break;
      case 'equipment-details':
        this.router.navigate(['/masters/equipment-group']);
        break;
      case 'unit-details':
        this.router.navigate(['/masters/unit-group']);
        break;
      case 'overseeing-team':
        this.router.navigate(['/masters/overseeing-team']);
        break;
      case 'propulsion':
        this.router.navigate(['/masters/propulsion']);
        break;
      case 'country':
        this.router.navigate(['/masters/country']);
        break;
      case 'establishment':
        this.router.navigate(['/masters/establishment']);
        break;
      case 'manufacturer':
        this.router.navigate(['/masters/manufacturer']);
        break;
      default:
        console.log('Unknown route:', route);
    }
  }

  // Close dropdown when clicking outside
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.tab-dropdown')) {
      this.showMastersDropdown = false;
    }
  }

  // File handling methods
  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files) {
      this.selectedFiles = Array.from(files);
      this.newDefect.attachments = this.selectedFiles;
      console.log('Files selected:', this.selectedFiles);
    }
  }

  // Remove Fleet Entry Form Methods
  // addNewFleetEntry(): void {
  //   this.showAddFleetEntryDialog = true;
  //   this.newFleetEntry = {
  //     ship: '',
  //     readiness: 0,
  //     defects: 0,
  //     maintenance: ''
  //   };
  // }

  // handleFleetEntrySubmit(data: any): void {
  //   // Validate readiness percentage
  //   if (data.readiness < 0 || data.readiness > 100) {
  //     this.messageService.add({ 
  //       severity: 'error', 
  //       summary: 'Validation Error', 
  //       detail: 'Readiness percentage must be between 0 and 100' 
  //     });
  //     return;
  //   }

  //   // Validate defects count
  //   if (data.defects < 0) {
  //     this.messageService.add({ 
  //       severity: 'error', 
  //       summary: 'Validation Error', 
  //       detail: 'Open defects count cannot be negative' 
  //     });
  //     return;
  //   }

  //   // Add the new fleet entry
  //   const newEntry: FleetStatus = {
  //     ship: data.ship,
  //     readiness: data.readiness,
  //     defects: data.defects,
  //     maintenance: data.maintenance || 'None'
  //   };

  //   this.fleetStatus.push(newEntry);
    
  //   this.messageService.add({ 
  //     severity: 'success', 
  //       summary: 'Success', 
  //       detail: `Fleet entry for ${data.ship} added successfully!` 
  //   });
    
  //   this.showAddFleetEntryDialog = false;
  // }

  // closeFleetEntryDialog(): void {
  //   this.showAddFleetEntryDialog = false;
  // }
}