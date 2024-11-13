import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';

@Directive({
  selector: 'canvas[appHorizentalBarChart]',
  standalone: true
})
export class HorizentalBarChartDirective implements AfterViewInit, OnInit {
  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;
  total: number = 0;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  constructor(private logger: LoggerService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(HorizentalBarChartDirective.name, "ngOnInit");
   
    this.total = this.data.reduce((sum, item) => sum + item, 0);
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
        indexAxis: 'y',
        scales: {
        },
        responsive: false,
        layout: {
          autoPadding: true,
          padding: {
            left: 10,
            top: 10,
            bottom: 10,
            right: 30
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
            formatter: (value, context) => {
              let total = (context.dataset.data as number[]).reduce((sum, item) => sum + item, 0);
              let v = (value / total) * 100;
              return v.toFixed(2) + '%';
            },
            color: '#298',
            font: {
              size: 12,
            },
            anchor: 'end',
            display: 'auto',
            align: 'end',
            clamp: true,
            offset: 3,
          },
        }
      },
      plugins: [ChartDataLabels]
    };

  }

  ngAfterViewInit() {
    this.logger.trackEventCalls(HorizentalBarChartDirective.name, "ngOnngAfterViewInitInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
