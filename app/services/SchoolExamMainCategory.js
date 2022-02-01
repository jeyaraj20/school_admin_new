"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const SchoolExamMainCategory = mongoose.model("tbl__school_exam_category"); 
module.exports = {
    // 1. Get All Master Category
    getAllSchoolMasterCategory: async (req, res, next) => {
        try {
            const rows = await SchoolExamMainCategory.find({
                    schoolid:req.payload.user.id,
                    examcat_type: "M",
                    exa_cat_status: "Y",
                    exaid: 0,
                    exaid_sub: 0
            }).sort({ exa_cat_pos: 1 });
            if (!rows){
                return jsend(404,"Exam Master Category Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200,"data received Successfully", 
                { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Master Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Get All Main Category
    getAllSchoolMainCategory: async (req, res, next) => {
        try {
            const { masterId } = req.params;
            if (!masterId)  return jsend(400, "Please send valid request data");
            const  rows  = await SchoolExamMainCategory.find({
                  examcat_type: "C",
                  exa_cat_status: "Y",
                  exaid: masterId,
                  schoolid: req.payload.user.id,
                  exaid_sub: 0,
            }).sort({ exa_cat_pos: 1 });
            if (!rows){
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200,"data received Successfully", 
                { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Main Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 3. Get All Main Category
    getAllSchoolExamMainCategory: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  category = await SchoolExamMainCategory.aggregate([
                {
                   "$match": {
                       exa_cat_status:status,
                       examcat_type:{$ne:"S"},
                       schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exaid',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" }, 
                {
                  $project: {ExamData:1,
                    count: { $sum: 1 },MasterName:"$ExamData.exa_cat_name"
                    }
                }
              ])
            if (!category){
               return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                const count = category.length;
            return jsend(200,"data received Successfully", 
                { count, category });
            }
        } catch (error) {
            logger.error(`Error at Get All Main Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //4.Get All Inactive School ExamMainCategory
    getAllInactiveSchoolExamMainCategory: async (req, res, next) => {
        try {
            const   rows  = await SchoolExamMainCategory.find({
                    examcat_type: "M",
                    exa_cat_status: "N",
                    exaid: 0,
                    exaid_sub: 0,
                    schoolid: req.payload.user.id
            }).sort({ exa_cat_pos: 1 });
            if (!rows){
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200,"data received Successfully",
                { count, category: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Inactive Main Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //5.Get School ExamMainCategory By Id
    getSchoolExamMainCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == null)  return jsend(400, "Please send valid request data");
            const category = await SchoolExamMainCategory.findOne({
                    exa_cat_id: catId,
                    schoolid: req.payload.user.id,
                    exa_cat_status: "Y",
            });
            if (!category){
                return jsend(404,"Exam Main Category Not Found !!!");
            }else{
                return jsend(200,"data received Successfully",
                { category });
            }
        } catch (error) {
            logger.error(`Error at Get Exam Main Category By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Create Exam Main Category
    createSchoolExamMainCategory: async (req, res, next) => {
        try {
          //  const { file } = req;
          //  if (!file) return jsend(404,"No File");
     const {
            exaid,exaid_sub, examcat_type, exa_cat_name,exa_cat_slug,
                exa_cat_pos,exa_cat_desc,qc_exams_id } = req.payload;
                const exa_cat_id= await SchoolExamMainCategory.count()
     const message  =  await SchoolExamMainCategory.create({
                exa_cat_id: (exa_cat_id) ? Number(exa_cat_id) + 1 : 1,
                exaid,
                schoolid: req.payload.user.id,
                exaid_sub,
                examcat_type,
                exa_cat_name,
                exa_cat_slug,
                exa_cat_pos,
                exa_cat_desc,
               // exa_cat_image: file.filename,
                qc_exams_id : qc_exams_id,
                exa_cat_status: "Y",
                exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
            }) .catch((err) => {
        return jsend(500,err.message);
    });if(message){
        return jsend(200, "data received Successfully",
        { message:"Exam Main Category Created",message })
    }else{
        return jsend(500,"Please try again after sometime");
    }
    } catch (error) {
        logger.error(`Error at Create Exam Main Category : ${error.message}`);
        return jsend(500,error.message);
    }
    },

    //7.Update School ExamMainCategory By Id
    updateSchoolExamMainCategoryById: async (req, res, next) => {
        try {
            // const { file } = req;
            // if (!file) return jsend(404,"No File");
            const { catId } = req.params;
            if (catId == null)return jsend(400, "Please send valid request data");
      const {
            exaid, exaid_sub, examcat_type, exa_cat_name,exa_cat_slug, exa_cat_pos,exa_cat_desc,
                qc_exams_id } = req.payload;
      const response =  await SchoolExamMainCategory.findOneAndUpdate({
               exa_cat_id: catId ,
                    exaid,
                    schoolid:req.payload.user.id,
                    exaid_sub,
                    examcat_type,
                    exa_cat_name,
                    exa_cat_slug,
                    exa_cat_pos,
                    exa_cat_desc,
                   // exa_cat_image: file.filename,
                    qc_exams_id : qc_exams_id,
                    exa_cat_status: "Y",
                    exa_cat_dt: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                    exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                }) .catch((err) => {
                    return jsend(404,err.message);
                });
                    if(response)  {
                        return jsend(200, "data received Successfully",
                        { message: "Updated Success",response })
                    }else{
                        return jsend(404, "Please try again after sometime")
                    }
        } catch (error) {
            logger.error(`Error at Update Exam Main Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //8.Update School Inactive By Id
    updateSchoolInactiveById: async (req, res, next) => {
        try {
                const { catId, status } = req.payload;
                if (!catId || !status)  return jsend(404, "Please send valid request data");
        const response  =  await SchoolExamMainCategory.findOneAndUpdate(
                    { exa_cat_status: status ,
                      exa_cat_id: catId  }
                ) .catch((err) => {
                    return jsend(500,"Please send valid request data");
                });
                    if(response)  {
                        return jsend(200, "data received Successfully",
                        { message: "Updated Success",response })
                    }else{
                        return jsend(404, "Please try again after sometime")
                    }
        } catch (error) {
            logger.error(`Error at Update Exam Main Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 9. Update 'Position'
    updateSchoolPositionById: async (req, res, next) => {
        try {
            const { values } = req.payload;
              if (!values) return jsend(400, "Please send valid request data");
                values.forEach(async (val) => {
            await SchoolExamMainCategory.findOneAndUpdate(
                {  exa_cat_id: val.catId  },
                { exa_cat_pos: val.position }
                       
                    )
            
                .catch((err) => {
                    return jsend(404,err.message);
                }); 
            })   
            return jsend(200, "data received Successfully",
            { message: "Updated Success",values })
        } catch (error) {
            logger.error(`Error at Update Exam Main Category Position - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //10. getAllExamCategory {new}
    getAllExamCategory: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  category = await SchoolExamMainCategory.aggregate([
                {
                   "$match": {
                  exa_cat_status:status,
                   }
                },
                     { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exaid',
                  'foreignField': 'exa_cat_id',
                  'as': 'Exam'
                }},                      
                 { "$unwind": "$Exam" }, 
                 { '$lookup': {
                    'from': "tbl__school_exam_category",
                    'localField': 'exaid_sub',
                    'foreignField': 'exa_cat_id',
                    'as': 'ExamData'
                  }},                      
                   { "$unwind": "$ExamData" }, 
                 {
                    $project: {
                        _id:0 ,
                        mastercategory:"$Exam.exa_cat_name",
                        maincategory:"$ExamData.exa_cat_name",
                      }
                  }
              ])
            if (!category) return jsend (404,"Exam Package Not Found !!!");
            return jsend(200, "data received Successfully",
                { count: category.length, category });
        } catch (error) {
            logger.error(`Error at Get All Exam Package : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    
};

