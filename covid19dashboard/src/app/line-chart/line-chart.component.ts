import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { DataService } from '../data.service';
import { WeeklyData } from '../models';


@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  dataSinceApril: WeeklyData;

  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Total Deaths' },
    { data: [], label: 'Total Recovered' },
    { data: [], label: 'Total Cases' }
  ];
  public lineChartLabels: Label[] = ["1"];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    { backgroundColor: '#f5c6cb' },
    { backgroundColor: '#bee5eb' },
    { backgroundColor: '#ffeeba' }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];

  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  constructor(private service: DataService) { }

  ngOnInit(): void {
    for (let j = 0; j < 222; j++) {
        this.lineChartLabels[j]=""+j;
    }
    this.getDataSinceApril();

  }

  getDataSinceApril() {
    this.service.getDataApril().subscribe(
      response => {
        this.dataSinceApril = response;
        console.log(this.dataSinceApril);

        this.setData();
      }
    )
  }

  public setData() {
    //for (let i = 0; i < this.lineChartData.length; i++) {
      for (let j = 1; j < 222; j++) {
        this.lineChartData[0].data[j] = this.dataSinceApril[j].TotalDeaths + this.lineChartData[0].data[j-1];
      }

      for (let j = 1; j < 222; j++) {
        this.lineChartData[1].data[j] = this.dataSinceApril[j].TotalRecovered + this.lineChartData[1].data[j-1];
      }

      for (let j = 1; j < 222; j++) {
        this.lineChartData[2].data[j] = this.dataSinceApril[j].TotalConfirmed + this.lineChartData[2].data[j-1];
      }
    //}
    this.chart.update();
  }


  private generateNumber(i: number): number {
  return Math.floor((Math.random() * (i < 2 ? 100 : 1000)) + 1);
}

// events
public chartClicked({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
  console.log(event, active);
}

public hideOne(): void {
  const isHidden = this.chart.isDatasetHidden(1);
  this.chart.hideDataset(1, !isHidden);
}

public pushOne(): void {
  this.lineChartData.forEach((x, i) => {
    const num = this.generateNumber(i);
    const data: number[] = x.data as number[];
    data.push(num);
  });
  this.lineChartLabels.push(`Label ${this.lineChartLabels.length}`);
}

public changeColor(): void {
  this.lineChartColors[2].borderColor = 'green';
  this.lineChartColors[2].backgroundColor = `rgba(0, 255, 0, 0.3)`;
}

public changeLabel(): void {
  this.lineChartLabels[2] = ['1st Line', '2nd Line'];
}

}
