var osql = {};

osql.db = 'a8118023';
osql.url = 'https://dbkiso.si.aoyama.ac.jp/api/';

osql.goto = function (url) {
    if (!url) {
        return;
    }
    window.localStorage.setItem('referrer', location.href);
    window.location.href = url;
};

osql.back = function () {
    var ref = window.localStorage.getItem('referrer');
    if (ref) {
        window.location.href = ref;
    } else {
        history.back();
    }
};

osql.requireLogin = function () {
    var login = window.localStorage.getItem('login');
    if (!login) {
        osql.goto('login.html');
    }
};

osql.logout = function () {
    window.localStorage.removeItem('login');
};

osql.login = function (userid, password, success, failure) {
    window.localStorage.setItem('login', false);

    var query = {};
    query.userid = userid;
    query.password = password;
    query.db = osql.db;
    query.sql = 'show tables;';
    osql.post0(query, function () {
        window.localStorage.setItem('userid', userid);
        window.localStorage.setItem('password', password);
        window.localStorage.setItem('login', true);
        if (success) {
            success();
        }
    }, function () {
        if (failure) {
            failure();
        }
    });
};

osql.post0 = function (query, success, failure) {
    $.post(osql.url, query, function (data, textStatus) {
        //console.log(data);
        //console.log(textStatus);
        try {
            var objects = JSON.parse(data);
            //console.log(objects);
            //console.log(textStatus);
            if (objects.result === 'fail') {
                if (failure) {
                    failure({}, data);
                }
                return;
            }
            if (success) {
                success(objects);
            }
        } catch (ex) {
            console.error(ex);
            if (failure) {
                failure({}, data);
            }
        }
    });
};

osql.connect = function (sql) {
    return new Promise(function (resolve) {
        osql.post(sql, function (objects) {
            resolve(objects);
        });
    });
};

osql.post = function (sql, success, failure) {
    osql.requireLogin();
    var query = {};
    query.userid = window.localStorage.getItem('userid');
    query.password = window.localStorage.getItem('password');
    query.db = osql.db;
    query.sql = sql;
    osql.post0(query, success, failure);
};

osql.getParams = function () {
    var paramstr = document.location.search.substring(1);
    var paramstrs = paramstr.split('&');
    params = {};
    paramstrs.forEach(function (each) {
        var tokens = each.split('=');
        params[tokens[0]] = tokens[1];
    });
    return params;
};

osql.getUID = function () {
    return window.sessionStorage.getItem('userid');
};