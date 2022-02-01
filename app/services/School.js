
"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const jsend = serviceLocator.get("jsend");
const logger = serviceLocator.get("logger");
const moment = serviceLocator.get("moment"); 
const multer = serviceLocator.get("multer");
const auth = serviceLocator.get('jwtHelper');
const mongoose = serviceLocator.get("mongoose");
const trimRequest = serviceLocator.get('trimRequest');
const ImageFilter = serviceLocator.get("imageFilter");
const School = mongoose.model("tbl__school");
const SchoolQuestion = mongoose.model("tbl__schoolquestion");
const SchoolQCExam = mongoose.model("tbl__school_questioncloud_exam");
// require("dotenv").config();
module.exports = {

//-------------------------- Multer Part Start ----------------------------------//

// // Ensure Questions Directory directory exists
// var homeCategoryDir = path.join(process.env.school);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

// const storage = multer.diskStorage({
//     destination: (req, file, callBack) => {
//         callBack(null, process.env.school);
//     },
//     filename: (req, file, callBack) => {
//         callBack(null, `file-${Date.now()}${path.extname(file.originalname)}`);
//     },
// });

// const upload = multer({
//     storage: storage,
//     fileFilter: ImageFilter,
//     limits: { fileSize: "2mb" },
// }).fields([
//     {
//         name: "schoolLogo",
//         maxCount: 1,
//     },
// ]);


//-------------------------- Multer Part End ---------------------------------------//

     // 1. Get All Schools
     getAllSchool: async (req, res, next) => {
         try {
            const { schoolStatus } = req.params;
            if (schoolStatus == 0)   return jsend(400, "Please send valid request data");
            const  rows  = await School.find({
                schoolStatus: schoolStatus 
            }).sort({ schoolName: 1 });
            if (!rows) {
                return jsend(404,"School Not Found !!!");
            }else{
            const count = rows.length;
         return jsend(200, "data received Successfully", 
                { count, School: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All Schools : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 2. Get School By Id
     getSchoolById: async (req, res, next) => {
         try {
            const { id } = req.params;
            if (id == 0)  return jsend(400, "Please send valid request data");
            const  rows = await School.find({
               id: id ,
            include: { $in:[{ model: SchoolQCExam,activeStatus: 'Y'}]}
            });
            if (!rows){ return jsend(400,"School Not Found !!!");
         }else{
            const count =rows.length
            return jsend(200, "data received Successfully", 
            {count, rows });
         }
         } catch (error) {
            logger.error(`Error at Get School By Id: ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 3. Create School
     createSchool: async (req, res, next) => {
         try {
            // upload(req, res, function (err) {
            //     if (req.fileValidationError) {
            //         return jsend(req.fileValidationError);
            //     } else if (err instanceof multer.MulterError) {
            //         return jsend(err);
            //     } else if (err) {
            //         return jsend(err);
            //     } else {
            //         console.log("Success", req.files);
            //     }
         const {
           schoolName, address1,address2,phoneNumber, emailId, password, contactPerson,
           mobileNumber, totalStudents, ipAddress,expirydate,examdata } = req.payload;
         if (
          !schoolName || !address1 || !address2 || !phoneNumber ||!emailId ||!password ||
          !contactPerson ||!mobileNumber || !totalStudents || !expirydate )
                  return jsend( "Please send valid request data");
                  const schoolPassword = Buffer.from(password).toString("base64");
                  const id = await School.count()
                    const schools=   new  School({
                            id: (id) ? Number(id) + 1 : 1,
                            schoolName,
                            //schoolLogo: req.files.schoolLogo[0].filename,
                            address1,
                            address2,
                            phoneNumber,
                            emailId,
                            password: schoolPassword,
                            contactPerson,
                            mobileNumber,
                            totalStudents,
                            schoolStatus: "Y",
                            ipAddress,
                            createdBy: req.payload.user.userid,
                            createdTimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            expiryDate:expirydate
                        })
                      const saveSchool=  schools.save()
                        .catch((err) => {
                            return jsend(err.message);
                        });
                  if(saveSchool){
                      
                    let examdatafinal=JSON.parse(examdata);
                    let examlist=[];
                    examdatafinal.forEach((list) => {
                        let subcatarray=list.subcategoryid;
                       let subcatid=subcatarray.join();
                        examlist.push({
                        schoolRefId: saveSchool.id,
                        masterCategory: list.mastercategoryId,
                        mainCategory:list.categoryId,
                        subCategory: subcatid,
                        activeStatus: 'Y',
                        ipAddress,
                        createdBy: req.payload.user.userid,
                        createdTimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                    });
                });
                // 2. tbl__automatic_question_details insert
            const SchoolQCExams=   SchoolQCExam.create(examlist, {
                }).catch((err) => {
                    return jsend( "Please send valid request data");
                });
                return jsend(200,
                    { message: "School Created Success !!!" });
                  }
                  else{
                    return jsend(404,"not created");
                  }
          
         } catch (error) {
            logger.error(`Error at Create School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 4. Update School By Id
     updateSchoolById: async (req, res, next) => {
         try {
            const { id } = req.params;
            if (id == 0)   return jsend( "Please send valid request data");
            
            // upload(req, res, function (err) {
            //     if (req.fileValidationError) {
            //         return jsend(req.fileValidationError);
            //     } else if (err instanceof multer.MulterError) {
            //         return jsend(err);
            //     } else if (err) {
            //         return jsend(err);
            //     } else {
            //         console.log("Success", req.files);
            //     }
         const {
             schoolName, schoolLogo,address1, address2, phoneNumber, emailId, password, contactPerson,
             mobileNumber,totalStudents, ipAddress,examdata, expirydate } = req.payload;
         if (
             !schoolName ||!address1 ||!address2 ||!phoneNumber || !emailId ||!password ||
             !contactPerson ||!mobileNumber || !totalStudents ||!ipAddress ||!expirydate )
             return jsend( "Please send valid request data");
             const schoolPassword = Buffer.from(password).toString("base64");
         const result =    School.findOneAndUpdate( 
          { 
         id: id,
         schoolName,
         //schoolLogo:  req.files &&  req.files.schoolLogo ? req.files.schoolLogo[0].filename : schoolLogo,
         address1,
         address2,
         phoneNumber,
         emailId,
         password: schoolPassword,
         contactPerson,
         mobileNumber,
         totalStudents,
         schoolStatus: "Y",
         ipAddress,
         expirydate,
         updatedBy: "1",
         updatedTimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
             } )
                     //   .then((result) => res.send({ message: "Update Success" }))
                        .catch((err) => {
                            return jsend(500,err.message);
                        });
           const results  =   SchoolQCExam.findOneAndUpdate({ schoolRefId: id},
                            {
                                activeStatus:'D',
                            })
                         //   .then((result) => res.send({ message: "Update Success" }))
                            .catch((err) => {
                               return jsend(500,err.message);
                            });
                        let examdatafinal=JSON.parse(examdata);
                        let examlist=[];
                        examdatafinal.forEach((list) => {
                            let subcatarray=list.subcategoryid;
                           let subcatid=subcatarray.join();
                            examlist.push({
                            schoolRefId: id,
                            masterCategory: list.mastercategoryId,
                            mainCategory:list.categoryId,
                            subCategory: subcatid,
                            activeStatus: 'Y',
                            ipAddress,
                            createdBy: req.payload.user.userid,
                            createdTimestamp: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
                        });
                    });
                    // 2. tbl__automatic_question_details insert
                    const exams= SchoolQCExam.create(examlist, {
                    }).catch((err) => {
                        return jsend(500,err.message);
                    });
                    return(200,"data received Successfully",
                        { message: "School Updated Success !!!" });
           
         } catch (error) {
            logger.error(`Error at Update School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 5. Update 'Inactive / Active / Delete'
     updateStatusById: async (req, res, next) => {
         try {
            const { id, status } = req.payload;
            if (!id || !status) return jsend(400, "Please send valid request data");
            const result = await School.findOneAndUpdate({
                     id: id  ,
                    schoolStatus: status 
                })
                  .catch((err) => {
                        return jsend(404,err.message);
                    });
           if(result)  {
                  return jsend(200, "data received Successfully",
                      { message: "Updated Success",result})
                 }else{
                            return jsend(500, "Please try again after sometime")
                        }
         } catch (error) {
            logger.error(`Error at Update School Status : ${error.message}`);
            return jsend(error.message);
         }
     },

     // 6. Get Schools Count Only
     getSchoolsCount: async (req, res, next) => {
         try {
            const { schoolStatus } = req.params;
            if (schoolStatus == null)   return jsend(400, "Please send valid request data");
            const count = await School.count({ 
               schoolStatus :schoolStatus
            }).catch((err) => {
                return jsend(400, "School Not Found !!!");
            });
            return jsend(200, "data received Successfully",
            { count });
         } catch (error) {
            logger.error(`Error at Get Schools Count Only : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     //7.Get Schools By mobileNumber
     getSchoolsBymobileNumber: async (req, res, next) => {
         try {
            const { mobileNumber } = req.params;
            if (mobileNumber == null)   return jsend(400, "Please send valid request data");
            const result = await School.find({ 
                mobileNumber :mobileNumber
            })
            if (!result) {
                return jsend(404,"School Not Found !!!");
            }else{
            const count = result.length;
         return jsend(200, "data received Successfully", 
                { count,School:result});
            }
         } catch (error) {
            logger.error(`Error at Get All Schools : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     //8.Delete Status By Id
     DeleteStatusById: async (req, res, next) => {
         try {
            const { id, status } = req.payload;
            if (!id || !status) return jsend(400, "Please send valid request data");
            const result = await School.findOneAndDelete({
                     id: id  ,
                    schoolStatus: status 
                })
                  .catch((err) => {
                        return jsend(404,err.message);
                    });
           if(result)  {
                  return jsend(200, "data received Successfully",
                      { message: "Updated Success",result})
                 }else{
                            return jsend(500, "Please try again after sometime")
                        }
         } catch (error) {
            logger.error(`Error at Update School Status : ${error.message}`);
            return jsend(error.message);
         }
     },

     ///9.Get All School And Count
     getAllSchoolAndCount: async (req, res, next) => {
         try {
            const  rows  = await School.find({
            }).sort({ createdTimestamp: 1 });
            if (!rows) {
                return jsend(404,"School Not Found !!!");
            }else{
            const count = rows.length;
         return jsend(200, "data received Successfully", 
                { count, School: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All Schools : ${error.message}`);
            return jsend(500,error.message);
         }
     },
     };
