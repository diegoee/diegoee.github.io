// init var
var songs = [];
var abc=''; 

//values
abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Love for Sale Solo (A)\n'; 
abc=abc+'M:C\n';
abc=abc+'Q:165\n';
abc=abc+'K:Cm\n'; 
abc=abc+'"F"(c8|c2)z2=A4|"Cm"G4z2E2|C2z2E4|\n';
abc=abc+'"F"z2F2G4|z2E2C2B,2|"Cm"/(C8|C6)z2|\n';
abc=abc+'"F"z1D1F2F1F3|z1D1F2F1F3|"Eb"G4F4|E4C4|\n';
abc=abc+'"Dm"G8|z4c2G2|"Cm"(C8|C8)|]\n'; 
songs.push(abc); 

abc=''; 
abc=abc+'X:1\n';
abc=abc+'T:My Hot and Humid Solo\n'; 
abc=abc+'M:C\n';
abc=abc+'Q:126\n';
abc=abc+'K:Em\n'; 
abc=abc+'B1 B2 A1G1|';
abc=abc+'"Em"E2z2z1G1E2|z2B1 B1B2A1G1|E2z2B,1^C1E2|z4z2F1G1|\n';
abc=abc+'"Am"A2z2z1B1A2|z4z2F1G1|A2A2z1G1E2|z3B1 B2 A1G1|\n';
abc=abc+'"Em"E2z2z1G1E2|z2B1 B1B2A1G1|E2z2B,1^C1E2|z4F1G1|\n'; 
abc=abc+'"G"_A2 =A1G1  A3 z1 |z2e2 B1A1 G1A1 |"Em" G1E1z2B2E2|z8|]\n';       
songs.push(abc);   

//export to window var
window.songs=songs;