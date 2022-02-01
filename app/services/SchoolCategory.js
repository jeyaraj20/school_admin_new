
"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose");
const ImageFilter = serviceLocator.get("imageFilter");
const auth = serviceLocator.get('jwtHelper');
const fs = serviceLocator.get("fs");
const moment = serviceLocator.get("moment"); 
const path = serviceLocator.get("path");
const multer = serviceLocator.get("multer");
const trimRequest = serviceLocator.get('trimRequest');
const SchoolQuestionCategory = mongoose.model("tbl__school_question_category");
module.exports = {

     // 1. Get All Active Category - School
     getAllActiveSchoolCategory: async (req, res, next) => {
         try {
            const  rows  = await SchoolQuestionCategory.find({
                  cat_status: "Y",
                  pid: 0,
                  schoolid: req.payload.user.id 
            }).sort({ cat_pos: 1 });

            if (!rows) {
               return jsend(404,"Category Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200,"data received Successfully",
            { count, category: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All Active Category - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },
    
     // 2. Get Category By Id
     getSchoolCategoryById: async (req, res, next) => {
         try {
            const { catId } = req.params;
            if (catId == 0)return jsend(400, "Please send valid request data");
            const category = await SchoolQuestionCategory.findOne({
                    cat_id: catId,
                    schoolid: req.payload.user.id,
                    cat_status: "Y",
            });
            if (!category){ return jsend(404,"Category Not Found !!!");
         }else{
            const count = category.length;
            return jsend(200, "data received Successfully",
                {count, category });
         }
         } catch (error) {
            logger.error(`Error at Get Category By Id - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 3. Get Category By Position
     getSchoolCategoryByPosition: async (req, res, next) => {
         try {
            const { position, schoolId } = req.params;
            if (position == 0) return jsend(400, "Please send valid request data");
            const category = await SchoolQuestionCategory.find({
                    schoolid:req.payload.user.id,
                    cat_pos: position,
                    cat_status: "Y",
            }).sort({ cat_name: 1 });
            if (!category) {return jsend(404,"Category Not Found !!!");
         }else{
             const count = category.length
            return jsend(200,"data received Successfully",{ count,category });
         }
         } catch (error) {
            logger.error(`Error at Get Category By Position - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 4. Create Category
     createSchoolCategory: async (req, res, next) => {
         try {
            const { cat_name, cat_slug, cat_pos } = req.payload;
            if (!cat_name || !cat_slug || !cat_pos)
            return jsend(400, "Please send valid request data");
            const schoolid =req.payload.user.id;
            console.log(schoolid);
            const cat_id = await SchoolQuestionCategory.count()
         const  message = await SchoolQuestionCategory.create({
                cat_id: (cat_id) ? Number(cat_id) + 1 : 1,
                pid: "0",
                schoolid,
                cat_name,
                cat_slug,
                cat_code: "",
                cat_desc: "",
                cat_image:"",
                cat_pos,
                cat_status: "Y",
                cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                cat_lastupdate: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
            }).catch((err) => {
                return jsend(500,"Please try again after sometime" );
            })
            if(message){
                return jsend(200, "data received Successfully",
                { message})
               }else{
                return jsend(500, "Please try again after sometime" )
               }
         } catch (error) {
            logger.error(`Error at Create Category - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 5. Update Category By Id
     updateSchoolCategoryById: async (req, res, next) => {
         try {
            let { catId } = req.params;
            if (catId == 0)  return jsend(400, "Please send valid request data");
            const { cat_name, cat_slug, cat_pos } = req.payload;
            if (!cat_name || !cat_slug || !cat_pos)
            return jsend(400, "Please send valid request data");
         const result=  await SchoolQuestionCategory.findOneAndUpdate({     
                    cat_id: catId, 
                    schoolid: req.payload.user.id ,
                    cat_name,
                    cat_slug,
                    cat_pos,
                    cat_lastupdate: moment(Date.now()).format(  "YYYY-MM-DD HH:mm:ss" )
                } ).catch((err) => {
                    return jsend(500,"Please try again after sometime" );
                })
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Update Success !!!",result })
                   }else{
                    return jsend(500, "Please try again after sometime" )
                   }
         } catch (error) {
            logger.error(`Error at Update Category By Id - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 6. Update 'Inactive'
     updateInactiveById: async (req, res, next) => {
         try {
            const { catId, status } = req.payload;
            if (!catId || !status)  
            return jsend(400, "Please send valid request data");
         const result =  await SchoolQuestionCategory.findOneAndUpdate(
                { cat_id: catId, 
                    schoolid: req.payload.user.id ,
                cat_status: status }
            ).catch((err) => {
                return jsend(500,"Please try again after sometime" );
            })
            if(result){
                return jsend(200, "data received Successfully",
                { message: "Update Success !!!",result })
               }else{
                return jsend(500, "Please try again after sometime" )
               }
         } catch (error) {
            logger.error(`Error at Update Category Status - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 7. Update 'Delete'
     updateDeleteById: async (req, res, next) => {
         try {
            const    { catId, schoolid } = req.payload;
            if (!catId)return jsend(400, "Please send valid request data");
         const  result = await SchoolQuestionCategory.findOneAndUpdate(
                 {   cat_id: catId, 
                     schoolid:req.payload.id,
                     cat_status: "D" },
            ).catch((err) => {
                return jsend(500,"Please try again after sometime" );
            })
            if(result){
                return jsend(200, "data received Successfully",
                { message: "Update Success !!!",result })
               }else{
                return jsend(404, "Please try again after sometime" )
               }
         } catch (error) {
            logger.error(`Error at Update Category Status - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     // 8. Update 'Position'
     updatePositionById: async (req, res, next) => {
         try {
           
            const { values } = req.payload;
                values.forEach(async (val) => {
                    if (!val.catId,!val.position) return jsend(400, "Please send valid request data");
                   await SchoolQuestionCategory.findOneAndUpdate(
                        { cat_id: val.catId,
                             schoolid: req.payload.user.id ,
                            },{
                         cat_pos: val.position }
                    );
                });
            return jsend(200,"data received Successfully",
            { message: "Update Success !!!",values });
         } catch (error) {
            logger.error(`Error at Update Category Position - School : ${error.message}`);
            return jsend(error.message);
         }
     },

     // 9. Get All InActive Category
     getAllInactiveSchoolCategory: async (req, res, next) => {
         try {
            const rows  = await SchoolQuestionCategory.find({
                  cat_status: "N",
                  pid: 0, 
                  schoolid:req.payload.user.id 
            }).sort({ cat_pos: 1 });
            if (!rows) {
                return jsend(404,"Category Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200,"data received Successfully",
                { count, category: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All InActive Category - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },
    
     //10. Get School Category By Name
     getSchoolCategoryByName: async (req, res, next) => {
         try {
            const { cat_name } = req.params;
            const rows  = await SchoolQuestionCategory.find({
                cat_name: cat_name,
                 pid: 0,
                 schoolid:req.payload.user.id 
            });
            if (!rows){
                return jsend(404,"Question category Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200,"data received Successfully",
                { count, category: rows });
            }
         } catch (error) {
            logger.error(`Error at Get School Category By Name - School : ${error.message}`);
            return jsend( 500,error.message);
         }
     },

     //11.Get All School Category By Asc
     getAllSchoolCategoryByAsc: async (req, res, next) => {
         try {
            const  rows = await SchoolQuestionCategory.aggregate([
                {
                   "$match": {
                    cat_status:"Y",
                    pid:"0",
                    schoolid:req.payload.user.id
                   }
                },
             //  { $sort: { "cat_name": 1,"ASC":1 } },// ORDER BY bincat, TRIM(cat_name) ASC
                {
                  $project: {
                    cat_id:1,pid:1,cat_name:1,bincat:1,cat_slug:1,cat_code:1,cat_desc:1,cat_image:1,
                    cat_pos:1,cat_status:1,cat_dt:1,cat_lastupdate:1,
                  // IF(CAST(cat_name as signed)= 0,1000,CAST(cat_name as signed)) as bincat, 
                    }
                }
              ])
            if (!rows) { 
                return jsend(404,"Category Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200, "data received Successfully",
                { count, category: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All Active Category - School : ${error.message}`);
            return jsend(500,error.message);
         }
     },

     //12.Delete By Id
     DeleteQuestionCategoryById: async (req, res, next) => {
         try {
            const { catId, schoolid } = req.payload;
            if (!catId || !schoolid) return jsend(400, "Please send valid request data");
            const result = await SchoolQuestionCategory.findOneAndDelete({
                 cat_id: catId,
                 schoolid: req.payload.user.id,
                 cat_status: "Y",
                })
                  .catch((err) => {
                        return jsend(404,"Please try again");
                    });
           if(result)  {
                  return jsend(200, "data received Successfully",
                      { message: "Delete Success",result})
                 }else{
                  return jsend(404, "Please try again after sometime")
                        }
         } catch (error) {
            logger.error(`Error at Update School Status : ${error.message}`);
            return jsend(error.message);
         }
     },

     };
