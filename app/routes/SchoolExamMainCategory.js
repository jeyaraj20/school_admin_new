// const SchoolExamMainCategoryRoute = require("express").Router();
// const SchoolExamMainCategoryController = require("../controllers/SchoolExamMainCategory.controller");
// const path = require("path");
// var fs = require("fs");
// const multer = require("multer");
// const auth = require("../Middlewares/auth");
// require("dotenv").config();
const serviceLocator = require("../lib/service_locator");
const SchoolExamMainCategory = serviceLocator.get("SchoolExamMainCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([

// //-------------------------- Multer Part Start --------------------------------------//

// // Ensure ExamMainCategory Directory directory exists
// var schoolexamMainCategoryDir = path.join(process.env.schoolExamCategory);
// fs.existsSync(schoolexamMainCategoryDir) || fs.mkdirSync(schoolexamMainCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.schoolExamCategory);
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

//-------------------------- Multer Part End -------------------------------------------//

//-------------------------- Exam Main Category Route Start ------------------------------//

// // 1. Get All Master Category
{
  path: "/api/school/exammaincategory/master",
  method: "GET",
  handler: SchoolExamMainCategory.getAllSchoolMasterCategory,
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
  path: "/api/school/exammaincategory/main/{masterId}",
  method: "GET",
  handler: SchoolExamMainCategory.getAllSchoolMainCategory,
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

//3.Create School Exam MainCategory
{
  path: "/api/school/exammaincategory",
  method: "POST",
  handler: SchoolExamMainCategory.createSchoolExamMainCategory,
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

// SchoolExamMainCategoryRoute.post(
//     "/",
//     auth,
//     upload.single("exa_cat_image_url"),
//     SchoolExamMainCategoryController.createSchoolExamMainCategory
// );
//4.Get All School Exam MainCategory
{
  path: "/api/school/exammaincategory/{status}",
  method: "GET",
  handler: SchoolExamMainCategory.getAllSchoolExamMainCategory,
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
//5.Update School ExamMain Category By Id
{
  path: "/api/school/exammaincategory/catId/{catId}",
  method: "PUT",
  handler: SchoolExamMainCategory.updateSchoolExamMainCategoryById,
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

// SchoolExamMainCategoryRoute.put(
//     "/catId/:catId",
//     auth,
//     upload.single("exa_cat_image_url"),
//     SchoolExamMainCategoryController.updateSchoolExamMainCategoryById
// );
//6.Get School ExamMain Category By Id
{
  path: "/api/school/exammaincategory/catId/{catId}",
  method: "GET",
  handler: SchoolExamMainCategory.getSchoolExamMainCategoryById,
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
//7.Update School Inactive By Id
{
  path: "/api/school/exammaincategory/inactive",
  method: "PUT",
  handler: SchoolExamMainCategory.updateSchoolInactiveById,
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
//8.Update School Position By Id
{
  path: "/api/school/exammaincategory/position",
  method: "PUT",
  handler: SchoolExamMainCategory.updateSchoolPositionById,
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
//9.Get All Exam Category
{
  path: "/api/school/exammaincategory/name/{status}",
  method: "GET",
  handler: SchoolExamMainCategory.getAllExamCategory,
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
//10.Get All Inactive School ExamMain Category
{
  path: "/api/school/exammaincategory/getAllInactive",
  method: "GET",
  handler: SchoolExamMainCategory.getAllInactiveSchoolExamMainCategory,
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
//-------------------------- Exam Main Category Route End -----------------------------------//


]);
};
