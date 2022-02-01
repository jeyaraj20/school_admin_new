"use strict";

const serviceLocator = require("../lib/service_locator");
const jsend = serviceLocator.get("jsend");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const moment = serviceLocator.get("moment"); 
const mongoose = serviceLocator.get("mongoose"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolExamTypes = mongoose .model("tbl__schoolexamtypes");
const SchoolExamChapters = mongoose .model("tbl__schoolexamchapters");
const SchoolExamMainCategory =mongoose .model("tbl__school_exam_category");
module.exports = {
    // 1. Get All Exam Sub Category
    getAllSchoolExamSubCategory: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  category = await SchoolExamMainCategory.aggregate([
                {
                   "$match": {
                    exa_cat_status:status,
                    examcat_type:"S",
                    schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exaid_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },                     
                 { '$lookup': {
                   'from': "tbl__school_exam_category",
                   'localField': 'ExamData.exaid',
                   'foreignField': 'exa_cat_id',
                   'as': 'ExamChapters'
                 }},                     
                  { "$unwind": "$ExamChapters" }, 
                {
                  $project: {
                    ExamData:"$ExamData",category:"$ExamData.exa_cat_name",
                    Mastercategory:"$ExamChapters.exa_cat_name",
                    count: { $sum: 1 }
                    }
                }
              ])
              const  cWaitingCount = await SchoolExams.aggregate([
                {
                   "$match": {
                    exam_status:"W",
                    exam_type:"C",
                    schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exa_cat_id',
                  'foreignField': 'exam_sub_sub',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },                     
                {
                  $project: {
                    ExamData:"$ExamData",Count:"$ExamData.exam_id",
                    count: { $sum: 1 }
                    }
                }
              ])
              const  cActiveCount = await SchoolExams.aggregate([
                {
                   "$match": {
                    exam_status:"Y",
                    exam_type:"C",
                    schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exa_cat_id',
                  'foreignField': 'exam_sub_sub',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },                     
                {
                  $project: {
                    ExamData:"$ExamData",Count:"$ExamData.exam_id",
                    count: { $sum: 1 }
                    }
                }
              ])
              const  bWaitingCount = await SchoolExams.aggregate([
                {
                   "$match": {
                    exam_status:"w",
                    exam_type:"B",
                    schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exa_cat_id',
                  'foreignField': 'exam_sub_sub',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },                     
                {
                  $project: {
                    ExamData:"$ExamData",Count:"$ExamData.exam_id",
                    count: { $sum: 1 }
                    }
                }
              ])
              const  bActiveCount = await SchoolExams.aggregate([
                {
                   "$match": {
                    exam_status:"Y",
                    exam_type:"B",
                    schoolid:req.payload.user.id
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exa_cat_id',
                  'foreignField': 'exam_sub_sub',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },  
                {
                  $project: {
                    ExamData:"$ExamData",Count:"$ExamData.exam_id",
                   count: { $sum: 1 }
                    }
                }
              ])
            if (!category){
                return jsend(404,"Exam Sub Category Not Found !!!");
            }else{
            return jsend(200, "data received Successfully", 
                {   count: category.length, category ,
                    count_: cWaitingCount.length, cWaitingCount,
                    count__: cActiveCount.length, cActiveCount,
                    _count: bWaitingCount.length, bWaitingCount,
                    __count: bActiveCount.length, bActiveCount
                });
            }
        } catch (error) {
            logger.error(`Error at Get All Exam Sub Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

     //2.GetAllSchoolExamSubCategoryChapter
    getAllSchoolExamSubCategoryChapter: async (req, res, next) => {
        try {
            const { exa_cat_id } = req.params;
            const  rows  = await SchoolExamChapters.find({
                 chapter_status: "Y",
                 exa_cat_id: exa_cat_id,
                   schoolid: req.payload.user.id 
            }).sort({ chapt_id: 1 });
            if (!rows){
                return jsend(404,"Exam Sub Category Chapter Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200, "data received Successfully", 
                { count, chapterrows: rows });
            }
        } catch (error) {
            logger.error(`Error at get All School Exam SubCategory Chapter - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    
      //3.GetAllSchoolExamSubCategoryTypes
    getAllSchoolExamSubCategoryTypes: async (req, res, next) => {
        try {
            const { exa_cat_id } = req.params;
            const  rows  = await SchoolExamTypes.find({
                extype_status: "Y",
                 exa_cat_id: exa_cat_id,
                  schoolid: req.payload.user.id 
            }).sort({ extype_id: 1 });
            if (!rows){
                return jsend(404,"Exam Sub Category Type Not Found !!!");
            }else{
                const count = rows.length;
            return jsend(200, "data received Successfully", 
                { count, typerows: rows });
            }
        } catch (error) {
            logger.error(`Error at get All School Exam SubCategory Types - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 4. Create Exam Sub Category
    createSchoolExamSubCategory: async (req, res, next) => {
      try {
       const {
             exaid, schoolid, exaid_sub, examcat_type, exa_cat_name, exa_cat_slug, exa_cat_desc,
                chapterList, typeList, } = req.payload;
                    // 1. tbl__exam_category insert
                    const exa_cat_id = await SchoolExamMainCategory.count()
                    const category = await SchoolExamMainCategory.create({
                        exa_cat_id: (exa_cat_id) ? Number(exa_cat_id) + 1 : 1,
                        exaid,
                        schoolid: req.payload.user.id,
                        exaid_sub,
                        examcat_type,
                        exa_cat_name,
                        exa_cat_slug,
                        exa_cat_image: "",
                        exa_cat_desc,
                        exa_cat_pos: "0",
                        exa_cat_status: "Y",
                        exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                    });
                    console.log(category.exa_cat_id);
                    let examChaptersList = [];
                    let examTypesList = [];
                    chapterList.forEach((list) => {
                        examChaptersList.push({
                            exa_cat_id: category.exa_cat_id,
                            exmain_cat: exaid,
                            schoolid: req.payload.user.id,
                            exsub_cat: exaid_sub,
                            chapter_name: list,
                            chapter_status: "Y",
                            chapter_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        });
                    });
                    console.log(examChaptersList);
                    typeList.forEach((type) => {
                        examTypesList.push({
                            exa_cat_id: category.exa_cat_id,
                            exmain_cat: exaid,
                            schoolid: req.payload.user.id,
                            exsub_cat: exaid_sub,
                            extest_type: type,
                            extype_status: "Y",
                            extype_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                            lastupdate: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                        });
                    });
                    console.log(examTypesList);
                    
                    // 2. tbl__examtypes insert
                    await SchoolExamTypes.insertMany(examTypesList, {
                    });
                    // 3. tbl__examchapters insert
                    await SchoolExamChapters.insertMany(examChaptersList, {
                    })
                .catch((err) => {
                   return jsend(err.message);
                });
            return jsend(200,"data received Successfully", 
                { message: "Insert Success" });
        } catch (error) {
            logger.error(`Error at Create Exam Sub Category - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 5. Get Question By Id
    getSchoolExamSubCategoryById: async (req, res, next) => {
        try {
            const { exa_cat_id } = req.params;
           if (exa_cat_id == 0) return jsend(400, "Please send valid request data");
            const  category = await SchoolExamMainCategory.aggregate([
                {
                   "$match": {
                    exa_cat_id:exa_cat_id,
                    examcat_type:"S",
                    exa_cat_status:"Y",
                    schoolid:req.payload.user.id,
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'exaid_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },                     
                 { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'ExamData.exaid',
                  'foreignField': 'exa_cat_id',
                  'as': 'ExamDataQC'
                }},                      
                 { "$unwind": "$ExamDataQC" }, 
                {
                  $project: {
                    ExamData:1,"category":"$ExamData.exa_cat_name",
                    "Master category":"$ExamDataQC.exa_cat_name",
                    count: { $sum: 1 }
                    }
                }
              ])
            if (!category){
               return jsend(404,"Exam Sub Category Not Found !!!");
            }else{
            return jsend(200,"data received Successfully",
                { category });
            }
        } catch (error) {
            logger.error(`Error at Get Question By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Update Question By Id
    updateSchoolExamSubCategory: async (req, res, next) => {
        try {
            const { exa_cat_id } = req.params;
            if (exa_cat_id == 0) return jsend(400, "Please send valid request data")
     const {
            exaid, schoolid, exaid_sub, examcat_type, exa_cat_name, exa_cat_slug, exa_cat_desc,
            chapterList, delarr,typedelarr,typeList, } = req.payload;
                    // 1. tbl__exam_category update
         const  result   =    await SchoolExamMainCategory.findOneAndUpdate(
                        { exa_cat_id,
                             schoolid: req.payload.user.id
                            },
                        {   exaid,
                            schoolid,
                            exaid_sub,
                            examcat_type,
                            exa_cat_name,
                            exa_cat_slug,
                            exa_cat_image: "",
                            exa_cat_desc,
                            exa_cat_pos: "0",
                            exa_cat_status: "Y",
                            exa_cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            exa_cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" )
                        });
                    if (delarr.length > 0) {
                        await SchoolExamChapters.findOneAndUpdate({ chapter_status: 'N'},{ 
                           
                               chapt_id: { $in: delarr},
                                schoolid: req.payload.user.id
                     });
                    }
                    if (typedelarr.length > 0) {
                        await SchoolExamTypes.findOneAndUpdate({ extype_status: 'N'},{
                         
                                extype_id: {$in: typedelarr},
                                schoolid: req.payload.user.id
                        });
                    }
                    let examChaptersList = [];
                    let examTypesList = [];
                    for (let chapter of chapterList) {
                        examChaptersList.push({
                            chapt_id: chapter.chaptId,
                            exa_cat_id: exa_cat_id,
                            schoolid: req.payload.user.id,
                            exmain_cat: exaid,
                            exsub_cat: exaid_sub,
                            chapter_name: chapter.name,
                            chapter_status: "Y",
                            chapter_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        });
                    }
                    console.log(examChaptersList);
                    SchoolExamChapters.create(examChaptersList, { updateOnDuplicate: ['chapter_name'] });

                    for (let type of typeList) {
                        examTypesList.push({
                            extype_id: type.typeId,
                            exa_cat_id: exa_cat_id,
                            schoolid: req.payload.user.id,
                            exmain_cat: exaid,
                            exsub_cat: exaid_sub,
                            extest_type: type.name,
                            extype_status: "Y",
                            extype_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        })
                    }
                    console.log(examTypesList);
                    SchoolExamTypes.create(examTypesList, { updateOnDuplicate: ['extest_type'] })
                .catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
                    return jsend(200, "data received Successfully",
                { message: "Update Success" });
               } catch (error) {
                  logger.error(`Error at Update Question By Id - School : ${error.message}`);
                           return jsend(500,error.message);
        }
    },

    // 7. Update 'Active / Inactive / Delete'
    updateSchoolStatusById: async (req, res, next) => {
        try {
            const { exa_cat_id, status } = req.payload;
            if (!exa_cat_id || !status)   return jsend(400, "Please send valid request data");
               const result  =  await SchoolExamMainCategory.findOneAndUpdate(
                        { exa_cat_status: status,
                         exa_cat_id: exa_cat_id,
                         schoolid: req.payload.user.id 
                         }
                    ).catch((err) => {
                        return jsend(404,"Data Not Found !!!");
                    });
                        if(result)  {
                            return jsend(200, "data received Successfully",
                             { message: "Updated Success",result })
                        }else{
                            return jsend(500, "Please try again after sometime")
                        }
                } catch (error) {
                    logger.error(`Error at Update Exam Package : ${error.message}`);
                    return jsend(500, error.message)
                }
     },

     //8.GetExamSubCount
    getExamSubCount: async (req, res, next) => {
        try {
            const { exa_cat_status } = req.params;
            if (exa_cat_status == null)  return jsend(400, "Please send valid request data");
           const count = await SchoolExamMainCategory.count({
                   exa_cat_status,
                   examcat_type: "S",
                   exaid_sub: { $ne: 0 },
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });  if (!count) {
                return jsend(404,"Data Not Found !!!");
            }else{
                return jsend(200, "data received Successfully", 
                { count});
            }
        } catch (error) {
            logger.error(`Error at Get Exam Sub Category Count Only : ${error.message}`);
            return jsend(500,error.message);
        }
    },

     //9.Get Exam Sub By Status
    getExamSubByStatus: async (req, res, next) => {
        try {
            const { Status } = req.params;
            if (Status == null)  return jsend(400, "Please send valid request data");
           const rows = await SchoolExamMainCategory.find({
                   exa_cat_status:Status
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });  if (!rows) {
                return jsend(404,"Data Not Found !!!");
            }else{
                const count = rows.length
                return jsend(200, "data received Successfully", 
                {count, rows});
            }
        } catch (error) {
            logger.error(`Error at Get Exam Sub Category Count Only : ${error.message}`);
            return jsend(500,error.message);
        }
    },
};
