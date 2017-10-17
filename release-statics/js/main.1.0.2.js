var waitHint;

var isWechat = (function () {
    var ua = navigator.userAgent.toLowerCase();
    return (/micromessenger/.test(ua)) ? true : false;
})();


var isIos = (function () {
    var ua = window.navigator.userAgent.toLowerCase();
    return (ua.match(/iP(hone|od|ad)/i));
})();


$('#goExp').click(function () {
    $('.exp-page.page').addClass('fade').removeClass('hidden');

    setTimeout(function () {
        $('.exp-page.page').removeClass('fade');
    }, 50);
    setTimeout(function () {
        $('.intro.page').addClass('hidden');
    }, 700);

    waitHint = setTimeout(function () {
        var pos = $('.geetest_radar_btn')[0].getBoundingClientRect();
        $('.hint').fadeIn();
        $('.hint-wrap').css({top: pos.top});
    }, 1000);
});

var g = new Geetest({
    type: 'fullpage',
    gt: '',
    challenge: '',
    offline: true,
    new_captcha: true,
    width: '100%',
    static_servers: ['']
}).appendTo('#captcha');


var playVideo = function () {
    var outputCanvas = document.getElementById('output'),
        output = outputCanvas.getContext('2d'),
        bufferCanvas = document.getElementById('buffer'),
        buffer = bufferCanvas.getContext('2d'),
        video = document.getElementById('video'),
        width = outputCanvas.width,
        height = outputCanvas.height, finish = false;


    video.addEventListener('pause', function () {
        finish = true
    });

    function processFrame() {
        buffer.drawImage(video, 0, 0);

        // this can be done without alphaData, except in Firefox which doesn't like it when image is bigger than the canvas
        var image = buffer.getImageData(0, 0, width, height),
            imageData = image.data,
            alphaData = buffer.getImageData(width, 0, width, height).data;

        for (var i = 3, len = imageData.length; i < len; i = i + 4) {
            imageData[i] = alphaData[i - 1];
        }

        output.putImageData(image, 0, 0, 0, 0, width, height);
        if (finish) {
            $('#captcha')[0].onclick = 'javascipt:;';
            $('#video').hide();
            g.callVerify();
            $('.login-button').addClass('finish');
            $('.finish-hint').fadeIn();
            $('#canvas_output').hide();

            $('.login-button.finish').click(function () {
                $('.final-page').addClass('fade').removeClass('hidden');

                setTimeout(function () {
                    $('.final-page').removeClass('fade');
                }, 50);
                setTimeout(function () {
                    $('.section1 .ani-right').addClass('ani-active');
                    $('.section1 .ani-down').addClass('ani-active');
                }, 500);
                setTimeout(function () {
                    $('.exp-page.page').addClass('hidden');
                }, 700);
            })

        }
        else {
            requestAnimationFrame(processFrame);
        }
    }

    processFrame();
    video.play();
};


var show_captcha = function () {
    clearTimeout(waitHint);
    $('.hint').hide();
    setTimeout(function () {
        $('#canvas_output').show();
        // playVideo();
    }, 1000);
    $('#captcha').off('click');
};

$('#captcha').click(show_captcha);

var fullpage;

$(document).ready(function () {
    fullpage = $('.final-page').fullpage({
            onLeave: function (index, nextIndex) {
                $('.section .ani-right').removeClass('ani-active');
                $('.section .ani-down').removeClass('ani-active');
                setTimeout(function () {
                    $('.section' + nextIndex + ' .ani-right').addClass('ani-active');
                    $('.section' + nextIndex + ' .ani-down').addClass('ani-active');
                }, 500);
            }
        }
    );

    download('video', "./release-statics/video1.mp4");
});

var download = function (id, url) {
    var v = document.getElementById(id);

    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function (oEvent) {
        var blob = new Blob([oEvent.target.response], {type: "video/mp4"});
        if (isWechat && !isIos) {
            v.src = url;
        }
        else {
            v.src = URL.createObjectURL(blob);
        }
    };

    xhr.onprogress = function (oEvent) {
        if (oEvent.lengthComputable) {
            size[id] = [oEvent.loaded, oEvent.total];
            load_process()
        }
    };

    xhr.send();
};

var size = {'video': [0, 0]};

var load_process = function () {
    var all_start = true;
    for (var key in size) {
        if (size[key][1] == 0) {
            all_start = false;
        }
    }

    if (all_start) {
        var all_size = 0, downloaded = 0;
        for (var key in size) {
            all_size += size[key][1];
            downloaded += size[key][0];
        }
        var progress = downloaded / all_size;
        $('#progress').text(parseInt(progress * 100));


        if (progress >= 1.) {
            $('.intro.page').addClass('fade').removeClass('hidden');

            setTimeout(function () {
                $('.intro.page').removeClass('fade');
            }, 50);
            setTimeout(function () {
                $('.loading').addClass('hidden');
            }, 700);

        }
    }

};

$('.final-button').click(function () {
    window.location.href = 'http://m.geetest.com/?utm_source=campaign&utm_medium=h5&utm_campaign=geetest3.0'
});

$(window).resize(function () {
    $('.final-page').fullpage.reBuild()
});
