import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { DashboardService, DashboardStats } from '../../services/dashboard.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    BaseChartDirective,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  stats: DashboardStats | null | undefined = null;
  loading = true;

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  // Doughnut Chart
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      }
    }
  };
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: ['#4caf50', '#ff9800', '#f44336'] }
    ]
  };
  public doughnutChartType: ChartType = 'doughnut';

  // Bar Chart
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {},
      y: {
        min: 0,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: true,
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Asistencias', backgroundColor: '#3f51b5' }
    ]
  };
  public barChartType: ChartType = 'bar';

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // Default to today
    const today = new Date();
    this.range.setValue({ start: today, end: today });
    this.loadStats();

    // Subscribe to value changes
    this.range.valueChanges.subscribe(val => {
      if (val.start && val.end) {
        this.loadStats();
      }
    });
  }

  loadStats() {
    this.loading = true;
    const start = this.range.value.start ? this.formatDate(this.range.value.start) : undefined;
    const end = this.range.value.end ? this.formatDate(this.range.value.end) : undefined;

    this.dashboardService.getStats(start, end).subscribe({
      next: (response) => {
        if (response.success) {
          this.stats = response.data;
          this.updateCharts();
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats', err);
        this.loading = false;
      }
    });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateCharts() {
    if (!this.stats) return;

    // Update Doughnut Chart
    const estadoData = this.stats.asistenciaPorEstado;
    const labels = ["A Tiempo", "Tardanzas", "Ausencias"];
    const data = [
      estadoData["A Tiempo"] || 0,
      estadoData["Tardanzas"] || 0,
      estadoData["Ausencias"] || 0
    ];

    this.doughnutChartData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'], // Green, Orange, Red
        hoverBackgroundColor: ['#66bb6a', '#ffb74d', '#ef5350']
      }]
    };

    // Update Bar Chart
    const trendData = this.stats.asistenciaPorDia;
    const trendLabels = Object.keys(trendData);
    const trendValues = Object.values(trendData);

    this.barChartData = {
      labels: trendLabels,
      datasets: [
        { data: trendValues, label: 'Asistencias', backgroundColor: '#3f51b5', hoverBackgroundColor: '#5c6bc0' }
      ]
    };
  }
}
