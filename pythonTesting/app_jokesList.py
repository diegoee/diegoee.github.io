class MyLogger:        
  def __init__(self,filename='log',logLevel='INFO',delFolder=False):
    self.logging = __import__('logging')
    if logLevel=='DEBUG':
      self.levelMain=self.logging.DEBUG
    if logLevel=='INFO':
        self.levelMain=self.logging.INFO
    if logLevel=='WARNNIG':
      self.levelMain=self.logging.WARNNIG
    if logLevel=='ERROR':
      self.levelMain=self.logging.ERROR

    import os
    folder = os.path.dirname(__file__)+'/logs_jokesList'
    self.folder=folder
    isExist = os.path.exists(folder)
    
    from datetime import date
    if not isExist:
      os.makedirs(folder)
    else:
      if delFolder:
        import shutil
        if isExist:
          shutil.rmtree(folder)
        os.makedirs(folder) 

    filename = date.today().strftime("%Y_%m_%d")+'_'+filename
    self.logging.basicConfig(
      format='%(asctime)s %(levelname)s -> %(message)s',
      filename=folder+'/'+filename+'.log', 
      encoding='utf-8', 
      level=self.levelMain
    )
    self.log_debug('LoggerEtl created') 

  def log(self,txt,level):  
    if level == self.logging.DEBUG: 
      self.logging.debug(txt)
      if self.levelMain == self.logging.DEBUG:
        print('DEBUG: '+txt)
    if level == self.logging.INFO: 
      self.logging.info(txt)
      if self.levelMain == self.logging.DEBUG or self.levelMain == self.logging.INFO:
        print('INFO: '+txt)
    if level == self.logging.WARNING: 
      self.logging.warning(txt)
      if self.levelMain == self.logging.DEBUG or self.levelMain == self.logging.INFO or self.levelMain == self.logging.WARNING:
        print('WARNING: '+txt)
    if level == self.logging.ERROR: 
      self.logging.error(txt)
      print('ERROR: '+txt)

  def log_debug(self,txt): 
    self.log(txt,self.logging.DEBUG)

  def log_info(self,txt): 
    self.log(txt,self.logging.INFO)

  def log_warning(self,txt): 
    self.log(txt,self.logging.WARNING)

  def log_error(self,txt): 
    self.log(txt,self.logging.ERROR)

class JokesList: 
  def __init__(self):   
    import os
    import pandas as pd
    import numpy as np

    config = os.path.dirname(__file__)
    config = config+'/config_jokesList.json'
    config = pd.read_json(config)
    level = config['loglevel'].iloc[0]
    filename = os.path.basename(__file__)
    filename = filename.split('.')[0]
    self.logger = MyLogger(filename,level,True)

    self.logger.log_info(' ')
    self.logger.log_info('INI: '+filename)

    self.setInterval(self.getJoke)

    self.logger.log_info('END: '+filename)
    self.logger.log_info(' ')

  def getJoke(self):
    import requests
    import numpy as np
    import pandas as pd

    #toPrint = 'getJoke INI'
    #self.logger.log_info(toPrint)

    url = 'https://v2.jokeapi.dev/joke/Any?lang=en&safe-mode'
    #toPrint = url
    #self.logger.log_info(toPrint)

    try:
      res = requests.get(url)
      #toPrint = 'status code: '
      #toPrint = toPrint+str(res.status_code)
      #self.logger.log_info(toPrint)

      #toPrint = res.json()
      #print(toPrint)
      res = pd.DataFrame.from_dict(res.json(),orient="index")
      aux = res[0].iloc[0]
      if not aux:
        #toPrint = '-'
        #self.logger.log_info(toPrint)
        toPrint = 'Categoty: '+res[0].iloc[1]
        self.logger.log_info(toPrint)
        aux = res[0].iloc[2]
        joke = ' '
      if aux=='single':
        joke = res[0].iloc[3]
      if aux=='twopart':
        joke = res[0].iloc[3]+' '+res[0].iloc[4]
      toPrint = joke
      self.logger.log_info(toPrint)
      #toPrint = '-'
      #self.logger.log_info(toPrint)

    except Error:
      toPrint = 'Error '
      self.logger.log_error(toPrint)

    #toPrint = 'getJoke END'
    #self.logger.log_info(toPrint)
    self.logger.log_info(' ')
    return 0

  def setInterval(self,func):
    toPrint = 'setInterval INI'
    self.logger.log_info(toPrint)
    from threading import Timer
    self.on=0
    onMax=5
    sec=2

    def rec():
      self.on=self.on+1
      toPrint = str(self.on)+'/'+str(onMax)
      self.logger.log_info(toPrint)
      func()
      if self.on<onMax:
        Timer(sec, rec).start()
      else:
        toPrint = 'END'
        self.logger.log_info(toPrint)

    Timer(1, rec).start()

    toPrint = 'jokes interval by '+str(sec)+'s -> max. jokes: '+str(onMax)
    self.logger.log_info(toPrint)

    toPrint = 'setInterval END'
    self.logger.log_info(toPrint)

if __name__ == '__main__':
  JokesList() 