const serviceLocator = require("../lib/service_locator");
const SchoolStudent = serviceLocator.get("SchoolStudent");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- SchoolStudent Route Start -----------------------------------//

 // 1. Get All Student
{
  path: "/api/school/student/status/{stud_status}",
  method: "GET",
  handler: SchoolStudent.getAllStudent,
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

// 2. Get Student By Id
{
  path: "/api/school/student/school/id",
  method: "POST",
  handler: SchoolStudent.getStudentById,
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

//  3. Create Many Student
{
  path: "/api/school/student/school/create-many",
  method: "POST",
  handler: SchoolStudent.createBulkStudent,
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

//  4. Update Student
{
  path: "/api/school/student/schoolstud-id/{id}",
  method: "PUT",
  handler: SchoolStudent.updateStudent,
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

//  5. Update 'Inactive / Active / Delete'
{
  path: "/api/school/student/school/stud-status",
  method: "PUT",
  handler: SchoolStudent.updateStatus,
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

//  6. Create Multi Student (Excel Upload)
{
  path: "/api/school/student/create/excel-file/",
  method: "POST",
  handler: SchoolStudent.createBulkStudent,
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

// 7. Read Multi Student (Excel Upload)
{
  path: "/api/school/student/read/excel-file/",
  method: "POST",
  handler: SchoolStudent.readBulkStudent,
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
       pre: [trimRequest, auth.verifyAccessToken],
     payload: {
      maxBytes: 209715200,
      output: 'file',
      parse: true,
      multipart: true     // <-- this fixed the media type error
    }
    }
},

// 8. Get Multi Student (Excel Upload Format File)
{
  path: "/api/school/student/get/excel-file/",
  method: "POST",
  handler: SchoolStudent.getSampleExcelFile,
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

// 9. Create One Student
{
  path: "/api/school/student/create-one",
  method: "POST",
  handler: SchoolStudent.createStudent,
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

//10.Get Student By MobileNo
{
  path: "/api/school/student/{mobileNo}",
  method: "GET",
  handler: SchoolStudent.getStudentBymobileNo,
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


//-------------------------- Student Route End -----------------------------------//

]);
};
