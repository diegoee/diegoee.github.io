class AppGiroValues:        
  def __init__(self):
    print('***')
    print('*** START ***')
    import pandas as pd 
    import yahoofinancials as yf
    import datetime as dt
    import matplotlib.pyplot as plt 
    import os

    data = pd.read_csv(os.path.dirname(__file__)+'/'+'giro_count.csv', sep=',') 
    data = data[data['ISIN']!='NLFLATEXACNT']
    data = data[~data['Descripción'].str.contains('Cuenta')]  

    data = data[['Fecha','Producto','Descripción','Unnamed: 8']] 
    data.columns = ['Fecha', 'ID_Producto', 'Desc', 'CastflowEUR']
    data['N'] = 1
    data = data[['Fecha','ID_Producto','Desc','N','CastflowEUR']] 
    data['Fecha'] = pd.to_datetime(data['Fecha'], format='%d-%m-%Y') 
    
    for desc in ['flatex Deposit','Ingreso']: 
      data.loc[data['Desc'] == desc, 'ID_Producto'] = 'BANK INPUT' 
    data.loc[data['Desc'].str.contains('Tax'), 'ID_Producto'] = 'TAX' 
    data.loc[data['Desc'].str.contains('Costes'), 'ID_Producto'] = 'TAX' 
    data.loc[data['Desc'].str.contains('Compra'), 'ID_Producto'] = 'BUY' 
    data['CastflowEUR'] = data['CastflowEUR'].replace(',','.', regex=True) 
    data['CastflowEUR'] = data['CastflowEUR'].astype(float)
    data['Total'] = data['N']*data['CastflowEUR']
    print(data)
    
    def getStockValue(ticket, N, dStart, dEnd, DescTicket):
      stock = yf.YahooFinancials(ticket).get_historical_price_data(dStart, dEnd, 'daily') 
      stock = pd.DataFrame.from_dict(stock[ticket]['prices'])
      stock = stock[['formatted_date','close']] 
      stock.columns = ['Fecha', 'CastflowEUR']
      stock['Fecha'] = pd.to_datetime(stock['Fecha'], format='%Y-%m-%d')      
      for date in pd.date_range(start=dStart, end=dEnd): 
        maxDate = stock[stock['Fecha']==date]['Fecha']
        if maxDate.size==0:  
          aux = stock[stock['Fecha']==stock[stock['Fecha']<=date]['Fecha'].max()].iloc[[0]]
          aux['Fecha'] = date 
          stock = pd.concat([stock, aux]) 
      stock['ID_Producto'] = 'STOCK'
      stock['N'] = N
      stock['Desc'] = DescTicket
      stock = stock[['Fecha','ID_Producto','Desc','N','CastflowEUR']]  
      return stock

    stocksData  = pd.read_json(os.path.dirname(__file__)+'/'+'stocks.json')
    stocksData['dEnd'] = dt.datetime.today().strftime("%Y-%m-%d")

    #stocksData = stocksData[:2] 
    #data = data[4:] 

    stocks = pd.DataFrame({'Fecha': [ ], 'ID_Producto': [], 'Desc': [], 'N': [], 'CastflowEUR': []}) 
    for i in range(stocksData.index.size): 
      stocks = pd.concat([stocks, getStockValue(stocksData['ticker'].loc[i], stocksData['N'].loc[i], stocksData['dStart'].loc[i], stocksData['dEnd'].loc[i], stocksData['desc'].loc[i])])   
    stocks.sort_values(by=['Fecha', 'ID_Producto','Desc'], inplace=True, ascending=True)
      
    stocks['CastflowEUR'] = stocks['CastflowEUR'].replace(',','.', regex=True) 
    stocks['CastflowEUR'] = stocks['CastflowEUR'].astype(float)
    stocks['Total'] = stocks['N']*stocks['CastflowEUR']

    plotData = pd.DataFrame({'Fecha': [ ], 'CastflowEUR': []}) 
    for date in pd.date_range(start='2022-11-20', end=dt.datetime.today().strftime('%Y-%m-%d')):  
      value = data[(data['Fecha'] <= date) & (data['ID_Producto']!='BANK INPUT')]['Total'].sum() 
      value = value + stocks[stocks['Fecha'] == date]['Total'].sum()
      value = round(value, 2) 
      plotData = pd.concat([plotData, pd.DataFrame({'Fecha': [date.strftime('%Y-%m-%d')], 'CastflowEUR': [value]})])

    plotData['Max']  = round(plotData['CastflowEUR'].max() , 2)
    plotData['Min']  = round(plotData['CastflowEUR'].min() , 2)
    plotData['Mean'] = round(plotData['CastflowEUR'].mean(), 2)
    plotData = plotData.set_index('Fecha') 
    plotData1 = plotData 

    plotData = pd.DataFrame({'ID_Producto': [ ], 'Total': []})  
    plotData = pd.concat([plotData, stocks[stocks['Fecha'] == stocks['Fecha'].max()]])[['Desc','Total']]  
    plotData.columns = ['ID_Producto', 'Total']
    plotData = pd.concat([plotData, pd.DataFrame({'ID_Producto': ['CASH'], 'Total': [data['Total'].sum()]})]) 
    plotData['Total'] = round(plotData['Total'], 2) 
    plotData.columns = ['ID_Producto', 'EUR']
    plotData = plotData.set_index('ID_Producto')   
    plotData2 = plotData  
    
    plotData = pd.DataFrame({'Plottype': [ ], 'Desc': [ ], 'CastflowEUR': []})  
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [1],'Desc': ['Tax Cost'],   'CastflowEUR': [round(abs(data[data['ID_Producto']=='TAX']['Total'].sum()), 2)]})]) 
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [1],'Desc': ['Buy Cost'],   'CastflowEUR': [round(abs(data[data['ID_Producto']=='BUY']['Total'].sum()), 2)]})]) 
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [3],'Desc': ['Total Cost'], 'CastflowEUR': [round(abs(data[data['ID_Producto'].isin(['BUY','TAX'])]['Total'].sum()), 2)]})]) 
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [0],'Desc': ['Input Cash'], 'CastflowEUR': [round(abs(data[data['ID_Producto']=='BANK INPUT']['Total'].sum()), 2)]})]) 
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [1],'Desc': ['Cash'],       'CastflowEUR': [round(abs(data[data['ID_Producto'].isin(['BANK INPUT','BUY','TAX'])]['Total'].sum()), 2)]})]) 
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [1],'Desc': ['Stocks'],     'CastflowEUR': [round(abs(stocks[stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d')]['Total'].sum()), 2)]})])
    plotData = pd.concat([plotData, pd.DataFrame({'Plottype': [2],'Desc': ['Cartera'],    'CastflowEUR': [round(abs(data['Total'].sum() + stocks[stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d')]['Total'].sum()), 2)]})])
    plotData3 = plotData

    fig = plt.figure(figsize=(12, 8)) 
    gs  = fig.add_gridspec(3,2)
    ax1 = fig.add_subplot(gs[1:,:])
    ax2 = fig.add_subplot(gs[0 ,1])
    ax3 = fig.add_subplot(gs[0, 0])

    pt1 = plotData1.plot(ax=ax1, kind='line', style=['.-','-','-','-'], color=['#3C7BE3','green','red','black'])
    pt1.set_title('Evolución valores B/P')
    pt1.xaxis.set_label_text('')
    pt1.yaxis.set_label_text('EUR') 
    pt1.grid() 
    pt1.legend(loc='upper left')  
    pt1.annotate('Min.: '+str(plotData1['Min'].iloc[-1])+' €', # this is the text
      (plotData1.index.size-2,plotData1['Min'].iloc[-1]), # these are the coordinates to position the label
      textcoords="offset points", # how to position the text
      xytext=(0,10), # distance from text to points (x,y)
      ha='center') # horizontal alignment can be left, right or center
    pt1.annotate('Max.: '+str(plotData1['Max'].iloc[-1])+' €', # this is the text
      (plotData1.index.size-2,plotData1['Max'].iloc[-1]), # these are the coordinates to position the label
      textcoords="offset points", # how to position the text
      xytext=(0,-15), # distance from text to points (x,y)
      ha='center') # horizontal alignment can be left, right or center
    pt1.annotate('Media: '+str(plotData1['Mean'].iloc[-1])+' €', # this is the text
      (plotData1.index.size-2,plotData1['Mean'].iloc[-1]), # these are the coordinates to position the label
      textcoords="offset points", # how to position the text
      xytext=(0,10), # distance from text to points (x,y)
      ha='center') # horizontal alignment can be left, right or center
    colortext = 'black' 
    if plotData1['CastflowEUR'].iloc[-1]>0: 
      colortext = 'green' 
    if plotData1['CastflowEUR'].iloc[-1]<0: 
      colortext = 'red' 
    pt1.annotate('B/P: '+str(plotData1['CastflowEUR'].iloc[-1])+' €', # this is the text
      (plotData1.index.size-2,plotData1['CastflowEUR'].iloc[-1]), # these are the coordinates to position the label
      textcoords="offset points", # how to position the text
      xytext=(0,10), # distance from text to points (x,y)
      ha='center', # horizontal alignment can be left, right or center
      fontname="Times New Roman", 
      size=16, 
      fontweight='bold',
      color=colortext)

    pt2 = plotData2.plot(ax=ax2, kind='pie', y='EUR', 
      autopct=lambda p: '{:.2f}%\n{:.2f}€'.format(p, p*sum(plotData2['EUR'])/100),  
      textprops={"color":"white", "weight":"bold"},
      wedgeprops={'linewidth': 0.5, 'edgecolor': 'white'})
    pt2.set_title('')
    pt2.xaxis.set_visible(False)
    pt2.yaxis.set_visible(False)
    #pt2.get_legend().remove()
    pt2.legend(title="Stocks", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))


    pt3 = plotData3['CastflowEUR'].plot(ax=ax3, kind='barh', color='white') 
    for i in range(plotData3.index.size): 
      fontsize = 18
      fontw = None
      if plotData3['Plottype'].iloc[i]==1:
        fontsize=14
      if plotData3['Plottype'].iloc[i]==2:
        fontsize=22
        fontw = 'bold'
      text = str(plotData3['Desc'].iloc[i])+':'
      pt3.annotate(text,(0,i), textcoords='offset points', xytext=(20,0), ha='left', va='center', fontname='Times New Roman', size=fontsize)
      text = str(plotData3['CastflowEUR'].iloc[i])+' €'  
      pt3.annotate(text,(0,i), textcoords='offset points', xytext=(200,0), ha='right', va='center', fontname='Times New Roman', size=fontsize, fontweight=fontw) 
      if plotData3['Plottype'].iloc[i]==2:
        text = 'B/P: '+str(plotData1['CastflowEUR'].iloc[-1])+' €'  
        colortext = 'black' 
        if plotData1['CastflowEUR'].iloc[-1]>0: 
          colortext = 'green' 
        if plotData1['CastflowEUR'].iloc[-1]<0: 
          colortext = 'red'  
        pt3.annotate(text,(0,i), textcoords='offset points', xytext=(350,0), ha='right', va='center', fontname='Times New Roman', size=fontsize-4, color=colortext) 
      if plotData3['Plottype'].iloc[i]==3:
        text = 'B/P: '+str(round((plotData1['CastflowEUR'].iloc[-1]-plotData1['CastflowEUR'].iloc[i])/plotData1['CastflowEUR'].iloc[i],2))+'%'  
        colortext = 'black' 
        if plotData1['CastflowEUR'].iloc[-1]>0: 
          colortext = 'green' 
        if plotData1['CastflowEUR'].iloc[-1]<0: 
          colortext = 'red'  
        pt3.annotate(text,(0,i), textcoords='offset points', xytext=(350,0), ha='right', va='center', fontname='Times New Roman', size=fontsize-4, color=colortext)

    pt3.set_title('Información Cartera GIRO', fontname="Times New Roman", size=18 , fontweight='bold')
    pt3.xaxis.set_label_text('')  
    pt3.yaxis.set_label_text('EUR')  
    pt3.axis('off')
    pt3.grid()

    fig.tight_layout(pad=0.5) 
    #fig.savefig('CarteraGiro.png', bbox_inches='tight')
    plt.show(block=False) 
    plt.pause(120)
    plt.close('all')
    
    print('*** END  ***')
    print('***')

if __name__ == '__main__':
  AppGiroValues()