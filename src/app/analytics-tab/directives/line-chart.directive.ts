import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoggerService } from 'src/app/services/logger.service';
import { UtilityService } from '../../services/utility.service';

@Directive({
  selector: 'canvas[appLineChart]',
  standalone: true
})
export class LineChartDirective implements AfterViewInit, OnInit {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  @Output() legendItemClick = new EventEmitter<{ label: string, display: boolean }>();

  constructor(private logger: LoggerService,private utility: UtilityService,
    private elementRef: ElementRef<HTMLCanvasElement>) {
  }
  ngOnInit(): void {
    this.logger.trackEventCalls(LineChartDirective.name, "ngOnInit");

    this.config = <ChartConfiguration>{
      type: 'line',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          label: '',
          fill: false,
          stepped: true,
          tension: 0.1,
          borderColor: this.utility.getRandomColor(),
        }]
      },
      options: {
        responsive: false,
        layout: {
          autoPadding: true,
          padding: {
            left: 10,
            top: 30,
            bottom: 30,
            right: 30
          },
        },
        plugins: {
          legend: {
            display:false,
          },
          tooltip: {
            boxHeight: 8,
            boxWidth: 8,
            boxPadding: 5,
            usePointStyle: true,
            borderColor: '#2a9d8f',
            backgroundColor: '#2a9d8f'
          },
        }
      },
    };

  }

  ngAfterViewInit() {
    this.logger.trackEventCalls(LineChartDirective.name, "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
