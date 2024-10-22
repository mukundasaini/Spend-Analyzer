import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Directive({
  selector: 'canvas[appCatBarChartPage]',
  standalone: true
})
export class CatBarChartPageDirective implements AfterViewInit, OnInit {
  logPrefix: string = 'CATPIE_PAGE::: ';

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;
  total: number = 0;

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {
    console.log(this.logPrefix + "constructor");
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");
    this.total = this.data.reduce((sum, item) => sum + item, 0);
    this.config = <ChartConfiguration>{
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          label: 'Rs',
          // hoverOffset: 20,
          // borderColor: "#264653"
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          //   x: {
          //     stacked: true
          //   },
          // y: {
          //   title: {
          //     text: this.labels,
          //     display: true,
          //     color: '#2a9d8f'
          //   },
          //   suggestedMin: 10
          // }
        },
        responsive: true,
        // aspectRatio: 2 / 1,
        layout: {
          autoPadding: false,
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
            // position: "bottom",
            // align: 'start',
            // fullSize: true,
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
            //       formatter: (value, context) => {
            //         let v = (value / this.total) * 100;
            //         return v.toFixed(2) + '%';
            //       },
            //       color: '#fff',
            //       font: {
            //         size: 14,
            //       },
            //       anchor: 'end',
            //       display: 'auto',
            //       align: 'end',
            //       clamp: true,
            //       offset: 6,
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
