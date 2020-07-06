/*Dependecies: jquery & threejs 
* <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>  
* <script src="https://threejs.org/build/three.js"></script> 
*/
(function(document,window){
  "use strict";
  var dado = {
    getRndN: function (nstart,nEnd){
        return Math.floor(Math.random()*nEnd)+nstart;
    },
    getRndN01: function (){ //-1, 1
        return this.getRndN(0,2)*2-1;
    },
    exe: function(idElement,callback){ 
      var self = this;   
      $('#'+idElement).html(' ' );
      var scene, camera, renderer, geometry, material, renderer, group, mesh = undefined;
      
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera( 50, $(window).innerWidth()/$(window).innerHeight(), 0.1, 1000 );
      renderer = new THREE.WebGLRenderer();
      renderer.setSize($(window).innerWidth(),$(window).innerHeight());
      $('#'+idElement).html(renderer.domElement);  

      //cube
      group = new THREE.Group();
      geometry = new THREE.BoxGeometry( 2, 2, 2 );
      material = new THREE.MeshBasicMaterial( { color: 0xEEEEEE} ); 
      mesh = new THREE.Mesh( geometry, material );  
      group.add( mesh ); 

      //line black
      material = new THREE.LineBasicMaterial( { color: 0x000000 } ); 
      var points = [];         
      //1 side
      points.push( new THREE.Vector3( -1, -1, -1 )); //x, y, z
      points.push( new THREE.Vector3(  1, -1, -1 ));
      points.push( new THREE.Vector3(  1,  1, -1 ));
      points.push( new THREE.Vector3( -1,  1, -1 ));
      points.push( new THREE.Vector3( -1, -1, -1 ));
      //2 side
      points.push( new THREE.Vector3( -1, -1, -1 )); //x, y, z
      points.push( new THREE.Vector3(  1, -1, -1 ));
      points.push( new THREE.Vector3(  1, -1,  1 ));
      points.push( new THREE.Vector3( -1, -1,  1 ));
      points.push( new THREE.Vector3( -1, -1, -1 ));
      //3 side
      points.push( new THREE.Vector3( -1, -1, -1 )); //x, y, z
      points.push( new THREE.Vector3( -1,  1, -1 ));
      points.push( new THREE.Vector3( -1,  1,  1 ));
      points.push( new THREE.Vector3( -1, -1,  1 ));
      points.push( new THREE.Vector3( -1, -1, -1 ));
      //4 side
      points.push( new THREE.Vector3(  1, -1, -1 )); //x, y, z
      points.push( new THREE.Vector3(  1,  1, -1 ));
      points.push( new THREE.Vector3(  1,  1,  1 ));
      points.push( new THREE.Vector3(  1, -1,  1 ));
      points.push( new THREE.Vector3(  1, -1, -1 ));
      //5 side
      points.push( new THREE.Vector3(  1,  1, -1 ));
      points.push( new THREE.Vector3( -1,  1, -1 ));
      points.push( new THREE.Vector3( -1,  1, -1 )); //x, y, z
      points.push( new THREE.Vector3( -1,  1,  1 ));
      points.push( new THREE.Vector3( -1,  1,  1 ));
      points.push( new THREE.Vector3(  1,  1,  1 ));
      // 6 side. Not need it    
      geometry = new THREE.BufferGeometry().setFromPoints( points );
      mesh = new THREE.Line( geometry, material );   
      group.add( mesh );  

      //Black point sides
      geometry = new THREE.CircleGeometry( 0.225, 100 );
      material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
      // cirle n1
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0;
      mesh.position.y=0;
      mesh.position.z=1.01;
      group.add( mesh );
      // cirle n2 
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0.5;
      mesh.position.y=0.5;
      mesh.position.z=-1.01;
      mesh.rotation.y=1*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-0.5;
      mesh.position.y=-0.5;
      mesh.position.z=-1.01;
      mesh.rotation.y=1*Math.PI;
      group.add( mesh );
      // cirle n3 
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0.5;
      mesh.position.y=-1.01;
      mesh.position.z=0.5;
      mesh.rotation.x=0.5*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-0.5;
      mesh.position.y=-1.01;
      mesh.position.z=-0.5;
      mesh.rotation.x=0.5*Math.PI;
      group.add( mesh );        
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0;
      mesh.position.y=-1.01;
      mesh.position.z=0;
      mesh.rotation.x=0.5*Math.PI;
      group.add( mesh );
      // cirle n4 //The X axis is red. The Y axis is green. The Z axis is blue.
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0.5;
      mesh.position.y=1.01;
      mesh.position.z=-0.5;
      mesh.rotation.x=-0.5*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-0.5;
      mesh.position.y=1.01;
      mesh.position.z=-0.5;
      mesh.rotation.x=-0.5*Math.PI;
      group.add( mesh );        
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-0.5;
      mesh.position.y=1.01;
      mesh.position.z=0.5;
      mesh.rotation.x=-0.5*Math.PI;
      group.add( mesh );  
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=0.5;
      mesh.position.y=1.01;
      mesh.position.z=0.5;
      mesh.rotation.x=-0.5*Math.PI;
      group.add( mesh );
      // cirle n5 //The X axis is red. The Y axis is green. The Z axis is blue.
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=1.01;
      mesh.position.y=0;
      mesh.position.z=0;
      mesh.rotation.y=0.5*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=1.01;
      mesh.position.y=0.5;
      mesh.position.z=0.5;
      mesh.rotation.y=0.5*Math.PI;
      group.add( mesh );        
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=1.01;
      mesh.position.y=-0.5;
      mesh.position.z=0.5;
      mesh.rotation.y=0.5*Math.PI;
      group.add( mesh );  
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=1.01;
      mesh.position.y=0.5;
      mesh.position.z=-0.5;
      mesh.rotation.y=0.5*Math.PI;
      group.add( mesh );  
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=1.01;
      mesh.position.y=-0.5;
      mesh.position.z=-0.5;
      mesh.rotation.y=0.5*Math.PI;
      group.add( mesh );
      // cirle n5 //The X axis is red. The Y axis is green. The Z axis is blue.
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=0;
      mesh.position.z=0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=0.5;
      mesh.position.z=0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh );        
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=-0.5;
      mesh.position.z=0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh );  
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=0.5;
      mesh.position.z=-0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh );  
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=-0.5;
      mesh.position.z=-0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh );
      mesh = new THREE.Mesh( geometry, material );
      mesh.position.x=-1.01;
      mesh.position.y=0;
      mesh.position.z=-0.5;
      mesh.rotation.y=-0.5*Math.PI;
      group.add( mesh ); 

      scene.add( group );  
      //var axesHelper = new THREE.AxesHelper( 2 ); //The X axis is red. The Y axis is green. The Z axis is blue.
      //scene.add( axesHelper );   
      camera.position.set( 0, 0, 5 ); 
      renderer.render( scene, camera ); 
      
      //Camera position
      var a90 = Math.PI/2;
      var nPosition =[
      [    0,    0, 0], //1         
      [2*a90,    0, 0], //2
      [3*a90,    0, 0], //3
      [1*a90,    0, 0], //4
      [    0,3*a90, 0], //5
      [    0,1*a90, 0]  //6
      ]; 

      function click(){
        $('#'+idElement).off('click');
        stopWaitAnimate(); 
        stopWaitAnimate(); 
        
        var n = self.getRndN(1,6);
        self.lastValue = n;
        var pos = [];
        var pospos = [];
        pos.push(nPosition[n-1]);
        var nPos = 10;
        var nNPos = 20;
        for (var i=0; i<nPos-1; i++){
          var x = self.getRndN01();
          var y = self.getRndN01();
          var z = self.getRndN01();
          for (var ii=0; ii<nNPos; ii++){
            pospos.push([pos[pos.length-1][0]+a90*x*ii/nNPos,pos[pos.length-1][1]+a90*y*ii/nNPos,pos[pos.length-1][2]+a90*z*ii/nNPos]); 
          }            
          pos.push([pos[pos.length-1][0]+a90*x,pos[pos.length-1][1]+a90*y,pos[pos.length-1][2]+a90*z]);
        }   
        pospos.push([pos[pos.length-1][0],pos[pos.length-1][1],pos[pos.length-1][2]]);       

        var i = pospos.length-1; 
        function animate() { 
          group.rotation.x = pospos[i][0];
          group.rotation.y = pospos[i][1];
          group.rotation.z = pospos[i][2]; 
          i--; 
          renderer.render( scene, camera ); 
          if(i>=0){
            requestAnimationFrame( animate ); 
          }else{  
          animateZoomIn();
            $('#'+idElement).on('click',click);
            if(typeof callback === 'function'){ 
              callback(self.lastValue);
            }
          }
        };  
        function animateZoomIn() {  
          if(camera.position.z>=4){
            camera.position.z -=0.1;  
            renderer.render( scene, camera );              
            requestAnimationFrame( animateZoomIn );  
          }else{        
            animateZoomOut();
          }             
        }; 
        function animateZoomOut() {  
          if(camera.position.z<5){
            camera.position.z +=0.1;  
            renderer.render( scene, camera );              
            requestAnimationFrame( animateZoomOut );  
          }else{
            exeWaitAnimate();
          }   
        }; 
        animate(); 
      } 

      var exeAnimateWait = true; 
      function animateWait() { 
        group.rotation.x += 0.0025;
        group.rotation.y += 0.005;
        group.rotation.z += 0.005;  
        renderer.render( scene, camera ); 
        if(exeAnimateWait){
          requestAnimationFrame( animateWait ); 
        } 
      }; 

      function exeWaitAnimate(){  
        exeAnimateWait = true;
        self.timeoutAnimateWait = setTimeout(function(){ 
          animateWait();
        },2000);
      }

      function stopWaitAnimate(){
        exeAnimateWait = false;
        clearTimeout(self.timeoutAnimateWait);
      }

      stopWaitAnimate();
      exeWaitAnimate(); 
      click();  
    },
    timeoutAnimateWait: undefined, 
    lastValue: undefined,
  } 
  window.dado = dado;
})(document,window);