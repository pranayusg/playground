import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart-basic-column',
  templateUrl: './chart-basic-column.component.html',
  styleUrls: ['./chart-basic-column.component.css'],
})
export class ChartBasicColumnComponent implements OnInit {
  authors: any = [];
  likes: any = [];
  dislikes: any = [];

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false,
    },
    title: {
      text: 'Author wise likes & dislikes',
    },
    xAxis: {
      categories: this.authors,
      crosshair: true,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Counts',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat:
        '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },

    series: [
      {
        name: 'Likes',
        type: 'column',
        data: this.likes,
      },
      {
        name: 'Dislikes',
        type: 'column',
        data: this.dislikes,
      },
    ],
  };

  getData() {
    return [
      {
        author: 'Domnic Torreto',
        likes: 120,
        dislikes: 10,
      },
      {
        author: 'Henry Ford',
        likes: 80,
        dislikes: 30,
      },
      {
        author: 'Jim Carrey',
        likes: 100,
        dislikes: 60,
      },
      {
        author: 'Nelson Mandela',
        likes: 70,
        dislikes: 10,
      },
      {
        author: 'Brock Lesnar',
        likes: 140,
        dislikes: 5,
      },
      {
        author: 'Arnold Schwarzenegger',
        likes: 60,
        dislikes: 40,
      },

      {
        author: 'Sir Norman Wisdom',
        likes: 100,
        dislikes: 120,
      },
      {
        author: 'Will Smith',
        likes: 115,
        dislikes: 30,
      },
      {
        author: 'John F. Kennedy',
        likes: 80,
        dislikes: 40,
      },
      {
        author: 'Friedrich Nietzsche',
        likes: 60,
        dislikes: 70,
      },
      {
        author: 'John D. Rockefeller',
        likes: 130,
        dislikes: 50,
      },
    ];
  }
  constructor() {}

  ngOnInit(): void {
    this.setData();
  }

  setData() {
    this.getData().forEach((element) => {
      this.authors.push(element.author);
      this.likes.push(element.likes);
      this.dislikes.push(element.dislikes);
    });
  }
}
