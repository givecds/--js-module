//函数节流
throttle= function(fn,interval){
  var _this = fn,
  time,
  firstTime=true;
  return function(){
    _me=this;
    if(firstTime){
    _this.apply(_me,arguments);
    return firstTime=false;
    }
    if(time){
      return false;
    }
    time=setTimeout(function(){
      clearTimeout(time);
      time=null;
      _this.apply(_me,arguments);
    },interval||500)
  }
}

//柯里化
var currying=function(fn){
  var args=[];
  return function(){
    if(arguments.length===0){
      return fn.apply(this,args);
    }
    else{
    Array.prototype.push.apply(args,arguments);
    return arguments.callee;
    }
  }
 };

//添加事件
function addEvent(o,e,fn){
  if(window.attachEvent){o.attachEvent("on"+e,fn)}
  else if(window.addEventListener){o.addEventListener(e,fn,false);}
  else {o["on"+e]=fn;}

}


//解绑事件
function removeEvent(o,e,fn){
  if(window.detacEvent){o.detacEvent("on"+e,fn);}
  else if(removeEventListener){o.removeEventListener(e,fn,false);}
  else {o["on"+e]=null;}
}

//解除默认事件
function stopDefault(e){
  if(e&&e.preventDefault){e.preventDefault();}
  else {window.event.returnValue=false}
  return false;
}

//阻止冒泡
function stopBubble(e){
  if(e&&e.stopPropagation){e.stopPropagation;}
  else (window.event.cancelBubble=true)
}

//数据结构_队列
function eventQueue(){
  var dataStore=[];
  eventQueue.prototype.front=function(){
    return dataStore[0]
  }
  eventQueue.prototype.toString=function(i){
    return dataStore[i]
  }
  eventQueue.prototype.length=function(){
    return dataStore.length
  }
  eventQueue.prototype.remove=function(){
    if(dataStore.length==0)return null;
    else return dataStore.shift();
  }
  eventQueue.prototype.add=function(ele){
    dataStore.push(ele);
    return dataStore.length;
  }
}