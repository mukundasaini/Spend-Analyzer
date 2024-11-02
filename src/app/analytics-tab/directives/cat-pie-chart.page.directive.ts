import { AfterViewInit, Directive, ElementRef, Input, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Directive({
  selector: 'canvas[appCatPieChartPage]',
  standalone: true
})
export class CatPieChartPageDirective implements AfterViewInit, OnInit {
  logPrefix: string = 'CATPIE_PAGE::: ';

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
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: this.backgroundColor,
          label: 'Rs',
          hoverOffset: 20,
          borderColor: "#264653"
        }]
      },
      options: {
        responsive: true,
        layout: {
          autoPadding: false,
          padding: {
            left: 20,
            top: 40,
            bottom: 26,
            right: 20
          },
        },
        plugins: {
          legend: {
            position: "bottom",
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
            color: '#fff',
            font: {
              size: 14,
            },
            anchor: 'end',
            display: 'auto',
            align: 'end',
            clamp: true,
            offset: 6,
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
