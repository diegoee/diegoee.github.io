package com.diegoee.myporfolio;

import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
  public static final String TAG = "TAG_LOG";

  // Used to load the 'native-lib' library on application startup.
  static {
    System.loadLibrary("native-lib");
    System.loadLibrary("node");
  }

  //A native method that is implemented by the 'native-lib' native library,     * which is packaged with this application.
  public native Integer startNodeWithArguments(String[] arguments);


  //We just want one instance of node running in the background.
  public static boolean startedNodeAlready = false;

  private WebView webView;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.activity_main);
    getSupportActionBar().hide();

    webView = findViewById(R.id.web);

    webView.getSettings().setJavaScriptEnabled(true);
    webView.getSettings().setAllowFileAccess(true);
    webView.getSettings().setAllowContentAccess(true);
    webView.getSettings().setAllowFileAccessFromFileURLs(true);
    webView.getSettings().setAllowUniversalAccessFromFileURLs(true);

    //Only hide the scrollbar, not disables the scrolling:
    webView.setVerticalScrollBarEnabled(false);
    webView.setHorizontalScrollBarEnabled(false);

    //Only disabled the horizontal scrolling:
    webView.getSettings().setLayoutAlgorithm(WebSettings.LayoutAlgorithm.SINGLE_COLUMN);

    //To disabled the horizontal and vertical scrolling:
    webView.setOnTouchListener(new View.OnTouchListener() {
      public boolean onTouch(View v, MotionEvent event) {
        return (event.getAction() == MotionEvent.ACTION_MOVE);
      }
    });
    webView.loadUrl("https://localhost:8080");

    Log.v(TAG,"on Testing ...");
    Log.v(TAG,getApplicationContext().getFilesDir().getAbsolutePath());

    if( !startedNodeAlready ) {
      startedNodeAlready=true;
      new Thread(new Runnable() {
        @Override
        public void run() {
          String nodeDir = getApplicationContext().getFilesDir().getAbsolutePath()+"/nodejs-project";
          startNodeWithArguments(new String[]{
            "node",
            nodeDir+"/main_server.js"
          });
        }
      }).start();
    }
  }
}