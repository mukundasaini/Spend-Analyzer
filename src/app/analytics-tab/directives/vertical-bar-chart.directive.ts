import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';
import { UtilityService } from 'src/app/services/utility.service';

@Directive({
  selector: 'canvas[appVerticalBarChart]',
  standalone: true
})
export class VerticalBarChartDirective implements AfterViewInit, OnInit {
  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];

  constructor(private logger: LoggerService, private utility: UtilityService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }

  ngOnInit(): void {
    this.logger.trackEventCalls(VerticalBarChartDirective.name, "ngOnInit");

    this.config = <ChartConfiguration>{
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          borderColor: this.utility.getRandomColor(),
          borderWidth: 2,
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
              color: this.utility.getRandomColor(),
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
            borderColor: this.utility.getRandomColor(),
            backgroundColor: this.utility.getRandomColor()
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
    this.logger.trackEventCalls(VerticalBarChartDirective.name, "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
