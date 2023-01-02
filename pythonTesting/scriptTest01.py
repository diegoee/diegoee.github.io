class JokeList: 
    def __init__(self):   
        import os
        import pandas as pd
        import numpy as np
        
        from MyLogger import MyLogger
     
        config = os.path.dirname(__file__)
        config = config+'/config.json'
        config = pd.read_json(config)
        level = config['loglevel'].iloc[0]
        filename = os.path.basename(__file__)
        filename = filename.split('.')[0]
        self.logger = MyLogger(filename,level,True)
        
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
        onMax=20
        sec=5
        
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
    JokeList() 