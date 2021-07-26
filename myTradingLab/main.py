 # RUN ON TERMINAL
# >python main.py 
print("*** START SCRIPT ***")  
import os 
import pandas as pd
from datetime import datetime
import json

class myTradingStrategy:
  def __init__(self):
    print("loadData created")
    self.readData()

  def readData(self):
    print("readData")
    dir = os.path.dirname(__file__)
    files = os.listdir(dir+'/dataEURUSD')
    self.data = pd.DataFrame(columns=['Open','High','Low','Close'])
    for file in files: 
      print(' '+dir+'/dataEURUSD/'+file)
      #df = pd.read_csv(dir+'/dataEURUSD/'+file, header=None, usecols=[0,1,2,3,4,5,6], names=['Date','Hour','Open','High','Low','Close','Vol']) 
      #df.insert(0, "Time", df['Date'] +" "+ df['Hour'], True)
      #df = df.drop(columns=['Date', 'Hour', 'Vol']) 
      #df['Time'] = pd.to_datetime(df['Time'])
      #df = df.set_index('Time')
      #self.data.append(df) 

    print(self.data.head()) 

  def exportResult(self):
    print("exportResult")        
    #exportData = self.data
    #exportData.insert(0, 'Time', self.data.index, True)  
    #exportData.to_json('dataResult/candlestick.json', orient='split')
    
    
mts = myTradingStrategy()
mts.exportResult()

print("*** END SCRIPT ***") 