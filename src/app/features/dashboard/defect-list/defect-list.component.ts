// src/app/features/dashboard/defect-list/defect-list.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of } from 'rxjs'; // Keep 'of' for error handling
import { catchError, tap, finalize } from 'rxjs/operators'; // Keep for error handling
import { ChartData, DefectListService } from '../../../shared/services/defect/defect-list.service';

@Component({
  selector: 'app-defect-list',
  standalone: false,
  templateUrl: './defect-list.component.html',
  styleUrls: ['./defect-list.component.css']
})
export class DefectListComponent implements OnInit, OnChanges {
  // Inputs will now only *receive* values, not trigger fetches
  @Input() command: number | null = null;
  @Input() ship: number | null = null;
  @Input() dept: number | null = null;
  // @Input() dateRange: Date[] | undefined; // Removed as per your request

  chartData: ChartData | undefined;
  details: any[] = [];
  dialogVisible = false;

  loading$: Observable<boolean>;

  constructor(private defectListService: DefectListService) { // Injected DefectListService
    this.loading$ = this.defectListService.loading$;
  }

  ngOnInit(): void {
    // Important: Do NOT call fetchData() here, as it will be called by DashboardComponent
    // only when the filters are explicitly applied.
    // However, for the very initial load, DashboardComponent calls applyFilters() in ngOnInit,
    // which then calls this fetchData().
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Important: Do NOT trigger fetchData() here.
    // The `fetchData()` method will be called explicitly by the parent.
    // This `ngOnChanges` is just to observe when inputs update, but not to fetch data immediately.
    // If you need to react to input changes for *other* local logic (not data fetching), do it here.
  }

  /**
   * This method is explicitly called by the parent DashboardComponent
   * when the "Apply Filters" button is clicked or on initial load.
   */
  fetchData(): void {
    console.log('DefectListComponent: Fetching data with filters:', {
      command: this.command,
      ship: this.ship,
      dept: this.dept
    });

    this.chartData = undefined; // Clear previous data while loading

    this.defectListService.getDefectCounts(
      this.command !== null ? this.command.toString() : null,
      this.dept !== null ? this.dept.toString() : null,
      this.ship !== null ? this.ship.toString() : null
      // Removed dateRange
    ).pipe(
      tap(data => {
        console.log('DefectListComponent: Fetched chart data:', data);
      }),
      catchError((err) => {
        console.error('DefectListComponent: Error fetching defect data:', err);
        return of({ labels: [], datasets: [] }); // Return empty data on error
      }),
      finalize(() => {
        // Any final actions after fetch completes (success or error)
      })
    ).subscribe(data => {
      this.chartData = data;
    });
  }

  onChartClick(event: any): void {
    this.dialogVisible = true;
    this.details = [
      { ship: this.ship || 'N/A', status: 'Open', dept: 'Engineering' },
      { ship: this.ship || 'N/A', status: 'Closed', dept: 'Electrical' }
    ];
  }
}