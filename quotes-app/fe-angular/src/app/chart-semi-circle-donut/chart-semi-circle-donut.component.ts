import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-semi-circle-donut',
  templateUrl: './chart-semi-circle-donut.component.html',
  styleUrls: ['./chart-semi-circle-donut.component.css'],
})
export class ChartSemiCircleDonutComponent implements OnInit {
  data: any = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      plotBackgroundColor: '', //Set backgrounf color
      plotBorderWidth: 0,
      plotShadow: false,
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Author likes',
      align: 'center',
      verticalAlign: 'middle',
      y: 60,
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          distance: -50,
          style: {
            fontWeight: 'bold',
            color: 'white',
          },
        },
        startAngle: -90,
        endAngle: 90,
        center: ['50%', '75%'],
        size: '110%',
      },
    },
    series: [
      {
        type: 'pie',
        name: 'Likes',
        innerSize: '50%',
        data: [
          ['Brock Lesnar', 45.9],
          ['Nelson Mandela', 13.29],
          ['Will Smith', 15],
          ['Henry Ford', 9.78],
          ['Domnic Torreto', 7.42],
          {
            name: 'Other',
            y: 7.61,
            dataLabels: {
              enabled: true,
            },
          },
        ],
      },
    ],
  };

  constructor() {}

  ngOnInit(): void {}
}
