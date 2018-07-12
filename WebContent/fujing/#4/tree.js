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

  function objectClone(obj) {
    var newObj = {},
      flag = false;
    for (var item in obj) {
      newObj[item] = obj[item];
      flag = true;
    }
    return flag ? newObj : false;
  }
  //根据一维数组生成树对象
  function mapTree(id, tree) {
    var arr = [];
    for (var i = 0; i < tree.length; i++) {
      if (tree[i].parentid == id) {
        var tempObj = objectClone(tree[i]);
        var tempArr = mapTree(tempObj.id, tree);
        if (tempArr) {
          tempObj['children'] = tempArr;
        }
        arr.push(tempObj);
      }
    }
    return arr.length > 0 ? arr : false;
  }
  //根据树对象生成domTree字符串
  function domCompile(data) {
    var result = '';
    if (data.children) {
      result += "<li class='folder'>" +
        "<p>" +
        "<span class='tree-hit'></span><span class='tree-icon'></span><span>" + data.name + "</span></P>" +
        "<ul>";
      for (var j = 0; j < data.children.length; j++) {
        result += domCompile(data.children[j]);
      }
      result += "</ul></li>";
    } else {
      result += "<li class='file'><p><span class='tree-hit'></span><span class='tree-icon'></span><span>" + data.name + "</span></P></li>";
    }
    return result;
  }
  //树的一维数组数据
  var data = [
    { id: 1, name: 'My Document' }, { id: 2, parentid: 1, name: 'Photos' },
    { id: 3, parentid: 1, name: 'Program Files' }, { id: 4, parentid: 1, name: 'index.html' },
    { id: 5, parentid: 1, name: 'about.html' }, { id: 6, parentid: 1, name: 'welcome.html' },
    { id: 7, parentid: 2, name: 'Friends' }, { id: 8, parentid: 2, name: 'Wife' },
    { id: 9, parentid: 2, name: 'Company' }, { id: 10, parentid: 3, name: 'Intel' },
    { id: 11, parentid: 3, name: 'Java' }, { id: 12, parentid: 3, name: 'Micro Coffee' },
    { id: 13, parentid: 3, name: 'Games' }
  ];
  var trees = document.querySelectorAll('.domTree');
  //开始生成树结构
  var rootid = 1 //根节点需要被指定
  var treeData;
  for (var i = 0; i < data.length; i++) {
    if (data[i].id == rootid) {
      //复制根节点
      treeData = objectClone(data[i]);
      break;
    }
  }
  var childrenNode = mapTree(treeData.id, data);
  if (childrenNode) {
    treeData.children = childrenNode;
    childrenNode = null;
  }
  //树结构生成完毕

  for (var i = 0; i < trees.length; i++) {
    (function(i) {
      //这里必须满足该树是一个根
      var domString = domCompile(treeData);
      trees[i].innerHTML = domString;
      //初始化操作
      var ul = document.querySelectorAll('.domTree ul');
      for (var j = 0; j < ul.length; j++) {
        ul[j].previousSibling.children[0].className += ' notopen';
        ul[j].setAttribute('height', ul[j].clientHeight + 'px');
        ul[j].style.height = '0px';
        ul[j].previousSibling.children[0].setAttribute('isopen', 'no');
        ul[j].style.backgroundPositionX = '0px';
      }
      //给小三角添加点击功能
      var treeHit = document.querySelectorAll('.folder>p>.tree-hit');
      for (var j = 0; j < treeHit.length; j++) {
        treeHit[j].addEventListener('click', function() {
          if (this.className.indexOf('notopen') > 0) {
            this.className = this.className.replace(/notopen/, 'isopen');
            this.parentNode.nextSibling.style.height = this.parentNode.nextSibling.getAttribute('height');
          } else {
            this.className = this.className.replace(/isopen/, 'notopen');
            this.parentNode.nextSibling.style.height = '0px';
          }
        });
      }
      treeHit = null;
      //添加点击选中效果
      var pList = document.querySelectorAll('p');
      for (var j = 0; j < pList.length; j++) {
        pList[j].addEventListener('click', function() {
          if (document.querySelector('.domTree p.selected')) {
            document.querySelector('.domTree p.selected').className = '';
          }
          this.className = 'selected';
        });
      }
    })(i);
  }
})();
