import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';
import { UtilityService } from 'src/app/services/utility.service';

@Directive({
  selector: 'canvas[appPieChart]',
  standalone: true
})
export class PieChartDirective implements AfterViewInit, OnInit {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() inputChartData: ChartData = <ChartData>{};

  constructor(private logger: LoggerService, private utility: UtilityService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(PieChartDirective.name, "ngOnInit");

    this.config = <ChartConfiguration>{
      type: 'pie',
      data: this.inputChartData,
      options: {
        responsive: false,
        layout: {
          autoPadding: true,
          padding: {
            left: 10,
            top: 30,
            bottom: 30,
            right: 10
          },
        },
        plugins: {
          legend: {
            position: "left",
            align: 'start',
            fullSize: true,
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 5,
              boxWidth: 8,
              boxHeight: 8,
              color: '#e9c46a',
              font: {
                size: 12,
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
    this.logger.trackEventCalls(PieChartDirective.name, "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }
}
