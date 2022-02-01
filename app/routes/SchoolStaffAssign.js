const serviceLocator = require("../lib/service_locator");
//const SchoolStaffAssign = serviceLocator.get("SchoolReport");
const SchoolStaffAssign = serviceLocator.get("SchoolStaffAssign")
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- School Staff Assign Route Start ------------------------------//

//1.GetAllStaffAssign
{
  path: "/api/school/staffassign/allstaffassign",
  method: "GET",
  handler: SchoolStaffAssign.getAllStaffAssign,
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

//2.GetAllInactiveSchoolOperator
{
  path: "/api/school/staffassign/Inactive",
  method: "GET",
  handler: SchoolStaffAssign.getAllInactiveSchoolOperator,
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

//3.Get School Operator By Id
{
  path: "/api/school/staffassign/Operator/Id/{opId}",
  method: "GET",
  handler: SchoolStaffAssign.getSchoolOperatorById,
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

// 4. Assign Staff
{
  path: "/api/school/staffassign",
  method: "POST",
  handler: SchoolStaffAssign.assignSchoolStaff,
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

//5. Get Question By Sub Category Id
{
  path: "/api/school/staffassign/id/{id}",
  method: "PUT",
  handler: SchoolStaffAssign.updateSchoolStaff,
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

//6.Update Inactive By Id
{
  path: "/api/school/staffassign/Inactive/Id",
  method: "PUT",
  handler: SchoolStaffAssign.updateInactiveById,
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





//-------------------------- School Staff Assign Route End -----------------------------------//

]);
};
