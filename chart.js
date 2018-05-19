var chart = (function () {
  // 公共参数 颜色
  var color = ['red', 'green', 'blue', 'black', 'orange', 'brown'];
  // canvas 布局图表时需要的 padding 值
  var elmProp = {
    paddingTop:60,
    paddingRight: 60,
    paddingBottom:60,
    paddingLeft:60
  }

  // 获取数据的最大值和最小值
  function getMaxMin(data) {
    var max = Math.max.apply(Math, data[0]), min = Math.min.apply(Math, data[0]);
    var tempMax = 0, tempMin = 0;
    for (var i = 1; i<data.length;i++) {
      tempMax = Math.max.apply(Math, data[i]);
      tempMin = Math.min.apply(Math, data[i]);
      if (tempMax > max) max = tempMax;
      if (tempMin < min) min = tempMin;
    }
    return {
      max:max,
      min:min
    };
  }

  // 对数组进行倒序排列
  function sortData(data) {
    var newData = data.sort(function (a,b) {
      return b - a;
    })
    return newData;
  }

  // 生成canvas插入到元素中
  function createCanvas(config) {
    var elm = document.querySelector(config.el);
    var canvas = document.createElement("canvas");
    canvas.width = config.width;
    canvas.height = config.height;
    elm.appendChild(canvas);
    return canvas;
  }

  var line = function (options) {
    // 这里需要先写个复制 options 的函数
    var canvasConfig = {
      el:options.el,
      width:800,
      height:300
    }
    var canvas = createCanvas(canvasConfig)
    var canvasContext = canvas.getContext("2d");

    canvasContext.clearRect(0,0, canvas.width, canvas.height);
    // 写上标题
    canvasContext.textAlign = "center";
    canvasContext.globalAlpha = 0.6;
    canvasContext.fillText(options.title, canvas.width / 2, elmProp.paddingTop / 2);
    // 画Y/X轴两条主线
    canvasContext.beginPath();
    canvasContext.moveTo(elmProp.paddingLeft, elmProp.paddingTop);
    canvasContext.lineTo(elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
    canvasContext.lineTo(canvas.width - elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
    canvasContext.globalAlpha = 0.6;
    canvasContext.lineWidth = 2;
    canvasContext.strokeStyle = "black";
    canvasContext.stroke();

    // 获取到数据的最大值/最小值，以便在X/Y轴上设定值的间距
    var dataExtremeValue = getMaxMin(options['data']);
    var dataMax = dataExtremeValue['max'];
    var dataMin = dataExtremeValue['min'];

    // 画Y轴
    var yAxisHeightGapLength = (canvas.height  - elmProp.paddingTop - elmProp.paddingBottom) / 6;
    var yAxisValueGapLength = (dataMax - dataMin) / 6;
    for (var i=0; i<=6 ; i++) {
      canvasContext.globalAlpha = 1;
      canvasContext.beginPath();
      canvasContext.lineWidth = 0.5;
      canvasContext.moveTo(elmProp.paddingLeft - 5, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.textAlign = "right";
      var value = parseFloat(dataMin) + parseFloat(yAxisValueGapLength * (6-i));

      value = value.toFixed(2);
      canvasContext.fillText(value +" "+ options.yAxis, 55, elmProp.paddingTop + 5 + i * yAxisHeightGapLength);
      canvasContext.lineTo(elmProp.paddingLeft, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.stroke();
      canvasContext.globalAlpha = 0.2;
      canvasContext.lineTo(canvas.width - elmProp.paddingLeft, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.stroke();
    }
    // 画X轴
    var xAxisWidthGapLength = (canvas.width - elmProp.paddingLeft - elmProp.paddingRight) / options.xAxis.length;
    for (var i = 0; i< options.xAxis.length; i++) {
      canvasContext.globalAlpha = 1;
      canvasContext.beginPath();
      canvasContext.lineWidth = 0.5;
      canvasContext.moveTo(elmProp.paddingLeft + (i + 1) * xAxisWidthGapLength, canvas.height - elmProp.paddingTop + 5);
      canvasContext.textAlign = "center";
      var value = options.xAxis[i];
      canvasContext.fillText(value, elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, canvas.height + 20 - elmProp.paddingBottom);
      canvasContext.lineTo(elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, canvas.height - elmProp.paddingBottom);
      canvasContext.stroke();
      canvasContext.globalAlpha = 0.2;
      canvasContext.lineTo(elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, elmProp.paddingTop);
      canvasContext.stroke();
    }
    // 画曲线，描点
    canvasContext.globalAlpha = 0.75;
    for (var i = 0; i< options.data.length; i++) {
      for (var j = 0; j<options.data[i].length; j++) {
        // 画曲线
        canvasContext.beginPath();
        var map = (canvas.height - elmProp.paddingTop - elmProp.paddingBottom) * options.data[i][j] / dataMax;
        map = canvas.height - elmProp.paddingBottom - map;
        var nextMap = (canvas.height - elmProp.paddingTop - elmProp.paddingBottom) * options.data[i][j+1] / dataMax;
        nextMap = canvas.height - elmProp.paddingBottom - nextMap;
        canvasContext.moveTo(elmProp.paddingLeft + (j+1) * xAxisWidthGapLength, map);
        canvasContext.bezierCurveTo(elmProp.paddingLeft + (j+1) * xAxisWidthGapLength + 16, map, elmProp.paddingLeft + (j+2) * xAxisWidthGapLength - 16, nextMap, elmProp.paddingLeft + (j+2) * xAxisWidthGapLength, nextMap);
        canvasContext.strokeStyle = color[i];
        canvasContext.stroke();
        // 描点
        canvasContext.beginPath();
        canvasContext.arc(elmProp.paddingLeft + (j+1) * xAxisWidthGapLength, map, 3, 0, 2 * Math.PI);
        canvasContext.stroke();
      }
    }
  }

  var bar = function (options) {
    var canvasConfig = {
      el:options.el,
      width:550,
      height:400
    }
    var canvas = createCanvas(canvasConfig)
    var canvasContext = canvas.getContext("2d");

    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    // 写标题
    canvasContext.textAlign = "center";
    canvasContext.globalAlpha = 0.6;
    canvasContext.fillText(options.title, canvas.width / 2, elmProp.paddingTop / 2);
    // 画Y/X轴的两条主线
    canvasContext.strokeStyle = "black";
    canvasContext.globalAlpha = 0.6;
    canvasContext.lineWidth = 2;
    canvasContext.beginPath();
    canvasContext.moveTo(elmProp.paddingLeft, elmProp.paddingTop);
    canvasContext.lineTo(elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
    canvasContext.lineTo(canvas.width - elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
    canvasContext.stroke();

    // 获取到数据的最大值/最小值，以便在X/Y轴上设定值的间距
    var dataExtremeValue = getMaxMin(options['data']);
    var dataMax = dataExtremeValue['max'];

    // 画Y轴
    var yAxisHeightGapLength = (canvas.height - elmProp.paddingBottom - elmProp.paddingBottom) / 6;
    var yAxisValueGapLength = dataMax / 6;
    for (var i=0; i<=6; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(elmProp.paddingTop - 5, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.globalAlpha = 1;
      canvasContext.lineWidth = 0.5;
      canvasContext.textAlign = "right";
      var value = parseFloat(yAxisValueGapLength * (6 - i));
      value = value.toFixed(2);
      canvasContext.fillText(value + " " + options.yAxis, elmProp.paddingTop - 5, elmProp.paddingTop + 5 + i * yAxisHeightGapLength);
      canvasContext.lineTo(elmProp.paddingLeft, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.stroke();

      canvasContext.globalAlpha = 0.2;
      canvasContext.lineTo(canvas.width - elmProp.paddingTop, elmProp.paddingTop + i * yAxisHeightGapLength);
      canvasContext.stroke();
    }

    /* 画X轴 */
    var xAxisWidthGapLength = (canvas.width - elmProp.paddingLeft - elmProp.paddingRight) / options.xAxis.length;
    for (var i=0; i<options.xAxis.length; i++) {
      canvasContext.beginPath();
      canvasContext.globalAlpha = 1;
      canvasContext.lineWidth = 0.5;
      canvasContext.moveTo(elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, canvas.height - elmProp.paddingBottom + 5);
      // 标注X轴上的说明
      canvasContext.textAlign = "center";
      var value = options.xAxis[i];
      canvasContext.fillText(value, elmProp.paddingLeft + (i+1) * xAxisWidthGapLength - xAxisWidthGapLength / 2, canvas.height - elmProp.paddingBottom + 20);
      canvasContext.lineTo(elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, canvas.height - elmProp.paddingBottom);
      canvasContext.stroke();
      canvasContext.globalAlpha = 0.2;
      canvasContext.lineTo(elmProp.paddingLeft + (i+1) * xAxisWidthGapLength, elmProp.paddingTop);
      canvasContext.stroke();
    }

    /* 画柱形 */
    canvasContext.globalAlpha = 0.6;
    // 计算每个柱形的宽度，多个柱形，就需要平分每个方格的宽度
    var barWidth = (xAxisWidthGapLength - 16) / options.data.length;
    // 总方格的长度，与数据对应的比例
    var ratio = (canvas.height - elmProp.paddingBottom - elmProp.paddingTop) / dataMax;
    for (var i=0; i< options.data.length; i++) {
      for (var j=0; j< options.data[i].length; j++) {
        canvasContext.beginPath();
        canvasContext.strokeStyle = color[i];
        canvasContext.lineWidth = 1;
        canvasContext.moveTo(elmProp.paddingLeft + j * xAxisWidthGapLength + 8 + barWidth * i, canvas.height - elmProp.paddingBottom);
        canvasContext.lineTo(elmProp.paddingLeft + j * xAxisWidthGapLength + 8 + barWidth * (i+1), canvas.height - elmProp.paddingBottom);

        var currentBarHeight = options.data[i][j] * ratio;
        canvasContext.lineTo(elmProp.paddingLeft + j * xAxisWidthGapLength + 8 + barWidth * (i+1), canvas.height - elmProp.paddingBottom - currentBarHeight);
        canvasContext.lineTo(elmProp.paddingLeft + j * xAxisWidthGapLength + 8 +barWidth * i, canvas.height - elmProp.paddingBottom - currentBarHeight);
        canvasContext.closePath();
        canvasContext.stroke();
        canvasContext.fillStyle = color[i];
        canvasContext.fill();
      }
    }
  }

  var pie = function (options) {

    var canvasConfig = {
      el:options.el,
      width:350,
      height:350
    }
    var canvas = createCanvas(canvasConfig)
    var canvasContext = canvas.getContext("2d");

    // 重新排列数据，大的数据排在前面
    var data = sortData(options.data);
    // 饼图的参数
    var center = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var radius = canvas.width > canvas.height ? (canvas.height - elmProp.paddingLeft * 2) / 2 : (canvas.width - elmProp.paddingTop * 2) / 2;
    var total = data.reduce(function (prev, cur) {
      return prev + cur;
    })
    var degree = data.map(function (value) {
      var radian = value * 360 / total;
      return radian * Math.PI / 180;
    })

    // 写标题
    canvasContext.textAlign = "center";
    canvasContext.globalAlpha = 0.6;
    canvasContext.fillStyle = "black";
    canvasContext.fillText(options.title, canvas.width / 2, elmProp.paddingTop / 2);
    // 画饼图
    var defaultDegree = - Math.PI / 2;
    for (var i = 0; i< degree.length; i++) {
      canvasContext.beginPath();
      canvasContext.moveTo(center, center);
      canvasContext.arc(center, center, radius, defaultDegree, defaultDegree + degree[i]);
      defaultDegree = defaultDegree + degree[i];
      canvasContext.fillStyle = color[i];
      canvasContext.strokeStyle = color[i];
      canvasContext.globalAlpha = 0.4;
      canvasContext.fill();
      // 画空心圆饼图，多了一步在中心画一个白色的圆
      if (options.type == "ring") {
        canvasContext.beginPath();
        canvasContext.arc(center, center, radius / 2, 0, Math.PI * 2);
        canvasContext.globalAlpha = 1;
        canvasContext.fillStyle = "white";
        canvasContext.fill();
      }
    }
  }

  var ring = function (options) {
    options.type = "ring";
    pie(options);
  }

  var radar = function (options) {
    var canvasConfig = {
      el:options.el,
      width:350,
      height:350
    }
    var canvas = createCanvas(canvasConfig)
    var canvasContext = canvas.getContext("2d");
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);

    var center = canvas.width > canvas.height ? canvas.height / 2 : canvas.width / 2;
    var radius = canvas.width > canvas.height ? (canvas.height - elmProp.paddingTop * 2) / 2 : (canvas.width - elmProp.paddingLeft * 2) / 2;
    /* 写标题 */
    canvasContext.globalAlpha = 0.6;
    canvasContext.textAlign = "center";
    canvasContext.fillText(options.title, canvas.width / 2, elmProp.paddingTop / 2);

    /* 画多边形 */
    canvasContext.translate(center, center);
    var gapDegree = 360 / options.index.length;
    var dataMax = Math.max.apply(Math, options.data);
    var polygonNum = 5; // 五个多边形
    // 计算每个多边形半径的差值，这样才能知道怎么划分五个多边形
    var gapRadiusLength = Math.ceil(dataMax / polygonNum);
    for (var i=1; i<=polygonNum; i++) {
      var currentRadiusLength = radius * (i * gapRadiusLength) / (polygonNum * gapRadiusLength);
      for (var j=0; j<options.index.length; j++) {
        // 画枝干
        canvasContext.beginPath();
        canvasContext.globalAlpha = 0.4;
        canvasContext.rotate(gapDegree * Math.PI / 180);
        canvasContext.moveTo(0, 0);
        canvasContext.lineTo(0, -currentRadiusLength);
        // 每一次都会画一次主干(currentRadiusLength)，这样五次以后，就会越来越粗(从(0,0)到(0,-1)就会画五次，(0,-1)到(0,-2)就会画四次，依次类推)，
        // 所以现在只在第五次的时候画一次，其它时候为透明
        if (i != 5) {
          canvasContext.strokeStyle = "rgba(0,0,0,0)";
        } else {
          canvasContext.strokeStyle = "black";
        }
        canvasContext.stroke();
        // 画横轴
        canvasContext.beginPath();
        canvasContext.moveTo(0, -currentRadiusLength);
        var x = currentRadiusLength * Math.sin(gapDegree * Math.PI / 180);
        var y = currentRadiusLength * Math.cos(gapDegree * Math.PI / 180);
        canvasContext.strokeStyle = "black";
        canvasContext.lineTo(x, -y);
        canvasContext.stroke();
      }
    }

    // 我理解为这条语句是回到中心点，为什么我看见每个需要旋转的都需要translate两次呢，一次是正，一次是负
    canvasContext.translate(-center, -center);

    // 把 index 都加上去，8 是在半径上增加 8，这样就能把index写到外面去
    for (var i=0; i<options.index.length; i++) {
      var radian = i * gapDegree;
      var x = center + Math.sin(radian * Math.PI / 180) * (radius + 8);
      var y = center - Math.cos(radian * Math.PI / 180) * (radius + 8);
      if (radian == 0 || (radian > 80 && radian < 96)) {
        canvasContext.textAlign = "center";
      } else if (radian < 180) {
        canvasContext.textAlign = "left";
      } else {
        canvasContext.textAlign = "right";
      }
      canvasContext.fillStyle = "black";
      canvasContext.fillText(options.index[i], x, y);
    }

    // 附上颜色
    canvasContext.beginPath();
    for (var i=0; i<options.data.length; i++) {
      var value = options.data[i] * radius / (gapRadiusLength * polygonNum);
      var radian = i * gapDegree;
      var x = center + Math.sin(radian * Math.PI / 180) * value;
      var y = center - Math.cos(radian * Math.PI / 180) * value;
      if (i == 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }
    }
    canvasContext.closePath();
    canvasContext.fillStyle = color[0];
    canvasContext.fill();
  }

  return {
    bar:bar,
    line:line,
    pie:pie,
    ring:ring,
    radar:radar
  }
})()