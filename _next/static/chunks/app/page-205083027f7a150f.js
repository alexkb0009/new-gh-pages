(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{684:function(o,t,e){var i=0/0,n=/^\s+|\s+$/g,m=/^[-+]0x[0-9a-f]+$/i,r=/^0b[01]+$/i,D=/^0o[0-7]+$/i,s=parseInt,b="object"==typeof e.g&&e.g&&e.g.Object===Object&&e.g,l="object"==typeof self&&self&&self.Object===Object&&self,x=b||l||Function("return this")(),p=Object.prototype.toString,f=Math.max,c=Math.min,d=function(){return x.Date.now()};function P(o){var t=typeof o;return!!o&&("object"==t||"function"==t)}function a(o){if("number"==typeof o)return o;if("symbol"==typeof(t=o)||t&&"object"==typeof t&&"[object Symbol]"==p.call(t))return i;if(P(o)){var t,e="function"==typeof o.valueOf?o.valueOf():o;o=P(e)?e+"":e}if("string"!=typeof o)return 0===o?o:+o;o=o.replace(n,"");var b=r.test(o);return b||D.test(o)?s(o.slice(2),b?2:8):m.test(o)?i:+o}o.exports=function(o,t,e){var i,n,m,r,D,s,b=0,l=!1,x=!1,p=!0;if("function"!=typeof o)throw TypeError("Expected a function");function F(t){var e=i,m=n;return i=n=void 0,b=t,r=o.apply(m,e)}function y(o){var e=o-s,i=o-b;return void 0===s||e>=t||e<0||x&&i>=m}function u(){var o,e,i,n=d();if(y(n))return T(n);D=setTimeout(u,(o=n-s,e=n-b,i=t-o,x?c(i,m-e):i))}function T(o){return(D=void 0,p&&i)?F(o):(i=n=void 0,r)}function z(){var o,e=d(),m=y(e);if(i=arguments,n=this,s=e,m){if(void 0===D)return b=o=s,D=setTimeout(u,t),l?F(o):r;if(x)return D=setTimeout(u,t),F(s)}return void 0===D&&(D=setTimeout(u,t)),r}return t=a(t)||0,P(e)&&(l=!!e.leading,m=(x="maxWait"in e)?f(a(e.maxWait)||0,t):m,p="trailing"in e?!!e.trailing:p),z.cancel=function(){void 0!==D&&clearTimeout(D),b=0,i=s=n=D=void 0},z.flush=function(){return void 0===D?r:T(d())},z}},4972:function(o,t,e){"use strict";e.r(t),e.d(t,{VizScript:function(){return p},cleanupVizScript:function(){return x},vizScript:function(){return l}});var i=e(6006),n=e(684),m=e.n(n),r=e(257),D=e.n(r);function s(){let o=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return"translate3d(".concat(o,", ").concat(t,", ").concat(e,")")}function b(o,t){var e=new Set([...o.classList,t]);o.className=[...e].join(" ")}function l(){var o={focalLength:350,aspectRatio:1.25,bottomOffset:0,logicRefreshRate:10,endStep:800,camera:{x:0,y:0,z:-100,center:[50,50]},fonts:{header:D().style.fontFamily+", HelveticaNeue, sans-serif",header2:D().style.fontFamily+", HelveticaNeue, sans-serif",small:D().style.fontFamily+", HelveticaNeue, sans-serif"},text:{initialTextOffset:75}},t={useDim:{},mouse:{},introAnimComplete:!1,postMouseMove:!1,postMouseMoveTimer:null,time:0,model:{boxPoints:{f1:{x:25,y:25,z:100},f2:{x:75,y:25,z:100},f3:{x:75,y:75,z:100},f4:{x:25,y:75,z:100},b1:{x:75,y:90,z:40},b2:{x:25,y:90,z:40},t1:{x:75,y:8,z:120},t2:{x:25,y:8,z:120}},detailPoints:{box1frontLeft:{},box1backRight:{}},detailVectors:{box1first:{x:0,y:0,z:0}},b1TextOffsetVector:{x:0,y:0},box2Points:{f1:{x:25,y:25,z:180},f2:{x:75,y:25,z:180},f3:{x:75,y:75,z:180},f4:{x:25,y:75,z:180},b1:{x:25,y:25,z:180},b2:{x:75,y:25,z:180},b3:{x:75,y:75,z:180},b4:{x:25,y:75,z:180}},box3Points:{},box4Points:{},horizon:{s:{x:-300,y:65},e:{x:-300,y:65}}},firstLayerInit:!1,temp:{},ce:{pageTitle:document.getElementById("title"),container:document.getElementById("frontContainer"),menu:document.getElementById("f_menu"),latestItems:document.getElementById("f_latestItems")}};!function(){var e,i={percentDim:function(e,i){return(null!=e.x&&null!=e.y?(0==i&&(e=e.x),1==i&&(e=e.y)):isNaN(e)&&null!=t.model[e[0]][e[1]]&&(0==i&&(e=t.model[e[0]][e[1]].x),1==i&&(e=t.model[e[0]][e[1]].y)),0==i)?e/(100*o.aspectRatio)*t.useDim.width+t.useDim.offsetWidth:1==i?e/100*t.useDim.height+t.useDim.offsetHeight:void 0},point2DFrom3D:function(e,n,m){return null==e.x&&null==e.y&&null!=t.model[e[0]][e[1]]&&(e=t.model[e[0]][e[1]]),e=i.applyVector(e,n),null==m&&(m=o.focalLength/(o.focalLength+e.z-o.camera.z)),{x:(e.x-o.camera.x-o.camera.center[0])*m+o.camera.center[0],y:(e.y-o.camera.y-o.camera.center[1])*m+o.camera.center[1],scale:100*m}},applyVector:function(o,t){return{x:o.x+(t&&t.x||0),y:o.y+(t&&t.y||0),z:o.z+(t&&t.z||0)}},setCanvasSize:function(e,i){i*o.aspectRatio>e?(t.useDim.width=e,t.useDim.height=e/o.aspectRatio,t.useDim.offsetWidth=0,t.useDim.offsetHeight=parseInt((i-t.useDim.height)/2)):(t.useDim.height=i,t.useDim.width=i*o.aspectRatio,t.useDim.offsetHeight=0,t.useDim.offsetWidth=parseInt((e-t.useDim.width)/2)),n.width=e,n.height=i},rotationMatrix:function(o,t,e){return null==e&&(e={x:0,y:0}),t.x-=e.x,t.y-=e.y,{x:t.x*Math.cos(o)-t.y*Math.sin(o)+e.x,y:t.x*Math.sin(o)+t.y*Math.cos(o)+e.y}},rotationYMatrix:function(o,t,e){return null==e&&(e={x:50,z:50}),t.x-=e.x,t.z-=e.z,{x:t.x*Math.cos(o)+t.z*Math.sin(o)+e.x,y:t.y,z:-t.x*Math.sin(o)+t.z*Math.cos(o)+e.x}},clonePointSetObject:function(o,t){for(var e in t={},o)t[e]={x:o[e].x,y:o[e].y,z:o[e].z};return t},setMouseCoords:function(o){t.mouse.x=o.clientX,t.mouse.y=o.clientY}},n=document.getElementById("front-page-canvas"),r=n.getContext("2d");window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(o){setTimeout(o,100)};var D=m()(function(){let e=t.ce.container.getBoundingClientRect();i.setCanvasSize(e.width,e.height-o.bottomOffset),window.requestAnimationFrame(l)},250);function l(e){var m,D,s;(e=r).clearRect(0,0,n.width,n.height),t.firstLayerInit&&((D=m=e).beginPath(),D.moveTo(i.percentDim(["horizon","s"],0),i.percentDim(["horizon","s"],1)),D.lineTo(i.percentDim(["horizon","e"],0),i.percentDim(["horizon","e"],1)),D.lineWidth=1,D.strokeStyle="#999",D.stroke(),t.model.box3Points.f1.y<t.model.boxPoints.b1.y&&(x(m,t.model.box3Points),x(m,t.model.box4Points)),x(m,t.model.box2Points)),e.beginPath(),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)<i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)?(e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),1))):e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1)),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)>i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)?(e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),e.fillStyle="#f4f4f4",t.time>300&&e.fill(),e.lineWidth=2,e.strokeStyle="#000",e.stroke(),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),t.time<300&&e.fill()):(e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.fillStyle="#f4f4f4",e.fill(),e.lineWidth=2,e.strokeStyle="#000",e.stroke()),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),0)>i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0)||i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)>i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0)?(e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)>i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)?(e.strokeStyle="#000",e.lineWidth=2,e.stroke(),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.fillStyle="#f4f4f4",e.fill(),e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineWidth=1,e.stroke()):(e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineWidth=2,e.stroke(),e.fillStyle="#e4e4e4",e.fill()),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)>i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)?(e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),1)),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)),e.lineWidth=1,e.strokeStyle="#999",e.stroke(),e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineWidth=1,e.strokeStyle="#000",e.stroke(),e.beginPath()):i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)<i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1)&&(e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","t2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1)),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)),e.lineWidth=1,e.strokeStyle="#999",e.stroke(),e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)),e.lineWidth=1,e.strokeStyle="#000",e.stroke())):(e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineWidth=2,e.strokeStyle="#000",e.stroke(),e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1))),i.percentDim(i.point2DFrom3D(["boxPoints","t1"]),1)<=i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1)&&(e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f2"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f1"]),1))),e.lineWidth=1,e.strokeStyle="#999",e.stroke(),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)>i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)&&t.time>300&&(e.beginPath(),e.moveTo(i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f3"]),1)),e.lineTo(i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),0),i.percentDim(i.point2DFrom3D(["boxPoints","f4"]),1)),e.lineWidth=1,e.strokeStyle="#000",e.stroke()),e.font="8pt "+o.fonts.small,e.fillStyle="#444",t.time<300?(e.fillText('4" by 4" by 4" Box Model #'+(3245+t.time),i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)+t.model.b1TextOffsetVector.y),e.font="15pt "+o.fonts.header,t.time<75?e.fillText("Imagine",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-15+ +t.model.b1TextOffsetVector.y):t.time<150?e.fillText("Plan",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-15+t.model.b1TextOffsetVector.y):t.time<225?e.fillText("Set",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-15+t.model.b1TextOffsetVector.y):e.fillText("Build",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-15+t.model.b1TextOffsetVector.y)):(e.fillStyle="rgba(45,45,45,"+(1-(t.time-300)/50)+")",e.fillText('4" by 4" by 4" Box Model #3545',i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)+t.model.b1TextOffsetVector.y),e.font="15pt sans-serif",e.fillText("Continue",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+10+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-15+t.model.b1TextOffsetVector.y),t.time>325&&(e.font=Math.max(parseInt(t.useDim.height/30),16)+"pt "+o.fonts.header2,t.time<475?(e.fillStyle="rgba(0,0,0,"+Math.min(Math.abs((t.time-325)%2),.25)+")",t.time<345?e.fillText("constraints",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-24+t.model.b1TextOffsetVector.y):t.time<370?e.fillText("prototyping",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-24+t.model.b1TextOffsetVector.y):t.time<400?e.fillText("testing",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-24+t.model.b1TextOffsetVector.y):t.time<435?e.fillText("iteration",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-24+t.model.b1TextOffsetVector.y):t.time<475&&e.fillText("development",i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(i.point2DFrom3D(["boxPoints","b1"]),1)-24+t.model.b1TextOffsetVector.y)):t.time<630?(e.font=Math.max(parseInt(t.useDim.height/30),18)+"pt "+o.fonts.header,e.fillStyle="rgba(0,0,0,"+(1-Math.min((Math.max(t.time,600)-600)/30,1))+")",t.temp.firstTextFixed||(t.temp.firstTextFixed=i.point2DFrom3D(t.model.boxPoints.b1),t.temp.firstTextFixed.enabled=!0),e.fillText("design",i.percentDim(t.temp.firstTextFixed,0)+o.text.initialTextOffset+t.model.b1TextOffsetVector.x,i.percentDim(t.temp.firstTextFixed,1)-24+t.model.b1TextOffsetVector.y),t.time>520&&(t.time<600?e.fillStyle="rgba(0,0,0,"+Math.min((t.time-520)/40,1)+")":e.fillStyle="rgba(40,40,40,"+(1-Math.min((t.time-600)/30,1))+")",e.fillText("   + computation",i.percentDim(t.temp.firstTextFixed,0)+o.text.initialTextOffset+(t.model.b1TextOffsetVector.x-1.25*t.model.b1TextOffsetVector.x),i.percentDim(t.temp.firstTextFixed,1)+6+t.model.b1TextOffsetVector.y))):e.font="bold "+Math.max(parseInt(t.useDim.height/12),18)+"pt "+o.fonts.header)),s=e,t.time<590||(s.beginPath(),s.moveTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),1)),s.lineTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{y:t.model.detailVectors.box1first.y}),1)),s.moveTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1backRight"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),1)),s.lineTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1backRight"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{y:t.model.detailVectors.box1first.y}),1)),s.moveTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),1)),s.lineTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{x:t.model.detailVectors.box1first.x}),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontRight"]),1)),s.moveTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"]),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{y:t.model.detailVectors.box1first.y}),1)),s.lineTo(i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{x:t.model.detailVectors.box1first.x}),0),i.percentDim(i.point2DFrom3D(["detailPoints","box1frontLeft"],{y:t.model.detailVectors.box1first.y}),1)),s.lineWidth=1,s.strokeStyle="#555",s.stroke()),(t.time<o.endStep||t.postMouseMove)&&window.requestAnimationFrame(l)}function x(o,t){o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.f1),0),i.percentDim(i.point2DFrom3D(t.f1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f2),0),i.percentDim(i.point2DFrom3D(t.f2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f3),0),i.percentDim(i.point2DFrom3D(t.f3),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f4),0),i.percentDim(i.point2DFrom3D(t.f4),1)),o.fillStyle="#eee",o.fill(),i.percentDim(i.point2DFrom3D(t.f2),0)<i.percentDim(i.point2DFrom3D(t.b2),0)&&(o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.f2),0),i.percentDim(i.point2DFrom3D(t.f2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b2),0),i.percentDim(i.point2DFrom3D(t.b2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b3),0),i.percentDim(i.point2DFrom3D(t.b3),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f3),0),i.percentDim(i.point2DFrom3D(t.f3),1)),o.fillStyle="#ddd",o.fill()),o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.b3),0),i.percentDim(i.point2DFrom3D(t.b3),1)),i.percentDim(i.point2DFrom3D(t.b4),1)>i.percentDim(i.point2DFrom3D(t.f4),1)?o.lineTo(i.percentDim(i.point2DFrom3D(t.b4),0),i.percentDim(i.point2DFrom3D(t.b4),1)):o.lineTo(i.percentDim(i.point2DFrom3D(t.f3),0),i.percentDim(i.point2DFrom3D(t.f3),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f4),0),i.percentDim(i.point2DFrom3D(t.f4),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f1),0),i.percentDim(i.point2DFrom3D(t.f1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f2),0),i.percentDim(i.point2DFrom3D(t.f2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b2),0),i.percentDim(i.point2DFrom3D(t.b2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b3),0),i.percentDim(i.point2DFrom3D(t.b3),1)),o.lineWidth=1,o.strokeStyle="#000",o.stroke(),o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.f2),0),i.percentDim(i.point2DFrom3D(t.f2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f3),0),i.percentDim(i.point2DFrom3D(t.f3),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b3),0),i.percentDim(i.point2DFrom3D(t.b3),1)),o.moveTo(i.percentDim(i.point2DFrom3D(t.f3),0),i.percentDim(i.point2DFrom3D(t.f3),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f4),0),i.percentDim(i.point2DFrom3D(t.f4),1)),o.lineWidth=1,o.strokeStyle="#444",o.stroke(),i.percentDim(i.point2DFrom3D(t.b1),1)<i.percentDim(i.point2DFrom3D(t.f1),1)&&(o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.f1),0),i.percentDim(i.point2DFrom3D(t.f1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b1),0),i.percentDim(i.point2DFrom3D(t.b1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b2),0),i.percentDim(i.point2DFrom3D(t.b2),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.f2),0),i.percentDim(i.point2DFrom3D(t.f2),1)),o.fillStyle="#eee",o.fill(),o.beginPath(),o.moveTo(i.percentDim(i.point2DFrom3D(t.f1),0),i.percentDim(i.point2DFrom3D(t.f1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b1),0),i.percentDim(i.point2DFrom3D(t.b1),1)),o.lineTo(i.percentDim(i.point2DFrom3D(t.b2),0),i.percentDim(i.point2DFrom3D(t.b2),1)),o.lineWidth=1,o.strokeStyle="#000",o.stroke())}window.addEventListener("resize",D,{passive:!0}),D(),e={tFunc:function(){t.time++,t.time>50&&t.time<190&&(t.model.boxPoints.b1.z<150?t.model.boxPoints.b1.z+=90/t.time:(t.model.boxPoints.b1.z=150,t.model.boxPoints.t1.z=150),t.model.boxPoints.b2.z=t.model.boxPoints.b1.z,t.model.boxPoints.t1.z>t.model.boxPoints.b1.z?(t.model.boxPoints.t1.z+=t.time/550,t.model.boxPoints.t2.z=t.model.boxPoints.t1.z):t.model.boxPoints.t1.z=t.model.boxPoints.t2.z=t.model.boxPoints.b1.z,t.model.boxPoints.b1.y>t.model.boxPoints.f3.y?(t.model.boxPoints.b1.y-=.18,t.model.boxPoints.b2.y-=.18):t.model.boxPoints.b1.y=t.model.boxPoints.b2.y=t.model.boxPoints.f3.y,t.model.boxPoints.t1.y<t.model.boxPoints.f1.y?(t.model.boxPoints.t1.y+=t.time/550,t.model.boxPoints.t2.y=t.model.boxPoints.t1.y):t.model.boxPoints.t1.y=t.model.boxPoints.t2.y=t.model.boxPoints.f1.y,t.model.boxPoints.f4.z=t.model.boxPoints.f3.z=t.model.boxPoints.f2.z=t.model.boxPoints.f1.z-=.5),t.time<300?(o.camera.x+=.2,o.camera.z+=.2,o.focalLength-=.5):t.time<400&&(t.time<375&&(t.model.b1TextOffsetVector.y-=.5),t.time>375&&(t.model.b1TextOffsetVector.x-=.6)),t.time>400&&(t.firstLayerInit||(t.model.box3Points=i.clonePointSetObject(t.model.box2Points),t.model.box3Points.b1.z=t.model.box3Points.b2.z=t.model.box3Points.b3.z=t.model.box3Points.b4.z=t.model.box3Points.f1.z,t.model.box3Points.f1.y=t.model.box3Points.f2.y=t.model.box3Points.b1.y=t.model.box3Points.b2.y=t.model.boxPoints.f4.y+5,t.model.box4Points=i.clonePointSetObject(t.model.box2Points),t.model.box4Points.f1.z=t.model.box4Points.f2.z=t.model.box4Points.f3.z=t.model.box4Points.f4.z=t.model.boxPoints.f1.z,t.model.box4Points.b1.z=t.model.box4Points.b2.z=t.model.box4Points.b3.z=t.model.box4Points.b4.z=t.model.boxPoints.b1.z,t.model.box4Points.f1.y=t.model.box4Points.f2.y=t.model.box4Points.b1.y=t.model.box4Points.b2.y=t.model.boxPoints.f4.y+5,t.model.box4Points.f1.x=t.model.box4Points.f4.x=t.model.box4Points.b1.x=t.model.box4Points.b4.x=t.model.boxPoints.f4.x-5,t.model.box4Points.f3.x=t.model.box4Points.f2.x=t.model.box4Points.b3.x=t.model.box4Points.b2.x=t.model.boxPoints.f4.x-5,t.firstLayerInit=!0),t.model.box2Points.b4.z-t.model.box2Points.f4.z<t.model.boxPoints.t2.z-t.model.boxPoints.f1.z?(t.model.box2Points.b4.z+=1.5,t.model.box2Points.b1.z=t.model.box2Points.b2.z=t.model.box2Points.b3.z=t.model.box2Points.b4.z):(t.model.box2Points.b4.z=t.model.box2Points.f4.z+t.model.boxPoints.t2.z-t.model.boxPoints.f1.z,t.model.box2Points.b1.z=t.model.box2Points.b2.z=t.model.box2Points.b3.z=t.model.box2Points.b4.z,t.time<580&&(t.model.box2Points.f1.y=t.model.box2Points.f2.y-=.36,t.model.box2Points.b1.y=t.model.box2Points.b2.y-=.36))),t.time>450&&(t.time<500&&(o.camera.y+=.5),t.time<580?(t.model.boxPoints.f4.y=t.model.boxPoints.f3.y+=.36,t.model.boxPoints.b2.y=t.model.boxPoints.b1.y+=.36,t.model.box3Points.f3.y=t.model.box3Points.f4.y=t.model.box3Points.b3.y=t.model.box3Points.b4.y=t.model.boxPoints.f4.y,t.model.box4Points.f3.y=t.model.box4Points.f4.y=t.model.box4Points.b3.y=t.model.box4Points.b4.y=t.model.boxPoints.f4.y):t.time<660&&(o.camera.y-=.1,o.camera.x-=.1,t.model.box4Points.f1.x=t.model.box4Points.b1.x=t.model.box4Points.f4.x=t.model.box4Points.b4.x-=.5,t.model.box3Points.b1.z=t.model.box3Points.b2.z=t.model.box3Points.b3.z=t.model.box3Points.b4.z+=1.5),t.time<640&&(t.model.b1TextOffsetVector.x+=.15,o.camera.z-=.25),t.model.box2Points.f3.x>t.model.boxPoints.f3.x-3&&(t.model.box2Points.f2.x=t.model.box2Points.f3.x-=.02,t.model.box2Points.b2.x=t.model.box2Points.b3.x-=.02,t.model.box2Points.f1.x=t.model.box2Points.f4.x+=.02,t.model.box2Points.b1.x=t.model.box2Points.b4.x+=.02,t.model.box2Points.f2.z=t.model.box2Points.f1.z+=.02,t.model.box2Points.b2.z=t.model.box2Points.b1.z+=.02,t.model.box2Points.f3.z=t.model.box2Points.f4.z-=.02,t.model.box2Points.b3.z=t.model.box2Points.b4.z-=.02,e.updateBoundValues()),t.model.horizon.e.x<Math.abs(t.model.horizon.s.x)+100&&(t.model.horizon.e.x+=3),500===t.time&&b(document.body,"introhalfcomplete"),t.model.box2Points.f3.z>t.model.boxPoints.f3.z+3?(t.model.box2Points.f1.z=t.model.box2Points.f2.z=t.model.box2Points.f3.z=t.model.box2Points.f4.z-=2,t.model.box2Points.b1.z=t.model.box2Points.b2.z=t.model.box2Points.b3.z=t.model.box2Points.b4.z-=2):(t.model.box2Points.f1.z=t.model.box2Points.f2.z=t.model.box2Points.f3.z=t.model.box2Points.f4.z=t.model.boxPoints.f3.z+3,t.model.box2Points.b1.z=t.model.box2Points.b2.z=t.model.box2Points.b3.z=t.model.box2Points.b4.z=t.model.boxPoints.b2.z-3),t.time>590&&t.model.detailPoints.box1frontLeft.y+t.model.detailVectors.box1first.y<t.model.detailPoints.box1backRight.y?t.model.detailVectors.box1first.y+=1:t.time>590&&(t.model.detailVectors.box1first.y=t.model.detailPoints.box1backRight.y-t.model.detailPoints.box1frontLeft.y,t.model.detailPoints.box1frontLeft.x+t.model.detailVectors.box1first.x<t.model.detailPoints.box1backRight.x?t.model.detailVectors.box1first.x+=.5:t.model.detailVectors.box1first.x=t.model.detailPoints.box1backRight.x-t.model.detailPoints.box1frontLeft.x)),t.time==o.endStep-100&&p.init(),t.time>=o.endStep&&(e.clear(),t.introAnimComplete=!0)},updateBoundValues:function(){t.model.detailPoints.box1frontLeft={x:t.model.box2Points.f1.x,y:t.model.boxPoints.f1.y+3,z:t.model.box2Points.f1.z},t.model.detailPoints.box1backRight={x:t.model.box2Points.f3.x,y:t.model.boxPoints.f3.y-3,z:t.model.box2Points.f3.z},t.model.detailPoints.box1frontRight={x:t.model.box2Points.f2.x,y:t.model.boxPoints.f2.y+3,z:t.model.box2Points.f2.z}},clear:function(){clearInterval(e.interval)}};var p={init:function(){b(document.body,"introcomplete")},setUI:function(){if(window.innerWidth<550){t.ce.menu.style.transform="translate3d(calc(95vw - 100% - 24px),0,0)",t.ce.latestItems.style.transform="translate3d(calc(95vw - 100% - 24px),0,0)";return}var o=i.percentDim(i.point2DFrom3D(["box3Points","b2"]),0);isNaN(o)||(t.ce.menu.style.transform=s(o+60+"px"),t.ce.latestItems.style.transform=s(o+60+"px"))}};if(document.body.classList.contains("introcomplete"))for(var f=0;f<o.endStep;f++)e.tFunc();e.interval=setInterval(e.tFunc,o.logicRefreshRate),setTimeout(()=>{n.style.opacity=1},200),n.addEventListener("mousemove",i.setMouseCoords,!1),n.addEventListener("click",function(){t.introAnimComplete||(p.init(),e.clear(),e.interval=setInterval(e.tFunc,o.logicRefreshRate/300))})}()}let x=()=>{},p=o=>{let{children:t}=o;return(0,i.useEffect)(()=>{let o=l();return o},[]),t}},2797:function(o,t,e){Promise.resolve().then(e.t.bind(e,3619,23)),Promise.resolve().then(e.t.bind(e,9191,23)),Promise.resolve().then(e.bind(e,4972))},9191:function(){},257:function(o){o.exports={style:{fontFamily:"'__Heebo_d78d2c', '__Heebo_Fallback_d78d2c'",fontStyle:"normal"},className:"__className_d78d2c",variable:"__variable_d78d2c"}}},function(o){o.O(0,[619,667,961,744],function(){return o(o.s=2797)}),_N_E=o.O()}]);