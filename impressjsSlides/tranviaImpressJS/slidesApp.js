/*global $*/
(function () {
 /** Variables **/
  var App;

  /** initial value **/
  App = {
    init: function init() {
      var el, el2, lim;

      $.each($('.footerDiv'), this.setNumberSlide);
      $.each($('.headerDiv'), this.backTittle);


      //$.each($('.step'), App.setPosAndTrans);
      for (var i = 0; i < $('.step').length-1; i++) {
          this.setPosAndTrans(i, $($('.step')[i]));
      }

      lim = App.lim();
      el = $('#overview');
      el.attr('data-x', Math.round(lim*1000/2)-500);
      el.attr('data-y', 1000);
      el.attr('data-z', 0);
      el.attr('data-rotate-x', 0);
      el.attr('data-rotate-y', 0);
      el.attr('data-rotate-z', 0);
      el.attr('data-scale', lim+1);

      el = $($('.step')[$('.step').length-1]);
      el2 = $($('.step')[$('.step').length-2]);

      el = $($('.step')[$('.step').length-1]);
      el.attr('data-x', Math.round(lim*1000/2)-500);
      el.attr('data-y', parseInt(el2.attr('data-y'))+2000);
      el.attr('data-z', 0);
      el.attr('data-rotate-x', 0);
      el.attr('data-rotate-y', 90);
      el.attr('data-rotate-z', 0);
      el.attr('data-scale', 0.25);

      el = $($('.footerDiv')[$('.footerDiv').length-1]);
      el.empty();

    },
    lim: function lim(){
      var x = Math.ceil(($('.step').length)/4);
      return x;
    },
    //Set atributo pos:
    setNumberSlide: function setNumberSlide(index, value){
      var x = index+1;

      $(value).append( x +' of '+(($('.footerDiv').length)-1));
    },
    backTittle: function backTittle(index,value){
      var x = $(value).text();
      $(value).html('<a href="javascript:impress().goto(document.getElementById(\'overview\'));">'+ x +'</a>');
    },
    setPosAndTrans: function setPosAndTrans(index, value){
      var rnd;
      var lim = App.lim();
      index=index-1;

      //console.log(index+': '+lim+' - '+index);
      if (index<lim){
        $(value).attr('data-x', index*1000);
        $(value).attr('data-y', 0);
        //console.log(index+': '+lim+' - '+index);
      } else if (index<lim*2){
        $(value).attr('data-x', (index-lim)*1000);
        $(value).attr('data-y', 1000);
        //console.log(index+': '+lim*2+' - '+(index-lim));
      } else{
        $(value).attr('data-x', (index-lim*2)*1000);
        $(value).attr('data-y', 2000);
        //console.log(index+': '+lim*3+' - '+(index-lim*2));
      }
      $(value).attr('data-z', 0);

      $(value).attr('data-rotate-y', 0);
      $(value).attr('data-rotate-z', 0);
      $(value).attr('data-scale', 1);

      rnd = Math.floor((Math.random() * 3) + 1);
      var deg = 30;
      if((index%4)===0){
        $(value).attr('data-rotate-x', deg);
      }
      if((index%4)===1){
        $(value).attr('data-rotate-x', 0);
        $(value).attr('data-scale', 0.75);
      }
      if((index%4)===2){
        $(value).attr('data-rotate-x', -deg);
      }
      if((index%4)===3){
        $(value).attr('data-rotate-x', 0);
        $(value).attr('data-scale', 0.75);
      }

    }
  };

  App.init();
})();
