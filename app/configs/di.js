"use strict";

const serviceLocator = require("../lib/service_locator");
const config = require("./configs")();

serviceLocator.register("logger", () => {
  return require("../lib/logger").create(config.application_logging);
});
serviceLocator.register("imageFilter", () => {
  return require("../helper/general_helper");
});
serviceLocator.register("html-pdf", () => {
  return require("html-pdf");
});
serviceLocator.register("multer", () => {
  return require("multer");
});

serviceLocator.register("jwtHelper", () => {
  return require("../helper/jwt_helper");
});

serviceLocator.register("moment", () => {
  return require("moment");
});
serviceLocator.register("razorpay", () => {
  return require("razorpay");
});

serviceLocator.register("jwt", () => {
  return require("jsonwebtoken");
});
serviceLocator.register("fetch", () => {
  return require("node-fetch");
});

serviceLocator.register("bluebird", () => {
  return require("bluebird");
});

serviceLocator.register("jsonwebtoken", () => {
  return require("jsonwebtoken");
});

serviceLocator.register("jsend", () => {
  return require("../lib/jsend");
});

serviceLocator.register("failAction", () => {
  return require("../lib/failAction").verify;
});

serviceLocator.register("trimRequest", () => {
  return require("../utils/trimRequest").all;
});

serviceLocator.register("generateOTP", () => {
  return require("../utils/random").generateOTP;
});

serviceLocator.register("httpStatus", () => {
  return require("http-status");
});

serviceLocator.register("mongoose", () => {
  return require("mongoose");
});
serviceLocator.register("fs", () => {
  return require("fs");
});
serviceLocator.register("XLSX", () => {
  return require("xlsx");
});

serviceLocator.register("path", () => {
  return require("path");
});

serviceLocator.register("util", () => {
  return require("util");
});

serviceLocator.register("handlebars", () => {
  return require("handlebars");
});

serviceLocator.register("_", () => {
  return require("underscore");
});

serviceLocator.register("nodemailer", () => {
  return require("nodemailer");
});

serviceLocator.register("glob", () => {
  return require("glob");
});

serviceLocator.register("bcrypt", () => {
  return require("bcrypt");
});

serviceLocator.register("crypto", () => {
  return require("crypto");
});
serviceLocator.register("School", (serviceLocator) => {
  return require("../services/School");
 });
serviceLocator.register("Login", (serviceLocator) => {
 return require("../services/Login");
});
serviceLocator.register("SchoolCategory", (serviceLocator) => {
  return require("../services/SchoolCategory");
 });
serviceLocator.register("SchoolExam", (serviceLocator) => {
  return require("../services/SchoolExam");
 });
 serviceLocator.register("SchoolExamMainCategory", (serviceLocator) => {
  return require("../services/SchoolExamMainCategory");
 });
 serviceLocator.register("SchoolExamquestion", (serviceLocator) => {
  return require("../services/SchoolExamquestion");
 });
 serviceLocator.register("SchoolExamSubCategory", (serviceLocator) => {
   return require("../services/SchoolExamSubCategory");
  });
 serviceLocator.register("SchoolOperator", (serviceLocator) => {
  return require("../services/SchoolOperator");
 });
serviceLocator.register("SchoolQuestion", (serviceLocator) => {
 return require("../services/SchoolQuestion");
});
serviceLocator.register("SchoolReport", (serviceLocator) => {
  return require("../services/SchoolReports");
 });
serviceLocator.register("SchoolStaffAssign", (serviceLocator) => {
  return require("../services/SchoolStaffAssign");
 });
serviceLocator.register("SchoolStudent", (serviceLocator) => {
  return require("../services/SchoolStudent");
 });
serviceLocator.register("SchoolSubCategory", (serviceLocator) => {
  return require("../services/SchoolSubCategory");
 });
 serviceLocator.register("Util", (serviceLocator) => {
  return require("../services/Util");
 });
   
module.exports = serviceLocator;
