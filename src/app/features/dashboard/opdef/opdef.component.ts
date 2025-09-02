import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-opdef',
  standalone:false,
  templateUrl: './opdef.component.html',
  styleUrl: './opdef.component.css'
})
export class OpdefComponent implements OnInit, OnChanges {
  @Input() command: string | null = null;
  @Input() ship: string | null = null;
  @Input() dept: any;
  @Input() dateRange: Date[] | undefined;

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef;

  chartData: any;
  chartOptions: any;
  details: any[] = [];
  dialogVisible = false;

  ngOnInit(): void {
    this.loadChartData(); // load data initially even if inputs are not provided
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['command'] || changes['ship']) {
      this.loadChartData(); // also update data on input changes
    }
  }

  loadChartData(): void {
    // Use fallback/default values if inputs are missing
    const selectedShip = this.ship || 'Default Ship';
    const selectedCommand = this.command || 'Default Command';

    this.chartData = {
      labels: ['Electrical', 'Mechanical', 'Navigation'],
      datasets: [{
        label: `${selectedShip} Defects`,
        data: [12, 5, 8],
        backgroundColor: [
          '#667eea', // Electrical - Solid Purple
          '#f093fb', // Mechanical - Solid Pink
          '#4facfe'  // Navigation - Solid Blue
        ],
        hoverBackgroundColor: [
          '#667eea', // Electrical - Same solid Purple on hover
          '#f093fb', // Mechanical - Same solid Pink on hover
          '#4facfe'  // Navigation - Same solid Blue on hover
        ],
        borderColor: [
          '#5a67d8', // Electrical - Darker Purple border
          '#e53e3e', // Mechanical - Darker Pink border
          '#3182ce'  // Navigation - Darker Blue border
        ],
        hoverBorderColor: [
          '#5a67d8', // Electrical - Same border color on hover
          '#e53e3e', // Mechanical - Same border color on hover
          '#3182ce'  // Navigation - Same border color on hover
        ],
        borderWidth: 2,
        hoverBorderWidth: 2,
        borderRadius: 8, // Rounded edges
        borderSkipped: false
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: true, // Keep original aspect ratio
      aspectRatio: 2, // Maintain chart height
      interaction: {
        intersect: false,
        mode: 'index'
      },
      hover: {
        animationDuration: 0
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0,0,0,0.1)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    };
  }

  onCommandClick(event: any): void {
    const index = event.element.index;
    this.details = [
      { ship: this.ship || 'Default Ship', department: 'Electrical', date: '2025-06-01', dartNo: 'DART-001', desc: 'Battery failure' },
      { ship: this.ship || 'Default Ship', department: 'Electrical', date: '2025-06-05', dartNo: 'DART-002', desc: 'Lighting issue' }
    ];
    this.dialogVisible = true;
  }
}

