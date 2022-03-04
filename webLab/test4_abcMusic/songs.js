// init var
var songs = [];
var abc=''; 

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
//songs.push(abc);  

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Hot and Humid Solo\n'; 
abc=abc+'L:1/8\n';
abc=abc+'M:C\n';
abc=abc+'Q:1/4=126\n';
abc=abc+'K:Em\n'; 
abc=abc+'"Em"z1B3A4|B1 A1^c1 z2z1G1|z1G1z1 E1G2E1G1|z4z2F1(A1|\n';
abc=abc+'"Am"A2)z2z4|z8|z8|z8|\n';
abc=abc+'"Em"z1B3A4|B1 A1^c1 z2z1E1|z1^F1 z1G1 z1A1 z1G1|E2z2 z2G2|\n'; 
abc=abc+'"G"z1_A2 =A1G1  A3 z1 |z2e2 B1A1 G1A1 |"Em" G1E1z2B2E2|z8|]\n';       
songs.push(abc); 



//export to window var
window.songs=songs;