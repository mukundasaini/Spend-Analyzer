import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';

@Directive({
  selector: 'canvas[appCardBarChartPage]',
  standalone: true
})
export class CardBarChartPageDirective implements AfterViewInit, OnInit {
  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];

  constructor(private logger: LoggerService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(CardBarChartPageDirective.name, "ngOnInit");

    this.config = <ChartConfiguration>{
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          label: 'Rs',
        }]
      },
      options: {
        indexAxis: 'x',
        scales: {
        },
        responsive: false,
        layout: {
          autoPadding: true,
          padding: {
            left: 10,
            top: 10,
            bottom: 10,
            right: 20
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 5,
              boxWidth: 8,
              boxHeight: 8,
              color: '#2a9d8f',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            boxHeight: 8,
            boxWidth: 8,
            boxPadding: 5,
            usePointStyle: true,
            borderColor: '#2a9d8f',
            backgroundColor: '#2a9d8f'
          },
          datalabels: {
            display: false
          },
        }
      },
      plugins: [ChartDataLabels]
    };

  }

  ngAfterViewInit() {
    this.logger.trackEventCalls(CardBarChartPageDirective.name, "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
