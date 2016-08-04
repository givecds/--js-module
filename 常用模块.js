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

//AJAX
var xhr = function () {
    var ajax = function  () {
        return ('XMLHttpRequest' in window) ? function  () {
                return new XMLHttpRequest();
            } : function  () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    }(),
    formatData= function (fd) {
        var res = '';
        for(var f in fd) {
            res += f+'='+fd[f]+'&';
        }
        return res.slice(0,-1);
    },
    AJAX = function(ops) {
        var     
        root = this,
        req = ajax();
        root.url = ops.url;
        root.type = ops.type || 'responseText';
        root.method = ops.method || 'GET';
        root.async = ops.async || true;     
        root.data = ops.data || {};
        root.complete = ops.complete || function  () {};
        root.success = ops.success || function(){};
        root.error =  ops.error || function (s) { alert(root.url+'->status:'+s+'error!')};
        root.abort = req.abort;
        root.setData = function  (data) {
            for(var d in data) {
                root.data[d] = data[d];
            }
        }
        root.send = function  () {
            var datastring = formatData(root.data),
            sendstring,get = false,
            async = root.async,
            complete = root.complete,
            method = root.method,
            type=root.type;
            if(method === 'GET') {
                root.url+='?'+datastring;
                get = true;
            }
            req.open(method,root.url,async);
            if(!get) {
                req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
                sendstring = datastring;
            }      
            //在send之前重置onreadystatechange方法,否则会出现新的同步请求会执行两次成功回调(chrome等在同步请求时也会执行onreadystatechange)
            req.onreadystatechange = async ? function  () {
                // console.log('async true');
                if (req.readyState ==4){
                    complete();
                    if(req.status == 200) {
                        root.success(req[type]);
                    } else {
                        root.error(req.status);
                    }                   
                }
            } : null;
            req.send(sendstring);
            if(!async) {
                //console.log('async false');
                complete();
                root.success(req[type]);
            }
        }
        root.url && root.send();        
    };
    return function(ops) {return new AJAX(ops);}    
}();