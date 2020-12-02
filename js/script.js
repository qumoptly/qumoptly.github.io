/**
 * ---------------------------------------
 * This demo was created using amCharts 4.
 * 
 * For more information visit:
 * https://www.amcharts.com/
 * 
 * Documentation is available at:
 * https://www.amcharts.com/docs/v4/
 * ---------------------------------------
 */

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4plugins_timeline.SerpentineChart);
chart.curveContainer.padding(50, 20, 50, 20);
chart.levelCount = 4;
chart.yAxisRadius = am4core.percent(25);
chart.yAxisInnerRadius = am4core.percent(-25);
chart.maskBullets = false;

var colorSet = new am4core.ColorSet();
colorSet.saturation = 0.5;

chart.data = [{
    "category": "Web Pages ",
    "start": "2016-03-06",
    "end": "2017-11-20",
    "color": colorSet.getIndex(20),
    "task": "时间线",
    "disabled1":false,
    "image1":"../img/robot1.png",
    "location":0
}, {
    "category": "Web Pages ",
    "start": "2017-11-20",
    "end": "2018-07-28",
    "color": colorSet.getIndex(18),
    "task": "激光相关整理",
    "disabled1":false,
    "image1":"../img/atom.png"
}, {
    "category": "Web Pages ",
    "start": "2018-04-09",
    "end": "2019-01-09",
    "color": colorSet.getIndex(16),
    "task": "部署到Github Pages",
    "disabled1":false,
    "image1":"../img/ocat.png"
}, {
    "category": "Web Pages ",
    "start": "2019-01-09",
    "end": "2020-12-31",
    "color": colorSet.getIndex(15),
    "task": "qumoptly ",
    "disabled1":false,
    "image1":"../img/ocat.png"
}, {
    "category": "Web Pages ",
    "start": "2019-07-24",
    "end": "2020-10-31",
    "color": colorSet.getIndex(24),
    "task": "相关资源工具 spdcalc、激光计算、Edmund Optics资源、RP-Photonics备份等"
}, 
{
    "category": "Hexo ",
    "start": "2019-07-16",
    "end": "2019-07-27",
    "color": colorSet.getIndex(14),
    "task": "Hexo 博客"
}, {
    "category": "Docsify ",
    "start": "2019-07-20",
    "end": "2020-12-31",
    "color": colorSet.getIndex(0),
    "task": "Docsify 笔记本",
    "disabled1":false,
    "image1":"../img/proj.png"
}, {
    "category": "Docsify ",
    "start": "2019-07-20",
    "end": "2020-11-04",
    "color": colorSet.getIndex(2),
    "task": "量子机器学习"
}, {
    "category": "Docsify ",
    "start": "2020-01-11",
    "end": "2020-03-16",
    "color": colorSet.getIndex(6),
    "task": "激光器整理"
}, {
    "category": "Docsify ",
    "start": "2020-01-12",
    "end": "2020-03-16",
    "color": colorSet.getIndex(8),
    "task": "激光器图解"
}, {
    "category": "Docsify ",
    "start": "2020-03-30",
    "end": "2020-07-20",
    "color": colorSet.getIndex(10),
    "task": "OneNote笔记"
}, {
    "category": "Docsify ",
    "start": "2020-09-08",
    "end": "2020-11-30",
    "color": colorSet.getIndex(12),
    "task": "软件学习"
}
];

chart.dateFormatter.dateFormat = "yyyy-MM-dd";
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";
chart.fontSize = 11;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.paddingRight = 25;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.innerRadius = -60;
categoryAxis.renderer.radius = 60;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 70;
dateAxis.baseInterval = { count: 1, timeUnit: "day" };
dateAxis.renderer.tooltipLocation = 0;
dateAxis.startLocation = -0.5;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.6;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 7;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.7;
labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7, 7, 7, 7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(20);
series.columns.template.tooltipText = "{task}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

series.dataFields.openDateX = "start";
series.dataFields.dateX = "end";
series.dataFields.categoryY = "category";
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 0;

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.radius = 3;
bullet.circle.strokeOpacity = 0;
bullet.propertyFields.fill = "color";
bullet.locationX = 0;


var bullet2 = series.bullets.push(new am4charts.CircleBullet());
bullet2.circle.radius = 3;
bullet2.circle.strokeOpacity = 0;
bullet2.propertyFields.fill = "color";
bullet2.locationX = 1;


var imageBullet1 = series.bullets.push(new am4plugins_bullets.PinBullet());
imageBullet1.disabled = true;
imageBullet1.propertyFields.disabled = "disabled1";
imageBullet1.locationX = 1;
imageBullet1.circle.radius = 20;
imageBullet1.propertyFields.stroke = "color";
imageBullet1.background.propertyFields.fill = "color";
imageBullet1.image = new am4core.Image();
imageBullet1.image.propertyFields.href = "image1";

var imageBullet2 = series.bullets.push(new am4plugins_bullets.PinBullet());
imageBullet2.disabled = true;
imageBullet2.propertyFields.disabled = "disabled2";
imageBullet2.locationX = 0;
imageBullet2.circle.radius = 20;
imageBullet2.propertyFields.stroke = "color";
imageBullet2.background.propertyFields.fill = "color";
imageBullet2.image = new am4core.Image();
imageBullet2.image.propertyFields.href = "image2";


var eventSeries = chart.series.push(new am4plugins_timeline.CurveLineSeries());
eventSeries.dataFields.dateX = "eventDate";
eventSeries.dataFields.categoryY = "category";
eventSeries.data = [
    { category: "", eventDate: "2016-03-20", letter: "(⊙o⊙)", description: "资料丢失" },
    { category: "", eventDate: "2017-11-20", letter: "Laser", description: "From：2017-11-20" },
    { category: "", eventDate: "2018-07-28", letter: "Laser", description: "To：2018-08-28" },
    { category: "", eventDate: "2018-06-23", letter: "PoseNet", description: "PoseNet人体姿态检测" },
    { category: "", eventDate: "2018-06-26", letter: "Yolo-Tiny", description: "Yolo-Tiny目标检测" },
    { category: "", eventDate: "2018-09-17", letter: "Quirk", description: "Quirk量子电路模拟" },
    { category: "", eventDate: "2020-07-17", letter: "Optics", description: "更新Edmund Optics资源中心" },
    { category: "", eventDate: "2020-06-17", letter: "Photonics", description: "更新RP-Photonics镜像" },
    { category: "", eventDate: "2020-05-24", letter: "Laser tools", description: "激光常用计算公式" },
    { category: "", eventDate: "2019-07-16", letter: "Hexo", description: "Hexo博客" },
    { category: "", eventDate: "2019-07-30", letter: "QML", description: "量子机器学习" },
    { category: "", eventDate: "2020-01-11", letter: "Laser", description: "激光器整理" },
    { category: "", eventDate: "2020-03-16", letter: "Laser", description: "激光器图解" },
    { category: "", eventDate: "2020-11-04", letter: "QML", description: "量子机器学习" },
    { category: "", eventDate: "2020-03-30", letter: "Light", description: "OneNote笔记" },
    { category: "", eventDate: "2020-09-08", letter: "Soft", description: "软件学习" }];
eventSeries.strokeOpacity = 0;

var flagBullet = eventSeries.bullets.push(new am4plugins_bullets.FlagBullet())
flagBullet.label.propertyFields.text = "letter";
flagBullet.locationX = 0;
flagBullet.tooltipHTML = "<b>{description}<b>";

chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(85);

var cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false;