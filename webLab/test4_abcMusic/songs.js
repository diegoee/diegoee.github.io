// init var
var songs = [];
var abc=''; 

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
abc=abc+'"Em"z1 B3 A4|"F#m"B2 A1^c1 "B7"z2 z1G1|"Em"z1G1  z1E1  G2  E1G1|"Bm"z4 z2 "E7"F1(A1|\n';
abc=abc+'"Am"A2) z2 z4|z2 F2 F2 F2|"F#m"F2 A2 z2 G1E1|"B7" z8|\n';
abc=abc+'"Em"z1 B3 A4|"F#m"B2 A1^c1 "B7"z2 z1E1|"Em"z1^F1 z1G1 z1A1 z1G1|"Bm"E2z2 "E7"z2(G2|\n'; 
abc=abc+'"G"G2) _B2 =A1G1 A2|"F#m"z2 e2 "B7"B1A1 G1A1|"Em" G1E1 z4 B2|"F#m"E2z2 "Bm"z4 |]\n';       
songs.push(abc); 



abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Love for Sale Solo (Theme A)\n'; 
abc=abc+'L:1/8\n';
abc=abc+'%%barnumbers 2\n';  
abc=abc+'M:C\n';
abc=abc+'Q:1/4=165\n';
abc=abc+'K:Cm\n'; 
abc=abc+'"F"(c8|c2)z2=A4|"Cm"G4z2E2|C2z2E4|\n';
abc=abc+'"F"z2F2G4|z2E2C2B,2|"Cm"/(C8|C6)z2|\n';
abc=abc+'"F"z1D1F2F1F3|z1D1F2F1F3|"Eb"G4F4|E4C4|\n';
abc=abc+'"Dm"G8|z4c2G2|"Cm"(C8|C8)|]\n'; 
songs.push(abc);  

//export to window var
window.songs=songs;