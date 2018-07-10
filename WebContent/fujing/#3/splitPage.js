;
(function() {
  var Lists = document.querySelectorAll(".list");
  if (Lists.length > 0) {
    for (var i = 0; i < Lists.length; i++) {
      (function(i) {
        //添加下拉刷新时的图标
        var img = document.createElement('img');
        img.src = 'reload.png';
        img.className = 'reload';
        Lists[i].insertBefore(img, Lists[i].children[0]);
        var startY, SCROLL_TOP, scrollTarget; //scrollTarget保存被添加overflow:hidden的元素，用于还原
        Lists[i].addEventListener('touchstart', function(e) {
          e = e || window.event;
          if (e.targetTouches.length > 0) {
            startY = e.targetTouches[0].clientY;
            SCROLL_TOP = Lists[i].scrollTop || document.body.scrollTop || document.documentElement.scrollTop;
          } else if (e.changedTouches.length > 0) {
            startY = e.changedTouches[0].clientY;
          } else if (e.touches.length > 0) {
            startY = e.touches[0].clientY;
          }
        });
        Lists[i].addEventListener('touchmove', function(e) {
          e = e || window.event;
          var nowY;
          if (e.targetTouches.length > 0) {
            nowY = e.targetTouches[0].clientY;
          } else if (e.changedTouches.length > 0) {
            nowY = e.changedTouches[0].clientY;
          } else if (e.touches.length > 0) {
            nowY = e.touches[0].clientY;
          }
          if (nowY - startY > 0) {
            //往下滑，刷新
            if (nowY - startY > SCROLL_TOP) {
              if (Lists[i].scrollTop) {
                Lists[i].style.overflow = 'hidden';
                scrollTarget = List[i];
              } else if (document.body.scrollTop) {
                document.body.style.overflow = 'hidden';
                scrollTarget = document.body;
              } else if (document.documentElement.scrollTop) {
                document.documentElement.style.overflow = 'hidden';
                scrollTarget = document.documentElement;
              }
              //滑倒顶了，则刷新
              Lists[i].style.transform = 'translateY(' + (nowY - startY - SCROLL_TOP) + 'px)';
              document.querySelector('.reload').style.transform = 'rotate(' + (nowY - startY - SCROLL_TOP) * 2 + 'deg)';
            } else {
              //下拉后未释放，但是又往上拉
              if (scrollTarget) {
                scrollTarget.style.overflow = "";
              }
            }
          } else {
            if (Lists[i].scrollTop) {
              scrollTarget = List[i];
            } else if (document.body.scrollTop) {
              scrollTarget = document.body;
            } else if (document.documentElement.scrollTop) {
              scrollTarget = document.documentElement;
            }
            if (!scrollTarget) {
              //如果一进来就一次滑到低刷新，此时scrollTarget为undefinded,return 重新获取scrollTarget dom对象
              return;
            }
            //往上滑，分页
            if (startY - nowY + SCROLL_TOP + scrollTarget.clientHeight > scrollTarget.scrollHeight) {
              //滑到底了，开始刷新动画
              if (document.querySelectorAll('.getMore').length <= 0) {
                var getMore = document.createElement('p');
                getMore.innerText = '获取更多...';
                getMore.className = 'getMore';
                Lists[i].appendChild(getMore);
                scrollTarget.style.overflow = 'hidden';
              }
              var distance = startY - nowY + SCROLL_TOP + scrollTarget.clientHeight - scrollTarget.scrollHeight;
              //添加getMore之后scrollHeight可能会发生变化， 故采取distance>0?-distance:0写法
              Lists[i].style.transform = 'translateY(' + (distance > 0 ? -distance : 0) + 'px)';
            }
          }
        });
        Lists[i].addEventListener('touchend', function(e) {
          e = e || window.event;
          var endY;
          if (e.targetTouches.length > 0) {
            endY = e.targetTouches[0].clientY;
          } else if (e.changedTouches.length > 0) {
            endY = e.changedTouches[0].clientY;
          } else if (e.touches.length > 0) {
            endY = e.touches[0].clientY;
          }
          //还原样式
          if (scrollTarget) {
            scrollTarget.style.overflow = "";
          }
          Lists[i].style.transform = '';
          document.querySelector('.reload').style.transform = '';
          Lists[i].style.transition = 'all .2s';
          window.setTimeout(function() {
            Lists[i].style.transition = '';
          }, 250);
          if (document.querySelector('.getMore')) {
            Lists[i].removeChild(document.querySelector('.getMore'));
          }
          if (endY - startY - SCROLL_TOP > 20) {
            //20,防止不小心触碰触发刷新
            //do fresh callback here...
          }
          if (startY - endY + SCROLL_TOP + scrollTarget.clientHeight - scrollTarget.scrollHeight > 20) {
            //do getMoreInfo callback here
          }
        });
      })(i)
    }
  }
})();
