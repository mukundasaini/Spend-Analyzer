import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData, ChartDataset } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Directive({
  selector: 'canvas[appCardBarChartPage]',
  standalone: true
})
export class CardBarChartPageDirective implements AfterViewInit, OnInit {
  logPrefix: string = 'CARD_BAR_PAGE::: ';

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];

  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {
    console.log(this.logPrefix + "constructor");
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");

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
    console.log(this.logPrefix + "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
