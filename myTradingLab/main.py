# RUN ON TERMINAL
# >python main.py  
import os 
import pandas as pd
from datetime import datetime
import json
 
print("*** START SCRIPT ***") 
class myTradingStrategy:
  def __init__(self):
    print("loadData created")
    self.readData()

  def readData(self):
    print("readData start")
    dir = os.path.dirname(__file__)
    files = os.listdir(dir+'/dataEURUSD')
    self.data = pd.DataFrame( columns=['Time','Open','High','Low','Close']) 
    for x in range(0, len(files)-2):
      del files[0] 
    for file in files: 
      df = pd.read_csv(dir+'/dataEURUSD/'+file, sep = ';', header=None, usecols=[0,1,2,3,4,5], names=['Time','Open','High','Low','Close','Vol'])  
      df = df.drop(columns=['Vol']) 
      df['Time'] = pd.to_datetime(df['Time']) 
      self.data = self.data.append(df)   
      print(' '+dir+'/dataEURUSD/'+file)
      #print(df.head()) 
    self.data = self.data.set_index('Time')
    #print(self.data.head()) 
    print(' Rows: '+str(len(self.data)))
    print("readData end")

  def exportResult(self):
    print("exportResult start")        
    exportData = self.data.copy()
    exportData.insert(0, 'Time', exportData.index, True) 
    exportData['Time'] = pd.to_datetime(exportData['Time']) 
    #exportData = exportData.head(10) 
    #print(exportData.head())
    exportData.to_json('dataResult/candlestick_EURUSD_M1.json', orient='split') 
    print("exportResult end")  
    
mts = myTradingStrategy()
mts.exportResult()

print("*** END SCRIPT ***") 