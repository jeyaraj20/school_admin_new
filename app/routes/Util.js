const serviceLocator = require("../lib/service_locator");
const Util = serviceLocator.get("Util");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Utility Route Start -----------------------------------//

{
    path: "/api/util/Count",
    method: "GET",
    handler: Util.getSchoolAllDocumentCount,
    options: {
        response: {
          status: {
            500() {
              throw ((createError.Unauthorized()))
            },
          },
          failAction(request, h, error) {
            return jsend(401, "Authorization failed.Please send valid token to proceed further")
          }
        },
     //   pre: [trimRequest, auth.verifyAccessToken]
      }
  },
  


// UtilRoute.get("/download-pdf", (req, res, next) => {
//     res.download(__dirname + '../../public/examcalender.pdf', 'test.pdf');
// });

//-------------------------- Utility Route Start -----------------------------------//

]);
};