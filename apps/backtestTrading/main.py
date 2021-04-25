#main.py
print("*** START SCRIPT ***")

#Preapp: handle file
class MyAuxTools:  
  def __init__(self):
    print("MyAuxTools created")
  def deletefilesInCurretFolder(seft,fileExt):
    import os 
    dir = os.path.dirname(__file__)
    for f in os.listdir(dir):
      if not f.endswith("."+fileExt):
        continue
      os.remove(os.path.join(dir, f))
      print("removed file: "+os.path.join(dir, f))

mt = MyAuxTools()
mt.deletefilesInCurretFolder("html")

#App: Main backteting   
class Mybacktesting:  
  def __init__(self):
    print("Mybacktesting created") 
  def exe(self):
    import os 
    import pandas as pd
    dir = os.path.dirname(__file__)
    df = pd.read_csv(dir+'/DAT_MT_EURUSD_M1_2020.csv', header=None, usecols=[0,1,2,3,4,5,6], names=['Date','Hour','Open','High','Low','Close','Vol']) 
    df.insert(0, "Time", df['Date'] +" "+ df['Hour'], True)
    df = df.drop(columns=['Date', 'Hour', 'Vol']) 
    df['Time'] = pd.to_datetime(df['Time'])
    df = df.set_index('Time')
    df = df.head(100)
    #print(df.head()) 
    #print(df.info()) 

    import mplfinance as fplt
    fplt.plot(df, type='candle', style='charles', title='EURUSD_M1_2020', ylabel='Price')

mb = Mybacktesting()
mb.exe() 

print("*** END SCRIPT ***") 