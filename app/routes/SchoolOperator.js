const serviceLocator = require("../lib/service_locator");
const SchoolOperator = serviceLocator.get("SchoolOperator");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Operator Route Start ------------------------------//

 // 1. Get All Active Operator
{
  path: "/api/school/operator/{status}",
  method: "GET",
  handler: SchoolOperator.getAllActiveSchoolOperator,
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

// 2. Get Exam By Id
{
  path: "/api/school/operator/inactive/",
  method: "GET",
  handler: SchoolOperator.getAllInactiveSchoolOperator,
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

// // 3. Get Operator By Id
{
  path: "/api/school/operator/Id/{opId}",
  method: "GET",
  handler: SchoolOperator.getSchoolOperatorById,
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

// // 4. Create Operator
{
  path: "/api/school/operator",
  method: "POST",
  handler: SchoolOperator.createSchoolOperator,
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

// // 5. Update Operator
{
  path: "/api/school/operator/opId/{opId}",
  method: "PUT",
  handler: SchoolOperator.updateSchoolOperatorById,
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

// // 6. Update 'Inactive / Active / Delete'
{
  path: "/api/school/operator/inactive",
  method: "PUT",
  handler: SchoolOperator.updateInactiveById,
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

//7.Get All Operator
{
  path: "/api/school/operator/getoperator/{status}",
  method: "GET",
  handler: SchoolOperator.getAllOperator,
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
}
//-------------------------- Operator Route End -----------------------------------//



]);
};
