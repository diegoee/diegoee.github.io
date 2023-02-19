class AppGiroValues:        
  def __init__(self):
    print('***')
    print('*** START: AppGiroValues ***')  
    import numpy as np
    import pandas as pd 
    import yahoofinancials as yf
    import datetime as dt
    import matplotlib.pyplot as plt 
    import os 
    #Read, cleaning and formating MOVMENTS 
    data = pd.read_csv(os.path.dirname(__file__)+'/'+'giro_count.csv', sep=',') 
    data = data[data['ISIN']!='NLFLATEXACNT']
    data = data[~data['Descripción'].str.contains('Cuenta')]  
    data = data[['Fecha','Producto','Descripción','Unnamed: 8']] 
    data.columns = ['Fecha', 'ID_Producto', 'Desc', 'CastflowEUR']
    data['N'] = 1
    data = data[['Fecha','ID_Producto','Desc','N','CastflowEUR']] 
    data['Fecha'] = pd.to_datetime(data['Fecha'], format='%d-%m-%Y') 
       
    data.loc[data['Desc'] == 'flatex Deposit'      , 'ID_Producto'] = 'INPUT' 
    data.loc[data['Desc'] == 'Ingreso'             , 'ID_Producto'] = 'INPUT' 
    data.loc[data['Desc'].str.contains('Tax')      , 'ID_Producto'] = 'TAX' 
    data.loc[data['Desc'].str.contains('Costes')   , 'ID_Producto'] = 'TAX' 
    data.loc[data['Desc'].str.contains('Compra')   , 'ID_Producto'] = 'BUY' 
    data.loc[data['Desc'].str.contains('Venta')    , 'ID_Producto'] = 'SELL' 
    data.loc[data['Desc'].str.contains('reembolso'), 'ID_Producto'] = 'INPUT FREE'  
    data.loc[data['Desc'] == 'Dividendo' , 'ID_Producto'] = 'DIV' 
    data.loc[data['Desc'] == 'Retención del dividendo' , 'ID_Producto'] = 'TAX DIV' 
    data['CastflowEUR'] = data['CastflowEUR'].replace(',','.', regex=True) 
    data['CastflowEUR'] = data['CastflowEUR'].astype(float)
    data['Total'] = data['N']*data['CastflowEUR']
    data = data[data['CastflowEUR']!=0]
    data.sort_values(by=['Fecha','Desc'], inplace=True, ascending=True)
    print('MOVEMENTS')
    print(data)
    
    #AUX function to get data STOCKS
    def getStockValue(type, ticket, N, dStart, dEnd, descTicket): 
      stock = pd.DataFrame({'Fecha': [ ], 'ID_Producto': [], 'Desc': [], 'N': [], 'CastflowEUR': []}) 
      if type=='STOCK': 
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
      stock['ID_Producto'] = type
      stock['N'] = N
      stock['Desc'] = descTicket  
      stock = stock[['Fecha','ID_Producto','Desc','N','CastflowEUR']]
      return stock

    #Generate STOCKS values in time
    stocksData  = pd.read_json(os.path.dirname(__file__)+'/'+'stocks.json')
    stocksData['dEnd'] = dt.datetime.today().strftime("%Y-%m-%d") 
    stocks = pd.DataFrame({'Fecha': [ ], 'ID_Producto': [], 'Desc': [], 'N': [], 'CastflowEUR': []}) 
    for i in range(stocksData.index.size):  
      stocks = pd.concat([stocks, getStockValue(stocksData['type'].loc[i], stocksData['ticker'].loc[i], stocksData['N'].loc[i], stocksData['dStart'].loc[i], stocksData['dEnd'].loc[i], stocksData['desc'].loc[i])])   
    stocks.sort_values(by=['Fecha', 'ID_Producto','Desc'], inplace=True, ascending=True) 
    stocks['CastflowEUR'] = stocks['CastflowEUR'].replace(',','.', regex=True) 
    stocks['CastflowEUR'] = stocks['CastflowEUR'].astype(float)
    stocks['Total'] = stocks['N']*stocks['CastflowEUR']
    print('STOCKS VALUES')
    print(stocks[stocks['Fecha'] == stocks['Fecha'].max()])

    # Start ploting
    fig = plt.figure(figsize=(16, 26)) 
    s = stocks[stocks['ID_Producto'] == 'STOCK']['Desc'].unique()
    gs  = fig.add_gridspec(5+s.size,2)
    ax2 = fig.add_subplot(gs[0  ,1])
    ax3 = fig.add_subplot(gs[0  ,0])
    ax1 = fig.add_subplot(gs[1:3,:])
    ax4 = fig.add_subplot(gs[3:5,:])
    axs = []
    for i in range(0,s.size): 
      axs.append(fig.add_subplot(gs[i+5,:])) 
    aux = 0;

    for i in range(0,s.size): 
      #plots Stocks: DATA 
      plotDataS = stocks[stocks['Desc'] == s[i]]
      title = s[i]+': N='+str(round(plotDataS['N'].iloc[-1]))+' ('+plotDataS['ID_Producto'].iloc[-1]+')'
      aux = round(plotDataS['Total'].iloc[-1]-plotDataS['Total'].iloc[0], 2)
      colortext='black'
      if aux>0:
          colortext='green'
      if aux<0:
          colortext='red'
      plotDataS = plotDataS[['Fecha','CastflowEUR']]
      plotDataS['Fecha'] = plotDataS['Fecha'].dt.strftime('%Y-%m-%d')
      plotDataS.columns = ['Fecha', 'CastflowEUR'] 
      plotDataS['CastflowEUR'] = round(plotDataS['CastflowEUR'], 2)
      plotDataS['Max']  = round(plotDataS['CastflowEUR'].max() , 2)
      plotDataS['Min']  = round(plotDataS['CastflowEUR'].min() , 2)
      plotDataS['Mean'] = round(plotDataS['CastflowEUR'].mean(), 2) 
      plotDataS = plotDataS.set_index('Fecha')  

      #plots Stocks: MATPLOT
      axs[i] = plotDataS.plot(ax=axs[i], kind='line', style=['.-','-','-','-'], color=['#3C7BE3','green','red','black'])
      axs[i].set_title(title)
      axs[i].xaxis.set_label_text('')
      axs[i].yaxis.set_label_text('EUR') 
      axs[i].grid() 
      axs[i].legend().remove()   

      axs[i].spines['left'  ].set_color('white')
      axs[i].spines['right' ].set_color('white')
      axs[i].spines['top'   ].set_color('white') 
      axs[i].spines['bottom'].set_color('white')
      axs[i].yaxis.label.set_color('grey')
      axs[i].tick_params(axis='x', colors='grey') 
      axs[i].tick_params(axis='y', colors='grey') 
      axs[i].annotate('Min.: '     +str(plotDataS['Min'].iloc[-1])+' €' , (plotDataS.index.size-2, plotDataS['Min'].iloc[-1] ), textcoords="offset points",  xytext=(0,10)   , ha='center')
      axs[i].annotate('Max.: '     +str(plotDataS['Max'].iloc[-1])+' €' , (plotDataS.index.size-2, plotDataS['Max'].iloc[-1] ), textcoords="offset points",  xytext=(0,-15)  , ha='center')  
      axs[i].annotate('Media: '    +str(plotDataS['Mean'].iloc[-1])+' €', (plotDataS.index.size-2, plotDataS['Mean'].iloc[-1]), textcoords="offset points",  xytext=(0,10)   , ha='center')  
      axs[i].annotate('B/P total: '                                     , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(40,-15) , ha='center', size=16)
      axs[i].annotate(str(aux)+' €'                                     , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(130,-15), ha='center', size=16, fontweight='bold', color=colortext) 
      aux = round((plotDataS['CastflowEUR'].iloc[-1]-plotDataS['CastflowEUR'].iloc[0])/plotDataS['CastflowEUR'].iloc[0], 4)*100
      if(aux>0):
        axs[i].annotate('Var: '                                         , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(40,-35) , ha='center', size=16)
        axs[i].annotate('+ '+str(aux)+' %'                              , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(130,-35), ha='center', size=16, fontweight='bold', color=colortext) 
      if(aux<0):
        axs[i].annotate('Var: '                                         , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(40,-35) , ha='center', size=16)
        axs[i].annotate('- '+str(aux)+' %'                              , (0                     , plotDataS['Max'].iloc[0]  ), textcoords="offset points",  xytext=(130,-35), ha='center', size=16, fontweight='bold', color=colortext) 
   
    #plots 1: DATA
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

    #plots 1: MATPLOT
    ax1 = plotData1.plot(ax=ax1, kind='line', style=['.-','-','-','-'], color=['#3C7BE3','green','red','black'])
    ax1.set_title('Evolución valores B/P')
    ax1.xaxis.set_label_text('')
    ax1.yaxis.set_label_text('EUR') 
    ax1.grid() 
    ax1.legend(loc='upper left')  
    colortext = 'black' 
    if plotData1['CastflowEUR'].iloc[-1]>0: 
      colortext = 'green' 
    if plotData1['CastflowEUR'].iloc[-1]<0: 
      colortext = 'red' 
    ax1.annotate('Min.: '  +str(plotData1['Min'].iloc[-1])+' €'        , (plotData1.index.size-2,plotData1['Min'].iloc[-1]) , textcoords="offset points", xytext=(0,10)   , ha='center')
    ax1.annotate('Max.: '  +str(plotData1['Max'].iloc[-1])+' €'        , (plotData1.index.size-2,plotData1['Max'].iloc[-1]) , textcoords="offset points", xytext=(0,-15)  , ha='center')  
    ax1.annotate('Media: ' +str(plotData1['Mean'].iloc[-1])+' €'       , (plotData1.index.size-2,plotData1['Mean'].iloc[-1]), textcoords="offset points", xytext=(0,10)   , ha='center')      
    ax1.annotate('B/P: '   +str(plotData1['CastflowEUR'].iloc[-1])+' €', (0                     ,plotData1['Max'].iloc[-1]) , textcoords="offset points", xytext=(120,-25), ha='center', fontname="Times New Roman", size=20, fontweight='bold',  color=colortext) 
    aux = (pd.to_datetime(plotData1.index[plotData1.index.size-1], format="%Y/%m/%d")-pd.to_datetime(plotData1.index[0], format="%Y/%m/%d")).days
    ax1.annotate('Period: '+str(aux)+' days'                           , (0                     ,plotData1['Max'].iloc[-1]) , textcoords="offset points", xytext=(120,-45), ha='center') 
    
    ax1.spines['left'  ].set_color('white')
    ax1.spines['right' ].set_color('white')
    ax1.spines['top'   ].set_color('white') 
    ax1.spines['bottom'].set_color('white')
    ax1.yaxis.label.set_color('grey')
    ax1.tick_params(axis='x', colors='grey') 
    ax1.tick_params(axis='y', colors='grey') 

    #plots 2: DATA
    plotData = pd.DataFrame({'ID_Producto': [ ], 'Total': []})  
    plotData = pd.concat([plotData, stocks[stocks['Fecha'] == stocks['Fecha'].max()]])[['Desc','Total']]  
    plotData.columns = ['ID_Producto', 'Total']
    plotData = pd.concat([plotData, pd.DataFrame({'ID_Producto': ['CASH'], 'Total': [data['Total'].sum()]})]) 
    plotData['Total'] = round(plotData['Total'], 2) 
    plotData.columns = ['ID_Producto', 'EUR'] 
    labels = []
    for i in range(plotData.index.size):
      labels.append(plotData['ID_Producto'].iloc[i]+': '+str(plotData['EUR'].iloc[i])+'€ ('+str(round((plotData['EUR'].iloc[i]/sum(plotData['EUR']))*100,2))+'%)')
    
    plotData['Labels']=labels
    plotData = plotData.set_index('ID_Producto')  
    plotData.sort_values(by=['ID_Producto'], inplace=True, ascending=True)
    plotData2 = plotData  
    
    #plots 2: MATPLOT
    ax2 = plotData2.plot(ax=ax2, kind='pie', y='EUR', 
      autopct=lambda p: '{:.2f}%\n{:.2f}€'.format(p, p*sum(plotData2['EUR'])/100),  
      textprops={"color":"white", "weight":"bold", "fontsize": 8},
      wedgeprops={'linewidth': 0.5, 'edgecolor': 'white'})
    ax2.set_title('')
    ax2.xaxis.set_visible(False)
    ax2.yaxis.set_visible(False)
    ax2.get_legend().remove() 
    ax2.legend(title=None, labels=plotData2['Labels'], loc="center left", bbox_to_anchor=(1, 0, 0.5, 1), prop={'size': 8}) 
    ax2.set_title('Información Cartera GIRO', fontname="Times New Roman", size=18, fontweight='bold')

    ax2.spines['left'  ].set_color('white')
    ax2.spines['right' ].set_color('white')
    ax2.spines['top'   ].set_color('white') 
    ax2.spines['bottom'].set_color('white')
    
    #plots 3: DATA
    plotData = pd.DataFrame({})  
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Nº distinct Stocks'],   
      'Value': [stocks[stocks['ID_Producto'].isin(['STOCK']) & (stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d'))]['Total'].count()], 
      'Extra': [None],   
      'Extra_color': [None]
    })]) 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Timing'],   
      'Value': [str(aux)+' day(s)'], 
      'Extra': [None],   
      'Extra_color': [None]
    })]) 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Tax Buy/Sell'],   
      'Value': ['{0:.2f}€'.format(round(abs(data[data['ID_Producto'].isin(['TAX','INPUT FREE'])]['Total'].sum()), 2))], 
      'Extra': [None],   
      'Extra_color': [None]
    })]) 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Cash Div'],   
      'Value': ['{0:.2f}€'.format(round(abs(data[data['ID_Producto'].isin(['DIV','TAX DIV'])]['Total'].sum()), 2))], 
      'Extra': [None],   
      'Extra_color': [None]
    })])   
    colortext='black'
    if plotData1['CastflowEUR'].iloc[-1]>0:
        colortext='green'
    if plotData1['CastflowEUR'].iloc[-1]<0:
        colortext='red' 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [14],
      'Fontw': ['bold'],
      'Desc':  ['Input Cash'], 
      'Value': ['{0:.2f}€'.format(round(abs(data[data['ID_Producto']=='INPUT']['Total'].sum()), 2))],   
      'Extra': ['B/P: '+str(round(((plotData1['CastflowEUR'].iloc[-1])/round(abs(data[data['ID_Producto']=='INPUT']['Total'].sum()), 2))*100,2))+'%'],
      'Extra_color': [colortext]
    })]) 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Cash'],       
      'Value': ['{0:.2f}€'.format(round(abs(data[data['ID_Producto'].isin(['INPUT FREE','INPUT','BUY','TAX','DIV','TAX DIV'])]['Total'].sum()), 2))],   
      'Extra': [str(round(abs(data[data['ID_Producto'].isin(['INPUT FREE','INPUT','BUY','TAX','DIV','TAX DIV'])]['Total'].sum())/abs(data['Total'].sum() + stocks[stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d')]['Total'].sum()), 4)*100)+' % Cartera'],   
      'Extra_color': [None]
    })]) 
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [11],
      'Fontw': [None],
      'Desc':  ['Stocks'],     
      'Value': ['{0:.2f}€'.format(round(abs(stocks[stocks['ID_Producto'].isin(['STOCK']) & (stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d'))]['Total'].sum()), 2))],   
      'Extra': [str(round(abs(stocks[stocks['ID_Producto'].isin(['STOCK']) & (stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d'))]['Total'].sum())/abs(data['Total'].sum() + stocks[stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d')]['Total'].sum()), 4)*100)+' % Cartera'],   
      'Extra_color': [None]
    })])
    plotData = pd.concat([plotData, pd.DataFrame({
      'Fonts': [18],
      'Fontw': ['bold'],
      'Desc':  ['Cartera'],    
      'Value': ['{0:.2f}€'.format(round(abs(data['Total'].sum() + stocks[stocks['Fecha'] == dt.datetime.today().strftime('%Y-%m-%d')]['Total'].sum()), 2))],   
      'Extra': ['B/P: '+str(plotData1['CastflowEUR'].iloc[-1])+'€'],   
      'Extra_color': [colortext]
    })])
    plotData3 = plotData  

    #plots 3: MATPLOT
    ax3.set_axis_off()
    cols = ['Desc','Value','']
    ncols = len(cols)
    nrows = plotData3.index.size
    x = [0.5, 1.5, 2.5]
    ax3.set_xlim(0, ncols)
    ax3.set_ylim(0, nrows)
    ax3.set_axis_off()
    ax3.plot([ax3.get_xlim()[0], ax3.get_xlim()[1]], [nrows, nrows], lw=1.5, color='black', marker='', zorder=4)
    ax3.plot([ax3.get_xlim()[0], ax3.get_xlim()[1]], [    0,     0], lw=1.5, color='black', marker='', zorder=4)
    for i in range(1, nrows):
        ax3.plot([ax3.get_xlim()[0], ax3.get_xlim()[1]], [i, i], lw = 1.15, color='gray', ls=':', zorder=3 , marker='') 
        
    ax3.fill_between(
      x=[0,x[1]-0.5],
      y1=nrows,
      y2=0,
      color='lightgrey',
      alpha=0.5,
      ec='None'
    )
    
    for i in range(0, nrows):  
      ax3.annotate(
        xy = (x[0]-0.4,i+0.15),
        text = plotData3['Desc'].iloc[i],
        ha = 'left', 
        fontname='Times New Roman', 
        size=plotData3['Fonts'].iloc[i], 
        fontweight=plotData3['Fontw'].iloc[i]
      )    

      ax3.annotate(
        xy = (x[1]+0.4,i+0.15),
        text = plotData3['Value'].iloc[i],
        ha = 'right',
        fontname='Times New Roman', 
        size=plotData3['Fonts'].iloc[i], 
        fontweight=plotData3['Fontw'].iloc[i]
      )   
      ax3.annotate(
        xy=(x[2]+0.4,i+0.15),
        text=plotData3['Extra'].iloc[i],
        ha='right',
        color=plotData3['Extra_color'].iloc[i], 
        fontweight=plotData3['Fontw'].iloc[i]
      ) 

    for i in range(0, ncols):
      ax3.annotate(
        xy=(x[i], nrows),
        text = cols[i],
        weight='bold',
        va='bottom',
        ha='center'
      )  

    #plots 4: MATPLOT
    ax4.set_axis_off() 
    cols =        ['Fecha','Type','Desc', 'Cash'] 
    xYlimStart =  [      0,   0.5,     1,      3]
    xTextStart =  [      0,   0.5,     1,      4]
    xTitleCenter =[   0.25,  0.75,     2,    3.5]    
    marginText   =[   +0.1,  +0.1,  +0.1,   -0.1]
    alignText =   [ 'left','left','left','right']
    ncols = len(cols)
    nrows = data.index.size   
    ax4.set_xlim(0, ncols)
    ax4.set_ylim(0, nrows)
    ax4.set_axis_off()
    ax4.plot([ax3.get_xlim()[0], ax4.get_xlim()[1]], [nrows, nrows], lw=1.5, color='black', marker='', zorder=4)
    ax4.plot([ax3.get_xlim()[0], ax4.get_xlim()[1]], [    0,     0], lw=1.5, color='black', marker='', zorder=4)
    for i in range(1, nrows):
        ax4.plot([ax4.get_xlim()[0], ax4.get_xlim()[1]], [i, i], lw = 1.15, color='gray', ls=':', zorder=3 , marker='')  

    ax4.plot([0, 0],         [ax4.get_ylim()[0], ax4.get_ylim()[1]],  lw = 1.15, color='gray', ls=':', zorder=3 , marker='')
    ax4.plot([ncols, ncols], [ax4.get_ylim()[0], ax4.get_ylim()[1]],  lw = 1.15, color='gray', ls=':', zorder=3 , marker='')  
    for i in range(0, len(xYlimStart)):
      ax4.plot([xYlimStart[i], xYlimStart[i]],[ax4.get_ylim()[0], ax4.get_ylim()[1]],  lw = 1.15, color='gray', ls=':', zorder=3 , marker='')
    
    for i in range(0, nrows): 
      if(i%2==0):
        ax4.fill_between(
          x=[0,nrows],          y1=i-1,
          y2=i,
          color='lightgrey',
          alpha=0.25,
          ec='None'
        )
      info = [ 
        data['Fecha'].iloc[i].strftime('%Y-%m-%d'),  
        data['ID_Producto'].iloc[i], 
        data['Desc'].iloc[i], 
        '{0:.2f}€'.format(data['CastflowEUR'].iloc[i]), 
      ]  
      for ii in range(0, ncols): 
        ax4.annotate(
          xy = (xTextStart[ii]+marginText[ii],i+0.2),
          text = info[ii],
          ha = alignText[ii],
          size=10,  
        )    

    for i in range(0, ncols):
      ax4.annotate(
        xy=(xTitleCenter[i], nrows),
        text = cols[i],
        weight='bold',
        va='bottom',
        ha='center'
      )  
    
    fig.tight_layout(pad=0.5) 
    fig.savefig(os.path.dirname(__file__)+'/'+'CarteraGiro.png', bbox_inches='tight', dpi=300)
    plt.show(block=False) 
    #plt.pause(180)
    plt.close('all')
    
    print('*** END: AppGiroValues  ***')
    print('***')

if __name__ == '__main__':
  AppGiroValues()