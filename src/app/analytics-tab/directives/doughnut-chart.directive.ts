import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';
import { UtilityService } from 'src/app/services/utility.service';

@Directive({
  selector: 'canvas[appDoughNutChart]',
  standalone: true
})
export class DoughNutChartDirective implements AfterViewInit, OnInit {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() inputChartData: ChartData = <ChartData>{};
  @Output() legendItemClick = new EventEmitter<{ label: string, display: boolean }>();

  constructor(private logger: LoggerService, private utility: UtilityService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(DoughNutChartDirective.name, "ngOnInit");

    const pieDoughnutLegendClickHandler = Chart.overrides.doughnut.plugins.legend.onClick;

    this.config = <ChartConfiguration>{
      type: 'doughnut',
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
            onClick: (e, legendItem, legend) => {
              pieDoughnutLegendClickHandler.call(legend, e, legendItem, legend);
              this.legendItemClick.emit({ label: legendItem.text, display: legendItem.hidden ?? false });
            },
            position: "left",
            align: 'start',
            fullSize: true,
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 5,
              boxWidth: 8,
              boxHeight: 8,
              color: this.utility.getRandomColor(),
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
    this.logger.trackEventCalls(DoughNutChartDirective.name, "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
