# RUN ON TERMINAL
# >python main.py  
import os 
import pandas as pd
import time 
import datetime

class TimeCounter:
  def __init__(self): 
    self.startTime = time.time()  
    local_time = time.ctime(time.time())
    print("Date:",local_time) 
    
  def start(self): 
    self.startTime = time.time()  
    
  def end(self):  
    local_time = time.ctime(time.time())
    print("Date:",local_time)
    self.stopTime = time.time()-self.startTime 
    print("Run time:", str(datetime.timedelta(seconds=self.stopTime)))  

class Acount:

  def __init__(self,cast=None):
    print("Acount created")
    self.resetAcount()
    if (cast is not None):
      self.cast=cast

  def resetAcount(self):
    self.cast=0
    self.benefitLoss=0
    self.margin=0
    self.available=0
    self.realCast=0
    self.positions=pd.DataFrame(columns=['id','Margin', 'B/L', 'Open']) 
    self.openPos=0 

  def printStatusAcount(self):
    self.updateAcount()    
    print('Acount info:')    
    print(' Cast: ',self.cast) 
    print(' B/L: ',self.benefitLoss) 
    print(' Margin: ',self.margin) 
    print(' Available cast: ',self.available) 
    print(' Real Cast: ',self.realCast,' (',round((self.realCast*1.00/self.cast)*100,2),'%)') 
    print(' Open Positions: ',self.openPos)
    #print(self.positions)    
    
  def updateAcount(self):
    self.cast        = self.cast + self.positions.loc[self.positions['Open'] == False,'B/L'].sum()
    self.positions   = self.positions.loc[self.positions['Open'] == True]
    self.benefitLoss = self.positions.loc[self.positions['Open'] == True,'B/L'   ].sum()
    self.margin      = self.positions.loc[self.positions['Open'] == True,'Margin'].sum()
    self.available   = self.cast - self.margin
    self.realCast    = self.cast + self.benefitLoss
    self.openPos     = len(self.positions)

  def createPosition(self,margin):
    self.updateAcount()
    if (margin<=self.available):
      id = self.positions['id'].max()+1
      if pd.isna(id):
        id=0
      self.positions = self.positions.append({
        'id': id,
        'Margin': margin, 
        'B/L': 0, 
        'Open': True
      }, ignore_index=True)
      self.updateAcount()
      return id
    else:
      return -1

  def updatePosition(self,id,bl,stillOpen=True):
    self.positions.loc[self.positions['id'] == id,'B/L']=bl
    if (stillOpen == False):
      self.positions.loc[self.positions['id'] == id,'Open']=False
    self.updateAcount()

class MyTradingStrategy:
  def __init__(self):
    print("MyTradingStrategy created")
    self.data = None

  def readDataEURUSD(self):
    print("readData start")
    dir = os.path.dirname(__file__)
    files = os.listdir(dir+'/dataEURUSD')
    self.data = pd.DataFrame( columns=['Time','Open','High','Low','Close']) 
    for x in range(0, len(files)-1):
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
    print(self.data.head()) 
    print("readData end")

  def exportResult(self,nameMethod):
    print("exportResult start")        
    exportData = self.data.copy()
    exportData.insert(0, 'Time', exportData.index, True) 
    exportData['Time'] = pd.to_datetime(exportData['Time']) 
    #exportData = exportData.head(10) 
    #print(exportData.head())
    exportData.to_json('dataResult/candlestick_EURUSD_M1_'+nameMethod+'.json', orient='split') 
    print("exportResult end")   
    
  def method_EURUSD_01(self):
    print("method01 start")
    #self.readDataEURUSD()  
    spread = 0.00006 
    acount = Acount(500)   
    pos01 = acount.createPosition(margin=333) 
    pos02 = acount.createPosition(margin=333) 
    pos03 = acount.createPosition(margin=433)
    #acount.printStatusAcount()    
    acount.updatePosition(id=pos01,bl=5)
    acount.updatePosition(id=pos02,bl=1)
    acount.updatePosition(id=pos03,bl=1)
    #acount.printStatusAcount()
    acount.updatePosition(id=pos01,bl=-3,stillOpen=False) 
    acount.updatePosition(id=pos02,bl= 1,stillOpen=False)  
    acount.updatePosition(id=pos03,bl=-2,stillOpen=False)  
    acount.printStatusAcount() 
    #self.exportResult('mth01')
    print("method01 end")  

print("*** START SCRIPT ***")
tm = TimeCounter()
tm.start()
mts = MyTradingStrategy()
mts.method_EURUSD_01()
tm.end()
print("*** END SCRIPT ***") 