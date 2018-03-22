;
(function () {
  var calendarInputs = document.querySelectorAll(".calendar");
  if (calendarInputs.length > 0) {
    var monthList = ['壹月', '贰月', '叁月', '肆月', '伍月', '陆月', '柒月', '捌月', '玖月', '拾月', '拾壹月', '拾贰月'];
    var weekList = ['一', '二', '三', '四', '五', '六', '日'];
    var dayList = [31, false, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

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
        $element.$top += element.offsetTop;
        $element.$left += element.offsetLeft;
        parent = element.offsetParent;
      }
      return $element;
    }

    function edit() {
      //输入框聚焦时进入编辑模式
      if (this.value && (/^\d{4}\/\d{2}\/\d{2}$/.test(this.value) || /^\d{8}$/.test(this.value))) {
        this.value = this.value.split('/').join("");
      } else {
        this.value = "";
      }
    }

    function format() {
      //输入框聚焦时进入编辑模式
      if (this.value && /^\d{4}\/\d{2}\/\d{2}$/.test(this.value) || /^\d{8}$/.test(this.value)) {
        this.value = this.value.split('/').join("");
        var trueDate = new Date();
        trueDate.setFullYear(this.value.substring(0, 4), this.value.substring(4, 6) - 1, this.value.substring(6, 8));
        this.value = trueDate.getFullYear() + '/' + ('0' + (trueDate.getMonth() - -1)).replace(/^0?(\d{2})$/, '$1') + '/' + ('0' + trueDate.getDate()).replace(/^0?(\d{2})$/, '$1');
      } else {
        this.value = "";
      }
    }

    function doCancel() {
      var oldCalendarWindow = document.querySelectorAll('.calendarWindow');
      if (oldCalendarWindow.length > 0) {
        for (var i = 0, len = oldCalendarWindow.length; i < len; i++) {
          oldCalendarWindow[i].parentNode.removeChild(oldCalendarWindow[i]);
        }
      }
    }

    function clickCalendar() {
      if (this.nextSibling && this.nextSibling.className && this.nextSibling.className.indexOf('calendarWindow') != -1) {
        doCancel();
        return;
      } else {
        doCancel();
      }
      var parent = this.parentNode;
      var calendarWindow = document.createElement("div");
      calendarWindow.className += "calendarWindow";
      var calendarPosition = getElementPosition(this.previousSibling);
      calendarWindow.style.top = calendarPosition.$top + calendarPosition.$height + 5 + 'px';
      calendarWindow.style.left = calendarPosition.$left + 'px';
      var nowDate = this.previousSibling.value;
      var toyear, tomonth, todate;
      if (nowDate && /^\d{4}\/\d{2}\/\d{2}$/.test(nowDate)) {
        toyear = nowDate.split('/')[0];
        tomonth = nowDate.split('/')[1] - 1;
        todate = nowDate.split('/')[2];
      } else {
        nowDate = new Date();
        toyear = nowDate.getFullYear();
        tomonth = nowDate.getMonth();
        todate = nowDate.getDate();
      }
      if (parent.lastChild == calendarInputs[i]) {
        parent.appendChild(calendarWindow);
        var content = document.createElement("div");
        calendarWindow.appendChild(content);
        setDate(toyear, tomonth, content);
      } else {
        parent.insertBefore(calendarWindow, this.nextSibling);
        var content = document.createElement("div");
        calendarWindow.appendChild(content);
        setDate(toyear, tomonth, content, this.previousSibling);
      }
      //this.previousSibling.focus();
    }

    function calDays(year, month) {
      //根据年月计算该月天数
      if (!dayList[month]) {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
          return 29;
        } else {
          return 28;
        }
      }
      return dayList[month];
    }

    function setDate(year, month, element, target) {
      //生成日的html
      element.innerHTML = "<div class='leader'><div class='left'></div><div class='timer'>" + monthList[month] + " " + year + "年" + "</div><div class='right'></div></div><div class='main'></div>";
      var main = document.querySelector('.main');
      var result = "";
      for (var i = 0; i < 7; i++) {
        result += "<div class='weekItem'>" + weekList[i] + "</div>";
      }
      var day = new Date(year, month, 1).getDay();
      var lastMonthDays = calDays(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1);
      var thisMonthDays = calDays(year, month);
      var len = day - 1 < 0 ? 6 : day - 1;
      for (var i = 0; i < len; i++) {
        result += "<div class='unOptionItem'>" + (lastMonthDays - len + i - -1) + "</div>";
      }
      for (var i = 0; i < thisMonthDays; i++) {
        result += "<div class='optionItem'>" + (i - -1) + "</div>";
      }
      len = 7 - (day + 6 + thisMonthDays) % 7;
      for (var i = 0; i < len; i++) {
        result += "<div class='unOptionItem'>" + (i - -1) + "</div>";
      }
      main.innerHTML = result;
      //绑定方法
      var optionItems = document.querySelectorAll('.optionItem');
      for (var i = 0, len = optionItems.length; i < len; i++) {
        optionItems[i].addEventListener('click', function () {
          target.value = year + '/' + ('0' + (month - -1)).replace(/^0?(\d{2})$/, '$1') + '/' + ('0' + this.innerText).replace(/^0?(\d{2})$/, '$1');
          doCancel();
        });
      }
      document.querySelector('.left').addEventListener('click', function () {
        year = month - 1 < 0 ? year - 1 : year;
        month = month - 1 < 0 ? 11 : month - 1;
        setDate(year, month, element, target);
      });
      document.querySelector('.right').addEventListener('click', function () {
        year = month - -1 > 11 ? year - -1 : year;
        month = month - -1 > 11 ? 0 : month - -1;
        setDate(year, month, element, target);
      });
      document.querySelector('.timer').addEventListener('click', function () {
        setMonth(year, element, target);
      });
    }

    function setMonth(year, element, target) {
      //生成月的html
      element.innerHTML = "<div class='leader'><div class='left'></div><div class='timer'>" + year + "年" + "</div><div class='right'></div></div><div class='main'></div>";
      var main = document.querySelector('.main');
      var result = "";
      for (var i = 0; i < 12; i++) {
        result += "<div class='optionItem monthItem' val='" + i + "'>" + monthList[i] + "</div>";
      }
      main.innerHTML = result;
      //绑定方法
      var optionItems = document.querySelectorAll('.monthItem');
      for (var i = 0, len = optionItems.length; i < len; i++) {
        optionItems[i].addEventListener('click', function () {
          setDate(year, this.attributes.val.value, element, target);
        });
      }
      document.querySelector('.left').addEventListener('click', function () {
        year = year - 1;
        setMonth(year, element, target);
      });
      document.querySelector('.right').addEventListener('click', function () {
        year = year - -1;
        setMonth(year, element, target);
      });
      document.querySelector('.timer').addEventListener('click', function () {
        setYear(year, element, target);
      });
    }

    function setYear(year, element, target) {
      //生成年的html
      element.innerHTML = "<div class='leader'><div class='left'></div><div class='timer'>" + Math.floor(year / 10) + "0年 - " + Math.floor(year / 10) + '9' + "年" + "</div><div class='right'></div></div><div class='main'></div>";
      var main = document.querySelector('.main');
      var result = "";
      for (var i = 0; i < 12; i++) {
        result += "<div class='optionItem yearItem' val='" + (Math.floor(year / 10 - 1) + '9' - -i) + "'>" + (Math.floor(year / 10 - 1) + '9' - -i) + "</div>";
      }
      main.innerHTML = result;
      //绑定方法
      var optionItems = document.querySelectorAll('.yearItem');
      for (var i = 1, len = optionItems.length - 1; i < len; i++) {
        optionItems[i].addEventListener('click', function () {
          setMonth(this.attributes.val.value, element, target);
        });
      }
      document.querySelector('.left').addEventListener('click', function () {
        year = year - 10;
        setYear(year, element, target);
      });
      document.querySelector('.right').addEventListener('click', function () {
        year = year - -10;
        setYear(year, element, target);
      });
    }
    for (var i = 0, length = calendarInputs.length; i < length; i++) {
      var calendarImg = document.createElement("img");
      calendarImg.src = "calendar.png";
      calendarImg.className += "calendarImg";
      var elementPostition = getElementPosition(calendarInputs[i], 'parent');
      calendarImg.style.left = (elementPostition.$left + elementPostition.$width - 24) + 'px';
      calendarImg.style.top = (elementPostition.$top - -1) + 'px';
      calendarImg.addEventListener('click', clickCalendar);
      calendarInputs[i].addEventListener('focus', edit);
      calendarInputs[i].addEventListener('blur', format);
      if (i == 0) {
        document.querySelector('body').addEventListener('click', function (e) {
          var clickTarget = e.target || window.event.target;
          while (clickTarget.parentNode) {
            if (clickTarget.className.indexOf('calendarWindow') != -1 || clickTarget.className.indexOf('calendarImg') != -1) {
              return;
            }
            clickTarget = clickTarget.parentNode;
          }
          doCancel();
        });
      }
      var parent = calendarInputs[i].parentNode;
      if (parent.lastChild == calendarInputs[i]) {
        parent.appendChild(calendarImg);
      } else {
        parent.insertBefore(calendarImg, calendarInputs[i].nextSibling);
      }
    }
  }
})();
