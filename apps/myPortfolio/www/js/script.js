function app(){
  'use strict';

   var exeModal = false;
  $('#loadingModal').modal({ 
    backdrop: 'static',
    keyboard: false
  });  
  $('#loadingModal').on('shown.bs.modal', function (e) { 
    if(exeModal){ 
      exeModal = false;
      $('#loadingModal').modal('toggle'); 
    }
  });  

  $('.modal').on('shown.bs.modal',function(){
    var event;
    if(typeof(Event) === 'function') { //CHROME
          event = new Event('resize');
    }else{ // IE
      event = window.document.createEvent('UIEvents'); 
      event.initUIEvent('resize', true, false, window, 0);  
    }
    window.dispatchEvent(event);  
  });
  
  $('#sec1').addClass('active');
  $('.goBtn').on('click',function(){  
    $.each($('.section'),function(){
      $(this).removeClass('active');
    });
    var sec = $(this).attr('go-to');
    $(sec).addClass('active');
  }); 

  try{
    var ipcRenderer = require('electron').ipcRenderer;    
    ipcRenderer.on('reply1',function(event, arg){
      //console.log(arg);  
      renderData(arg);
      exeModal = true;
      $('#loadingModal').modal('toggle'); 
    }); 
    ipcRenderer.send('request1', true);
  }catch(e){
    console.error(e);  
    exeModal = true;
    $('#loadingModal').modal('toggle'); 
    renderData({
      name: 'testing...', 
      cashValue: 120,
      shareValue: 330 
    }); 
  } 

  function renderData(data){
    $('#tableMov tbody').html(''); 
    var tab = data.movData;
    for(var i in tab){ 
      var tr = '<tr>';
      tr = tr + '<td>'+tab[i].id+'</td>'; 
      tr = tr + '<td class="text-center">'+tab[i].date+'</td>';  
      tr = tr + '<td class="text-left">'+tab[i].cat1+'</td>';
      tr = tr + '<td class="text-left">'+tab[i].cat2+'</td>';
      tr = tr + '<td class="text-left">'+tab[i].desc+'</td>';
      tr = tr + '<td class="text-left">'+(tab[i].commnet===undefined?'-':tab[i].commnet)+'</td>';   
      tr = tr + '<td class="text-right">'+tab[i].value+'</td>';
      if (tab[i].ticker==='EUR'){
        tr = tr + '<td>'+tab[i].ticker+'</td>';
       }else{
        tr = tr + '<td><a href="https://es.finance.yahoo.com/quote/'+tab[i].ticker+'?p='+tab[i].ticker+'" target="_blank">'+tab[i].ticker+'</a></td>';
      }
      tr = tr + '<td class="text-right">'+tab[i].n+'</td>';
      tr = tr + '<td class="text-right"><div class="form-check"><input class="form-check-input filterMov" type="checkbox" value="'+tab[i].id+'" checked></div></td>';      
      tr = tr + '</tr>';
      $('#tableMov tbody').append(tr); 
    } 
 
    function plotDataEvo(){
      var filterIdMov = [];
      $.each($('.filterMov'),function(){
        if($(this).is(':checked')===true){
          filterIdMov.push($(this).val());
        } 
      }); 
      var dataPlot = [];
      for (i in filterIdMov){
        dataPlot.push(data.evoData.filter(function(value, index, array){
          return value.id===filterIdMov[i];
        })[0]);
      } 
      dataPlot = dataPlot.filter(function(value, index, array){
        return value.data.length>0;
      }); 
 
      var temp = [];
      for(i in dataPlot){
        temp = temp.concat(dataPlot[i].data);
      }
      dataPlot = temp;
      
      temp = [];
      for(i in dataPlot){
        temp.push(dataPlot[i][0]);
      }

      temp = temp.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
      });

      var temp1 =[]
      for(i in temp){
        var aux = 0;
        for(ii in dataPlot){
          if(dataPlot[ii][0]==temp[i]){
            aux=aux+dataPlot[ii][1];
          };
        } 
        temp1.push(aux);
      }
      dataPlot = [];
      for(i in temp){
        //TODO: parse to date
        //dataPlot.push([moment(temp[i]).toDate().getTime()/1000, temp1[i]]);
        dataPlot.push([temp[i] , temp1[i]]);
      }
      //console.log([temp[0], temp1[0]]);
      //console.log([moment(temp[0]).valueOf()/1000, temp1[0]]);
      //console.log([moment(temp[0]).toDate().getTime(), temp1[0]]); 

      //.filterMov
      Highcharts.stockChart('chartEvo', { 
        chart: {
          alignTicks: false
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          crosshairs: [true,true],
          valueDecimals: 2,
          split: true 
        },
        xAxis: {                        
          title: {
            text: 'Tiempo'
          }, 
        },
        yAxis: {
          opposite: false,
          title: {
            text: 'Euros (€)'
          }
        },
        rangeSelector: {
          inputEnabled: false,
          labelStyle: {
            display: 'none'
          },
          buttons: [{
            type: 'month',
            count: 1, 
            text: '1m'
          }, {
            type: 'month',
            count: 2 ,
            text: '2m'
          }, {
            type: 'month',
            count: 3 ,
            text: '3m'
          }, {
            type: 'month',
            count: 4 ,
            text: '4m'
          }, {
            type: 'month',
            count: 6,
            text: '6m'
          }, {
            type: 'year',
            count: 1,
            text: '1y '
          }, {
            type: 'year',
            count: 2,
            text: '2y '
          },{
            type: 'all',
            text: 'All'
          }]
        },
        series: [{
          name: 'Mi cartera',
          data: dataPlot,
          tooltip: {
            valueDecimals: 2
          }
        }]
      });
    }

    plotDataEvo();
    $('#btnEvoData').on('click',function(){   
      $('#loadingModal').modal('toggle'); 
      setTimeout(function(){ 
        plotDataEvo(); 
        exeModal = true;
        $('#loadingModal').modal('toggle');
      },1000); 
    }); 
 

    //inflate data in DOM y cal data for the charts
    var $indata = $('.inputdata');
    $($('.inputdata')[0]).html(data.name);
    $($('.inputdata')[1]).html(data.cValue);  
    $($('.inputdata')[2]).html(data.cashValue);  
    $($('.inputdata')[3]).html(data.shareValue);  
    $($('.inputdata')[4]).html(data.gDia+' <b>('+data.gDiaPor+')</b>');
    $($('.inputdata')[4]).addClass(data.gDiaClass);       
    $($('.inputdata')[5]).html(data.gTot+' <b>('+data.gTotPor+')</b>');
    $($('.inputdata')[5]).addClass(data.gTotClass);
    $($('.inputdata')[6]).html(data.nValue);         
    
    $('#tableShares tbody').html(''); 
    tab = data.activeValue;
    for(var i in tab){ 
      var tr = '<tr>';
      tr = tr + '<td><a href="https://es.finance.yahoo.com/quote/'+tab[i].ticker+'?p='+tab[i].ticker+'" target="_blank">'+tab[i].ticker+'</a></td>';
      tr = tr + '<td>'+tab[i].name+'</td>';  
      tr = tr + '<td class="'+tab[i].gTotClass+' text-right">'+tab[i].gTotPor+'</td>';
      tr = tr + '<td class="'+tab[i].gTotClass+' text-right">'+tab[i].gTot+'</td>';
      tr = tr + '<td class="'+tab[i].gDiaClass+' text-right">'+tab[i].gDiaPor+'</td>';
      tr = tr + '<td class="'+tab[i].gDiaClass+' text-right">'+tab[i].gDia+'</td>';  
      var aux = '<div class="dropdown"><button class="btn btn-outline-secondary btn-sm btn-block dropdown-toggle" type="button" id="dropdownBtn'+i+'" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Detalle Mov.</button>';
      aux = aux +'<div class="dropdown-menu" aria-labelledby="dropdownBtn'+i+'">';
      aux = aux +'<div class="dropdown-item"><i class="small">'+tab[i].name+'</i></div>';
      for(var ii in tab[i].mov){
        aux = aux +'<div class="dropdown-item">Fecha: '+tab[i].mov[ii].date+' - Acción: '+tab[i].mov[ii].type+'<br>- Cantidad: '+tab[i].mov[ii].n+'<br>- Importe: '+tab[i].mov[ii].value+'</div>';
      }
      aux = aux+'</div></div>'; 
      tr = tr + '<td class="text-left">'+aux+'</td>';
      tr = tr + '<td class="text-right">'+tab[i].n+'</td>';
      tr = tr + '<td class="text-right">'+tab[i].valueBuyAvg+'</td>';
      tr = tr + '<td class="text-right">'+tab[i].nValue+'</td>'; 
      tr = tr + '</tr>';
      $('#tableShares tbody').append(tr); 
    } 

    $('#tableSharesOld tbody').html('');
    tab = data.oldValue;
    for(var i in tab){ 
      var tr = '<tr>';
      tr = tr + '<td><a href="https://es.finance.yahoo.com/quote/'+tab[i].ticker+'?p='+tab[i].ticker+'" target="_blank">'+tab[i].ticker+'</a></td>';
      tr = tr + '<td>'+tab[i].name+'</td>';   
      tr = tr + '<td class="'+tab[i].gTotClass+' text-right">'+tab[i].gTot+'</td>';  
      var aux = '<ul class="list-group">';        
      for(var ii in tab[i].mov){
        aux = aux +'<li class="list-group-item">Fecha: '+tab[i].mov[ii].date+'<br>- Acción: '+tab[i].mov[ii].type+'<br>- Cantidad: '+tab[i].mov[ii].n+'<br>- Importe: '+tab[i].mov[ii].value+'</li>';
      }
      aux = aux+'</ul>';
      tr = tr + '<td class="text-left">'+aux+'</td>';
      tr = tr + '</tr>';
      $('#tableSharesOld tbody').append(tr); 
    }     
   
    // Build the chart
    Highcharts.chart('chart1',{
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}:{point.y} (<b>{point.percentage:.1f}%</b>)'
      },
      credits: false,
      plotOptions: {
        pie: { 
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'EUR', 
        data: [{
          name: 'Cash',
          y: parseFloat(data.cashValue)
        },{
          name: 'Acciones',
          y: parseFloat(data.shareValue)
        }]
      }]
    }); 
      
    // Build the chart
    var dataPlot = [];
    for (i in data.activeValue){
      dataPlot.push({
        name: data.activeValue[i].name,
        y: Math.round(data.activeValue[i].n*data.activeValue[i].nValue*100)/100
      }); 
    }
    
    Highcharts.chart('chart2',{
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}:{point.y} (<b>{point.percentage:.1f}%</b>)'
      },
      credits: false,
      plotOptions: {
        pie: { 
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'EUR', 
        data: dataPlot
      }]
    });   

    $.each([$('#tableShares'),$('#tableSharesOld'),$('#tableMov')],function(){
      this.DataTable({  
        "bPaginate": false,
        "columnDefs": [
        {
          type: "date-euro",
          targets: "sorting-date",
          searchable: false
        },
        {
          type: "currency",
          targets: "sorting-currency",
          searchable: false
        },
        {
          type: "buttons",
          targets: "sorting-buttons",
          searchable: false,
          orderable: false
        }],
        aaSorting: [],
        language:
        {
          "sProcessing": 'Procesando...',
          "sLengthMenu": 'Mostrar _MENU_ registros',
          "sZeroRecords": 'No se encontraron resultados',
          "sEmptyTable": 'Ningún dato disponible en esta tabla',
          "sInfo": "",
          "sInfoEmpty": 'Mostrando registros del 0 al 0 de un total de 0 registros',
          "sInfoFiltered": '(filtrado de un total de _MAX_ registros)',
          "sInfoPostFix": "",
          "sSearch": "Buscar:",
          "sUrl": "",
          "sInfoThousands": ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate":
          {
            "sFirst": 'Primero',
            "sLast": 'Último',
            "sNext": 'Siguiente',
            "sPrevious": 'Anterior'
          },
          "oAria":
          {
            "sSortAscending": ': Activar para ordenar la columna de manera ascendente',
            "sSortDescending": ': Activar para ordenar la columna de manera descendente'
          },
          "decimal": ".",
          "thousands": "" 
        }
      });
    }); 
  } 
} 
app(); 

 

   

