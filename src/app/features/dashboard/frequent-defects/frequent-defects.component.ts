import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-frequent-defects',
  standalone:false,
  templateUrl: './frequent-defects.component.html',
  styleUrls: ['./frequent-defects.component.css']
})
export class FrequentDefectsComponent implements OnChanges {
  @Input() chartData: any;

  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData']) {
      this.setupChartOptions();
    }
  }

  setupChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        title: {
          display: true,
          text: 'Top Frequent Defects'
        }
      }
    };
  }
}
