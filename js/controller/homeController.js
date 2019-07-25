app.controller('homeController', function ($scope, $http,MyService) {

    //https://nodetest-229207.appspot.com/getUser?user=
    //https://pmdbmicro.appspot.com/getTMDB
    //var tmdbApiKey = "42247a02bfe535270b121180167a05d4";
    var page = 0;

    $scope.tmdbApiKey = "";

    MyService.fighters().then(function (data) {
        $scope.tmdbApiKey = data;
        $scope.movieInit(0,'M');
    });

    $scope.pg = 1;
    $scope.nowPlaying = [];
    $scope.videoTable = [];
    $scope.mainBackgroundList = [];
    $scope.userProfile = [];
    $scope.recomTable = [];
    $scope.analyticsFav = [];
    $scope.genreList = [];
    $scope.analyticsMovieList = [];
    $scope.analyticsTvList = [];
    $scope.analyticsMovieListFinal = [];
    $scope.analyticsTvListFinal = [];
    $scope.dataM = [];

    $scope.myVid = "M";

    // "https://api.themoviedb.org/3/genre/movie/list?api_key=" + $scope.tmdbApiKey + "&language=en-US"

    $http({
        method: 'GET',
        url: "https://api.themoviedb.org/3/genre/movie/list?api_key=" + $scope.tmdbApiKey + "&language=en-US"
    }).then(function successCallback(response) {
        $scope.genreList = response.data.genres;

    })

    $scope.getRecom = function (videoID, videoType) {

        //


        if (videoType == "T")

            $http({                             //http header for recommendations
                method: 'GET',
                url: "https://api.themoviedb.org/3/tv/" + videoID + "/recommendations?api_key=" + $scope.tmdbApiKey + "&language=en-US&page=1"
            }).then(function successCallback(response) {
                $scope.recomTable = response.data.results.slice(0, 5)
                modal.style.display = "block";
            })

        else {

            $http({
                method: 'GET',
                url: "https://api.themoviedb.org/3/movie/" + videoID + "/recommendations?api_key=" + $scope.tmdbApiKey + "&language=en-US&page=1"
            }).then(function successCallback(response) {
                $scope.recomTable = response.data.results.slice(0, 5)
                modal.style.display = "block";

            })

        }
        modal.style.display = "block";
    }

    $scope.openModal = function (videoDetails, vidInfo) {


        if (vidInfo == false) {
            $scope.modalMovie = videoDetails;

            if (videoDetails.title)
                $scope.getRecom(videoDetails.id, "M");
            else
                $scope.getRecom(videoDetails.id, "T");

        } else {

            var myVidID = videoDetails.split("_")[0]

            if (videoDetails.split("_")[2] == "T")

                $http({
                    method: 'GET',
                    url: "https://api.themoviedb.org/3/tv/" + myVidID + "?api_key=" + $scope.tmdbApiKey + "&language=en-US"
                }).then(function successCallback(response) {

                    $scope.modalMovie = response.data;
                    $scope.getRecom(myVidID, "T");
                })

            else {

                $http({
                    method: 'GET',
                    url: "https://api.themoviedb.org/3/movie/" + myVidID + "?api_key=" + $scope.tmdbApiKey + "&language=en-US"
                }).then(function successCallback(response) {

                    $scope.modalMovie = response.data;
                    $scope.getRecom(myVidID, "M");
                })

            }
        }
    }

    $scope.searchVid = function () {

        if ($scope.queryVid) {

            var choice = "";
            var includeAdult = "";
            if ($scope.myVid == "M") {
                choice = "movie";
                includeAdult = "&include_adult=false";
            } else if ($scope.myVid == "T") {
                choice = "tv";
                includeAdult = "";
            }

            $http({
                method: 'GET',
                url: "https://api.themoviedb.org/3/search/" + choice + "?api_key=" + $scope.tmdbApiKey + "&language=en-US&page=1" + includeAdult + "&query=" + $scope.queryVid
            }).then(function successCallback(response) {
                $scope.fillTable(response);
            })
        } else
            alert("Enter a movie or TV series name to search");
    }

    $scope.movieInit = function (pgnum, linkVideo) {        // calling data from tmdb

        page = page + pgnum;
        if (page == 0) {
            page = 1
        }

        $scope.showPageNum = page;

        if (linkVideo == 'M') {
            urlVid = "https://api.themoviedb.org/3/movie/now_playing?api_key=" + $scope.tmdbApiKey + "&language=en-US&page="
        } else if (linkVideo == 'T') {
            urlVid = "https://api.themoviedb.org/3/tv/popular?api_key=" + $scope.tmdbApiKey + "&language=en-US&page="
        }

        $http({
            method: 'GET',
            url: urlVid + page
        }).then(function successCallback(response) {
            $scope.fillTable(response)
        }, function errorCallback(response) {});

    }

    window.onload = function () {


        function changeImage() {
            var BackgroundImg = $scope.mainBackgroundList;
            var i = Math.floor((Math.random() * 19) + 1);
            document.body.style.backgroundImage = 'url("' + BackgroundImg[i] + '")';
            document.body.style.backgroundRepeat = 'no repeat';
            document.body.style.backgroundSize = 'cover';

        }
        window.setInterval(changeImage, 5000);
    }

    $scope.fillTable = function (response) {        //slicing 5 movies and inserting in array_cat

        $scope.nowPlaying = response.data.results
        $scope.videoTable[0] = $scope.nowPlaying.splice(0, 5);
        $scope.videoTable[1] = $scope.nowPlaying.splice(0, 5);
        $scope.videoTable[2] = $scope.nowPlaying.splice(0, 5);
        $scope.videoTable[3] = $scope.nowPlaying.splice(0, 5);


        for (var item = 0; item < $scope.videoTable.length; item++)
            for (var i = 0; i < $scope.videoTable[item].length; i++) {

                $scope.mainBackgroundList.push("http://image.tmdb.org/t/p/w780/" + $scope.videoTable[item][i].poster_path);

            }

    }


    $scope.fillRecom = function (response) {

        response;

    }

    function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        $scope.$apply(function () {
            $scope.userProfile.id = profile.getId();
            $scope.userProfile.name = profile.getName();
            $scope.userProfile.email = profile.getEmail();
            $scope.userProfile.fav = [];
            //https://nodetest-229207.appspot.com/getUser?user=
            $http({
                method: 'GET',
                url: 'https://nodetest-229207.appspot.com/getUser?user=' + $scope.userProfile.email + "&name=" + $scope.userProfile.name
            }).then(function successCallback(response) {
                if (response.data.rows[0].fav)
                    $scope.userProfile.fav = response.data.rows[0].fav;
                $scope.showanalytics();

            }, function errorCallback(response) {});
        })
    }

    window.onSignIn = onSignIn;

    $scope.moveToBook = function (vidID, vidOriginal, vidTitle) {
        var typeOfVid = "M"
        var name;
        if (vidOriginal) {
            name = vidOriginal;
            typeOfVid = "T";
        } else
            name = vidTitle;

        if ($scope.userProfile.id) {

            if ($scope.userProfile.fav.indexOf(vidID + "_" + name + "_" + typeOfVid) >= 0) {

                alert("Already Bookmarked");

            } else {

                $http({
                    method: 'GET',
                    url: "https://nodetest-229207.appspot.com/bookmark?user=" + $scope.userProfile.email + "&movieID=" + vidID + "_" + name + "_" + typeOfVid
                }).then(function successCallback(response) {

                    $scope.userProfile.fav.push(vidID + "_" + name + "_" + typeOfVid);
                    $scope.showanalytics();
                }, function errorCallback(response) {});

            }
        } else {

            alert("Please Login to Bookmark");

        }

    }

    $scope.removeBook = function (vidID) {

        var typeOfVid = vidID.split("_")[2];
        var name = vidID.split("_")[1];
        vidID = vidID.split("_")[0];


        if ($scope.userProfile.id && $scope.userProfile.fav.length > 0 && $scope.userProfile.fav.indexOf(vidID + "_" + name + "_" + typeOfVid) >= 0) {

            $http({
                method: 'GET',
                url: "https://nodetest-229207.appspot.com/removeBookmark?user=" + $scope.userProfile.email + "&movieID=" + vidID + "_" + name + "_" + typeOfVid
            }).then(function successCallback(response) {
                $scope.userProfile.fav.splice($scope.userProfile.fav.indexOf(vidID + "_" + name + "_" + typeOfVid), 1);
                $scope.showanalytics();
            }, function errorCallback(response) {});

        } else {

            alert("Action not allowed");

        }

    }

    $scope.signOut = function () {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {});
        $scope.userProfile = [];
        $scope.showanalytics();
    }
    ////////////////// analytics ////////////





    $scope.fillAnalyticsList = function (data, start, limit, type) {

        $scope.analyticsFav.info = "Proccessing"

        if (type == "M") {
            if (start == limit) {

                var pieDataM = [];
                var barDataM = [];
                var barData2M = [];
                var genreTimes = [];
                var counts = {};
                $scope.dataM = [];
                $scope.dataBarM = [];
                $scope.dataBarM[0] = {};
                $scope.dataBarM[0]["key"] = "Values";
                $scope.dataBarM[0]["values"] = [];
                $scope.dataBar2M = [];
                $scope.dataBar2M[0] = {};
                $scope.dataBar2M[0]["key"] = "Values";
                $scope.dataBar2M[0]["values"] = [];

                for (var x = 0; x < data.length; x++) {
                    barDataM["label"] = data[x].title
                    barDataM["value"] = data[x].popularity
                    $scope.dataBarM[0]["values"].push(barDataM);
                    barDataM = [];

                    barData2M["label"] = data[x].title
                    barData2M["value"] = data[x].vote_average
                    $scope.dataBar2M[0]["values"].push(barData2M);
                    barData2M = [];

                    if (data[x].genres instanceof Array) {

                        for (var y = 0; y < data[x].genres.length; y++) {

                            genreTimes.push(data[x].genres[y].name);

                        }

                    } else {

                        genreTimes.push(data[x].genres.name);

                    }

                }
                genreTimes.forEach(function (x) {
                    counts[x] = (counts[x] || 0) + 1;
                });

                for (var l = 0; l < Object.keys(counts).length; l++) {

                    pieDataM["key"] = Object.keys(counts)[l];
                    pieDataM["y"] = counts[Object.keys(counts)[l]];
                    $scope.dataM.push(pieDataM);
                    pieDataM = [];

                }

            }

        } else if (type == "T") {

            if (start == limit) {

                var pieDataT = [];
                var barDataT = [];
                var barData2T = [];
                var genreTimesT = [];
                var countsT = {};
                $scope.dataT = [];
                $scope.dataBarT = [];
                $scope.dataBarT[0] = {};
                $scope.dataBarT[0]["keys"] = "Values";
                $scope.dataBarT[0]["values"] = [];
                $scope.dataBar2T = [];
                $scope.dataBar2T[0] = {};
                $scope.dataBar2T[0]["keys"] = "Values";
                $scope.dataBar2T[0]["values"] = [];

                for (var x = 0; x < data.length; x++) {
                    barDataT["label"] = data[x].original_name
                    barDataT["value"] = data[x].popularity
                    $scope.dataBarT[0]["values"].push(barDataT);
                    barDataT = [];

                    barData2T["label"] = data[x].original_name
                    barData2T["value"] = data[x].vote_average
                    $scope.dataBar2T[0]["values"].push(barData2T);
                    barData2T = [];

                    if (data[x].genres instanceof Array) {

                        for (var y = 0; y < data[x].genres.length; y++) {

                            genreTimesT.push(data[x].genres[y].name);

                        }

                    } else {

                        genreTimesT.push(data[x].genres.name);

                    }

                }
                genreTimesT.forEach(function (x) {
                    countsT[x] = (countsT[x] || 0) + 1;
                });

                for (var l = 0; l < Object.keys(countsT).length; l++) {

                    pieDataT["key"] = Object.keys(countsT)[l];
                    pieDataT["y"] = countsT[Object.keys(countsT)[l]];
                    $scope.dataT.push(pieDataT);
                    pieDataT = [];

                }

            }

        }
        $scope.analyticsFav.info = "";

    }



    $scope.showanalytics = function () {

        if ($scope.userProfile.id) {

            if ($scope.userProfile.fav.length > 0) {

                $scope.analyticsFav.info = "";
                $scope.analyticsMovieList = [];
                $scope.analyticsTvList = [];

                for (var z = 0; z < $scope.userProfile.fav.length; z++) {
                    var videoDetails = $scope.userProfile.fav[z];

                    if (videoDetails.split("_")[2] == "T") {
                        $http({
                            method: 'GET',
                            url: "https://api.themoviedb.org/3/tv/" + videoDetails.split("_")[0] + "?api_key=" + $scope.tmdbApiKey + "&language=en-US"
                        }).then(function successCallback(response) {

                            $scope.analyticsTvList.push(response.data);

                            $scope.fillAnalyticsList($scope.analyticsTvList, z, $scope.userProfile.fav.length, "T");


                        })
                    } else {

                        $http({
                            method: 'GET',
                            url: "https://api.themoviedb.org/3/movie/" + videoDetails.split("_")[0] + "?api_key=" + $scope.tmdbApiKey + "&language=en-US"
                        }).then(function successCallback(response) {

                            $scope.analyticsMovieList.push(response.data);

                            $scope.fillAnalyticsList($scope.analyticsMovieList, z, $scope.userProfile.fav.length, "M");

                        })

                    }



                }

            } else {
                $scope.analyticsMovieList = [];
                $scope.analyticsTvList = [];

                $scope.analyticsFav.info = "Please Bookmark to see analytics";

            }

        } else {
            $scope.analyticsMovieList = [];
            $scope.analyticsTvList = [];

            $scope.analyticsFav.info = "Please Login to see analytics";
        }



    }


    $scope.options = {
        chart: {
            type: 'pieChart',
            height: 500,
            x: function (d) {
                return d.key;
            },
            y: function (d) {
                return d.y;
            },
            showLabels: true,
            duration: 500,
            labelThreshold: 0.01,
            labelSunbeamLayout: true,
            legend: {
                margin: {
                    top: 5,
                    right: 35,
                    bottom: 5,
                    left: 0
                }
            }
        }
    };

    $scope.optionsBar = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            width: 500,
            margin: {

                bottom: 100

            },
            x: function (d) {
                return d.label;
            },
            y: function (d) {
                return d.value;
            },
            showValues: true,
            labelThreshold: 0.01,
            duration: 500,
            xAxis: {
                axisLabel: 'X Axis',
                rotateLabels: -75
            },
            yAxis: {
                axisLabel: 'Y Axis',
            }
        }
    };

    //////////////Search Button///////////////

    var docStyle = document.documentElement.style;
    var aElem = document.querySelector('a');
    var boundingClientRect = aElem.getBoundingClientRect();

    aElem.onmousemove = function (e) {

        var x = e.clientX - boundingClientRect.left;
        var y = e.clientY - boundingClientRect.top;

        var xc = boundingClientRect.width / 2;
        var yc = boundingClientRect.height / 2;

        var dx = x - xc;
        var dy = y - yc;

        docStyle.setProperty('--rx', dy / -1 + 'deg');
        docStyle.setProperty('--ry', dx / 10 + 'deg');

    };

    aElem.onmouseleave = function (e) {

        docStyle.setProperty('--ty', '0');
        docStyle.setProperty('--rx', '0');
        docStyle.setProperty('--ry', '0');

    };

    aElem.onmousedown = function (e) {

        docStyle.setProperty('--tz', '-25px');

    };

    document.body.onmouseup = function (e) {

        docStyle.setProperty('--tz', '-12px');

    };

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    //    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal
    //    btn.onclick = function () {
    //        modal.style.display = "block";
    //    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

});
