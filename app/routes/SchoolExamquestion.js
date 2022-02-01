const serviceLocator = require("../lib/service_locator");
const SchoolExamQuestion = serviceLocator.get("SchoolExamquestion");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- ExamQuestion Route Start -----------------------------------//

 // 1. Create ExamQuestion (Assign)
{
  path: "/api/school/examquestion",
  method: "POST",
  handler: SchoolExamQuestion.createSchoolExamQuestion,
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
  path: "/api/school/examquestion/getAssigned/Count",
  method: "POST",
  handler: SchoolExamQuestion.getAssignedSchoolExamQuestionsCount,
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

//3.createSchoolBankExamQuestion
{
  path: "/api/school/examquestion/bank",
  method: "POST",
  handler: SchoolExamQuestion.createSchoolBankExamQuestion,
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

//4.getAssignedSchoolExamQuestions
{
  path: "/api/school/examquestion/getassinged",
  method: "POST",
  handler: SchoolExamQuestion.getAssignedSchoolExamQuestions,
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

//5.getAssignedExamQuestionsCount
{
  path: "/api/school/examquestion/getassingedcount",
  method: "POST",
  handler: SchoolExamQuestion.getAssignedExamQuestionsCount,
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

//6.removeAssignedSchoolQuestion
{
  path: "/api/school/examquestion",
  method: "PUT",
  handler: SchoolExamQuestion.removeAssignedSchoolQuestion,
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

//-------------------------- ExamQuestion Route End ------------------+------------------//


]);
};
