## GLOBAL IMPORT
import time
start_time = time.time()
import os
import sys

## INIT VARIABLES    
root = os.path.dirname(__file__) 
file_name = os.path.basename(__file__) 
print("***********") 
print("Start: "+file_name) 

from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.button import Button
from kivy.uix.boxlayout import BoxLayout

class MyApp(App):
  def build(self):
    # Crear layout
    layout = BoxLayout(orientation='vertical', padding=10, spacing=10)

    # Crear etiqueta
    self.etiqueta = Label(text="¡Hola desde Kivy!", font_size=32)

    # Crear botón para cambiar texto
    boton_cambiar = Button(text="Haz clic aquí", font_size=24)
    boton_cambiar.bind(on_press=self.cambiar_texto)

    # Agregar widgets al layout
    layout.add_widget(self.etiqueta)
    layout.add_widget(boton_cambiar)

    return layout
  
  def cambiar_texto(self, instance):
    # Cambiar el texto de la etiqueta cuando se hace clic en el botón
    self.etiqueta.text = "¡Texto cambiado con Kivy!"


## EXE CODE   
scriptmode = False
if len(sys.argv)>1: 
  print("1st Exe arg: %s"%(sys.argv[1]))
  if sys.argv[1]=="scriptMode": 
    scriptmode = True
else:
  print("No exe arg")
MyApp().run()

## END   
exe_time = time.time() - start_time 
print("Exe time: %.2f s"%(exe_time))
print("End  : "+file_name)
print("***********") 

if scriptmode:
  sec=3
  for i in range(0,sec):
    print("Cerrado en %02d s"%(sec-i), end="\r")
    time.sleep(1)
  print("                 ", end="\r")
