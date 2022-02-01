const serviceLocator = require("../lib/service_locator");
const SchoolReport = serviceLocator.get("SchoolReport");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Adminmenu Route Start ------------------------------//
//1.Get Reports
{
  path: "/api/school/reports/report",
  method: "POST",
  handler: SchoolReport.getReports,
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
      pre: [trimRequest, auth.verifyAccessToken]

  }
},

// 2. Get Question By Sub Category Id
{
  path: "/api/school/reports/mainreport",
  method: "POST",
  handler: SchoolReport.getMainReports,
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
        pre: [trimRequest, auth.verifyAccessToken]

    }
},

//3.Get Test Reports
{
  path: "/api/school/reports/testreport",
  method: "POST",
  handler: SchoolReport.getTestReports,
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
        pre: [trimRequest, auth.verifyAccessToken]

    }
},

//4.Get Overall Masters
{
  path: "/api/school/reports/overallmaster",
  method: "POST",
  handler: SchoolReport.getOverallMasters,
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
        pre: [trimRequest, auth.verifyAccessToken]

    }
},

//5.Get Student Report
{
  path: "/api/school/reports/studentReport",
  method: "POST",
  handler: SchoolReport.getStudentReport,
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
        pre: [trimRequest, auth.verifyAccessToken]

    }
},

//6.Get Student QC Report
{
  path: "/api/school/reports/studentQCReport",
  method: "POST",
  handler: SchoolReport.getStudentQCReport,
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
        pre: [trimRequest, auth.verifyAccessToken]

    }
},


//-------------------------- Adminmenu Route End -----------------------------------//

]);
};
