import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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

  chartData: any;
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
        backgroundColor: '#42A5F5'
      }]
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

