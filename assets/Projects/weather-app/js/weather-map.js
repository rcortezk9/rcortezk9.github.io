/**
 * Created by renecortez on 4/27/17.
 */
$(document).ready(function(){
    'use strict';
    //declare variables
    var search = document.getElementById("search");
    var lat = 29.4241;
    var lon = -98.4636;
    var mapOptions = {
        zoom: 8,
        center: {
            lat: lat,
            lng: lon
        },
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var address, object;
    var geocoder = new google.maps.Geocoder();

    // Render the map
    var map = new google.maps.Map(document.getElementById("map-display"), mapOptions);
    //draggable marker
    var marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lon
        },
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP
    });

    function locationGeoCode() {
        // console.log(address.value + ' is the address you are searching');

        geocoder.geocode({"address": address.value}, function (results, status) {
            console.log(status);
            console.log(results);
            if (status === google.maps.GeocoderStatus.OK){
                map.setCenter(results[0].geometry.location);

            } else {
                alert("Geocoding was not successful - STATUS: " + status)
            }
        });
        address.value = '';
    }

    // Function to convert output to title case
    function titleCase(str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
    // Will give a compass direction
    function degToCompassDir(deg) {
        var compassDir = ["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"];;
        return compassDir [Math.round(deg/22.5)];
    }

    function toggleColClass(days, cols) {// Change format of display considering how many day forecast.
        for(var i=1; i<=days; i++) {
            if(days % 4 === 0) {
                $('#day' + i).toggleClass('col-xs-6 col-sm-' + cols + ' hide');
            } else {
                $('#day' + i).toggleClass('col-xs-' + cols + ' hide');
            }
        }
    }


    function getDate(day) {  //today: day=0, tomorrow: day=1, dayAfterTomorrow: day=2 ...

        var today = new Date(), date, indexDayOfWeek;
        var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday","Saturday"];
        var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        if(day != 0) {
            day = new Date(today.getTime() + day * (24 * 60 * 60 * 1000));
            indexDayOfWeek = day.getDay();
            date = month[day.getMonth()] + ' ' + day.getDate();
            return '<span class="dayOfWeek">' + dayOfWeek[indexDayOfWeek] + '</span> <br>' + date;
        } else {
            return '<span class="dayOfWeek"> Today </span> <br>' + month[today.getMonth()] + ' ' + today.getDate();
        }

    }

    function getWeather(lat, lon) {
        $.get("http://api.openweathermap.org/data/2.5/forecast/daily", {
            APPID: "55aec6780da8e9b516e2937ae17b58af",
            lat: lat,
            lon: lon,
            units: "imperial",
            cnt: 10
        }).done(function (data) {
            // console.log(data);
            data.list.forEach(function (element, index) {
           // console.log(element);

                var content;

                content = getDate(index);
                content += '<br><span id="temp">' + parseInt(element.temp.max) + '&deg;' + '/' + parseInt(element.temp.min) + '&deg;</span>';
                content += '<br><img src="http://openweathermap.org/img/w/' + element.weather[0].icon + '.png">';
                content += '<br><span>Clouds:</span>' + ' ' + titleCase(element.weather[0].description);
                content += '<br><span>Humidity:</span>' + ' ' + element.humidity + '%';
                content += '<br><span>Wind:</span>' + ' ' + parseInt(element.speed) + ' MPH' + ' / ' + degToCompassDir(element.deg);
                content += '<br><span>Pressure:</span>' + ' ' + element.pressure;

                $('#day' + (index+1)).html(content);

            });

            $('#cityName').text(data.city.name);


        });

    $('.options').click(function () {

        $('.options').each(function (i, option) {
            $('.options').removeClass('active');
        });

        $(this).addClass('active');

        $('.forecast').removeClass('col-xs-12 col-xs-6 col-xs-4 col-xs-3 col-sm-3').addClass('hide')

        switch ($(this).attr('data-option')){
            case '3':
                toggleColClass(3, 4);
                break;
            case '6':
                toggleColClass(6, 4);
                break;
            case '9':
                toggleColClass(9, 4);
                break;
        }
    })

    }
    marker.addListener('dragend', function(event) {
        lat = event.latLng.lat();
        lon = event.latLng.lng();
        mapOptions.center.lng = lon;
        mapOptions.center.lat = lat;
        getWeather(lat, lon);
    });

    search.addEventListener('click', function (e) {
        e.preventDefault();
        address = document.getElementById('location');
        console.log(address.value + 'is the address you are looking for');
        locationGeoCode();

    });


    getWeather(lat, lon);

});