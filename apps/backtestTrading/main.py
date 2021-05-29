#main.py
print("*** START SCRIPT ***") 
import tkinter as tk
import os as os 
import pandas as pd
import mplfinance as fplt 

class MyGUI:
  def __init__(self):
    self.window = tk.Tk()
    self.btn2 = tk.Button(self.window, height = 1, width = 20, text="Exit", command=self.exit) 
    self.btn2.pack(expand=True, fill=tk.BOTH, padx=5, pady=5) 
    self.btn1 = tk.Button(self.window, height = 2, width = 20, text="Plot", command=self.plot) 
    self.btn1.pack(expand=True, fill=tk.BOTH, padx=5, pady=5) 
    self.window.mainloop()

  def exit(self):    
    self.window.quit()    
    self.window.quit()

  def plot(self):
    dir = os.path.dirname(__file__)
    df = pd.read_csv(dir+'/DAT_MT_EURUSD_M1_2020.csv', header=None, usecols=[0,1,2,3,4,5,6], names=['Date','Hour','Open','High','Low','Close','Vol']) 
    df.insert(0, "Time", df['Date'] +" "+ df['Hour'], True)
    df = df.drop(columns=['Date', 'Hour', 'Vol']) 
    df['Time'] = pd.to_datetime(df['Time'])
    df = df.set_index('Time')
    df = df.head(100)
    print(df.head())  
 
    #figure = fplt.plot(df, type='candle', style='charles', title='EURUSD_M1_2020', ylabel='Price', returnfig=True)   

    import matplotlib
    matplotlib.use("TkAgg") 
    from matplotlib.figure import Figure
    from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg

    fig = Figure(figsize = (5, 5), dpi = 100) 
    myplot = fplt.plot(df, type='candle', style='charles', title='EURUSD_M1_2020', ylabel='Price', returnfig=True)  
    #output = FigureCanvasTkAgg(fig, master = self.window)
    #output.draw() 
    #output.get_tk_widget().pack() 
    #self.canvas.pack()
    #self.canvas.get_tk_widget().grid(row=0, column=0)    
    
MyGUI()

#Preapp: handle file
class MyAuxTools:  
  def __init__(self):
    print("MyAuxTools created")
  def deletefilesInCurretFolder(seft,fileExt): 
    dir = os.path.dirname(__file__)
    for f in os.listdir(dir):
      if not f.endswith("."+fileExt):
        continue
      os.remove(os.path.join(dir, f))
      print("removed file: "+os.path.join(dir, f))

#App: Main backteting   
class Mybacktesting:  
  def __init__(self):
    print("Mybacktesting created") 
  def exe(self): 
    dir = os.path.dirname(__file__)
    df = pd.read_csv(dir+'/DAT_MT_EURUSD_M1_2020.csv', header=None, usecols=[0,1,2,3,4,5,6], names=['Date','Hour','Open','High','Low','Close','Vol']) 
    df.insert(0, "Time", df['Date'] +" "+ df['Hour'], True)
    df = df.drop(columns=['Date', 'Hour', 'Vol']) 
    df['Time'] = pd.to_datetime(df['Time'])
    df = df.set_index('Time')
    df = df.head(100)
    #print(df.head()) 
    #print(df.info()) 

    fplt.plot(df, type='candle', style='charles', title='EURUSD_M1_2020', ylabel='Price')

#Exe script code.
#mt = MyAuxTools()
#mt.deletefilesInCurretFolder("html")
#mb = Mybacktesting()
#mb.exe() 

print("*** END SCRIPT ***") 