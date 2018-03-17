var chart = (function () {
  // 公共参数
  var color = ['red', 'green', 'blue', 'black', 'orange', 'brown'];

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

  var line = function (options) {
    // 先写个复制options的函数
    var elm = document.querySelector(options.el);
    var elmProp = {
      paddingTop:60,
      paddingRight: 60,
      paddingBottom:60,
      paddingLeft:60
    }
    var canvas = document.createElement("canvas");
    var canvasContext = canvas.getContext("2d");
    canvas.width = 800;
    canvas.height = 300;
    elm.appendChild(canvas);

    canvasContext.clearRect(0,0, canvas.width, canvas.height);
    // 写上标题
    canvasContext.textAlign = "center";
    canvasContext.globalAlpha = 0.6;
    canvasContext.fillText(options.title, canvas.width / 2, elmProp.paddingTop / 2);
    canvasContext.strokeStyle = "black";
    canvasContext.globalAlpha = 0.6;
    canvasContext.lineWidth = 2;
    // 画Y/X轴两条主线
    canvasContext.beginPath();
    canvasContext.moveTo(elmProp.paddingLeft, elmProp.paddingTop);
    canvasContext.lineTo(elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
    canvasContext.lineTo(canvas.width - elmProp.paddingLeft, canvas.height - elmProp.paddingBottom);
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

  }
  var radar = function (options) {

  }
  var pie = function (options) {

  }
  return {
    bar:bar,
    line:line,
    radar:radar,
    pie:pie
  }
})()