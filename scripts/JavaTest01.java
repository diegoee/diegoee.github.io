package scripts;

public class JavaTest01{
  public String var; 

  public JavaTest01() {  
    var = "Hellooo";
    System.out.println("var: "+var);  
    changeVar("Olé");
    System.out.println("var: "+var);  
  }

  public void changeVar(String newVar){
    var = newVar;
  }

  public static void main(String[] args){
    System.out.println("**** START JavaTest01 *****");  
    new JavaTest01();   
    System.out.println("**** END   JavaTest01 *****"); 
  }
} 