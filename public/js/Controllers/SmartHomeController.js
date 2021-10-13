"use strict";
app.controller('SmartHomeController', ['$scope', '$window', '$route', '$http', '$interval', '$filter', function($scope, $window, $route, $http, $interval, $filter) {
    $scope.title = "Smart Home Dashboard";
    $scope.aboutmsg = "this is a testview for the new Smart Home Dashboard";
    $scope.fetchusername = function() {var val = JSON.parse($window.localStorage.getItem('login'));$scope.username = val.username;};
    $scope.yearToChartList = new Array;for(var i = 2020; i <= 2022; i++){$scope.yearToChartList.push(i);};
    $scope.chart_selector_list = ['chart1','chart2'];
    $scope.chart_sel = {selected:'chart1'};
    $scope.doyRange = new Array;for(var i = 0; i <= 365; i++){$scope.doyRange.push(i);};
    $scope.woyRange = new Array;for(var i = 0; i <= 52; i++){$scope.woyRange.push(i);};
    $scope.moyRange = new Array;for(var i = 0; i <= 12; i++){$scope.moyRange.push(i);};
    $scope.year_to_chart = {selected: 2021};
    $scope.time_window = {name: {name: 'doy'}};
    $scope.time_range = {doy: 1, woy: 1, moy: 1};
    $scope.timeWindowList = [{name:'doy', range: $scope.doyRange, selected: $scope.doyRange[-1]},{name:'woy', range: $scope.woyRange, selected: $scope.woyRange[-1]},{name:'moy', range: $scope.moyRange, selected: $scope.moyRange[-1]}];
    $scope.doy_selected = "";$scope.woy_selected = "";$scope.moy_selected = "";
    $scope.selected_data_set_1;$scope.selected_data_set_2;
    $scope.d = [{selected_data_set_1: $scope.selected_data_set_1, selected_data_set_2: $scope.selected_data_set_2}];
    $scope.d.selected_data_set_1 = 'array_voltage';
    $scope.d.selected_data_set_2 = 'battery_sense_voltage';
    $scope.harvestchart = 0;
    $scope.showBridgeData = function() {$('.datadisplay').load('/data/get');};
    $scope.digitaltest = function () {$scope.digitaltestdata = $('.datadisplay').load('/arduino/digital_test');};
    $scope.greenhouse_variables = {};$scope.dailyGenData = {};$scope.powerGenData = [];$scope.power = [];$scope.datetime = [];$scope.line1 = [];$scope.line2 = [];$scope.line3 = [];$scope.line4 = [];
    $scope.PowerArrLabels = new Array; $scope.tristarVariableList = new Array; $scope.powerList = new Array;
    $scope.array_voltage_arrData = new Array; $scope.battery_temp_F_arrData = new Array;$scope.charging_current_arrData = new Array;$scope.solar_charge_arr_Data = new Array;$scope.battery_sense_voltage_arrData = new Array;
    $scope.rp1_arrData = new Array; $scope.rp2_arrData = new Array; $scope.rp3_arrData = new Array; $scope.rp4_arrData = new Array;

    // Convert to Fahrenheit
    $scope.convertToF = function (celsius) {
      var f = celsius * 9/5 + 32;
      return f
    }
    //fetch arduino greenhouse data
    $scope.fetchChartData = function (){
          $scope.fetchGreenhouseData().then(function(data){
                $scope.fetchPowerData().then(function(data){
                      $scope.makeChart1($scope.array_voltage_arrData,$scope.battery_sense_voltage_arrData,$scope.charging_current_arrData,$scope.battery_temp_F_arrData,"Solar Array Voltage","Battery Sensor Voltage","Charging Current","Battery Temperature (F)");
                      $scope.makeChart2($scope.solar_charge_arr_Data,$scope.rp1_arrData,$scope.rp2_arrData,$scope.rp3_arrData,$scope.rp4_arrData,"Incoming Charge","Line1","Line2","Line3","Line4");

                });
          });
    };
    $scope.fetchGreenhouseData = function() {

      /* Connects to Greenhouse Arduino Microcontroller via BackEnd Route in Express Server */

          return $http.get('/greenhouse/powerData').then(function(data){
                  $scope.greenhouse_variables = data.data.value;
                  $scope.change_Scenes_Night();
                  $scope.panel_Pulse();
                  // $scope.change_Scenes_Greenhouse_Temp();
                  return $scope.time_range.doy = $scope.greenhouse_variables.total_days;
              });
    };
    $scope.change_Scenes_Night = function () {
      if($scope.greenhouse_variables.charging_state == 'NIGHT'){
        document.getElementById('main').style.backgroundImage="url(../../public/img/smarthome/T4T_Landing.gif)";
        document.getElementById('main').style.backgroundSize="100%";
        document.getElementById('main').style.backgroundRepeat="no-repeat";
      }
    };
    $scope.panel_Pulse = function () {
      if($scope.greenhouse_variables.charging_state == 'MPPT' && document.getElementById('solarpanel')){
        if($scope.greenhouse_variables.array_voltage > 60 ){
            document.getElementById('solarpanel').style.animation="panelPulse 0.5s ease-in-out infinite alternate";
        }else{
            document.getElementById('solarpanel').style.animation="panelPulse 2s ease-in-out infinite alternate";
        }
      }
    };
    $scope.changeProgramState = function (program) {
      var url = "http://192.168.0.204/data";
      $http.get(url + '/get/' + program).then(function(res){
        if(res.data.value == 1){
          $http.get(url + '/put/' + program + '/0');
        }else{
          $http.get(url + '/put/' + program + '/1');
        }
      }).then(async function(){
        await $scope.fetchGreenhouseData();
        await location.reload();
      });
    }
    $scope.change_Scenes_Bat_Temp = function () {
      if($scope.greenhouse_variables.battery_temp_F > 85){
        document.getElementById('power').style.backgroundColor="red";
      }else if($scope.greenhouse_variables.battery_temp_F >= 78 && $scope.greenhouse_variables.battery_temp_F <= 85 ){
        document.getElementById('power').style.backgroundColor="orange";
      }else if($scope.greenhouse_variables.battery_temp_F >= 55 && $scope.greenhouse_variables.battery_temp_F <= 77 ){
        document.getElementById('power').style.backgroundColor="green";
      }else if($scope.greenhouse_variables.battery_temp_F >= 40 && $scope.greenhouse_variables.battery_temp_F <= 54 ){
        document.getElementById('power').style.backgroundColor="blue";
      }else if($scope.greenhouse_variables.battery_temp_F <= 39 ){
        document.getElementById('power').style.backgroundColor="indigo";
      }
    };
    $scope.change_Scenes_Greenhouse_Temp = function () {
      if($scope.greenhouse_variables.battery_temp_F > 85){
        document.getElementById('greenhouse').style.backgroundColor="red";
      }else if($scope.greenhouse_variables.battery_temp_F >= 72 && $scope.greenhouse_variables.battery_temp_F <= 85 ){
        document.getElementById('greenhouse').style.backgroundColor="orange";
      }else if($scope.greenhouse_variables.battery_temp_F >= 55 && $scope.greenhouse_variables.battery_temp_F <= 71 ){
        document.getElementById('greenhouse').style.backgroundColor="green";
      }else if($scope.greenhouse_variables.battery_temp_F >= 40 && $scope.greenhouse_variables.battery_temp_F <= 54 ){
        document.getElementById('greenhouse').style.backgroundColor="blue";
      }else if($scope.greenhouse_variables.battery_temp_F <= 39 ){
        document.getElementById('greenhouse').style.backgroundColor="indigo";
      }
    }
    //fetch power data
    $scope.fetchPowerData = function () {

          var url = '/sd/jonesGreenHouse/data/';//console.log(url);
              url += $scope.year_to_chart.selected;//console.log(url);
              url += '/doy/';
              url += $scope.time_range.doy;//console.log(url);
              url += '/powerData.json';console.log(url);

          return $http.get(url).then(function(data){
                      $scope.PowerArray = data.data;
                      $scope.array_voltage_arrData = [];
                      $scope.battery_temp_F_arrData = [];
                      $scope.charging_current_arrData = [];
                      $scope.rp1_arrData = [];
                      $scope.rp2_arrData = [];
                      $scope.rp3_arrData = [];
                      $scope.rp4_arrData = [];


                      angular.forEach($scope.PowerArray[0], function (value, key){
                         $scope.powerList.push(key);
                      });
                      console.log($scope.powerArray);
                      angular.forEach($scope.PowerArray, function (entry) {
                        $scope.PowerArrLabels.push(entry.update);

                        if ((entry.rp1 > 1) && (entry.rp1 < 1400)){$scope.rp1_arrData.push(entry.rp1);}else{$scope.rp1_arrData.push(1);}
                        if (entry.rp2 > 1 && entry.rp2 < 1400){$scope.rp2_arrData.push(entry.rp2);}else{$scope.rp2_arrData.push(1);}
                        //if (entry.rp3 > 1 && entry.rp3 < 1000){$scope.rp3_arrData.push(entry.rp3);}else{$scope.rp3_arrData.push(0);}
                        //if (entry.rp4 > 1 && entry.rp4 < 1000){$scope.rp4_arrData.push(entry.rp4);}else{$scope.rp4_arrData.push(0);}

                        if (entry.charging_current > 140){$scope.charging_current_arrData.push(0);}else{$scope.charging_current_arrData.push(entry.charging_current.toFixed(2));}
                        if (entry.charging_current.toFixed(2)*10 > 1400){$scope.solar_charge_arr_Data.push(0);}else{$scope.solar_charge_arr_Data.push(entry.charging_current.toFixed(2)*10);}

                        $scope.battery_temp_F_arrData.push(entry.battery_temp_F.toFixed(2));
                        $scope.array_voltage_arrData.push(entry.array_voltage.toFixed(2));
                        $scope.battery_sense_voltage_arrData.push(entry.battery_sense_voltage.toFixed(2));

                      var l = $scope.PowerArray.length;
                      $scope.charge_state = $scope.PowerArray[l-1]["charging_state"];
                      });
                    //  console.log($scope.rp1_arrData);
                    //  console.log($scope.charging_current_arrData);
                    //  console.log($scope.PowerArrLabels);
              });
    };

    $scope.makeChart1 = function (sds1,sds2,sds3,sds4,lbl1,lbl2,lbl3,lbl4) {
          $('#integralLineChart').remove();
          $scope.onClick = function (points, evt) {console.log(points, evt);};
          $scope.Chart1data = {
              labels: $scope.PowerArrLabels,
              datasets: [{data: sds1,label: lbl1,borderColor: "#FFB598",fill: false,lineTension: 0.8},
                         {data: sds2,label: lbl2,borderColor: "#91C3E9",fill: false,lineTension: 0.8},
                         {data: sds3,label: lbl3,borderColor: "#8A485F",fill: 'origin',backgroundColor: "#8A485F",lineTension: 0.8},
                         {data: sds4,label: lbl4,borderColor: "#F5EB8E",fill: false,lineTension: 0.8}
                        ]
          };
          $scope.Chart1options = {
            title: {
                  display: true,
                  text: 'Power Data Charts'
            },
            legend: {display: true},
            scales: {
              yAxes: [
                {
                  id: 'y-axis-1',
                  type: 'linear',
                  ticks: {
                      max: 120,
                      min: 0,
                      stepSize: 10
                  },
                  display: true,
                  position: 'left',
                  scaleLabel: { display: true, labelString: 'Solar Array Voltage' }
                },
                {
                  id: 'y-axis-2',
                  type: 'linear',
                  ticks: {
                      max: 120,
                      min: 0,
                      stepSize: 10
                  },
                  display: true,
                  position: 'right',
                  gridLines: {drawOnChartArea: false},
                  scaleLabel: { display: true, labelString: 'Battery Voltage Sensor' }
                }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Time of Data Entry'
                  }
                }
              ]
            }
          };
          $('#integrallinechartcon').append('<canvas id="integralLineChart" width="800" height="400" class="chart chart-line" chart-data="data" chart-labels="labels" chart-options="options" chart-click="onClick"><canvas>');
          var ctx = document.getElementById('integralLineChart');
          $scope.integralLineChart = new Chart(ctx, {
              type: 'line',
              data: $scope.Chart1data,
              options: $scope.Chart1options
          });
    };
    $scope.makeChart2 = function (sds4,sds5,sds6,sds7,sds8,lbl4,lbl5,lbl6,lbl7,lbl8) {
          $('#Chart2').remove();
          $scope.onClick = function (points, evt) {console.log(points, evt);};
          $scope.Chart2data = {
              labels: $scope.PowerArrLabels,
              datasets: [{yAxisID: 'y-axis-1', data: sds4,label: lbl4,borderColor: "#F5EB8E",fill: false,lineTension: 0.8},
                         {yAxisID: 'y-axis-2', data: sds5,label: lbl5,borderColor: "#d4faf6",fill: 'origin',backgroundColor: "#d4faf6",lineTension: 0.8},
                         {yAxisID: 'y-axis-2', data: sds6,label: lbl6,borderColor: "#b3ecf5",fill: 'origin',backgroundColor: "#b3ecf5",lineTension: 0.8},
                         {yAxisID: 'y-axis-2', data: sds7,label: lbl7,borderColor: "#a3daf7",fill: 'origin',backgroundColor: "#a3daf7",lineTension: 0.8},
                         {yAxisID: 'y-axis-2', data: sds8,label: lbl8,borderColor: "#84b1f0",fill: 'origin',backgroundColor: "#84b1f0",lineTension: 0.8}
                       ]
          };
          $scope.Chart2options = {
            title: {
                  display: true,
                  text: 'Power Data Charts'
            },
            legend: {display: true},
            scales: {
              yAxes: [
                 {
                  id: 'y-axis-1',
                  type: 'linear',
                  ticks: {max: 3600,min: 0,stepSize: 100},
                  stacked: false,
                  display: true,
                  position: 'left',
                  scaleLabel: { display: true, labelString: 'Incoming Solar Charge' }
                },
                {
                 id: "y-axis-2",
                 type: 'linear',
                 ticks: {max: 3600,min: 0,stepSize: 100},
                 stacked: true,
                 display: true,
                 position: 'right',
                 scaleLabel: { display: true, labelString: 'Power Consumption (Watts)' }
               }
              ],
              xAxes: [
                {
                  scaleLabel: {
                    display: true,
                    labelString: 'Time of Data Entry'
                  }
                }
              ]
            }
          };
          $('#Chart2con').append('<canvas id="Chart2" width="800" height="400" class="chart chart-line" chart-data="data" chart-labels="labels" chart-options="options" chart-click="onClick"><canvas>');
          var ctx = document.getElementById('Chart2');
          $scope.Chart2 = new Chart(ctx, {
              type: 'line',
              data: $scope.Chart2data,
              options: $scope.Chart2options
          });
    };
    $scope.fetch_event_log = function() {
      $scope.fetchGreenhouseData().then(function(data){
          $scope.doy = data;
          var url = '/sd/jonesGreenHouse/data/logs/';
              url += $scope.year_to_chart.selected;
              url += '/';
              url += $scope.doy;
              url += '/event_log.json'
         $http.get(url).then(function(data){
                  $scope.event_log = data.data;//console.log($scope.event_log);
                  return $scope.event_log;
          });
      });
    };
    $scope.DrawOscillator = function(){

    };
    $scope.DailySolarHarvest = function(){
          $scope.harvestchart = 1;
          $('#harvestchart').append('<canvas id="harvestchart" width="800" height="400" class="chart chart-line" chart-data="data" chart-labels="labels" chart-options="options" chart-click="onClick"><canvas>');
          $scope.fetchPowerGenerationData();
    };
    $scope.updateCharts = function () {

        //$('#integrallinechartcon').append('<canvas id="integralLineChart" width="800" height="400" class="chart chart-line" chart-data="data" chart-labels="labels" chart-options="options" chart-click="onClick"><canvas>');
        location.reload();
    };

    $scope.sun = function (){
        $scope.parseInstantData();
        console.log($scope.doy);
        url = '/sd/jonesgarden/data/'+doy+'_'+y+'/sunData.txt';
        $interval(
          $http.get(url)
              .then(function(data){
                $scope.vegSunT5State = data["vegSunT5State"];
                $scope.vegSunBlueState = data["vegSunBlueState"];
                $scope.vegSunRed1State = data["vegSunRed1State"];
                $scope.vegSunRed2State = data["vegSunRed2State"];
                $scope.bloomSunHPSState = data["bloomSunHPSState"];
                $scope.bloomSunMHState = data["bloomSunMHState"];
                if ($scope.vegSunT5State == "1") {
                    $("#sun").removeClass("sunOff");
                    $("#sun").addClass("sunOn");
                }else {
                    $("#sun").removeClass("sunOn");
                    $("#sun").addClass("sunOff");
                }
              }
          ),5000)
    };

    $scope.rain = function (){
        doy = $scope.doy;
        y = $scope.y;
        url = '/sd/jonesgarden/data/'+doy+'_'+y+'/rainData.txt';
        $http.get('/sd/jonesgarden/data/rainData.txt')
              .then(function(data){
                $scope.pump1State = data["pump1State"];
                $scope.pump2State = data["pump2State"];
                if ($scope.pump1State == "1" || $scope.pump2State == "1") {
                    $("#rain").removeClass("rainOff");
                    $("#rain").addClass("rainOn");
                }else {
                    $("#rain").removeClass("rainOn");
                    $("#rain").addClass("rainOff");
                }
              });
    };

    $scope.fetchClimateData = function (){
          doy = $scope.doy;
          y = $scope.y;
          url = '/sd/jonesgarden/data/'+doy+'_'+y+'/climateData.txt';
          $http.get(url)
            .then(function(data){
                  $scope.data = data;
                  console.log(data);
                  $scope.temperature = data["temperature"];
                  $scope.humidity = data["humidity"];
                });
    };
    $scope.wind = function (){
        doy = $scope.doy;
        y = $scope.y;
        url = '/sd/jonesgarden/data/'+doy+'_'+y+'/windData.txt';
        $http.get(url)
              .then(function(data){
                $scope.fanState = data["fanState"];
                $scope.humidity = data["dehumidifierState"];
              });
    };
    $scope.plants = function () {
      //$scope.plantdata = $('.datadisplay').load('/arduino/digital_test');
    };
    $scope.ledger = function () {
      //$scope.ledgerdata = $('.datadisplay').load('/arduino/digital_test');
    };
    $scope.fetchWeatherData = function (){
      $scope.fetchGreenhouseData().then(function(data){
        $scope.doy = data;
        console.log(data);

        var url = '/sd/jonesGreenHouse/data/';//console.log(url);
            url += $scope.year_to_chart.selected;//console.log(url);
            url += '/doy/';
            url += $scope.time_range.doy;//console.log(url);
            url += '/weatherForecastData.json';//console.log(url);

        $http.get(url).then(function(data){
            $scope.today = new Date();
            $scope.tomorrow = new Date();
            $scope.tomorrow.setDate($scope.tomorrow.getDate() + 1);
            $scope.weatherArray = JSON.parse(data.data[0]);
            //console.log($scope.weatherArray);
            $scope.forecast_main = $scope.weatherArray[0].weather[0].main;
            $scope.forecast_description = $scope.weatherArray[0].weather[0].description;
            $scope.forecast_temp = Math.round($scope.convertToF($scope.weatherArray[0].main['temp']));
            $scope.forecast_grnd_level = $scope.weatherArray[0].main['grnd_level'];
            $scope.forecast_temp_max = Math.round($scope.convertToF($scope.weatherArray[0].main['temp_max']));
            $scope.forecast_sea_level = $scope.weatherArray[0].main['sea_level'];
            $scope.forecast_humidity = $scope.weatherArray[0].main['humidity'];
            $scope.forecast_pressure = $scope.weatherArray[0].main['pressure'];
            $scope.forecast_temp_min = Math.round($scope.convertToF($scope.weatherArray[0].main['temp_min']));
            $scope.forecast_feels_like = Math.round($scope.convertToF($scope.weatherArray[0].main['feels_like']));
        });
      });
    };
    $scope.fetchWeatherMap = function () {
      var url = "http://maps.openweathermap.org/maps/2.0/weather/"
          url += "PR0/"
          url += "appid={d6fc81aec0534e24fe2a496ddece0556}"
          $http.get(url).then(function(data){
              $scope.weathermap = data.data;
          });

    };
    $scope.fetchGreenhouseData();
}]);
