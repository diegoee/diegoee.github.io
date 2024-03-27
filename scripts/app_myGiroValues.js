//funciones auxiliares
function print(msg,opt) {
  if(opt==='error'){
    console.error(msg); 
  }else if(opt==='table'){ 
    console.table(msg);  
  }else{ 
    console.log(msg); 
  }
} 
  
function getGiroCsvData(file){
	var fs = require('fs');
	var cp = require('csv-parse');
	return new Promise(function(resolve){ 
		var csvData=[];
		fs.createReadStream(file).pipe(cp.parse({ 
			delimiter: ",", 
			from_line: 1 
		})).on('data', function (row) {
			csvData.push(row);
		}).on('error', function (error) {
			print(error.message,'error');
		}).on('end', function () {
			//print('CSV loaded; len='+csvData.length+'');
			resolve(csvData); 
		}); 
	});
} 

function readJson(file){
	var fs = require('fs'); 
	return new Promise(function(resolve){ 
    fs.readFile(file, 'utf8', function(err,data){
      if(err){
        print('Error al leer el archivo: '+err.message,true);
        resolve(); 
      } 
      try { 
        var jsonData = JSON.parse(data); 
        //print('JSON loaded; len='+jsonData.length);
        resolve(jsonData);
      } catch (error) {
        print('Error al analizar el contenido JSON: '+error,'error');
      }
    }); 
  });
} 

function deleteFile(fileName){ 
  var fs = require('fs'); 
  return new Promise(function(resolve){ 
    fs.unlink(fileName, function(err){
      if (err) {
        print(err.message,'error');
        resolve(); 
      } else {
        //print('Fichero eliminado: '+fileName);
        resolve();
      }
    }); 
  });  
}

function readHtml(fileName){
	var fs = require('fs'); 
	return new Promise(function(resolve){ 
    fs.readFile(fileName, 'utf8',function(err, data){
      if (err) {
        print(err.message,'error');
        resolve();
      } else { 
        //print('Contenido del archivo HTML: '+fileName);
        resolve(data);
      }
    });
  });
}

async function getStockValueYahoo(ticket, N, dStart, dEnd, descTicket) {
  var axios = require('axios');
  var moment = require('moment');  
  var response = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/'+ticket+'?period1='+moment(dStart).unix()+'&period2='+moment(dEnd).unix()+'&interval=1d');
  var res ={
    prices: response.data.chart.result[0].indicators.quote[0].close,
    dates: response.data.chart.result[0].timestamp.map(function(timestamp){
      return moment.unix(timestamp).format('YYYY-MM-DD')
    })
  } 
  return res;
}

function filterBy(data,head,eHead,filter,eFilter){
  //getPosByHeadTitle
  var pos=0;
  for(var i=0; i<head.length; i++){
    if(head[i]===eHead){
      pos=i;
      break;
    }
  }
  //filter array
  if(filter==='!='){
    data=data.filter(function(e){
      return e[pos]!==eFilter;
    });
  }
  if(filter==='=='){
    data=data.filter(function(e){
      return e[pos]===eFilter;
    });
  }
  if(filter==='contain'){
    data=data.filter(function(e){
      return e[pos].indexOf(eFilter)>0;
    });
  }
  if(filter==='not contain'){
    data=data.filter(function(e){
      return !(e[pos].indexOf(eFilter)>0);
    });
  }
  if(filter==='!=(number)'){
    data=data.filter(function(e){
      return parseFloat(e[pos])!==parseFloat(eFilter);
    });
  }
  return data;
} 

async function createHtml(jsonData){
  var cheerio = require('cheerio'); 
  var htmlContent = await readHtml('app_myGiroValues_template.html'); 
  var fileRes ='app_myGiroValues_result.html'; 

  await deleteFile(fileRes); 

  var $ = cheerio.load(htmlContent);
  $('#dataScript').html(' ');  
  var code =' var data = '+JSON.stringify(jsonData)+';' 
  $('#dataScript').html(code); 
  htmlContent = $.html(); 

  var fs = require('fs');  
  return new Promise(function(resolve){ 
    fs.writeFile(fileRes, htmlContent, function(err){
      if (err) {
        print(err.message,'error');
        resolve();
      } else { 
        resolve();
      }
    }); 
  });

} 

function distinctArrayObject(array, propertyName) {
  return array.filter(function(obj, index, self){
    return index === self.findIndex(function(t){
        return t[propertyName] === obj[propertyName]
      }); 
  }); 
}

function convertirADias(dias){
  var moment = require('moment'); 
  const duracion = moment.duration(dias, 'days');
  const years = Math.floor(duracion.asYears());
  const months = Math.floor(duracion.asMonths()) % 12;
  const days = Math.floor(duracion.asDays()) % 30; 
  return years+'año(s) '+months+'mes(es) '+days+'día(s)';
}

//----- main -----
async function main(){ 
  console.time('Exe script'); 
	print('*** START: AppGiroValues ***');  
  var moment = require('moment'); 
  var path = require('path');
  print('Root script:'); 
  print(' '+path.resolve()); 
   
  print('Data Load');
	var data = await getGiroCsvData('degiro_count.csv');   
  var head = data[0]; 
  data.shift(); 	
  
  print('Filter data');
  data = filterBy(data,head,'Fecha','!=',''); 
  data = filterBy(data,head,'ISIN','!=','NLFLATEXACNT'); 
  data = filterBy(data,head,'Descripción','not contain','Cuenta'); 
 
  head = ['Fecha', 'ID_Producto', 'Desc', 'CastflowEUR'];
  var aux = [];
  data.forEach(function(e){ 
    aux.push([e[0],e[3],e[5],e[8]+' €']);
  });
  data = aux;  
  
  data.forEach(function(e){  
    e[0] = moment(moment(e[0],'DD-MM-YYYY').toDate()).format('YYYY-MM-DD');
    if(e[2]==='flatex Deposit'){
      e[1]='INPUT';
    }
    if(e[2]==='Ingreso'){
      e[1]='INPUT';
    }
    if(e[2].indexOf('Tax')!==-1){
      e[1]='TAX';
    }
    if(e[2].indexOf('Costes')!==-1){
      e[1]='TAX';
    }
    if(e[2].indexOf('Compra')!==-1){
      e[1]='BUY';
    }
    if(e[2].indexOf('Venta')!==-1){
      e[1]='SELL';
    }
    if(e[2].indexOf('reembolso')!==-1){
      e[1]='INPUT FREE';
    } 
    if(e[2]==='Dividendo'){
      e[2]=e[2]+': '+e[1] ;
    } 
    if(e[2].indexOf('Dividendo')!==-1){
      e[1]='DIV';
    } 
    if(e[2]==='Retención del dividendo'){
      e[2]=e[2]+': '+e[1] ;
    } 
    if(e[2].indexOf('Retención del dividendo')!==-1){
      e[1]='TAX DIV';
    }   
  });
  data = filterBy(data,head,'CastflowEUR','!=(number)',0); 

  data.sort(function(a,b){
    return (b[0]+b[2])-(a[0]+a[2]);
  }); 
  data.forEach(function(e){ 
    e[0] = moment(moment(e[0],'YYYY-MM-DD').toDate()).format('DD/MM/YYYY'); 
  });  

  print('MOVEMENTS');   
  var movements = data.map(function(fila) {
    var objetoFila = {};
    head.forEach(function(columna, indice) {
      objetoFila[columna] = fila[indice];
    });
    return objetoFila;
  });   
  delete data,head;  
  
  //print(movements,'table');

  print('STOCKS VALUES');  
  var stocks = await readJson('stocks.json');  
  for (var i = 0; i < stocks.length; i++) {    
    if(stocks[i].dEnd==='2099-12-31'){
      stocks[i].dEnd = moment().format('YYYY-MM-DD');
    } 
    aux = await getStockValueYahoo(stocks[i].ticker, stocks[i].N, stocks[i].dStart, stocks[i].dEnd, stocks[i].desc);
    
    for (var ii=0; ii<aux.dates.length; ii++){ 
      aux.dates[ii]=moment(aux.dates[ii],'YYYY-MM-DD').format('DD/MM/YYYY');
    }
    stocks[i].dates=aux.dates;
    stocks[i].prices=aux.prices;  
    stocks[i].dStart = moment(stocks[i].dStart,'YYYY-MM-DD').format('DD/MM/YYYY');
    stocks[i].dEnd   = moment(stocks[i].dEnd  ,'YYYY-MM-DD').format('DD/MM/YYYY');
  } 
  
  stocks.forEach(function(s){
    var currentDate = moment(s.dStart,'DD/MM/YYYY');
    var endDate     = moment(s.dEnd  ,'DD/MM/YYYY');
    var dates =[];
    var prices=[];
    while (currentDate.isSameOrBefore(endDate)) {
      dates.push(currentDate.format('DD/MM/YYYY')); 
      currentDate.add(1, 'day'); 
    }   
     
    prices.push(s.prices[0]); 
    for (var i = 1; i<dates.length; i++) { 
      var notFound=true; 
      for (var ii = 0; ii<s.dates.length; ii++) { 
        if(s.dates[ii]===dates[i]){
          notFound=false;
          prices.push(s.prices[ii]);
          break;
        } 
      } 
      if(notFound){ 
        prices.push(prices[prices.length-1]); 
      }
    }
  
    s.dates =dates;
    s.prices=prices;
  });

  var stocksValues = [];
  stocks.forEach(function(s){   
    stocksValues.push({
      id:     s.desc+'-'+s.dates[s.dates.length-1]+'-'+s.prices[s.prices.length-1],
      desc:   s.desc, 
      fecha:  s.dates[s.dates.length-1], 
      price:  s.prices[s.prices.length-1], 
      n:      s.N,
      total:  0
    }); 
  });
  aux = distinctArrayObject(stocksValues,'id');
  
  aux.forEach(function(e){
    var n = 0;
    for(var i=0; i<stocksValues.length; i++){
      if(e.id===stocksValues[i].id){
        n=n+stocksValues[i].n;
      }
    }
    e.n=n;
    e.total=Math.round(n*e.price*100)/100+' €'; 
    e.price=Math.round(e.price*100)/100
    delete e.id;
  });
  stocksValues=aux;
  delete aux;
  stocksValues.sort(function(a,b){
    return a.desc.localeCompare(b.desc);
  });    
  print(stocksValues,'table');
  
  print('data 2 plot'); 
  var dataJSON = {}; 
  dataJSON.movements   =movements; 
  
  print('COUNT STATE');  
  var countState = [];   
  var graph01Data = []; 
  var graph02Data = {
    bpNumber: null,
    bp:       null,
    timing:  null,
    categories:  null,
    series:   [] 
  };   

  var a1 = [];
  var a2 = [];
  var a3 = [];
  movements.forEach(function(e){
    a1.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim()));
  });  
  a1 = a1.reduce(function(a,b){ 
    return a+b; 
  },0); 
  
  stocksValues.forEach(function(e){ 
    a2.push(parseFloat(e.total.replaceAll('€','').trim())); 
  });
  a2 = a2.reduce(function(a,b){ 
    return a+b; 
  },0); 

  movements.forEach(function(e){
    if(e.ID_Producto.trim()==='INPUT'){
      a3.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim())); 
    }
  }); 
  a3 = (a1+a2)-a3.reduce(function(a,b){ 
    return a+b; 
  },0); 

  countState.push({
    info: 'Cartera',
    value: (Math.round((a1+a2)*100)/100)+' €',
    extra: 'B/P: '+(Math.round((a3)*100)/100)+' €' 
  });
  
  graph02Data.bpNumber = (Math.round((a3)*100)/100);
  graph02Data.bp = 'B/P: '+(Math.round((a3)*100)/100)+' €';
 
  countState.push({
    info: 'Stocks',
    value: (Math.round(a2*100)/100)+' €',
    extra: (Math.round((a2/(a1+a2))*10000)/100)+'% Cartera' 
  }); 
   
  countState.push({
    info: 'Cash',
    value: (Math.round(a1*100)/100)+' €',
    extra: (Math.round((a1/(a1+a2))*10000)/100)+'% Cartera' 
  }); 
  graph01Data.push({
    name: 'CASH',
    y: (Math.round(a1*100)/100) 
  }); 

  a3=[];
  movements.forEach(function(e){
    if(e.ID_Producto.trim()==='INPUT'){
      a3.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim())); 
    }
  }); 
  a3 = a3.reduce(function(a,b){ 
    return a+b; 
  },0);  
  countState.push({
    info: 'Input Cash',
    value: (Math.round(a3*100)/100)+' €',
    extra: 'B/P: '+(Math.round(((a1+a2-a3)/(a1+a2))*10000)/100)+'%' 
  });
  
  graph02Data.bp = graph02Data.bp+' ('+(Math.round(((a1+a2-a3)/(a1+a2))*10000)/100)+'%)'; 

  a3=[];
  movements.forEach(function(e){
    if(e.ID_Producto.trim()==='TAX DIV'||e.ID_Producto.trim()==='DIV'){
      a3.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim())); 
    }
  }); 
  a3 = Math.round(a3.reduce(function(a,b){ 
    return a+b; 
  },0)*100)/100; 
  countState.push({
    info: 'Cash Div',
    value: a3+' €',
    extra: '' 
  });  
  
  stocksValues.forEach(function(e){
    graph01Data.push({
      name: e.desc,
      y: Math.round(e.n*e.price*100)/100 
    }); 
  });  

  a3=[];
  movements.forEach(function(e){
    if(e.ID_Producto.trim()==='TAX'||e.ID_Producto.trim()==='INPUT FREE'){
      a3.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim())); 
    }
  }); 
  a3 = Math.abs(Math.round(a3.reduce(function(a,b){ 
    return a+b; 
  },0)*100)/100); 
  countState.push({
    info: 'Tax Buy/Sell',
    value: a3+' €',
    extra: '' 
  });
 
  a3 = []; 
  stocks.forEach(function(e){ 
    a3.push(moment(e.dates[0],'DD/MM/YYYY'));  
  });   
  countState.push({
    info: 'Timing',
    value: convertirADias(moment().diff(moment.min(a3),'days')),
    extra: 'Ini.: '+moment.min(a3).format('DD/MM/YYYY') 
  });
  graph02Data.timing = convertirADias(moment().diff(moment.min(a3),'days'));

  countState.push({
    info: 'Distinct Stocks',
    value: ''+stocksValues.length,
    extra: 'Tod.: '+moment().format('DD/MM/YYYY') 
  });
  delete a1,a2,a3;   
  
  print(countState,'table');
  dataJSON.countState=countState;  
  print('graph01Data done');
  dataJSON.graph01Data=graph01Data;
   
  var iniDate = moment(movements[0].Fecha,'DD/MM/YYYY'); 
  var endDate = moment(); 
  movements.forEach(function(e){ 
    iniDate = moment.min(iniDate,moment(e.Fecha,'DD/MM/YYYY'));
  });
  var dates=[];
  var currentDate = iniDate.clone();
  while (currentDate.isSameOrBefore(endDate)) {
    dates.push(currentDate.format('DD/MM/YYYY')); 
    currentDate.add(1, 'day'); 
  }
  graph02Data.categories=dates;
  var aux = []; 
  var max  = 0;
  var mean = 0;
  var min  = 0;
   
  dates.forEach(function(d,di){  
    var val=0;
    stocks.forEach(function(s,si){  
      for(var i=0; i<s.dates.length; i++){
        if(s.dates[i]===d){
          val = val+s.N*s.prices[i];
          break; 
        }
      } 
    });
    
    var ref = 0;
    movements.forEach(function(m,mi){  
      if(moment(m.Fecha,'DD/MM/YYYY').isSameOrBefore(moment(d,'DD/MM/YYYY'))){
        val = val+parseFloat(m.CastflowEUR.replaceAll('€','')); 
        if(m.ID_Producto.trim()==='INPUT'){
          ref = ref+parseFloat(m.CastflowEUR.replaceAll('€','')); 
        }
      } 
    }); 

    val = val - ref;
    max = Math.max(max,val);
    min = Math.min(min,val);
    aux.push(Math.round(val*100)/100);
  });
  graph02Data.series.push({ 
    name: 'CashflowEUR',
    data: aux 
  });
  
  aux = [];
  dates.forEach(function(){  
    aux.push(Math.round(max*100)/100);
  });
  graph02Data.series.push({ 
    name: 'Max',
    data: aux 
  });
  
  graph02Data.series[0].data.forEach(function(e){  
    mean=mean+e;
  });
  mean=mean/graph02Data.series[0].data.length;

  aux = [];
  dates.forEach(function(){  
    aux.push(Math.round(mean*100)/100);
  });
  graph02Data.series.push({ 
    name: 'Mean',
    data: aux 
  });

  aux = [];
  dates.forEach(function(){  
    aux.push(Math.round(min*100)/100);
  });
  graph02Data.series.push({ 
    name: 'Min',
    data: aux 
  }); 

  aux = [];
  dates.forEach(function(d,di){   
    var val=0;
    movements.forEach(function(m,mi){  
      if(moment(m.Fecha,'DD/MM/YYYY').isSameOrBefore(moment(d,'DD/MM/YYYY'))){ 
        val = val+parseFloat(m.CastflowEUR.replaceAll('€','')); 
      } 
    });  
    aux.push(Math.round(val*100)/100);
  });
  graph02Data.series.push({ 
    name: 'Cash',
    data: aux 
  });  
 
  var uniStocks=[];
  stocks.forEach(function(s,si){ 
    uniStocks.push({
      ticker: s.ticker,
      desc: s.desc
    }); 
  }); 
  var uniStocks=distinctArrayObject(uniStocks,'ticker');
  uniStocks.sort(function(a,b){
    return a.desc.localeCompare(b.desc);
  }); 
  var st=uniStocks.length;
  uniStocks.forEach(function(s,si){    
    console.log((si+1)+'/'+st+' -> ['+s.ticker+'] '+s.desc);  
    var aux = [];
    dates.forEach(function(d,di){   
      var val=0;
      stocks.forEach(function(ss,ssi){ 
        ss.dates.forEach(function(dd,ddi){ 
          if((s.ticker===ss.ticker)&&moment(dd,'DD/MM/YYYY').isSame(moment(d,'DD/MM/YYYY'))){ 
            val = val+ss.N*ss.prices[ddi]; 
          } 
        });
      });  
      aux.push(Math.round(val*100)/100);
    }); 
    graph02Data.series.push({ 
      name: s.desc,
      data: aux 
    });   
  }); 
  delete aux;
    
  print('graph02Data done');
  dataJSON.graph02Data=graph02Data;
  
  var graph03Data=[];  
  stocks.forEach(function(e){
    graph03Data.push({
      ticker: e.ticker
    })
  });
  graph03Data = distinctArrayObject(graph03Data,'ticker'); 
  graph03Data.forEach(function(a){
    stocks.forEach(function(s){
      if(a.ticker===s.ticker){
        a.desc=s.desc;
      }
    });
    a.n     =0;
    a.dates =[];
    a.series=[];
  }); 
  graph03Data.forEach(function(a){
    var dates = undefined;
    var prices = undefined;
    for(var i=0; i<stocks.length; i++){ 
      if(a.ticker===stocks[i].ticker){
        dates = stocks[i].dates;
        prices= stocks[i].prices;
        a.n=a.n+stocks[i].N;
      }
    } 
    a.dates =dates; 
    a.series.push({
      name: 'value',
      data: prices
    });
  });
  graph03Data.forEach(function(a){
    a.series.forEach(function(s){
      var max = s.data[0];
      var min = s.data[0];
      for(var i=0; i<s.data.length; i++){ 
        s.data[i]=Math.round(s.data[i]*100)/100; 
        max = Math.max(max,s.data[i]);
        min = Math.min(min,s.data[i]);
      } 
      var mean = 0;
      s.data.forEach(function(e){  
        mean=mean+e;
      });
      mean=mean/s.data.length;
    
      var aux = []; 
      s.data.forEach(function(){  
        aux.push(Math.round(max*100)/100);
      });
      a.series.push({ 
        name: 'Max',
        data: aux 
      });

      aux = [];
      s.data.forEach(function(){  
        aux.push(Math.round(mean*100)/100);
      });
      a.series.push({ 
        name: 'Mean',
        data: aux 
      });
    
      aux = [];
      s.data.forEach(function(){  
        aux.push(Math.round(min*100)/100);
      });
      a.series.push({ 
        name: 'Min',
        data: aux 
      }); 
    }); 
    var aux = a.n*(a.series[0].data[a.series[0].data.length-1]-a.series[0].data[0]);
    a.bp='B/P: '+(Math.round((aux)*100)/100)+' € ('+(Math.round((aux*100/(a.n*a.series[0].data[0]))*100)/100)+'%)';
    a.bpNumber=Math.round((aux)*100)/100;

    aux = a.n*(a.series[1].data[a.series[1].data.length-1]-a.series[0].data[0]);
    a.bpMax='B/P max: '+(Math.round((aux)*100)/100)+' € ('+(Math.round((aux*100/(a.n*a.series[0].data[0]))*100)/100)+'%)';

    aux = a.n*(a.series[3].data[a.series[3].data.length-1]-a.series[0].data[0]);
    a.bpMin='B/P min: '+(Math.round((aux)*100)/100)+' € ('+(Math.round((aux*100/(a.n*a.series[0].data[0]))*100)/100)+'%)';
    a.timing=convertirADias(moment(a.dates[a.dates.length-1],'DD/MM/YYYY').diff(moment(a.dates[0],'DD/MM/YYYY'),'days'));
 
  });   
  
  print('graph03Data done');
  dataJSON.graph03Data=graph03Data;
  
  print('Create HTML from Data and Template'); 
  await createHtml(dataJSON);  

	print('*** END: AppGiroValues  ***');   
  console.timeEnd('Exe script');
}
main();