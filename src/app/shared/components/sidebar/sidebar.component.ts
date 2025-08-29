import { Component, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ApiService } from '../../../services/api.service';

interface MenuItem {
  id: any;
  label: string;
  path?: string;
  expanded?: boolean;
  children?: MenuItem[];
  icon?: string;
  hasChildren?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnChanges {
  @Input() isCollapsed: boolean = false;
  @Output() collapseSidebar = new EventEmitter<void>();

  public expanded: boolean = true;
  
  // Watch for changes to isCollapsed input
  ngOnChanges() {
    if (this.isCollapsed !== undefined) {
      this.expanded = !this.isCollapsed;
    }
  }
  activeItem: string = '/dashboard';
  openSubMenus: { [key: string]: boolean } = {};

  themeMode: 'light' | 'dark' = 'light';

  constructor(private router: Router, private apiService: ApiService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeItem = event.urlAfterRedirects;
        // this.updateOpenSubMenus(this.activeItem);
        // Auto-collapse sidebar on navigation
        console.log('NavigationEnd detected, emitting collapseSidebar');
        this.collapseSidebar.emit();

      }
    });
  }

  menuItems: MenuItem[] = [
  {
    id: 1,
    icon: 'fa-solid fa-house',
    label: 'Home',
    path: '/dashboard',
    hasChildren: false,
  },
  {
    id: 2,
    icon: 'fa-solid fa-database',
    label: 'Masters',
    path: '/masters/ship-group/ship-master',
    hasChildren: true,
    children: [
      {
        id: 3,
        label: 'Ship',
        path: '/masters/ship-group/ship-master',
        hasChildren: true,
        children: [
          { id: 4, label: 'Ship Master', path: '/masters/ship-group/ship-master', hasChildren: false },
          { id: 5, label: 'Ship Category', path: '/masters/ship-group/ship-category', hasChildren: false },
          { id: 6, label: 'Departments', path: '/masters/ship-group/departments', hasChildren: false },
          { id: 7, label: 'Section', path: '/masters/ship-group/section', hasChildren: false },
          { id: 8, label: 'Group', path: '/masters/ship-group/group', hasChildren: false },
          { id: 9, label: 'Class', path: '/masters/ship-group/class', hasChildren: false },
        ],
      },
      {
        id: 10,
        label: 'Equipment',
        path: '/masters/ship-group/ship-master',
        hasChildren: true,
        children: [
          { id: 11, label: 'Equipments', path: '/masters/equipment-group/equipments', hasChildren: false },
          { id: 12, label: 'Equipment specification', path: '/masters/equipment-group/equipment-specification', hasChildren: false },
          { id: 13, label: 'Equipment Type', path: '/masters/equipment-group/equipment-type', hasChildren: false },
          { id: 14, label: 'Generic', path: '/masters/equipment-group/generic', hasChildren: false },
          { id: 15, label: 'Supplier', path: '/masters/equipment-group/supplier', hasChildren: false },
        ],
      },
      {
        id: 16,
        label: 'Unit',
        path: '/masters/ship-group/ship-master',
        hasChildren: true,
        children: [
          { id: 17, label: 'Commands', path: '/masters/unit-group/commands', hasChildren: false },
          { id: 18, label: 'Units', path: '/masters/unit-group/units', hasChildren: false },
          { id: 19, label: 'Ops Authority', path: '/masters/unit-group/ops-authority', hasChildren: false },
        ],
      },
      { id: 20, label: 'Propulsion', path: '/masters/propulsion', hasChildren: false },
      { id: 21, label: 'Country', path: '/masters/country', hasChildren: false },
      { id: 22, label: 'Establishment', path: '/masters/establishment', hasChildren: false },
      { id: 23, label: 'Manufacturer', path: '/masters/manufacturer', hasChildren: false },
    ],
  },
  {
    id: 24,
    icon: 'fa-solid fa-ship',
    label: 'SFD',
    path: '/sfd',
    hasChildren: true,
    children: [
      { id: 25, label: 'Dashboard', path: '/sfd/sfd-dashboard', hasChildren: false },
      {
        id: 26,
        label: 'Master',
        path: '/sfd/sfd-masters/section',
        hasChildren: true,
        children: [
          { id: 27, label: 'Section', path: '/sfd/sfd-masters/section', hasChildren: false },
          { id: 28, label: 'Group', path: '/sfd/sfd-masters/group', hasChildren: false },
          { id: 29, label: 'Country', path: '/sfd/sfd-masters/country', hasChildren: false },
          { id: 30, label: 'Class', path: '/sfd/sfd-masters/class', hasChildren: false },
          { id: 31, label: 'Ship Master', path: '/sfd/sfd-masters/ship-master', hasChildren: false },
          { id: 32, label: 'Supplier', path: '/sfd/sfd-masters/supplier', hasChildren: false },
          { id: 33, label: 'OPS Authority', path: '/sfd/sfd-masters/ops-authority', hasChildren: false },
          { id: 34, label: 'Generic', path: '/sfd/sfd-masters/generic', hasChildren: false },
          { id: 35, label: 'Equipments', path: '/sfd/sfd-masters/equipments', hasChildren: false },
          { id: 36, label: 'Establishment', path: '/sfd/sfd-masters/establishment', hasChildren: false },
          { id: 37, label: 'Propulsion', path: '/sfd/sfd-masters/propulsion', hasChildren: false },
          { id: 38, label: 'Manufacturer', path: '/sfd/sfd-masters/manufacturer', hasChildren: false },
        ],
      },
      {
        id: 39,
        label: 'Transactions',
        path: '/sfd/sfd-sfd-transactions',
        hasChildren: true,
        children: [
          { id: 40, label: 'Attach SFD By Reference', path: '/sfd/sfd-transactions/attach-sfd-by-reference', hasChildren: false },
          { id: 41, label: 'SFD List', path: '/sfd/sfd-transactions/sfd-list', hasChildren: false },
          { id: 42, label: 'Equipment Ship Details', path: '/sfd/sfd-transactions/equipment-ship-details', hasChildren: false },
          { id: 43, label: 'Ship Equipment Document Details', path: '/sfd/sfd-transactions/ship-equipment-doc-details', hasChildren: false },
          { id: 44, label: 'SFD Change Request (Add)', path: '/sfd/sfd-transactions/sfd-change-request', hasChildren: false },
          // { id: 45, label: 'SFD Approve/Removal/change', path: '/sfd/sfd-transactions/sfd-approve-removal-change-request', hasChildren: false },
          { id: 46, label: 'Equipment Hierarchy', path: '/sfd/sfd-transactions/equipment-hierarchy', hasChildren: false },
          { id: 47, label: 'Eqpt Nomenclature, Location On Board', path: '/sfd/sfd-transactions/eqpt-nomenclature-location', hasChildren: false },
        ],
      },
      {
        id: 48,
        label: 'Reports',
        path: '/sfd/sfd-reports',
        hasChildren: true,
        children: [
          { id: 49, label: 'Platform Equipment Fit', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 50, label: 'Equipment Distribution Across Ship', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 51, label: 'SHIP - SFD', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 52, label: 'SFD Link For ILMS', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 53, label: 'Supplier/Manufacturer - Address', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 54, label: 'Equipment - Ship', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 55, label: 'GROUP CODE-EQPT - Ship Details', path: '/sfd/sfd-reports', hasChildren: false },
          { id: 56, label: 'Equipment Details Across Navy Documents AVL In CMMS Ship Wise', path: '/sfd/sfd-reports', hasChildren: false },
        ],
      },
    ],
  },
  {
    id: 57,
    icon: 'fa-solid fa-ship',
    label: 'SRAR',
    path: '/srar',
    hasChildren: true,
    children: [
      { id: 58, label: 'Dashboard', path: '/srar/srar-dashboard', hasChildren: false },
      {
        id: 59,
        label: 'Master',
        path: '/srar',
        hasChildren: true,
        children: [
          { id: 60, label: 'Ship-State', path: '/srar/sarar-master/sarar/master-ship-state', hasChildren: false },
          { id: 61, label: 'Ship Location', path: '/srar/sarar-master/sarar/master-ship-location', hasChildren: false },
          { id: 62, label: 'Ship Activity Type', path: '/srar/sarar-master/sarar/master-ship-activity-type', hasChildren: false },
          { id: 63, label: 'Ship Activity Detail', path: '/srar/sarar-master/sarar/master-ship-activity-detail', hasChildren: false },
          { id: 64, label: 'Lubricant', path: '/srar/sarar-master/sarar/master-lubricant', hasChildren: false },
          { id: 65, label: 'Equipment', path: '/srar/sarar-master/sarar/master-equipment', hasChildren: false },
          { id: 66, label: 'Linked Equipment', path: '/srar/sarar-master/sarar/master-linked-equipment', hasChildren: false },
          { id: 67, label: 'FPT CST Form', path: '/srar/sarar-master/sarar/master-fpt-cst-form', hasChildren: false },
        ],
      },
      {
        id: 68,
        label: 'Transactions',
        path: '/srar',
        hasChildren: true,
        children: [
          { id: 69, label: 'Adjustment', path: '/srar/sarar-transaction/sarar/transaction-adjustment', hasChildren: false },
          { id: 70, label: 'Monthly', path: '/srar/sarar-transaction/sarar/transaction-monthly', hasChildren: false },
          { id: 71, label: 'Status', path: '/srar/sarar-transaction/sarar/transaction-status', hasChildren: false },
          // { id: 72, label: 'GraphQL', path: '/srar/sarar-transaction/sarar/transaction-graphql', hasChildren: false },
        ],
      },
      {
        id: 73,
        label: 'Reports',
        path: '/srar',
        hasChildren: true,
        children: [
          {  id: 'equipment-running-hours', label: 'Equipment Running Hours', path: '/srar/srar-reports', hasChildren: false },
          { id: 'boiler-running-hour-and-inspection-detail', label: 'Boiler-Running Hour and Inspection Details', path: '/srar/srar-reports', hasChildren: false },
          { id: 3, label: 'Consumption of Lubricant', path: '/srar/srar-reports', hasChildren: false },
          { id: "hours-underway", label: 'Hours Underway/Distance Run', path: '/srar/srar-reports', hasChildren: false },
          { id: 5, label: 'Cumalative Ship Activity-At Sea / Harbour', path: '/srar/srar-reports', hasChildren: false },
          { id: 6, label: 'Ship Activity Details', path: '/srar/srar-reports', hasChildren: false },
          { id: 7, label: 'EQPT RH Extension', path: '/srar/srar-reports', hasChildren: false },
          { id: 8, label: 'Overall Activity - In Platform', path: '/srar/srar-reports', hasChildren: false },
          { id: 9, label: 'Fuel Consumption - Month Wise', path: '/srar/srar-reports', hasChildren: false },
          { id: 10, label: 'Fuel Consumtion - Propulsion Wise', path: '/srar/srar-reports', hasChildren: false },
          { id: 11, label: 'H2S Sensor Status', path: '/srar/srar-reports', hasChildren: false },
          { id: 12, label: 'Yearly Cumalative Ship Activity Report', path: '/srar/srar-reports', hasChildren: false },
          { id: 13, label: 'Monthly Cumalative Ship Activity Report', path: '/srar/srar-reports', hasChildren: false },
          { id: 14, label: 'SRAR GTG Utilisation', path: '/srar/srar-reports', hasChildren: false },
          { id: 15, label: 'SRAR Average Speed Annual Report', path: '/srar/srar-reports', hasChildren: false },
          { id: 16, label: 'FPTCST Report', path: '/srar/srar-reports', hasChildren: false },
        ],
      },
    ],
  },
  {
    id: 90,
    icon: 'fa-solid fa-cog',
    label: 'Setup',
    path: '/setup',
    hasChildren: false,
  },
];


//   menuItems: MenuItem[] = [
//   {
//     icon: 'fa-solid fa-chart-line',
//     label: 'Dashboard',
//     path: '/dashboard',
//     hasChildren: false,
//   },
//   {
//     icon: 'fa-solid fa-database',
//     label: 'Masters',
//     hasChildren: true,
//     children: [
//       {
//         label: 'Ship Group',
//         path: '/masters/ship-group',
//         hasChildren: true,
//         children: [
//           {
//             label: 'Ship Master',
//             path: '/masters/ship-group/ship-master',
//             hasChildren: false
//           },
//           {
//             label: 'Fleet Master',
//             path: '/masters/ship-group/fleet-master',
//             hasChildren: false
//           }
//         ]
//       },
//       {
//         label: 'User Master',
//         path: '/masters/user-master',
//         hasChildren: false
//       }
//     ]
//   },
//   {
//     icon: 'fa-solid fa-ship',
//     label: 'SFD',
//     path: '/sfd',
//     hasChildren: false,
//   },
//   // {
//   //   icon: 'fa-solid fa-calendar',
//   //   label: 'Maintop',
//   //   path: '/maintop',
//   //   hasChildren: false,
//   // },
//   // {
//   //   icon: 'fa-solid fa-anchor',
//   //   label: 'DART',
//   //   path: '/dart',
//   //   hasChildren: false,
//   // },
//   {
//     icon: 'fa-solid fa-ship',
//     label: 'SRAR',
//     path: '/srar',
//     hasChildren: false,
//   }
// ];


  ngOnInit() {
    console.log(this.getActiveRouteSegments());
  }
  


  getActiveRouteSegments(): string[] {
    const currentUrl = this.router.url;
    // Remove leading slash and split by slash
    const segments = currentUrl.replace(/^\//, '').split('/').filter(segment => segment.length > 0);
    console.log('Current URL segments:', segments);
    return segments;
  }

  isActive(path: string): boolean {
    const currentUrl = this.router.url;
    return currentUrl === path || currentUrl.startsWith(path + '/');
  }
  toggleSidebarr() {
    this.expanded = !this.expanded;
    if (!this.expanded) {
      this.openSubMenus = {};
    }
    console.log('toggleSidebar called, expanded:', this.expanded);
    // Emit to parent to sync the state
    this.collapseSidebar.emit();
  }


  
  navigateTo(path: string) {
    // this.setActiveItem(path);
    this.activeItem = path;
    console.log('navigateTo called with path:', path);
    this.router.navigate([path]);
    // Auto-collapse sidebar when navigating
    console.log('Emitting collapseSidebar from navigateTo');
    this.collapseSidebar.emit();
  }

  logOut() {
    localStorage.clear();
    // window.location.href = '/login';
    this.router.navigate(['/home']);

  }

  // getCurrentRoute(): string {
  //   return this.router.url;
  // }

  // buildRouteFromSegments(segments: string[]): string {
  //   return '/' + segments.join('/');
  // }
  toggleSubmenu(item: MenuItem) {
  this.openSubMenus[item.label] = !this.openSubMenus[item.label];
}
  toggleMenuu(item: MenuItem): void {
    if (item.hasChildren) {
      item.expanded = !item.expanded;
    }
  }

   toggleSidebar(): void {
    this.expanded = !this.expanded;
  }

  toggleMenu(item: MenuItem): void {
    if (item.hasChildren) {
      item.expanded = !item.expanded;
    }
  }

  setObject(value: any): void {
    this.apiService.setReportName(value);
  }


}