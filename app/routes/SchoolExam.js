const serviceLocator = require("../lib/service_locator");
const SchoolExam = serviceLocator.get("SchoolExam");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
// //-------------------------- SchoolExam Route Start -----------------------------------//


//  1. Get All Exam 
{
  path: "/api/school/exam",
  method: "POST",
  handler: SchoolExam.getAllSchoolExam,
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
  path: "/api/school/exam/id/{id}",
  method: "GET",
  handler: SchoolExam.getSchoolExamById,
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

//  3. Create Common Exam
{
  path: "/api/school/exam/create",
  method: "POST",
  handler: SchoolExam.createSchoolExam,
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

//  4. Create Bank Exam
{
  path: "/api/school/exam/bexam",
  method: "POST",
  handler: SchoolExam.createSchoolBankExam,
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

//  5. Update Exam
{
  path: "/api/school/exam/id/{id}",
  method: "PUT",
  handler: SchoolExam.updateSchoolExamById,
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

//  6. Update Bank Exam
{
  path: "/api/school/exam/bexam/id/{id}",
  method: "PUT",
  handler: SchoolExam.updateSchoolBankExamById,
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

//  7. Update Exam Status 'Inactive / Active / Delete'
{
  path: "/api/school/exam/status",
  method: "PUT",
  handler: SchoolExam.updateSchoolStatusById,
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

//8.Get School Previous Year
{
  path: "/api/school/exam/previousyear/",
  method: "POST",
  handler: SchoolExam.getSchoolPreviousYear,
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

//9.Get School Test Types
{
  path: "/api/school/exam/getTestTypes/{sub_cat_id}",
  method: "GET",
  handler: SchoolExam.getSchoolTestTypes,
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

//10.Get School Chapters
{
  path: "/api/school/exam/getChapters/{sub_cat_id}",
  method: "GET",
  handler: SchoolExam.getSchoolChapters,
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

//11.Get School Test Types Edit
{
  path: "/api/school/exam/getTestTypesEdit/{sub_cat_id}",
  method: "GET",
  handler: SchoolExam.getSchoolTestTypesEdit,
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

//12.Get School Chapters Edit
{
  path: "/api/school/exam/getChaptersEdit/{sub_cat_id}",
  method: "GET",
  handler: SchoolExam.getSchoolChaptersEdit,
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

//13.Get School Section
{
  path: "/api/school/exam/getSection/{exam_id}",
  method: "GET",
  handler: SchoolExam.getSchoolSection,
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

//14.Get All ExamCount
{
  path: "/api/school/exam/examcount",
  method: "POST",
  handler: SchoolExam.getAllExamCount,
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

//15.Get All Exam WithAssignedcount
{
  path: "/api/school/exam/assignedcount",
  method: "POST",
  handler: SchoolExam.getAllExamWithAssignedcount,
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

//16.Get Exam Resutl Report
{
  path: "/api/school/exam/getExamResutlReport/{schoolId}",
  method: "GET",
  handler: SchoolExam.getExamResutlReport,
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

//-------------------------- SchoolExam Route End -----------------------------------//


]);
};
