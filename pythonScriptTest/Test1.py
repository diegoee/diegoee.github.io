class Test1:   
    os = __import__('os')
    logging = __import__('logging')

    def __init__(self):  
        if self.os.path.exists('test1.log'):
            self.os.remove('test1.log')
        else:
            print('The file does not exist')

        self.levelMain=self.logging.DEBUG
        self.initLogging()
        
        self.log_debug('Algo de DEBUG')
        self.log_info('Algo de INFO')
        self.log_warning('Algo de WARNING')
        self.log_error('Algo de ERROR')

    def initLogging(self):  
        self.logging.basicConfig(
            format='%(asctime)s %(levelname)s -> %(message)s',
            filename='test1.log', 
            encoding='utf-8', 
            level=self.levelMain
        )  
 
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

if __name__ == '__main__':
    test1 = Test1()