const serviceLocator = require("../lib/service_locator");
const SchoolSubCategory = serviceLocator.get("SchoolSubCategory");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");

exports.routes = (server, serviceLocator) => {
  return server.route([
//-------------------------- SubCategory Route Start ------------------------------//

//1.Get All Active SubCategory
{
  path: "/api/school/subcategory/status/{status}",
  method: "GET",
  handler: SchoolSubCategory.getAllActiveSchoolSubCategory,
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

// 2.Get All Inactive SubCategory
{
  path: "/api/school/subcategory/inactive",
  method: "GET",
  handler: SchoolSubCategory.getAllInActiveSchoolSubCategory,
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

// 3. Create SubCategory By Id
{
  path: "/api/school/subcategory",
  method: "POST",
  handler: SchoolSubCategory.createSchoolSubCategoryById,
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

// 4. Get Sub Category By Id
{
  path: "/api/school/subcategory/{catId}",
  method: "GET",
  handler: SchoolSubCategory.getSchoolSubCategoryById,
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

// 5. Update Sub Category
{
  path: "/api/school/subcategory/pid/{pid}",
  method: "PUT",
  handler: SchoolSubCategory.updateSchoolSubCategoryById,
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

// 6. Update 'Inactive'
{
  path: "/api/school/subcategory/inactive",
  method: "PUT",
  handler: SchoolSubCategory.updateInactiveById,
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

// 7. Update 'Delete'
{
  path: "/api/school/subcategory",
  method: "DELETE",
  handler: SchoolSubCategory.updateSchoolDeleteById,
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

// 8. Get QBank Sub Category Count Only
{
  path: "/api/school/subcategory/qbank-sub/count/{cat_status}",
  method: "GET",
  handler: SchoolSubCategory.getSchoolSubCategoryCount,
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

//9.GetAllActiveSubCategoryAlone
{
  path: "/api/school/subcategory/subcat/status/{status}",
  method: "GET",
  handler: SchoolSubCategory.getAllActiveSubCategoryAlone,
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

//10.Get SubCategory By CatId
{
  path: "/api/school/subcategory/sub/{catId}",
  method: "GET",
  handler: SchoolSubCategory.getSubCategoryByCatId,
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

//11.Get Search Result
{
  path: "/api/school/subcategory/search-criteria/",
  method: "POST",
  handler: SchoolSubCategory.getSearchResult,
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
//-------------------------- SubCategory Route End -----------------------------------//

]);
};