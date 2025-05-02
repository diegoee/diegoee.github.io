## GLOBAL IMPORT
import time
start_time = time.time()
import os

## INIT VARIABLES    
root = os.path.dirname(__file__) 
file_name = os.path.basename(__file__) 
print("***********") 
print("Start: "+file_name) 
print("root: "+root) 

from kivy.app import App
from kivy.uix.widget import Widget
from kivy.uix.label import Label
from kivy.uix.button import Button 
from kivy.uix.scrollview import ScrollView
from kivy.uix.floatlayout import FloatLayout
from kivy.uix.gridlayout import GridLayout 
from kivy.graphics import Line, Color, Rotate, PushMatrix, PopMatrix
from kivy.clock import Clock

class LoadingCircle(Widget):
  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    self.angle = 0
    with self.canvas:
      PushMatrix()
      self.rot = Rotate(angle=self.angle, origin=self.center)
      Color(0.4, 0.7, 1, 0.3)  
      self.full_circle = Line(circle=(self.center_x, self.center_y, 50), width=4)
      Color(0.1, 0.3, 0.8, 1) 
      self.segment = Line(circle=(self.center_x, self.center_y, 50, 0, 40), width=4)
      PopMatrix()
    self.bind(pos=self.update_canvas, size=self.update_canvas)
    Clock.schedule_interval(self.animate, 1/60)

  def update_canvas(self, *args):
    self.rot.origin = self.center
    self.full_circle.circle = (self.center_x, self.center_y, 50)
    self.segment.circle = (self.center_x, self.center_y, 50, 0, 40)

  def animate(self, dt):
    self.angle = (self.angle + 4) % 360
    self.rot.angle = self.angle

class MyApp(App):
  def build(self): 
    
    self.layout = GridLayout(rows=3, padding=10, spacing=10)    
    self.label = Label(text="...", size_hint_y=2/3, halign='left', valign='top')

    boton = Button(text="Exe action", font_size=24, size_hint_y=1/3)
    boton.bind(on_press=self.action_boton)  

    self.spinner = LoadingCircle(size_hint_y=2/3) 
    self.spinnerOnOff=False 
    
    self.layout.add_widget(boton)
    self.layout.add_widget(self.label)
    return self.layout     
  
  def action_boton(self, instance): 
    if self.spinnerOnOff:
      self.layout.add_widget(self.label)
      self.layout.remove_widget(self.spinner) 
    else:
      self.layout.add_widget(self.spinner) 
      self.layout.remove_widget(self.label) 
    self.spinnerOnOff=not self.spinnerOnOff

MyApp().run()

## END   
exe_time = time.time() - start_time 
print("Exe time: %.2f s"%(exe_time))
print("End  : "+file_name)
print("***********") 