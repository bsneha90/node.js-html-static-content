var http = require('http');

module.exports = function (options) {
    return function (req, res, next) {
        // Implement the middleware function based on the options object
        if(req.url.indexOf("login")> 0) {
            console.log(req.url)
            next();
        }
        else {
            const bahmniUserCookie = req.cookies["bahmni.user"];
            console.log(bahmniUserCookie == 'null','bahmniUserCookie');
            const isReportingCookieSet = req.cookies["reporting_session"] !== undefined && (bahmniUserCookie !=='null'
                && bahmniUserCookie !==undefined);
            console.log(isReportingCookieSet, 'isReportingCookieSet');
            function authenticate(reportingCookie) {
                var options = {
                    path: '/openmrs/ws/rest/v1/bahmnicore/whoami',
                    host:'192.168.23.33',
                    method: 'GET',
                    headers: {
                        'Cookie': `JSESSIONID=${reportingCookie}`
                    }
                };

                http.request(options, function (res) {
                    console.log('STATUS: ' + res.statusCode);
                    console.log('HEADERS: ' + JSON.stringify(res.body));
                }).end();
            }

            if (!isReportingCookieSet)
                res.redirect("/bahmni/home/index.html#/login");
            else {
            try {
                authenticate("some_cookie");//req.cookies["reporting_session"]);
            }catch (e) {
                console.log(e);

            }
            }
            console.log("Hello world", req.cookies);
            next()
        }
    }
}

