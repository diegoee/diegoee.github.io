## GLOBAL IMPORT
import time
start_time = time.time()
import os  

## INIT VARIABLES    
root = os.path.dirname(__file__) 
file_name = os.path.basename(__file__) 
print("***********") 
print("Start: "+file_name)  

## CREAR EXE APP 
from kivy.app import App 
from kivy.uix.label import Label
from kivy.uix.button import Button  
from kivy.uix.gridlayout import GridLayout   

import numpy as np
import sounddevice as sd 

class MyApp(App): 
  
  ##Multieffectos
  class AudioEffects():
    def __init__(self):
      print("audioEffects. Init")
  
      self.sample_rate  = 44100   # muestras por segundo 
      duration          = 1*60   # en segundos
      frequency         = 440.0   # Hz (A4)
      tremolo_freq      = 2.5     # Hz
  
      t = np.linspace(0, duration, int(self.sample_rate * duration), False)
      self.tone = 1.0 *       np.sin(2 * np.pi * frequency    * t) 
      lfo       = 0.5 * (1 +  np.sin(2 * np.pi * tremolo_freq * t))
      self.tone = self.tone * lfo

    def playNote(self, ):   
      sd.play(self.tone, samplerate=self.sample_rate, blocking=False) 

    def stopNote(self, ):  
      sd.stop()

  ##App Kivy 
  def build(self): 
    print('MyApp. build')  
    
    self.title = "Generador de Tono"  
    nRows=2
    nCols=1 
    self.layout    = GridLayout(rows=nRows,       cols=nCols,     padding=10, spacing=10) 
    self.label     = Label(     text="...",       halign='left',  valign='top')
    self.botonNote = Button(    text="Play note", font_size=24)   
    
    self.botonNote.bind(on_press=self.action_note)  
    self.botonNote.noteOnOff=False  

    self.layout.add_widget(self.botonNote) 
    self.layout.add_widget(self.label) 

    return self.layout    
  
  def on_start(self): 
    print('MyApp. on_start')  
    self.audioEffects = self.AudioEffects() 
  
  def on_stop(self): 
    print('MyApp. on_stop')    
  
  def action_note(self, instance):
    print('MyApp. action_note')    
    if not self.botonNote.noteOnOff: 
      self.audioEffects.playNote()
      self.botonNote.text="Stop note" 
    else: 
      self.audioEffects.stopNote()
      self.botonNote.text="Play note" 
    self.botonNote.noteOnOff=not self.botonNote.noteOnOff

MyApp().run()

## END   
exe_time = time.time() - start_time 
print("Exe time: %.2f s"%(exe_time))
print("End  : "+file_name)
print("*****************************") 