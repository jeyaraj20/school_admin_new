const serviceLocator = require("../lib/service_locator");
const SchoolCategory = serviceLocator.get("SchoolCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- Category Route Start ------------------------------//


  //1.Get All Active School Category
 {
    path: "/api/school/category",
    method: "GET",
    handler: SchoolCategory.getAllActiveSchoolCategory,
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

  //2.Get All School Category By Asc
  {
    path: "/api/school/category/asc",
    method: "GET",
    handler: SchoolCategory.getAllSchoolCategoryByAsc,
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
  
  // 3. Get All Inactive Category
 {
  path: "/api/school/category/inactive",
  method: "GET",
  handler: SchoolCategory.getAllInactiveSchoolCategory,
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

  // 4. Get Category By Id
 {
  path: "/api/school/category/{catId}",
  method: "GET",
  handler: SchoolCategory.getSchoolCategoryById,
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

  // 5. Get Category By Position No
 {
  path: "/api/school/category/position/{position}",
  method: "GET",
  handler: SchoolCategory.getSchoolCategoryByPosition,
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

  // 6. Create Category
 {
  path: "/api/school/category",
  method: "POST",
  handler: SchoolCategory.createSchoolCategory,
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

  // 7. Update Category
 {
  path: "/api/school/category/catId/{catId}",
  method: "PUT",
  handler: SchoolCategory.updateSchoolCategoryById,
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
 // 8. Update 'Inactive'
 {
  path: "/api/school/category/inactive",
  method: "PUT",
  handler: SchoolCategory.updateInactiveById,
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

 // 9. Update 'Delete'
 {
  path: "/api/school/category",
  method: "DELETE",
  handler: SchoolCategory.updateDeleteById,
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

 // 10. Update 'Position'
 {
  path: "/api/school/category/position",
  method: "PUT",
  handler: SchoolCategory.updatePositionById,
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

 //11.Get School Category By Name
 {
  path: "/api/school/category/catname/{cat_name}",
  method: "GET",
  handler: SchoolCategory.getSchoolCategoryByName,
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

 //12.Delete Question Category By Id
 {
  path: "/api/school/Delete/Id",
  method: "DELETE",
  handler: SchoolCategory.DeleteQuestionCategoryById,
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
//-------------------------- Category Route End -----------------------------------//


]);
};
