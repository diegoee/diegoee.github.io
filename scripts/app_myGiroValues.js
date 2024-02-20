//funciones auxiliares
function print(msg,opt) {
  if(opt==='error'){
    console.error(msg); 
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

function createJson(data,fileName){
	var fs = require('fs');  
  return new Promise(function(resolve){ 
    fs.writeFile(fileName, JSON.stringify(data), function(err){
      if (err) {
        print(err.message,'error');
        resolve();
      } else {
        //print('Archivo JSON creado: '+fileName);
        resolve();
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

async function generateImageFromHTML(htmlContent,filesJsonData){
  var puppeteer = require('puppeteer'); 
  var cheerio = require('cheerio'); 
  
  var $ = cheerio.load(htmlContent);
  $('#dataScript').html(' ');
  var code = '';
  var data = undefined;
  for(var i=0; i<filesJsonData.length; i++){
    data = await readJson(filesJsonData[i]);
    data = JSON.stringify(data); 
    code = code+' var '+filesJsonData[i].replaceAll('app_myGiroValues_','').replaceAll('.json','')+'='+data+';'
  } 
  $('#dataScript').html(code); 
  htmlContent = $.html();
  //print(htmlContent);

  var browser = await puppeteer.launch();
  var page = await browser.newPage(); 
  await page.setContent(htmlContent); 
  var file = 'CarteraGiroJS.pdf';  
  await page.pdf({
    path: file,
    format: 'A3',
  });
  await browser.close();
}

//----- main -----
async function main(){ 
  console.time('Exe script'); 
	print('*** START: AppGiroValues ***');  
  var moment = require('moment'); 
 
  //print('Data Load');
	var data = await getGiroCsvData('giro_count.csv');   
  var head = data[0]; 
  data.shift(); 	

  //print('Filter data');
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

  //print('MOVEMENTS');   
  var movements = data.map(function(fila) {
    var objetoFila = {};
    head.forEach(function(columna, indice) {
      objetoFila[columna] = fila[indice];
    });
    return objetoFila;
  });   
  delete data,head;   

  //print('STOCKS VALUES');  
  var stocks = await readJson('stocks.json');  
  for (let i = 0; i < stocks.length; i++) {    
    if(stocks[i].dEnd==='2099-12-31'){
      stocks[i].dEnd = moment().format('YYYY-MM-DD');
    } 
    aux = await getStockValueYahoo(stocks[i].ticker, stocks[i].N, stocks[i].dStart, stocks[i].dEnd, stocks[i].desc);
    stocks[i].dates=aux.dates;
    stocks[i].prices=aux.prices; 
    delete stocks[i].dStart; 
    delete stocks[i].dEnd; 
  }
  
  var stocksValues = [];
  stocks.forEach(function(e){   
    stocksValues.push({
      id:     e.desc+'-'+e.dates[e.dates.length-1]+'-'+Math.round(e.prices[e.prices.length-1]*100)/100,
      desc:   e.desc, 
      fecha:  e.dates[e.dates.length-1], 
      price:  Math.round(e.prices[e.prices.length-1]*100)/100, 
      n:      e.N,
      total:  0
    }); 
  });
  aux = stocksValues.filter(function(valor, indice, self) {
    return self.findIndex(function(objeto){
      return objeto.id === valor.id;
    }) === indice;
  });
  aux.forEach(function(e){
    var n = 0;
    for(var i=0; i<stocksValues.length; i++){
      if(e.id===stocksValues[i].id){
        n=n+stocksValues[i].n;
      }
    }
    e.n=n;
    e.total=n*Math.round(e.price*100)/100+' €'; 
    delete e.id;
  });
  stocksValues=aux;
  delete aux;
  stocksValues.sort(function(a,b){
    return a.desc.localeCompare(b.desc);
  });  
    
  //print('COUNT STATE');  
  var countState=[];  

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
    a3.push(moment(e.dates[0]));  
  });  
  a3 = moment().diff(moment.min(a3), 'days');
  countState.push({
    info: 'Timing',
    value: a3+' day(s)',
    extra: '' 
  });

  countState.push({
    info: 'Distinct Stocks',
    value: ''+stocksValues.length,
    extra: '' 
  });
  delete a1,a2,a3;  
  
  //print('Generate data graph 01'); 
  var graph01Data = [];
  aux=[];
  movements.forEach(function(e){
    if(e.ID_Producto.trim()==='TAX DIV'||e.ID_Producto.trim()==='DIV'){
      aux.push(parseFloat(e.CastflowEUR.replaceAll('€','').trim())); 
    }
  }); 
  aux = Math.round(aux.reduce(function(a,b){ 
    return a+b; 
  },0)*100)/100;  
  graph01Data.push({
    name: 'CASH',
    y: aux 
  }); 
  stocksValues.forEach(function(e){
    graph01Data.push({
      name: e.desc,
      y: Math.round(e.n*e.price*100)/100 
    }); 
  }); 

  //print('Generate data graph 02'); 
  var graph02Data = []; 
  /*
  plotData = pd.DataFrame({'Fecha': [ ], 'CastflowEUR': []}) 
    for date in pd.date_range(start='2022-11-20', end=dt.datetime.today().strftime('%Y-%m-%d')):  
      value = data[(data['Fecha'] <= date) & (data['ID_Producto']!='INPUT')]['Total'].sum()   
      value = value + stocks[stocks['Fecha'] == date]['Total'].sum() 
      value = round(value, 2)    
      plotData = pd.concat([plotData, pd.DataFrame({'Fecha': [date.strftime('%Y-%m-%d')], 'CastflowEUR': [value]})])  

    plotData['Max']  = round(plotData['CastflowEUR'].max() , 2)
    plotData['Min']  = round(plotData['CastflowEUR'].min() , 2)
    plotData['Mean'] = round(plotData['CastflowEUR'].mean(), 2) 
    plotData = plotData.set_index('Fecha') 
    plotData1 = plotData 
  */
  //print('Create files to Template');  
  await createJson(movements,'app_myGiroValues_movements.json');
  await createJson(countState,'app_myGiroValues_countState.json'); 
  await createJson(graph01Data,'app_myGiroValues_graph01.json');  
  await createJson(graph02Data,'app_myGiroValues_graph02.json'); 
  var htmlContent = await readHtml('app_myGiroValues_template.html'); 
  var filesJsonData=[ 
    'app_myGiroValues_movements.json',
    'app_myGiroValues_countState.json',
    'app_myGiroValues_graph01.json',
    'app_myGiroValues_graph02.json'
  ];
  /*
  print(graph02Data);
  /*
  var cheerio = require('cheerio');  
  var $ = cheerio.load(htmlContent);
  $('#dataScript').html(' ');
  var code = '';
  var data = undefined;
  for(var i=0; i<filesJsonData.length; i++){
    data = await readJson(filesJsonData[i]);
    data = JSON.stringify(data); 
    code = code+' var '+filesJsonData[i].replaceAll('app_myGiroValues_','').replaceAll('.json','')+'='+data+';'
  } 
  $('#dataScript').html(code); 
  htmlContent = $.html();
  print(htmlContent);
  /**/

  await generateImageFromHTML(htmlContent,filesJsonData);
  for(var i=0; i<filesJsonData.length; i++){
    await deleteFile(filesJsonData[i]); 
  }  
  
	print('*** END: AppGiroValues  ***');   
  console.timeEnd('Exe script');
}
main();
