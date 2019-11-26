var request = require('request');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
module.exports = function (options) {
    return function (req, res, next) {
        // Implement the middleware function based on the options object
        const reportingPrivilege = "app:reports";
        if(req.url.indexOf("login")> 0 || req.url.indexOf("not-privleged") > 0) {
            console.log(req.url, 'req.url')
            next();
        }
        else {
            const bahmniUserCookie = req.cookies["bahmni.user"];
            console.log(bahmniUserCookie == 'null', 'bahmniUserCookie');
            const isReportingCookieSet = req.cookies["reporting_session"] !== undefined && (bahmniUserCookie !== 'null'
                && bahmniUserCookie !== undefined);
            console.log(isReportingCookieSet, 'isReportingCookieSet');

            function authenticate(reportingCookie) {
                console.log("Authenticating....");
                var options = {
                    method: 'GET',
                    url: 'http://192.168.33.23/openmrs/ws/rest/v1/bahmnicore/whoami',
                    headers:
                        {
                            Cookie: `JSESSIONID=${reportingCookie}; reporting_session=${reportingCookie}`,
                        }
                };

                request(options, function (error, response, body) {
                    console.log(response.statusCode,'response.statusCode');
                    if (error) {
                        console.log(error);
                        throw new Error(error);
                    }
                    else if(response.statusCode === 403){
                        res.redirect("/bahmni/home/index.html#/login");
                    }
                    else {
                        const message = JSON.parse(body);
                        const privilegeFound = message.find(p => p.name === reportingPrivilege);
                        if (privilegeFound === undefined) {
                            res.redirect("/bahmnireports/not-privleged");
                        } else {
                            next()
                        }
                    }
                });
            }

            if (!isReportingCookieSet)
                res.redirect("/bahmni/home/index.html#/login");
            else {
                try {
                    authenticate(req.cookies["reporting_session"]);
                } catch (e) {
                    console.log(e);

                }
            }
            console.log("Hello world", req.cookies);
        }
    }
}

