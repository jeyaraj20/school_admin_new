
const serviceLocator = require("../lib/service_locator");
const School = serviceLocator.get("School");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- School Route Start -----------------------------------//

 //1.Get All School
 {
    path: "/api/school/status/{schoolStatus}",
    method: "GET",
    handler: School.getAllSchool,
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
  //2.Get School By Id
  {
    path: "/api/school/id/{id}",
    method: "GET",
    handler: School.getSchoolById,
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
  //3.Create School
  {
    path: "/api/school",
    method: "POST",
    handler: School.createSchool,
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
  //4.Update School By Id
  {
    path: "/api/school/id/{id}",
    method: "PUT",
    handler: School.updateSchoolById,
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
  //5.Update Status By Id
  {
    path: "/api/school/status",
    method: "PUT",
    handler: School.updateStatusById,
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
  //6.Get Schools Count
  {
    path: "/api/school/sch-count/{schoolStatus}",
    method: "GET",
    handler: School.getSchoolsCount,
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
  //7.Get Schools By mobileNumber
  {
    path: "/api/school/{mobileNumber}",
    method: "GET",
    handler: School.getSchoolsBymobileNumber,
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
  //8.Delete Status By Id
  {
    path: "/api/school/Delete/status",
    method: "PUT",
    handler: School.DeleteStatusById,
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
  //9.Get All School And Count
  {
    path: "/api/school/Count/",
    method: "GET",
    handler: School.getAllSchoolAndCount,
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
//-------------------------- School Route End -----------------------------------//


]);
};
