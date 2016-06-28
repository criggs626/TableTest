$.ajaxSetup({
    always: function (data) {
        if (data.redirect != undefined && data.redirect != "") {
            window.location = data.redirect;
        }
        if (data.message != undefined) {
            $("#message").html(data.message);
        }
    },
    complete: function (resp) {
        var data = $.parseJSON(resp.responseText);
        if (data.redirect != undefined && data.redirect != "") {
            window.location = data.redirect;
        }
        if (data.message != undefined && data.message != "") {
            $("#message").fadeOut(500, function () {
                $("#message").html(data.message);
                $("#message").fadeIn();
            });
        }
    }
});

$(document).on("submit", "[data-form]", function (event) {
    return ajax.submit(this, event);
});
$(document).on("click", "[data-uri]", function (event) {
    return ajax.uri(this, event);
});
$(document).on("submit", "[data-form-confirm-post]", function (event) {
    var scope = $('#modal-confirm');
    var settings = $(this).data("modal");
    var cont = $(this).data("cont");
    var title = $(this).attr("title");
    var text = $(this).attr("text");
    var modal = $('#modal-confirm').show();
    var $this = this;
    if (cont == true && typeof (cont) != "undefined") {
        return true;
    } else {
        event.preventDefault();
    }
    $("#modal-confirm-topbox").html(title);
    $("#modal-confirm-text").html(text);
    $("input[name='cancel']", scope).click(function () {
        modal.hide();
        $event.preventDefault();
    });
    $("input[name='confirm']", scope).click(function () {
        $($this).data("cont", true);
        $this.submit();
    });
    if (settings.x != undefined) {
        if (settings.x.indexOf("%") != -1) {
            var marginleft = (settings.x.replace("%", "") / 2) * -1 + "%";
        } else {
            var marginleft = (settings.x.replace("px", "") / 2) * -1 + "px";
        }
        $("#modal").animate({
            "width": settings.x,
            "margin-left": marginleft
        });
    }
    return false;
});
$(document).on("submit", "[data-form-confirm]", function (event) {
    var scope = $('#modal-confirm');
    var settings = $(this).data("modal");
    var title = $(this).attr("title");
    var modal = $('#modal-confirm').show();
    var $this = this;
    $event = event;
    $("#modal-confirm-topbox").html(title);
    $("input[name='cancel']", scope).click(function () {
        modal.hide();
        $event.preventDefault();
    });
    $("input[name='confirm']", scope).click(function () {
        ajax.submit($this, $event);
    });
    if (settings.x != undefined) {
        if (settings.x.indexOf("%") != -1) {
            var marginleft = (settings.x.replace("%", "") / 2) * -1 + "%";
        } else {
            var marginleft = (settings.x.replace("px", "") / 2) * -1 + "px";
        }
        $("#modal").animate({
            "width": settings.x,
            "margin-left": marginleft
        });
    }
});
var a;
$(document).on("click", "[data-modal]", function (event) {

    event.preventDefault();
    var settings = $(this).data("modal");
    var href = $(this).attr("href");
    var title = $(this).attr("title");
    var callback = $(this).data("callback");
    var container = "";
    if (settings.x) {
        if (settings.x.indexOf("%") != -1) {
            var marginleft = (settings.x.replace("%", "") / 2) + "%";
        } else {
            var marginleft = (settings.x.replace("px", "") / 2) + "px";
        }
        $("#modal").animate({
            "width": settings.x,
            "margin-left": marginleft
        });
    }
    if (settings.handler == "iframe" && href) {
        var w = "100%";
        var h = (settings.y !== undefined ? settings.y : "100%");
        var container = $('<iframe />', {
            name: 'modal_iframe',
            id: 'modal_iframe',
            src: href,
            width: w,
            height: h
        });
        $("#modal-container").html(container);
    }
    if (settings.handler == "ajax" && href) {
        $.get(href, function (data) {
            if (callback && callback !== "") {
                var fn = window.stringToFunction(callback);
                if (typeof fn === "function") {
                    fn(this, data);
                } else {
                    console.log("Invalid Callback");
                }
            } else {
                if (data.payload) {
                    $("#modal-container").html(data.payload);
                }
            }
        }, "json");
    }
    if (settings.handler == "img" && href) {
        var w = "100%";
        var h = (settings.y !== undefined ? settings.y : "100%");
        var container = $('<img />', {
            name: 'modal_img',
            id: 'modal_img',
            src: href,
            width: w,
            height: h
        });
        $("#modal-container").html(container);
    }
    if (!title) {
        title = "";
    }
    if (!callback || callback == "") {
        $("#modal-topbox").html(title);
    }
    $('#modal').show();
});
var a;
$(document).on('click', "[data-confirm]", function (event) {
    event.preventDefault();
    var scope = $('#modal-confirm');
    var settings = $(this).data("modal");
    var title = $(this).attr("title");
    var modal = $('#modal-confirm').show();
    var $this = this;
    a=this;
    $event = event;
    $("#modal-confirm-topbox").html(title);
    $("input[name='cancel']", scope).click(function () {
        modal.hide();
        $event.preventDefault();
    });
    $("input[name='confirm']", scope).click(function () {
        window.location.href = $this.href;
    });
    if (settings.x != undefined) {
        if (settings.x.indexOf("%") != -1) {
            var marginleft = (settings.x.replace("%", "") / 2) * 1 + "%";
        } else {
            var marginleft = (settings.x.replace("px", "") / 2) * 1 + "px";
        }
        $("#modal").animate({
            "width": settings.x,
            "margin-left": marginleft
        });
    }
});

$(document).on('click', "[data-search]", function (event) {
    event.preventDefault();
    var url = $(this).data('url');
    var query = $(this).data('query');
    var requestData = $(this).data("data");
    var container = $(this).data("container");
    var type = $(this).data('type');
    $.get(url + query, requestData, function (data) {
        if (type == 'table') {
            var content = JSON.parse(data);
            if ($('tbody').html() === '') {
                //if the tables body is empty initialize the table and add content
                $('#' + container).data('search', query);
                table(container, $("#size").val(), content);
            } else if (query === $('#' + container).data('search')) {
                //if the table already has content and the search term is the same update it
                tableUpdate(content);
            } else {
                //if there is a new search re-initialize the table with new content
                $('#' + container).data('search', query);
                $('tbody').html('');
                tableUpdate(content);
            }
        } else {
            $('#' + container).html(data);
        }
    });
});

$(document).on('click', "[data-view]", function (event) {
    event.preventDefault();
    var url = $(this).data('url');
    var query = $(this).data('query');
    var requestData = $(this).data("data");
    var container = $(this).data("container");
    $.get(url + query, requestData, function (data) {
        try {
            content = JSON.parse(data);
            if (content['payload']) {
                $('#' + container).html(data);
            }
        } catch (e) {
            $('#' + container).html(data);
        }
    });
});