package javaTesting;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors; 

public class JavaTest{
  public List<String> folderFiles;
  public String       jsonTree; 

  public JavaTest() { 
    folderFiles  = new ArrayList<String>();
    //https://www.jstree.com/
    folderFiles.add("Principal/folder1/Report1");
    folderFiles.add("Principal/folder2/Report2");
    folderFiles.add("Principal/folder2/folder21/Report3");
    folderFiles.add("Principal/folder2/folder22/Report4");
    folderFiles.add("Principal/folder2/folder3/Report4");
    folderFiles.add("Principal/folder3/Report5");
    folderFiles.add("Principal/folder3/Report6");
    folderFiles.add("Principal/folder3/Report7"); 
  }

  public void createJsonTree(){
    jsonTree="[";  
    List<String> aux = new ArrayList<String>();

    for (String folderFile: folderFiles){
      String[] folder = folderFile.split("/"); 
      for (int ii = 0; ii < folder.length; ii++){
        if(ii==0){
          aux.add("{  id: \""+(ii+"-"+folder[ii])+"\", parent: \"#\", text: \""+(folder[ii])+"\" }");  
        }else{
          aux.add("{  id: \""+(ii+"-"+folder[ii])+"\", parent: \""+((ii-1)+"-"+folder[ii-1])+"\", text: \""+(folder[ii])+"\" }"); 
        }
      }
    } 
    // distinct
    aux = aux.stream().distinct().collect(Collectors.toList()); 

    for (String a: aux){
      jsonTree=jsonTree+a+", ";
    }
    jsonTree=jsonTree+"]";
    
  }

  public static void main(String[] args){
    System.out.println("**** START JavaTest *****"); 

    JavaTest test = new JavaTest();    
    System.out.println("folderFiles len: "+test.folderFiles.size());  
    test.createJsonTree();
    System.out.println("jsonTree: "+test.jsonTree); 

    System.out.println("**** END   JavaTest *****"); 
  }
} 