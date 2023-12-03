package scripts;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;

import java.awt.*;
import java.awt.event.*;
import java.util.TimerTask;
import java.util.ArrayList;
import java.util.Timer;  
 

public class MyApp{  
  static int MS           = 25; 
  static int START_DELAY  = 0; 
  static int W_WINDOW     = 800;
  static int H_WINDOW     = 400;

  JButton btn1;
  JPanel graph;
  JLabel label;
  JFrame frame; 
 
  Timer timerSimulation; 
  int i; 
  ArrayList<Integer> x;
  ArrayList<Integer> y; 

  public int fn(int x, int h) {
    int res = 0;
    res = (int) (h*Math.random());
    return res;
  }

  public void startSimulation(){
    if(timerSimulation==null){
      TimerTask simulation = new TimerTask(){
        @Override
        public void run(){  
          y.add(fn(i,graph.getHeight()));
          x.add(i); 
          i++;
          if(i>graph.getWidth()){
            i=0;
          }
          label.setText("n: "+x.get(x.size()-1)+", fn: "+y.get(y.size()-1)); 
          graph.repaint();          
        }
      };
      timerSimulation = new Timer();
      timerSimulation.schedule(simulation,START_DELAY,MS);
    }
  }

  public void stopSimulation(){  
    if(timerSimulation!=null){
      timerSimulation.cancel(); 
      timerSimulation = null; 
    }
  }

  public boolean isRunningSimulation(){  
    return timerSimulation!=null;
  }

  public MyApp(){  
    //init variables:
    i = 0;
    x = new ArrayList<>(); 
    y = new ArrayList<>();  
    Border border = new LineBorder(Color.BLACK, 1);

    //Graph
    graph = new JPanel(){
      public void paintComponent (Graphics g){
        super.paintComponent(g);   
        g.setColor(Color.BLACK); 
        for(int j=0; j<x.size(); j++){
          g.fillOval(x.get(j), y.get(j), 5, 5);
        }
      }
    };
    graph.setBorder(border);

    //label
    label = new JLabel("Click button to start...");  
    label.setHorizontalAlignment(JLabel.CENTER);
    label.setVerticalAlignment(JLabel.CENTER);
    label.setFont(new Font("Arial", Font.PLAIN, 15)); 

    //button
    btn1 = new JButton("Play");  
    btn1.addActionListener(new ActionListener(){
      @Override
      public void actionPerformed(ActionEvent e) {  
          if(isRunningSimulation()){ 
            btn1.setText("Play"); 
            stopSimulation();           
          }else{ 
            btn1.setText("Stop"); 
            startSimulation(); 
          }
      }
    });  

    //Frame
    frame = new JFrame("My App");
    frame.setLayout(new GridBagLayout());  
    GridBagConstraints gbc = new GridBagConstraints(); 
    gbc.weighty = 1;
    gbc.weightx = 1;  
    gbc.anchor = GridBagConstraints.NORTHWEST; 
    gbc.fill = GridBagConstraints.BOTH; 
    gbc.gridwidth = 1;  
    gbc.gridheight = 1; 

    gbc.gridx = 0;  
    gbc.gridy = 0;      
    frame.add(btn1, gbc); 
    gbc.gridx = 1; // Columna 
    gbc.gridy = 0; // Fila      
    frame.add(label, gbc); 
    gbc.gridx = 0;  
    gbc.gridy = 1;     
    gbc.weighty = 20;
    gbc.weightx = 20;   
    gbc.gridwidth = 2;  
    frame.add(graph, gbc);      
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);  
    int x = GraphicsEnvironment.getLocalGraphicsEnvironment().getMaximumWindowBounds().width/2;
    int y = GraphicsEnvironment.getLocalGraphicsEnvironment().getMaximumWindowBounds().height/2;
    frame.setLocation(x-W_WINDOW/2,y-H_WINDOW/2);  
    frame.setSize(W_WINDOW, H_WINDOW); 
    frame.setResizable(false);
    frame.setVisible(true);
  }   
  
  public static void main(String[] args){
    System.out.println("**** START MyApp *****"); 
    new MyApp();   
    System.out.println("**** END   MyApp *****"); 
  }
  
} 