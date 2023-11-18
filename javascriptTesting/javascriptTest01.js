function createJsonTree(folderFiles){    
  var jsonTree = [];  
  for (var i in folderFiles){
    var folder = folderFiles[i].split("/"); 
    for (var ii=0; ii<folder.length; ii++){
      var add = true; 
      for (var iii=0; iii<jsonTree.length; iii++){
        if(jsonTree[iii].id===(ii+"-"+folder[ii])){
          add = false;
          break;
        }
      }
      if(add){
        if(ii==0){
          jsonTree.push({ 
            id: (ii+"-"+folder[ii]), 
            parent: '#', 
            text: folder[ii]
          });  
        }else{
          jsonTree.push({ 
            id: (ii+"-"+folder[ii]), 
            parent: ((ii-1)+"-"+folder[ii-1]), 
            text: folder[ii]
          });  
        }
      }
    }
  } 
  return jsonTree;
}
  
function exe(){
  console.log("**** START javascriptTest01 *****"); 
  var folderFiles = [];
  folderFiles.push('Principal/folder1/Report1');
  folderFiles.push("Principal/folder2/Report2");
  folderFiles.push("Principal/folder2/folder21/Report3");
  folderFiles.push("Principal/folder2/folder22/Report4");
  folderFiles.push("Principal/folder2/folder3/Report4");
  folderFiles.push("Principal/folder3/Report5");
  folderFiles.push("Principal/folder3/Report6");
  folderFiles.push("Principal/folder3/Report7"); 
  console.log(folderFiles);
  var folderFilesJSON = createJsonTree(folderFiles);
  console.log(folderFilesJSON);
  console.log("**** END  javascriptTest01 *****"); 
}
exe();