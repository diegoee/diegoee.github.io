// init var
var songs = [];
var abc='';  

/*
abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:As Time Goes By\n';
abc=abc+'M:4/4\n';
abc=abc+'L:1/8\n';
abc=abc+'K:F\n';
abc=abc+'G| AG F E2 F3| GB AG F A3| Be dc B c3-| c3 z2 z| d| fe dc d2 e2| B2 B2 E2 F2|]\n';
abc=abc+'G8-| G6 z G| AG FE F3 G| BA GF A3 B| ed cB c4| z4 z2 z d| fe dc d2 e2|]\n';
abc=abc+'B2 B2 E2 F2| E8-| E4 z4| E F3/2 E/2 c3 c2| c_d c=B c4| FG F c3 c2|]\n';
abc=abc+'c_d c=B c4| GA G e3 e2| ed ed f2 d2| c2 c2 G2 G2| B6 z G| AG FE F F2 G|]\n';
abc=abc+'BA GF A A2 B| ed cB c4| z6 d2| fe dc d2 e2| B2 B4 G2| B4 B4| e6 z2|]\n';  
songs.push(abc);
*/

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T: All of Me (no Chords)\n'; 
abc=abc+'C: --\n'; 
abc=abc+'L:1/16\n';     
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=135\n';
abc=abc+'K:D\n';    
abc=abc+'   d4 A2F2- F8- |F8      (3d4e4d4  |c4 ^A2F2- F8- |F16   |\n';   
abc=abc+'   B6 A2 F8-    |F4  ^E4 (3F4=c4B4 |A8 G8-        |G16   |\n';  
abc=abc+'   F6 =F2 E8-   |E8      (3F4^A4c4 |e8 d8-        |d16   |\n';  
abc=abc+'   c6 =c2 B8-   |B8      (3B4e4c4  |B16           |c16   |\n';  
abc=abc+'   d4 A2F2- F8- |F8      (3d4e4d4  |c4 ^A2F2- F8- |F16   |\n';  
abc=abc+'   B4 A2F2- F8- |F4  ^E4 (3F4=c4B4 |A8 G8-        |G16   |\n'; 
abc=abc+'   e8 d4 c4     |e12 c4            |B8  F4 A4     |c12 B4|\n';  
abc=abc+'   d8 B4 d4     |f8 f8             |d16-          |d16   |]\n';   
songs.push(abc);


abc=''; 
abc=abc+'X:1\n';
abc=abc+'T: All of Me\n'; 
abc=abc+'C: --\n'; 
abc=abc+'L:1/16\n';     
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=135\n';
abc=abc+'K:D\n';    
abc=abc+'"D"d4 A2F2- F8- |F8      (3d4e4d4  |"F#7"c4 ^A2F2- F8-|    F16|\n';   
abc=abc+'"B7"B6 A2 F8-   |F4  ^E4 (3F4=c4B4 |"E-" A8 G8-       |    G16|\n';  
abc=abc+'"F#7"F6 =F2 E8- |E8      (3F4^A4c4 |"B-" e8 d8-       |    d16|\n';  
abc=abc+'"E7" c6 =c2 B8- |B8      (3B4e4c4  |"E-7"B16          |"A7"c16|\n';  
abc=abc+'"D"d4 A2F2- F8-|F8      (3d4e4d4  |"F#7"c4 ^A2F2- F8- |F16    |\n';  
abc=abc+'"B7"B4 A2F2- F8-|F4  ^E4 (3F4=c4B4 |"E-" A8 G8-       |G16    |\n'; 
abc=abc+'"G" e8 d4 c4    |"G-"e12 c4        |"D7"B8 "F#-7"F4 A4|"B7"c12 B4|\n';  
abc=abc+'"E-7"d8 B4 d4   |"A7"f8 f8         |"D6"d16-          |d16   |]\n';   
songs.push(abc);


abc=''; 
abc=abc+'X:1\n';
abc=abc+'T: Stand by Me\n'; 
abc=abc+'C: Jerry Leiber, Mike Stoller and Ben E. King\n'; 
abc=abc+'L:1/16\n';     
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=95\n';
abc=abc+'K:F\n'; 
abc=abc+'[V:1]\n'; 
abc=abc+'A2c2|d12 A2c2- |c12 z4|z4F2G2 A2 G4 F2-|\n';   
abc=abc+'F8 z2 F2 G2A1G1|F8 z2 F2 A2G2-|G2 F6 z2 G2 G4|\n';   
abc=abc+'F12 z4|z8 z4 A2c2|d8- d2A2c2d2-|\n';       
abc=abc+'d6 c2 B2A2G2F2|A8 z2 G2 G4|F8- F2F2G2A2|\n';    
abc=abc+'F8 z2 G2 A4|G2 F6 z2 A2 G4|F12 z2 c2|\n';    
abc=abc+'d2c2 c4 f4 e4|d2c2 d4-d2 d4 d2-|d6 d2- d2c2 z2 A1G1|\n';    
abc=abc+'F1G1 A6- A4 G4|F8 z4 A4|G2 F6-F4 z4|\n';  
abc=abc+'z4 A2G2- G2 F6|z4 A2G2-G4 F4|z8 z2 A2 c2d2-|\n';
abc=abc+'d8- d2A1c1 c1d1c2-|c2 d6-d4 z4|z4 z2 G2 A2A2 G4|\n';
abc=abc+'F8 z2 F2 G2A2|G2 F6-F4 z2G2|A2G2 F4- F2F2 G4|\n';
abc=abc+'F10 z4|]\n';
abc=abc+'[V:2]\n';  
abc=abc+'z4|F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 F2E2    |D4 z2 D2- D2 z2 C4  |\n';  
abc=abc+'   D4 z2 D2- D2 z2 D2C2    |B,4 z2 B,2- B,2 z2 B,2D2|C4 z2 C2- C2 z2 C2E2|\n'; 
abc=abc+'   F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2|\n'; 
abc=abc+'   F4 z2 F2- F2 z2 F2E2    |D4 z2 D2- D2 z2 C4      |D4 z2 D2- D2 z2 D2C2|\n';  
abc=abc+'   B,4 z2 B,2- B,2 z2 B,2D2|C4 z2 C2- C2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2|\n';
abc=abc+'   F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 F2E2    |D4 z2 D2- D2 z2 C4  |\n';  
abc=abc+'   D4 z2 D2- D2 z2 D2C2    |B,4 z2 B,2- B,2 z2 B,2D2|C4 z2 C2- C2 z2 C2E2|\n'; 
abc=abc+'   F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2|\n'; 
abc=abc+'   F4 z2 F2- F2 z2 F2E2    |D4 z2 D2- D2 z2 C4      |D4 z2 D2- D2 z2 D2C2|\n';  
abc=abc+'   B,4 z2 B,2- B,2 z2 B,2D2|C4 z2 C2- C2 z2 C2E2    |F4 z2 F2- F2 z2 C2E2|\n';  
abc=abc+'   F10 z4|]\n';
songs.push(abc);
 
abc=''; 
abc=abc+'X:1\n';
abc=abc+'T: City of Star (My A\')\n'; 
abc=abc+'C: Diego E.\n'; 
abc=abc+'L:1/8\n';     
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=100\n';
abc=abc+'K:C\n'; 
abc=abc+'"Dm" D1E1F1A1- A1 z1 A1A1|"Bm" z2 G1A1 c1B1A1B1|"Am"E4 z2 z1 D1 |E2 z6|\n';  
abc=abc+'"Dm" D1E1F1A1- A1 z1 A1A1|"Bm" z2 A1E1 A1E1D1E1|"C"z1 E3 z2 G1D1|E2 z4 z1E1|\n';
abc=abc+'"Dm"     F2 z1 E1F2 z1 E1|"Bm" F2 z1 E1F2 z1 D1|"Am" E2 z1 D1E2 z1D1|E2 z4 e2|]\n';
songs.push(abc);

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T: Scales\n'; 
abc=abc+'C: Diego E.\n'; 
abc=abc+'L:1/4\n';     
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=80\n';
abc=abc+'K:C\n'; 
abc=abc+'"^Mayor"  "C"  C1 D1 E1 F1   | G1 A1 B1 c1| c1 d1 e1 f1 | g1 a1 b1 c\'1| C3 G1 |C4|\n';  
abc=abc+'"^Minor " "Am" A,1 B,1 C1 D1 | E1 F1 G1 A1| A1 B1 c1 d1 | e1 f1 g1 a1  | A,3 E1 |A,4|]\n';
songs.push(abc); 

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:Ain\'t no sunshine (Arr. Diego E. v1)\n'; 
abc=abc+'C:Bill Withers.\n'; 
abc=abc+'L:1/16\n';   
abc=abc+'%%barnumbers 4\n'; 
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=79\n';
abc=abc+'K:Am\n'; 
abc=abc+'"^Tema A"       E1G2A1- A1c3 B2A2          |"Am" A8 "Em7"z4 "G"z4        |"Am" z4 E1G2A1- A1c3 B2G2     |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2   |"Dm7"z4 c1d1c2- c4 A1G2A1-    |"Am"A8 "Em7"z4"G"z4          |\n'; 
abc=abc+'"^Tema A (bis)" "Am" z4 E1G2A1- A1c3 B2A2  |"Am" A8 "Em7"z4"G"z4         |"Am" z4 E1G2A1- A1c3 B2G2     |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2   |"Dm7"z4 c1d1c2- c4 A1G2A1-    |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"^Tema B" "Am" z3 E1 G1A2G1 A2G1A1- A1G1A2 |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |G1A2G1 A2G1A1- A1G1A2 G1A2E1  |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |\n';
abc=abc+'     G1A2G1 A2G1A1- A1G1A2 G1A2E1          |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |G1A2G1 A2G1A1- A1G1A2 G1A2E1  |"Am"G1A2G1 A4 z8             |\n';  
abc=abc+'"^Tema A+Out" "Am" z4 E1G2A1- A1c3 B2A2    |"Am" A8 "Em7"z4"G"z4         |"Am" z4 E1G2A1- A1c3 B2G2     |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2   |"Dm7"z4 c1d1c2- c4 A1G2A1-    |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"Am" z4 c1d1c2- c4 A1G2A1-                 |"Am"A8 "Em7"z4"G"z4          |"Am"z4 c1d1c2- c4 A1G2A1-     |"Am"A12 z4                   |]\n';
songs.push(abc); 

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:Ain\'t no sunshine (Arr. Diego E. v1 with "my Solo")\n'; 
abc=abc+'C:Bill Withers.\n'; 
abc=abc+'L:1/16\n';   
abc=abc+'%%barnumbers 4\n'; 
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=79\n';
abc=abc+'K:Am\n'; 
abc=abc+'"^Tema A"       E1G2A1- A1c3 B2A2          |"Am" A8 "Em7"z4 "G"z4        |"Am" z4 E1G2A1- A1c3 B2G2     |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2   |"Dm7"z4 c1d1c2- c4 A1G2A1-    |"Am"A8 "Em7"z4"G"z4          |\n'; 
abc=abc+'"^Solo" "Am" z4 E4 e1d3  c1A3              |"Am" A8 "Em7"z4 "G"z4        |"Am" z4 E1G2A1 c4 E1G2c1      |"Am"d4 z4 "Em7"z4"G"d1c2A1-  |\n';
abc=abc+'"Am" A4 z8   z2E2                          |"Em" A4 A4 A4 d2c2           |"Dm7"A4 z8  C1D2E1            |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"^Tema B" "Am" z3 E1 G1A2G1 A2G1A1- A1G1A2 |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |G1A2G1 A2G1A1- A1G1A2 G1A2E1  |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |\n';
abc=abc+'     G1A2G1 A2G1A1- A1G1A2 G1A2E1          |G1A2G1 A2G1A1- A1G1A1E1 G2E2 |G1A2G1 A2G1A1- A1G1A2 G1A2E1  |"Am"G1A2G1 A4 z8             |\n';  
abc=abc+'"^Tema A+Out" "Am" z4 E1G2A1- A1c3 B2A2    |"Am" A8 "Em7"z4"G"z4         |"Am" z4 E1G2A1- A1c3 B2G2     |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2   |"Dm7"z4 c1d1c2- c4 A1G2A1-    |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"Am" z4 c1d1c2- c4 A1G2A1-                 |"Am"A8 "Em7"z4"G"z4          |"Am"z4 c1d1c2- c4 A1G2A1-     |"Am"A12 z4                   |]\n';
songs.push(abc);


abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:Ain\'t no sunshine (Arr. Diego E. v2)\n'; 
abc=abc+'C:Bill Withers.\n'; 
abc=abc+'L:1/16\n';   
abc=abc+'%%barnumbers 4\n'; 
abc=abc+'M:4/4\n';
abc=abc+'Q:1/4=79\n';
abc=abc+'K:Am\n'; 
abc=abc+'"^Tema A"       E1G2A1- A1c3 B2A2-         |"Am" A2 A6 "Em7"z4 "G"z4       |"Am" z4 E1G2A1- A1c3 B2G2        |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2     |"Dm7"z4 c1d1c2- c4 A1G2A1        |"Am"A8 "Em7"z4"G"z4          |\n'; 
abc=abc+'"^Tema A (bis)" "Am" z4 E1G2A1- A1c3 B2A2- |"Am" A2 A6 "Em7"z4"G"z4        |"Am" z4 E1G2A1- A1c3 B2G2        |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2     |"Dm7"z4 c1d1c2- c4 A1G2A1        |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"^Tema B" "Am" z3 E1 G1A2G1 A2G1A1- A1G1A2 |G1A2G1 A2G1A1- A1G1A1E1 G1A2G1 |A2G1A1- A1G1A1E1 G1A2G1 B2G1A1-  |A1G1A2 G1A2G1 A2G1A1- A1G1A2 |\n';
abc=abc+'     G1A2G1 A2G1A1- A1G1A2 G1A2G1          |A1E1G1A1 e3d1 d1e1g1e1- e1d2c1 |d3c1  e1d3 c1c2B1- B1A3-         |"Am"A2 A6 z8                 |\n';  
abc=abc+'"^Tema A+Out" "Am" z4 E1G2A1- A1c3 B2A2-   |"Am" A2 A6 "Em7"z4"G"z4        |"Am" z4 E1G2A1- A1c3 B2G2        |"Am"A8 "Em7"z4"G"z4          |\n';
abc=abc+'"Am" z4 A1A2c1- c1e3 d2e2                  |"Em"d4 z1 A1d1c1- c2A2G2A2     |"Dm7"z4 c1d1c2- c4 A1G2A1        |"Am"A8 "Em7"z4"G"z4          |\n';  
abc=abc+'"Am" z4 c1d1c2- c4 A1G2A1                  |"Am"A8 "Em7"z4"G"z4            |"Am"z4 c1d1c2- c4 A1G2A1         |"Am"A12 z4                   |]\n';
songs.push(abc); 

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Rock On Solo\n'; 
abc=abc+'L:1/8\n';   
abc=abc+'%%barnumbers 4\n'; 
abc=abc+'M:C\n';
abc=abc+'Q:1/4=130\n';
abc=abc+'K:D\n'; 
abc=abc+'"D7" z8|    z8|     z8|    z8|\n';
abc=abc+'"G7" z8|    z8|"D7" z8|    z8|\n';
abc=abc+'"Bb" z8|"A7"z8|"Bb7"z8|"A7"z8|\n'; 
abc=abc+'"Bb7"z8|"A7"z8|"D7" z8|    z8|\n';
abc=abc+'     z8|    z8|]\n';       
songs.push(abc); 

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Hot and Humid Solo\n'; 
abc=abc+'L:1/8\n';   
abc=abc+'%%barnumbers 4\n'; 
abc=abc+'M:C\n';
abc=abc+'Q:1/4=126\n';
abc=abc+'K:Em\n'; 
abc=abc+'"Em"z1 B3 A4      |"F#m"B2 A1^c1 "B7"z2 z1G1|"Em"z1G1  z1E1  G2  E1G1|"Bm"z4 z2 "E7"F1A1-|\n';
abc=abc+'"Am"A2 z2 z4      |z2 F2 F2 F2              |"F#m"F2 A2 z2 G1E1      |"B7" z8            |\n';
abc=abc+'"Em"z1 B3 A4      |"F#m"B2 A1^c1 "B7"z2 z1E1|"Em"z1^F1 z1G1 z1A1 z1G1|"Bm"E2z2 "E7"z2G2- |\n'; 
abc=abc+'"G"G2 _B2 =A1G1 A2|"F#m"z2 e2 "B7"B1A1 G1A1 |"Em" G1E1 z4 B2         |"F#m"E2z2 "Bm"z4   |]\n';       
songs.push(abc);  

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Love for Sale Solo (Theme A)\n'; 
abc=abc+'L:1/8\n';
abc=abc+'%%barnumbers 2\n';  
abc=abc+'M:C\n';
abc=abc+'Q:1/4=165\n';
abc=abc+'K:Cm\n'; 
abc=abc+'"F"c8-        |c2z2=A4   |"Cm"G4z2E2 |C2z2E4 |\n';
abc=abc+'"F"z2F2G4     |z2E2C2B,2 |"Cm"/C8-   |C6z2   |\n';
abc=abc+'"F"z1D1F2F1F3 |z1D1F2F1F3|"Eb"G4F4   |E4C4   |\n';
abc=abc+'"Dm"G8        |z4c2G2    |"Cm"C8-    |C4  z4 |]\n'; 
songs.push(abc);  

//export to window var
window.songs=songs;