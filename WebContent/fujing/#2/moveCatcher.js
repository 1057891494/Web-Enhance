(function() {
  /* 阻止默认事件 */
  function preventDefaultEvent(event) {
    var $$this = Luna(this);
    event = event || window.event;
    if (event && event.stopPropagation) { //这是其他非IE浏览器
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
    return $$this;
  }

  function getElementPosition(element, who) {
    //给定元素element,获取元素的width,height,left,top;
    //who取值为'parent'时，取相对于上一级父元素定位;who取值为'body'时，取相对于body定位
    who = who || 'body';
    var $element = {
      $top: element.offsetTop,
      $left: element.offsetLeft,
      $height: element.offsetHeight,
      $width: element.offsetWidth
    };
    var parent = element.offsetParent;
    if (who == 'parent') {
      return $element;
    }
    while (parent) {
      element = parent;
      $element.$top += element.offsetTop - element.scrollTop;
      $element.$left += element.offsetLeft - element.scrollLeft;
      parent = element.offsetParent;
    }
    return $element;
  }
  var containers = document.querySelectorAll('.move-catcher');
  for (var i = 0; i < containers.length; i++) {
    (function(i) {
      //初始化进来时应该展示的是第一张内容
      containers[i].scrollLeft = 0;

      var startX, SCROLL_LEFT;
      var startTime, timer, distance, during, speed;
      containers[i].addEventListener('touchstart', function(e) {
        e = e || window.event;
        if (e.targetTouches.length > 0) {
          startX = e.targetTouches[0].clientX;
        } else if (e.changedTouches.length > 0) {
          startX = e.changedTouches[0].clientX;
        } else if (e.touches.length > 0) {
          startX = e.touches[0].clientX;
        }
        SCROLL_LEFT = containers[i].scrollLeft;
        startTime = Date.now();
      });
      containers[i].addEventListener('touchmove', function(e) {
        e = e || window.event;
        if (e.targetTouches.length > 0) {
          nowX = e.targetTouches[0].clientX;
        } else if (e.changedTouches.length > 0) {
          nowX = e.changedTouches[0].clientX;
        } else if (e.touches.length > 0) {
          nowX = e.touches[0].clientX;
        }
        containers[i].scrollLeft = SCROLL_LEFT + startX - nowX;
      });
      containers[i].addEventListener('touchend', function(e) {
        e = e || window.event;
        if (e.targetTouches.length > 0) {
          endX = e.targetTouches[0].clientX;
        } else if (e.changedTouches.length > 0) {
          endX = e.changedTouches[0].clientX;
        } else if (e.touches.length > 0) {
          endX = e.touches[0].clientX;
        }
        //滑动惯性
        distance = startX - endX;
        during = Date.now() - startTime;
        speed = distance / during * 20;
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function() {
          if (speed < 1 && speed > -1) {
            //速度减慢，惯性结束
            window.clearInterval(timer);
            //结束惯性之后停的位置不一定是完整的窗口，这时候需要归正
            var site = containers[i].scrollLeft;
            var cell = containers[i].children[0].clientWidth;
            var between = site - Math.floor(site / cell) * cell;
            var count = 0;
            //判断靠左归正还是靠右归正，通过四次定时完成过渡动画
            if (between < cell / 2) {
              var timing = window.setInterval(function() {
                count++;
                containers[i].scrollLeft += -between / 4;
                if (count == 4) {
                  window.clearInterval(timing);
                  document.querySelector('.move-catcher-lancher>li.active').className = '';
                  document.querySelector('.move-catcher-lancher').children[Math.floor(0.5+containers[i].scrollLeft/cell)].className='active';
                }
              }, 20);
            } else {
              var timing = window.setInterval(function() {
                count++;
                containers[i].scrollLeft += (cell - between) / 4;
                if (count == 4) {
                  window.clearInterval(timing);
                  document.querySelector('.move-catcher-lancher>li.active').className = '';
                  document.querySelector('.move-catcher-lancher').children[Math.floor(0.5+containers[i].scrollLeft/cell)].className='active';
                }
              }, 20);
            }
          }
          //继续衰减速度
          speed *= 0.95; //衰减速率
          containers[i].scrollLeft += speed;
        }, 20);
      });
      //右下角添加点击跳转小按键
      var ul = document.createElement('ul');
      ul.className = 'move-catcher-lancher';
      for (var j = 0; j < containers[i].children.length; j++) {
        ul.appendChild(document.createElement('li'));
      }
      containers[i].parentNode.insertBefore(ul, containers[i].nextSibling);
      var $pos1 = getElementPosition(containers[i], 'body');
      var $pos2 = getElementPosition(ul, 'body');
      ul.style.top = $pos1.$top + $pos1.$height - 30 + 'px';
      ul.style.left = $pos1.$left + $pos1.$width - $pos2.$width -10 + 'px';
      ul.children[0].className += 'active';
      for (var j = 0; j < ul.children.length; j++) {
        (function(j, target) {
          ul.children[j].setAttribute('val', j);
          ul.children[j].addEventListener('click', function() {
            document.querySelector('.move-catcher-lancher>li.active').className = '';
            this.className += 'active';
            window.setTimeout(function(ele) {
              containers[i].scrollLeft = ele.getAttribute('val') * target.children[0].clientWidth;
            }, 0, this);
          });
        })(j, containers[i]);
      }
    })(i);
  }
})();
