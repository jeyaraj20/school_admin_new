
const serviceLocator = require("../lib/service_locator");
const SchoolQuestion = serviceLocator.get("SchoolQuestion");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");
// const path = require("path");
// var fs = require("fs");
// const multer = require("multer");
// const auth = require("../Middlewares/auth");
// require("dotenv").config();

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Multer Part Start ----------------------------------//

// // Ensure Questions Directory directory exists
// var homeCategoryDir = path.join(process.env.schoolQuestions);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.schoolQuestions);
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, `file-${Date.now()}${path.extname(file.originalname)}`);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// };

// const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 10000000, files: 1 },
// });

//-------------------------- Multer Part End ---------------------------------------//

//-------------------------- Question Route Start ------------------------------//

// 1. Get All Question
{
  path: "/api/school/question/get/status",
  method: "POST",
  handler: SchoolQuestion.getAllSchoolQuestion,
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
  path: "/api/school/question/subId/{sub_id}",
  method: "GET",
  handler: SchoolQuestion.getSchoolQuestionByCategories,
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

//3. Create Question
{
  path: "/api/school/question",
  method: "POST",
  handler: SchoolQuestion.createSchoolQuestion,
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

//4.Get School Question By Id
{
  path: "/api/school/question/questid/{qId}",
  method: "GET",
  handler: SchoolQuestion.getSchoolQuestionById,
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

// 5. Update Question

{
  path: "/api/school/question/qid/{qId}",
  method: "PUT",
  handler: SchoolQuestion.updateSchoolQuestionById,
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

// 6. Question Count
{
  path: "/api/school/question/questionNo",
  method: "POST",
  handler: SchoolQuestion.getSchoolQuestionNo,
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

// 7. Update 'Active / Inactive / Delete'
{
  path: "/api/school/question/inactive",
  method: "PUT",
  handler: SchoolQuestion.updateSchoolStatusById,
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

//8.GetAllocateSchoolQuestion
{
  path: "/api/school/question/view",
  method: "POST",
  handler: SchoolQuestion.getAllocateSchoolQuestion,
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

//9. Get Dashboard Count
{
  path: "/api/school/question/dashboard/count",
  method: "GET",
  handler: SchoolQuestion.getSchoolQuestionsCount,
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

//10. Get Questions Count Only
{
  path: "/api/school/question/active-inactive/count",
  method: "POST",
  handler: SchoolQuestion.getSchoolQuestionsCountOnly,
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

//11.GetAllocateQuestionTotalCount
{
  path: "/api/school/question/totalcount",
  method: "POST",
  handler: SchoolQuestion.getAllocateQuestionTotalCount,
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

//12.Get Category Name
{
  path: "/api/school/question/getcategory",
  method: "POST",
  handler: SchoolQuestion.getCategoryName,
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

//13.Get Question By Id
{
  path: "/api/school/question/qId/{qId}",
  method: "GET",
  handler: SchoolQuestion.getQuestionById,
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
