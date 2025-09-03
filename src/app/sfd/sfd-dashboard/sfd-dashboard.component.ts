import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-sfd-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    NgChartsModule,
    CardModule,
    TableModule
  ],
  templateUrl: './sfd-dashboard.component.html',
  styleUrl: './sfd-dashboard.component.css' 
})
export class SfdDashboardComponent implements OnInit {

  // --- KPI Data ---
  totalShips: number = 254;
  activeOperationalShips: number = 187;
  averageManningLevel: number = 98; // As a percentage
  topDeployedShipClass: string = ' Destroyer';

  // --- Chart Data & Options ---

  // 1. Fleet Composition by Ship Class (Polar Area Chart)
  public fleetCompositionChartData: ChartConfiguration['data'] = {
    labels: ['Destroyers', 'Frigates', 'Submarines', 'Aircraft Carriers', 'Amphibious Assault Ships'],
    datasets: [{
      data: [65, 45, 30, 11, 25],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(153, 102, 255, 0.6)'
      ],
      hoverBackgroundColor: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderWidth: 1
    }]
  };
  public fleetCompositionChartType: ChartType = 'polarArea';
  public fleetCompositionChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  // 2. Monthly Maintenance Trend (Line Chart)
  public monthlyMaintenanceChartData: ChartConfiguration['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [150, 180, 165, 210, 230, 200],
        label: 'Maintenance Tasks Completed',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        tension: 0.4,
        fill: true
      },
      {
        data: [140, 170, 150, 190, 210, 190],
        label: 'Planned Tasks',
        borderColor: '#FFC107',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };
  public monthlyMaintenanceChartType: ChartType = 'line';
  public monthlyMaintenanceChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { title: { display: true, text: 'Number of Tasks' }, beginAtZero: true }
    },
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  // 3. Equipment Readiness by Subsystem (Bar Chart)
  public equipmentReadinessChartData: ChartConfiguration['data'] = {
    labels: ['Propulsion', 'Weapons', 'Navigation', 'Radar', 'Communications'],
    datasets: [{
      data: [95, 85, 99, 92, 98],
      label: 'Readiness (%)',
      backgroundColor: ['#66BB6A', '#FFA726', '#10B981', '#EF5350', '#7E57C2'],
      borderColor: '#333'
    }]
  };
  public equipmentReadinessChartType: ChartType = 'bar';
  public equipmentReadinessChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y', // Horizontal bars
    scales: {
      x: { title: { display: true, text: 'Readiness (%)' }, beginAtZero: true },
      y: { title: { display: true, text: 'Subsystem' } }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // --- Ship Data Table ---
  ships: any[] = [];
  shipTableColumns: any[] = [
    { field: 'hullNumber', header: 'Hull Number' },
    { field: 'shipName', header: 'Ship Name' },
    { field: 'class', header: 'Class' },
    { field: 'status', header: 'Operational Status' }
  ];

  constructor() { }

  ngOnInit(): void {
    // Dummy data for the table
    this.ships = [
      { hullNumber: 'DDG-51', shipName: 'USS Arleigh Burke', class: 'Arleigh Burke-class Destroyer', status: 'Deployed' },
      { hullNumber: 'FFG-62', shipName: 'USS Constellation', class: 'Constellation-class Frigate', status: 'In Port' },
      { hullNumber: 'SSN-774', shipName: 'USS Virginia', class: 'Virginia-class Submarine', status: 'Underway' },
      { hullNumber: 'CVN-78', shipName: 'USS Gerald R. Ford', class: 'Gerald R. Ford-class Aircraft Carrier', status: 'In Port' },
      { hullNumber: 'LHA-8', shipName: 'USS Bougainville', class: 'America-class Amphibious Assault Ship', status: 'Deployed' },
      { hullNumber: 'DDG-1000', shipName: 'USS Zumwalt', class: 'Zumwalt-class Destroyer', status: 'Underway' },
      { hullNumber: 'SSN-771', shipName: 'USS Columbia', class: 'Virginia-class Submarine', status: 'In Port' }
    ];
  }

}