const serviceLocator = require("../lib/service_locator");
const  SchoolExamSubCategory = serviceLocator.get("SchoolExamSubCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Exam Main Category Route Start ------------------------------//

//1.Get All School Exam SubCategory
{
  path: "/api/school/examsubcategory/status/{status}",
  method: "GET",
  handler: SchoolExamSubCategory.getAllSchoolExamSubCategory,
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

// 2. Get All School Exam SubCategory Chapter
{
  path: "/api/school/examsubcategory/chapter/{exa_cat_id}",
  method: "GET",
  handler: SchoolExamSubCategory.getAllSchoolExamSubCategoryChapter,
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

//3.Get All School Exam SubCategory Types
{
  path: "/api/school/examsubcategory/type/{exa_cat_id}",
  method: "GET",
  handler: SchoolExamSubCategory.getAllSchoolExamSubCategoryTypes,
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

//4.Create School Exam SubCategory
{
  path: "/api/school/examsubcategory",
  method: "POST",
  handler: SchoolExamSubCategory.createSchoolExamSubCategory,
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

//5.Get School Exam SubCategory By Id
{
  path: "/api/school/examsubcategory/id/{exa_cat_id}",
  method: "GET",
  handler: SchoolExamSubCategory.getSchoolExamSubCategoryById,
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

//6.Update School Exam SubCategory
{
  path: "/api/school/examsubcategory/id/{exa_cat_id}",
  method: "PUT",
  handler: SchoolExamSubCategory.updateSchoolExamSubCategory,
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

//7.Update School Status By Id
{
  path: "/api/school/examsubcategory/status",
  method: "PUT",
  handler: SchoolExamSubCategory.updateSchoolStatusById,
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

//8.Get Exam Sub Count
{
  path: "/api/school/examsubcategory/sub-cat/count/{exa_cat_status}",
  method: "GET",
  handler: SchoolExamSubCategory.getExamSubCount,
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

//9.Get Exam Sub By Status
{
  path: "/api/school/examsubcategory/sub-cat/{Status}",
  method: "GET",
  handler: SchoolExamSubCategory.getExamSubByStatus,
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
]);
};
