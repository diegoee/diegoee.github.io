import time
ini = time.time()
import os
import random

root_script = os.path.dirname(os.path.abspath(__file__))
name_script = os.path.basename(__file__) 
print(f"Ini: {name_script}")
print(f" Root script: {root_script}")

time.sleep(random.random()) 

end = time.time()-ini
print(f'End. {name_script}')
print(f'Exe time: {end:.3f} s')