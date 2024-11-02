import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Directive({
  selector: 'canvas[appCardPieChartPage]',
  standalone: true
})
export class CardPieChartPageDirective implements AfterViewInit, OnInit {

  chartData!: ChartData;
  chart!: Chart;
  config!: ChartConfiguration;
  logPrefix: string = 'CARDPIE_PAGE::: ';

  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() backgroundColor: string[] = [];
  constructor(private elementRef: ElementRef<HTMLCanvasElement>) {
    console.log(this.logPrefix + "constructor");
  }

  ngOnInit(): void {
    console.log(this.logPrefix + "ngOnInit");

    this.config = <ChartConfiguration>{
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          label: 'Rs',
          hoverOffset: 20,
          borderColor: "#f6f8fc"
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
              color: '#2a9d8f',
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
    console.log(this.logPrefix + "ngAfterViewInit");
    this.chart = new Chart(this.elementRef.nativeElement, this.config);
  }

}
