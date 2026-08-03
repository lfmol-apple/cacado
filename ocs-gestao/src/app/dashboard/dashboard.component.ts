

import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  vendasMesAtual:any = {
    NumVendas:0,
    ValorVendas: 0
  };

  ComprasMesAtual:any = {
    NumCompras:0,
    ValorCompras: 0
  };



  mesAtual = formatDate(new Date(),'MMMM','pt-BR');

  constructor(

    private dashboardService: DashboardService

  ) { }
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      this.dashboardService.getDasboard()
      .subscribe({
        next: res =>{
          console.log(res);
            this.vendasMesAtual = res.VendasMesAtual;
            this.ComprasMesAtual = res.ComprasMesAtual;
            const dataDailySalesChart: any = res.GraficoVendasSemana;
            let maxValue = Math.max(...dataDailySalesChart.series[0]);
            console.log(maxValue);
            const optionsDailySalesChart: any = {
              lineSmooth: Chartist.Interpolation.cardinal({
                  tension: 0
              }),
              low: 0,
              high: maxValue + (Math.round(maxValue*0.1)> 0?Math.round(maxValue*0.1):1), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
              chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
            }
    
            var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
    
            this.startAnimationForLineChart(dailySalesChart);


              /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

          var datawebsiteViewsChart = res.GraficoVendasMes;
          maxValue = Math.max(...datawebsiteViewsChart.series[0]);

          var optionswebsiteViewsChart = {
              axisX: {
                  showGrid: false
              },
              low: 0,
              high: maxValue + (Math.round(maxValue*0.1)> 0?Math.round(maxValue*0.1):1),
              chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
          };
          var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                }
              }
            }]
          ];
          var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

          //start animation for the Emails Subscription Chart
          this.startAnimationForBarChart(websiteViewsChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */


      var dataproducaoDiariaOvos = res.GraficoOvosMes;
      maxValue = Math.max(...dataproducaoDiariaOvos.series[0]);

      var optionsGraficoOvosMes = {
          tooltips:true,
          axisX: {
              showGrid: false
          },
          low: 0,
          high: maxValue + (Math.round(maxValue*0.1)> 0?Math.round(maxValue*0.1):1),
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var GraficoOvosMes = new Chartist.Line('#producaoDiariaOvos', dataproducaoDiariaOvos, optionsGraficoOvosMes, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(GraficoOvosMes);






      const dataCompletedTasksChart: any = res.GraficoComprasSemana
       
      
      maxValue = Math.max(...dataCompletedTasksChart.series[0]);
      const optionsCompletedTasksChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: maxValue + (Math.round(maxValue*0.1)> 0?Math.round(maxValue*0.1):1), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);      


          }
        })





  }

}
