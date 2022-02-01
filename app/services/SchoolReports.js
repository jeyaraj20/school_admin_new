
"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const { model } = require("mongoose");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose");
const ImageFilter = serviceLocator.get("imageFilter");
const XLSX = require("xlsx");
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const moment = serviceLocator.get("moment"); 
const multer = serviceLocator.get("multer");
const auth = serviceLocator.get('jwtHelper');
const trimRequest = serviceLocator.get('trimRequest');
const SchoolQuestionCategory =mongoose.model("tbl__school_question_category");
const SchoolExamtakenlistQc=mongoose.model("tbl__schoolexamtaken_list_qc");
const SchoolExamMainCategory=mongoose.model("tbl__school_exam_category");
const SchoolExamQuestions = mongoose.model("tbl__schoolexamquestions");
const SchoolExamChapters = mongoose.model("tbl__schoolexamchapters");
const SchoolExamTypes = mongoose.model("tbl__schoolexamtypes");
const SchoolQuestions = mongoose.model("tbl__schoolquestion");
const SchoolExams = mongoose.model("tbl__schoolexam");
// const { sort, next } = require("locutus/php/array");
// require("dotenv").config();
function getExamTitle(exam_id) {
    return new Promise(async (resolve, reject) => {
        let examTitle = "";
        const  rows  = await SchoolExams.find({
                exam_id,
                exam_status: "Y",
        }).catch((err) => {
            return jsend(500,err.message);
        });
        if (rows > 0) {
            const  category = await SchoolExamMainCategory.aggregate([
                   {
               "$match": {
                    examcat_type: "S",
                    exa_cat_status:"Y",
                    exa_cat_id:rows[0].exam_sub_sub
                         }
                   },  
               { '$lookup': {
                    'from': "tbl__exam_category",
                   'localField': 'exaid_sub',
                   'foreignField': 'exa_cat_id',
                   'as': 'ExamData'
                    }},                      
                 { "$unwind": "$ExamData" },                     
             { '$lookup': {
                    'from': "tbl__exam_category",
                    'localField': 'ExamData.exaid',
                   'foreignField': 'exa_cat_id',
                   'as': 'ExamChapters'
                }},                     
                { "$unwind": "$ExamChapters" }, 
              {
         "$match": {
               examcat_type: "S",
               "ExamData.exa_cat_status":"Y",
               "ExamChapters.exa_cat_status":"Y"
             }
          },
          {
            $project: {
              subCategory:"exa_cat_name",
              category:"ExamData.exa_cat_name",
              masterCategory:"ExamChapters.exa_cat_name",
              count: { $sum: 1 }
            }
          }
        ])
                .catch((err) => {
                    return jsend(500,err.message);
                });
            if (rows[0].exam_type_cat === "C") {
                const examChapter = await SchoolExamChapters.findOne({
                   chapt_id: rows[0].exam_type_id, chapter_status: "Y" ,
                }).catch((err) => {
                    return jsend(500,err.message);
                });
                examTitle = `${category[0].category} - ${category[0].subCategory} - Topic Wise Test - ${examChapter.chapter_name}`;
            } else if (rows[0].exam_type_cat === "T") {
                const examType = await SchoolExamTypes.findOne({
                    extype_id: rows[0].exam_type_id, extype_status: "Y" ,
                }).catch((err) => {
                    return jsend(500,err.message);
                });
                examTitle = `${category[0].category} - ${category[0].subCategory} - ${examType.extest_type}`;
            }
            resolve({
                count:rows.length,
                examTitle,
                masterCategoryName: category[0].masterCategory,
                examName: rows[0].exam_name,
            });
        } else {
            reject("No Title Avail");
        }
    });
}

module.exports = {
    // 1. Get Overall Reports.
    getReports: async(req, res, next) => {
        try {
    const { period,  startdate, enddate} = req.payload;
            if (!period) throw BadRequest();
            // remove limit 10
            const  data = await SchoolQuestionCategory.aggregate([
                {
                   "$match": {
                    cat_status:"Y"
                   }
                },
                { '$lookup': {
                  'from': "tbl__school_question_category",
                  'localField': 'cat_id',
                  'foreignField': 'pid',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },  
                   {
                   "$match": {
                      cat_status:"Y"
                    }
                    },
                {
                  $project: {
                    cat_id:  "$ExamData.cat_id",maincategory:"$cat_name",subcategory:"$ExamData.cat_name",
                    subcategorycode:"$ExamData.cat_code", count: { $sum: 1 }
                    }
                }
              ])
            const  uploaded = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:{$ne:"D"},
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                {
                   "$group": {
                            "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                                }
                            },
                {
                  $project: {
                    sub_id: "$data.sub_id",
                    uploaded : { $sum: 1 }
                  
                    }
                }
              ])
            const waiting = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'W',
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                {
                   "$group": {
                            "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                                }
                            },
                {
                  $project: {
                    sub_id:   "$data.sub_id",
                    waiting : { $sum: 1 }
                  
                    }
                }
              ])
            const  active = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'Y',
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                {
                   "$group": {
                            "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                                }
                            },
                {
                  $project: {
                    sub_id: "$data.sub_id",
                    active : { $sum: 1 }
                    }
                }
              ])
            const  inactive = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'N',
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                {
                   "$group": {
                            "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                                }
                            },
                {
                  $project: {
                    sub_id:"$data.sub_id",
                    inactive : { $sum: 1 }
                    }
                }
              ])
            let finalArr = [];
            for (let category of data) {
                let uploadedArr = uploaded.filter(e => e.sub_id == category.cat_id)
                let waitingArr = waiting.filter(e => e.sub_id == category.cat_id)
                let activeArr = active.filter(e => e.sub_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.sub_id == category.cat_id)

                let uploadedCount;
                let waitingCount;
                let activeCount;
                let inactiveCount;

                if (uploadedArr.length != 0) {
                    uploadedCount = uploadedArr[0].uploaded
                } else {
                    uploadedCount = 0;
                }
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }
                finalArr.push({
                    maincategory: category.maincategory,
                    subcategory: category.subcategory,
                    subcategorycode: category.subcategorycode,
                    uploaded: uploadedCount,
                    waiting: waitingCount,
                    active: activeCount,
                    inactive: inactiveCount
                });
            }
            //let { processeddata } = await getOverallData(data, startdate, enddate);
            return jsend(200,"data received Successfully", 
                {count: data.length, qdata: finalArr });
            //}
        } catch (error) {
            return jsend(500,error.message);
        }
    },

    //2.Get Main Reports
    getMainReports: async(req, res, next) => {
        try {
            const {  period, startdate, enddate } = req.payload;
            const  categories = await SchoolQuestionCategory.aggregate([
                {
                   "$match": {
                    cat_status:{$ne:'D'},
                    pid:"0"
                   }
                },
                {
                  $project: {
                    cat_name: "$cat_name",cat_id:"$cat_id",
                    count : { $sum: 1 }
                    }
                }
              ])
            const  waiting = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'W',
                    pid:"0",
                   quest_date:startdate,
                   aproved_date:enddate
                   }
                },
                  {
                '$lookup': {
                     'from': "tbl__school_question_category",
                     'localField': 'cat_id',
                     'foreignField': 'cat_id',
                     'as': 'ExamData'
                   }
                  },
               { "$unwind": "$ExamData" },
               {
                           "$group": {
                                    "_id": "$cat_id",
                                   "data": { "$addToSet": "$$ROOT" }
                                        }
                                    },
                {
                  $project: {
                    cat_name: "$ExamData.cat_name",cat_id:"$ExamData.cat_id",waiting:"$cat_id",
                    count : { $sum: 1 }
                  
                    }
                }
              ])
            const  active = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'Y',
                    pid:"0",
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                  {
                '$lookup': {
                     'from': "tbl__school_question_category",
                     'localField': 'cat_id',
                     'foreignField': 'cat_id',
                     'as': 'ExamData'
                   }
                  },
               { "$unwind": "$ExamData" },
               {
                           "$group": {
                                    "_id": "$cat_id",
                                   "data": { "$addToSet": "$$ROOT" }
                                        }
                                    },
                {
                  $project: {
                    cat_name: "$ExamData.cat_name",cat_id:"$ExamData.cat_id",active:"$cat_id",
                    count : { $sum: 1 }
                    }
                }
              ])
            const  inactive = await SchoolQuestions.aggregate([
                {
                   "$match": {
                    quest_status:'N',
                    pid:"0",
                    quest_date:startdate,
                    aproved_date:enddate
                   }
                },
                  {
                '$lookup': {
                     'from': "tbl__school_question_category",
                     'localField': 'cat_id',
                     'foreignField': 'cat_id',
                     'as': 'ExamData'
                   }
                  },
                      { "$unwind": "$ExamData" },
                      {
                           "$group": {
                                    "_id": "$cat_id",
                                   "data": { "$addToSet": "$$ROOT" }
                                        }
                                    },
                {
                  $project: {
                    cat_name:"$ExamData.cat_name",cat_id:"$ExamData.cat_id",inactive:"$cat_id",
                    count : { $sum: 1 }
                  
                    }
                }
              ])
      const  totalquestion = await SchoolQuestions.aggregate([
        {
           "$match": {
            quest_status:{$ne:"D"},
            pid:"0",
            quest_date:startdate,
           aproved_date:enddate
           }
        },
          {
        '$lookup': {
             'from': "tbl__school_question_category",
             'localField': 'cat_id',
             'foreignField': 'cat_id',
             'as': 'ExamData'
           }
          },
         { "$unwind": "$ExamData" },
         {
                   "$group": {
                            "_id": "$cat_id",
                           "data": { "$addToSet": "$$ROOT" }
                                }
                            },
         {
          $project: {
            cat_name: "$ExamData.cat_name",cat_id:"$ExamData.cat_id",total:"$cat_id",
            count : { $sum: 1 }
            }
        }
      ])
            let finalArr = [];
            for (let category of categories) {
                let waitingArr = waiting.filter(e => e.cat_id == category.cat_id)
                let activeArr = active.filter(e => e.cat_id == category.cat_id)
                let inactiveArr = inactive.filter(e => e.cat_id == category.cat_id)
                let totalArr = totalquestion.filter(e => e.cat_id == category.cat_id)

                let waitingCount;
                let activeCount;
                let inactiveCount;
                let totalCount;
                if (waitingArr.length != 0) {
                    waitingCount = waitingArr[0].waiting
                } else {
                    waitingCount = 0;
                }
                if (activeArr.length != 0) {
                    activeCount = activeArr[0].active
                } else {
                    activeCount = 0;
                }
                if (inactiveArr.length != 0) {
                    inactiveCount = inactiveArr[0].inactive
                } else {
                    inactiveCount = 0;
                }
                if (totalArr.length != 0) {
                    totalCount = totalArr[0].total
                } else {
                    totalCount = 0;
                }
                finalArr.push({
                    categoryname: category.cat_name,
                    waiting: waitingCount,
                    active: activeCount,
                    inactive: inactiveCount,
                    total: totalCount
                })
            }
            return jsend( 200,"data received Successfully", 
                {data: finalArr });
        } catch (error) {
            return jsend(500,error.message);
        }
    },

    //3.Get Test Reports
    getTestReports: async(req, res, next) => {
        try {
            const { period,startdate, enddate } = req.payload;
           //remove limit 20
            const  data = await SchoolExams.aggregate([
              
                {
                   "$match": {
                   exam_status: {$ne:"D"},
                   exam_date:startdate,
                   endDate:enddate
                   }
                },
                  {
                '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'exam_sub_sub',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamDatas'
                   }
                  },
               { "$unwind": "$ExamDatas" },
                  {
                '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'exaid_sub',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamData'
                   }
                  },
               { "$unwind": "$ExamData" },
                {
                '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'exaid',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamQcData'
                   }
                  },
               { "$unwind": "$ExamQcData" },
                {
                  $project: {
             examcat: "$exam_type_cat",examptype:"$exam_type_id",  examname:"$exam_name",
             examcode:"$exam_code",examques:"$tot_questions", staffname:"$exam_add_name",
             maincategory:"$ExamData.exa_cat_name",subcategory:"$ExamDatas.exa_cat_name",
             examdate:"$exam_date",mastercategory :"$ExamQcData.exa_cat_name",
             count : { $sum: 1 }
                    }
                }
              ])
            const examtypename1 = await SchoolExamChapters.aggregate([
                  {
                   "$group": {
                       "_id": "$chapt_id",
                        "data": { "$addToSet": "$$ROOT" }
                            }
                        },
                {
                   "$project": {
                    examname:"$chapter_name",chapt_id:1, count : { $sum: 1 }
                    }
                }
              ])
            const  examtypename2 = await SchoolExamTypes.aggregate([
                {
                 "$group": {
                     "_id": "$extype_id",
                      "data": { "$addToSet": "$$ROOT" }
                          }
                      },
              {
                 "$project": {
                  examname:"$extest_type",extype_id:1, count : { $sum: 1 }
                  }
              }
            ])

            let finalArr = [];
            for (let category of data) {
                let examtypename = [];
                if (category.examcat == 'C') {
                    examtypename = examtypename1.filter(e => e.chapt_id == category.examptype)
                }
                if (category.examcat == 'T') {
                    examtypename = examtypename2.filter(e => e.extype_id == category.examptype)
                }
                let examtypenameCount;
                if (examtypename.length != 0) {
                    examtypenameCount = examtypename[0].examname
                } else {
                    examtypenameCount = 0;
                }
                finalArr.push({
                    mastercategory: category.mastercategory,
                    maincategory: category.maincategory,
                    subcategory: category.subcategory,
                    examname: category.examname,
                    examcode: category.examcode,
                    examques: category.examques,
                    staffname: category.staffname,
                    examdate: new Date(category.examdate),
                    examtypename: examtypenameCount
                });
            }
            //let { processeddata } = await getTestData(data, startdate, enddate);
            return jsend(200,"data received Successfully", 
              {count: data.length,
                qdata: finalArr
            });
        } catch (error) {
            return jsend(500,error.message);
        }
    },

    //4.Get Overall Masters
    getOverallMasters: async(req, res, next) => {
        try {
            const { period, startdate, enddate  } = req.payload;
                //remove limit 20
            const  data = await SchoolExamMainCategory.aggregate([
                  {
                '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'exaid_sub',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamDatas'
                   }
                  },
               { "$unwind": "$ExamDatas" },
                  {
                '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'exaid',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamData'
                   }
                  },
               { "$unwind": "$ExamData" },
                 {
          $group: {
            _id: { name1: "$ExamData.exa_cat_name",
             name2: "$ExamDatas.exa_cat_name",
             name3:"$exa_cat_name" },
            data: { "$addToSet": "$$ROOT" }
          }
        },
                {
                  $project: {
                    mastercategory:"$data.ExamData.exa_cat_name",masterid:"$data.ExamData.exa_cat_id",
                    maincategory:"$data.ExamDatas.exa_cat_name",mainid:"$data.ExamDatas.exa_cat_id",
                    subcategory:"$data.exa_cat_name",subid:"$data.exa_cat_id",
                    count : { $sum: 1 }
                    }
                }
              ])
            const  totalquestions = await SchoolExamQuestions.aggregate([
                {
              '$lookup': {
                   'from': "tbl__schoolexam",
                   'localField': 'exam_id',
                   'foreignField': 'exam_id',
                   'as': 'ExamDatas'
                 }
                },
                     { "$unwind": "$ExamData" },
               {
                  "$match": {
                       "ExamData.exam_status": {$ne:'D'},
                       "ExamData.exam_date": startdate,
                       "ExamData.enddate": enddate
                 }
              },
               {
                 $group: {
                      _id: { name1: "$ExamData.exam_cat", 
                             name2: "$ExamData.exam_sub",
                             name3:"$ExamData.exam_sub_sub"},
                              data: { "$addToSet": "$$ROOT" }
                         }
                      },
              {
                $project: {
              exam_cat:"$ExamData.exam_cat",exam_sub:"$ExamData.exam_sub",
              exam_sub_sub:"$ExamData.exam_sub_sub", totalquestions : { $sum: 1 }
                  }
              }
            ])
            const  topicwisereports = await SchoolExams.aggregate([
                {
              "$match": {
                 exam_type_cat: 'C',
                exam_status: {$ne:"D"},
                exam_date: startdate,
               enddate:enddate
                           }
                   },  
               {
             $group: {
                _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
                  data: { "$addToSet": "$$ROOT" }
                     }
                   },
          {
            $project: {
          exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub",
        topicwisereports : { $sum: 1 }
              }
          }
        ])
              const  fulltests = await SchoolExams.aggregate([
                      {
          "$match": {
            exam_type_cat: 'B',
            exam_status: {$ne:"D"},
            exam_date: startdate,
            enddate:enddate
          }
        },  
                 {
          $group: {
            _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
            data: { "$addToSet": "$$ROOT" }
          }
        },
                {
                  $project: {
                exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub",
                fulltests : { $sum: 1 }
                    }
                }
              ])
              const  secsubject = await SchoolExams.aggregate([
                      {
          "$match": {
            sect_cutoff: 'Y',
            exam_status: {$ne:"D"},
            exam_date: startdate,
            enddate:enddate
          }
        },  
                 {
          $group: {
            _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
            data: { "$addToSet": "$$ROOT" }
          }
        },
                {
                  $project: {
                exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub",
              secsubject : { $sum: 1 }
                    }
                }
              ])
            const  sectiming = await SchoolExams.aggregate([
                      {
          "$match": {
            sect_timing: 'Y',
            exam_status: {$ne:"D"},
            exam_date: startdate,
            enddate:enddate
          }
        },  
                 {
          $group: {

            _id: { name1: "$exam_cat", name2: "$exam_sub",name3:"$exam_sub_sub" },
            data: { "$addToSet": "$$ROOT" }
          }
        },
                {
                  $project: {
                exam_cat:"$exam_cat",exam_sub:"$exam_sub",exam_sub_sub:"$exam_sub_sub",
              sectiming : { $sum: 1 }
                    }
                }
              ])
            let finalArr = [];
            for (let category of data) {
                let totalquestionsArr = totalquestions.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let topicwisereportsArr = topicwisereports.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let fulltestsArr = fulltests.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let secsubjectArr = secsubject.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))
                let sectimingArr = sectiming.filter(e => (e.exam_cat == category.masterid && e.exam_sub == category.mainid && e.exam_sub_sub == category.subid))

                let totalquestionsCount;
                let topicwisereportsCount;
                let fulltestsCount;
                let secsubjectCount;
                let sectimingCount;
                if (totalquestionsArr.length != 0) {
                    totalquestionsCount = totalquestionsArr[0].totalquestions
                } else {
                    totalquestionsCount = 0;
                }
                if (topicwisereportsArr.length != 0) {
                    topicwisereportsCount = topicwisereportsArr[0].topicwisereports
                } else {
                    topicwisereportsCount = 0;
                }
                if (fulltestsArr.length != 0) {
                    fulltestsCount = fulltestsArr[0].fulltests
                } else {
                    fulltestsCount = 0;
                }
                if (secsubjectArr.length != 0) {
                    secsubjectCount = secsubjectArr[0].secsubject
                } else {
                    secsubjectCount = 0;
                }
                if (sectimingArr.length != 0) {
                    sectimingCount = sectimingArr[0].sectiming
                } else {
                    sectimingCount = 0;
                }
                finalArr.push({
                    mastercategory: category.mastercategory,
                    maincategory: category.maincategory,
                    subcategory: category.subcategory,
                    totalquestions: totalquestionsCount,
                    topicwisereports: topicwisereportsCount,
                    fulltests: fulltestsCount,
                    secsubject: secsubjectCount,
                    sectiming: sectimingCount
                })
            }

            //let { processeddata } = await getOverallmasterData(data, startdate, enddate);
            return jsend(200,{
                count: data.length,
                qdata: finalArr
            });

        } catch (error) {
            return jsend(500,error.message);
        }
    },

    //5.Get Student Report
    getStudentReport: async(req, res, next) => {
        try {
            const { mainCategory, subCategory , startDate, endDate, schoolId, isExcel } = req.payload;
          
            let  data = await SchoolExamtakenlistQc.aggregate([

                {
                "$match": {
                     school_id: schoolId,
                     start_time:startDate,
                     end_time:endDate
                        }
                      },  
                { '$lookup': {
                       'from': "tbl__schoolexam",
                       'localField': 'exam_id',
                       'foreignField': 'exam_id',
                       'as': 'ExamData'
                     }},                      
               { "$unwind": "$ExamData" },    
                                 
               { '$lookup': {
                     'from': "tbl__school_student",
                     'localField': 'stud_id',
                    'foreignField': 'stud_id',
                    'as': 'SchoolStudent'
                  }},                     
               { "$unwind": "$SchoolStudent" }, 

               { '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'ExamData.exam_cat',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamCategory'
                     }},                     
               { "$unwind": "$ExamCategory" }, 

               { '$lookup': {
                     'from': "tbl__school_exam_category",
                     'localField': 'ExamData.exam_sub',
                     'foreignField': 'exa_cat_id',
                     'as': 'ExamCategory1'
                    }},                     
              { "$unwind": "$ExamCategory1" },

            //   {
            //   "$match": {
            // //  "ExamCategory.exa_cat_id":mainCategory,
            // // "ExamCategory1.exa_cat_id":subCategory
            //   }
  // },
          {
            $project: {
       examName:{$concat:["$ExamCategory.exa_cat_name","-","$ExamCategory.exa_cat_name","-","$ExamData.exam_name"]},
       studentName:{$concat:["$SchoolStudent.stud_fname","$SchoolStudent.stud_lname"]},
       studentEmail:"$SchoolStudent.stud_email", studentMobileNumber:"$SchoolStudent.stud_mobile",
       totalQuestion:"$tot_quest",totalAttendQuestion:"$tot_attend",
       totalNotAttendQuestion:{result:["$tot_quest"-"$tot_attend"]},totalCrtAnswer:"$answ_crt",
       totalWrongAnswer:"$answ_wrong",totalMark:"$total_mark",examId:"$ExamData.exam_id",
       mainCategoryName:"$ExamCategory.exa_cat_name",subCategoryName:"$ExamCategory1.exa_cat_name",
       count: { $sum: 1 }
            }
          }
        ])
           data = data.sort((a, b) =>{ return b.totalMark - a.totalMark });
            if(!isExcel){
                let excelData = [];
                if(data && data.length){
                    excelData = data.map( d =>{
                        let obj = {
                            "Student Name" : d.studentName,
                            "Student Email" : d.studentEmail, 
                            "Student Mobile No" : d.studentMobileNumber,
                            "Exam Name"	: d.examName,
                            "Total Questions" : d.totalQuestion,
                            "Total Attend Question" : d.totalAttendQuestion,
                            "Total Not Attend Question" : d.totalAttendQuestion,
                            "Total Correct Answer" : d.totalCrtAnswer,
                            "Total Wrong Answer" : d.totalWrongAnswer,
                            "Total Mark" : d.totalMark
                        };
                        return obj;
                    });
                }else{
                    excelData.push({
                            "Student Name" : "",
                            "Student Email" : "", 
                            "Student Mobile No" : "",
                            "Exam Name"	: "",
                            "Total Questions" : "",
                            "Total Attend Question" : "",
                            "Total Not Attend Question" : "",
                            "Total Correct Answer" : "",
                            "Total Wrong Answer" : "",
                            "Total Mark" : ""
                    });
                }
                // /* make the worksheet */
                // var ws = XLSX.utils.json_to_sheet(excelData);
                // /* add to workbook */
                // var wb = XLSX.utils.book_new();
                // XLSX.utils.book_append_sheet(wb, ws, "StudentsReport");
                // /* generate an XLSX file */
                // let exportFileName = `studentReport.xls`;
                // let filePath = path.join(__dirname, "../public/excels/studentReport.xls");
                // XLSX.writeFile(wb, filePath);
                // res.setHeader(
                //     "Content-Type",
                //     "application/vnd.openxmlformats-officedocument.studentReport.sheet"
                // );
                // res.setHeader("Content-Disposition", "attachment; filename=" + exportFileName);
                // res.sendFile(filePath, function (err) {
                //     console.log("Error downloading file: " + err);
                // });
                return {data}
                }else{
                      return jsend(200,"data received Successfully", 
                             {data});
                    }
                 } catch (error) {
                    return jsend(500,error.message);
                   }
    },

     //6.Get Student QC Report
    getStudentQCReport: async(req, res, next) => {
        try {
     const { qcMainCayegory, qcSubCayegory, schoolId, startDate, endDate, isExcel } = req.payload;      
        const  data = await SchoolExamtakenlistQc.aggregate([
                      {
          "$match": {
                school_id: schoolId,
                start_time:startDate,
                end_time:endDate
          }
        },  
          { '$lookup': {
               'from': "tbl__exam",
               'localField': 'exam_id',
               'foreignField': 'exam_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },                     
              { '$lookup': {
                'from': "tbl__school_student",
                'localField': 'stud_id',
                'foreignField': 'stud_id',
                'as': 'SchoolStudent'
              }},                     
               { "$unwind": "$SchoolStudent" }, 
               { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'ExamData.exam_cat',
                'foreignField': 'exa_cat_id',
                'as': 'ExamCategory'
              }},                     
               { "$unwind": "$ExamCategory" }, 
               { '$lookup': {
                'from': "tbl__exam_category",
                'localField': 'ExamData.exam_sub_sub',
                'foreignField': 'exa_cat_id',
                'as': 'ExamCategory1'
              }},                     
               { "$unwind": "$ExamCategory1" },
                    {
          "$match": {
               "ExamCategory.exa_cat_id":qcMainCayegory,
               "ExamCategory1.exa_cat_id":qcSubCayegory
          }
        },
                {
                  $project: {
                studentName:{CONCAT:["$SchoolStudent.stud_fname","$SchoolStudent.stud_lname"]},
                studentEmail:"$SchoolStudent.stud_email", studentMobileNumber:"$SchoolStudent.stud_mobile",
                totalNotAttendQuestion:{result:["$tot_quest"-"$tot_attend"]},totalCrtAnswer:"$answ_crt",
                totalWrongAnswer:"$answ_wrong",totalMark:"$total_mark",examId:"$ExamData.exam_id",
                count: { $sum: 1 }
                  }
                }
              ])
              console.log(data)
            for (let item of data) {
                let { examTitle, examName } = await getExamTitle(item.examId);
                item.examName = examTitle ? examTitle+' - '+examName: '';
            }
            data = data.sort((a, b) =>{ return b.totalMark - a.totalMark });
            if(isExcel){
                let excelData = [];
                if(data && data.length){
                    excelData = data.map( d =>{
                        let obj = {
                            "Student Name" : d.studentName,
                            "Student Email" : d.studentEmail, 
                            "Student Mobile No" : d.studentMobileNumber,
                            "Exam Name"	: d.examName,
                            "Total Questions" : d.totalQuestion,
                            "Total Attend Question" : d.totalAttendQuestion,
                            "Total Not Attend Question" : d.totalAttendQuestion,
                            "Total Correct Answer" : d.totalCrtAnswer,
                            "Total Wrong Answer" : d.totalWrongAnswer,
                            "Total Mark" : d.totalMark
                        };
                        return obj;
                    });
                }else{
                    excelData.push({
                        "Student Name" : "",
                        "Student Email" : "", 
                        "Student Mobile No" : "",
                        "Exam Name"	: "",
                        "Total Questions" : "",
                        "Total Attend Question" : "",
                        "Total Not Attend Question" : "",
                        "Total Correct Answer" : "",
                        "Total Wrong Answer" : "",
                        "Total Mark" : ""
                    });
                }
                var ws = XLSX.utils.json_to_sheet(excelData);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "StudentsReport");
                let exportFileName = `studentReport.xls`;
                let filePath = path.join(__dirname, "../public/excels/studentReport.xls");
                XLSX.writeFile(wb, filePath);
                res.setHeader(
                    "Content-Type",
                    "application/vnd.openxmlformats-officedocument.studentReport.sheet"
                );
                res.setHeader("Content-Disposition", "attachment; filename=" + exportFileName);
                res.sendFile(filePath, function (err) {
                    console.log("Error downloading file: " + err);
                });
            }if(!data){
              return jsend(404, "Please try again after sometime")
            }
            else{
                return jsend(200,"data received Successfully",
                  {data});
            }
            } catch (error) {
                 return jsend(500,error.message);
             }
      
    },

};

// Function part
async function getOverallData(data, startdate, enddate) {
    try {
        return new Promise(async(resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
                const  uploaded = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        sub_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    uploaded:{$sum:1}
                }}
              ])
   const  waiting = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"Y",
                        sub_id:list.cat_id,
                        quest_date:startdate,
                        enddate:enddate
                }},
                {$project:{
                    waiting:{$sum:1}
                }}
              ])
   const  active = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"Y",
                        sub_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    active:{$sum:1}
                }}
              ])
                const  inactive = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"N",
                        sub_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    inactive:{$sum:1}
                }}
              ])
                
                whole_data.push({
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    subcategorycode: list.subcategorycode,
                    uploaded: uploaded[0].uploaded != 0 ? uploaded[0].uploaded : 0,
                    waiting: waiting[0].waiting != 0 ? waiting[0].waiting : 0,
                    active: active[0].active != 0 ? active[0].active : 0,
                    inactive: inactive[0].inactive != 0 ? inactive[0].inactive : 0
                });
            };
            resolve({
                processeddata: whole_data
            });
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}
async function getMainData(data, startdate, enddate) {
    try {
        return new Promise(async(resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
   const  uploaded = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        cat_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    uploaded:{$sum:1}
                }}
              ])
                const  waiting = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"W",
                        cat_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    waiting:{$sum:1}
                }}
              ])
                const  active = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"Y",
                        cat_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    active:{$sum:1}
                }}
              ])
                const  inactive = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        quest_status:"N",
                        cat_id:list.cat_id,
                        quest_date:startdate,
                        aproved_date:enddate
                }},
                {$project:{
                    inactive:{$sum:1}
                }}
              ])
                whole_data.push({
                    maincategory: list.maincategory,
                    uploaded: uploaded[0].uploaded != 0 ? uploaded[0].uploaded : 0,
                    waiting: waiting[0].waiting != 0 ? waiting[0].waiting : 0,
                    active: active[0].active != 0 ? active[0].active : 0,
                    inactive: inactive[0].inactive != 0 ? inactive[0].inactive : 0
                });
            };
            // resolve({
            //     processeddata: whole_data
            // });
            return jsend({
                processeddata: whole_data
            })
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}
async function getTestData(data, startdate, enddate) {
    try {
        return new Promise(async(resolve, reject) => {
            var whole_data = [];

            for (let list of data) {
                let examtypename;
                if (list.examcat == 'C') {
                    examtypename = await SchoolExamChapters.aggregate( 
                        {$limit:300},                   
                        { "$match":{ 
                            chapt_id:list.examptype,
                        
                    }},
                    {$project:{
                        examname:"$chapter_name"
                    }}
                    )
                } else if (list.examcat == 'T') {
                    examtypename = await SchoolExamTypes.aggregate( 
                        {$limit:300},                   
                        { "$match":{ 
                            extype_id:list.list.examptype,
                        
                    }},
                    {$project:{
                        examname:"$extest_type"
                    }}
                    )
                }
                whole_data.push({
                    mastercategory: list.mastercategory,
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    examname: list.examname,
                    examcode: list.examcode,
                    examques: list.examques,
                    staffname: list.staffname,
                    examdate: new Date(list.examdate),
                    examtypename: examtypename ? examtypename[0][0].examname : 'Not Available'
                });
            }
            // resolve({
            //     processeddata: whole_data
            // });
            return({
                processeddata: whole_data
            })
        });
    } catch (error) {
        return jsend(500,error.message);
    }

}
async function getOverallmasterData(data, startdate, enddate) {
    try {
        return new Promise(async(resolve, reject) => {
            var whole_data = [];
            for (let list of data) {
              const  totalquestions = await SchoolQuestions.aggregate( [
                                     
                    { "$match":{ 
                        exam_id:list.list.examptype,
                }},
                {$project:{
                    totalquestions:{$sum:1}
                }}
              ])
              const  totalquestions1 = await SchoolExams.aggregate([
                { "$match":{ 
                    exam_status:{$ne:"D"},
                    exam_date:startdate,
                    j:enddate
            }},
            {
                $group: {
                  _id: { que: ["$exam_cat","$exam_sub","$exam_sub_sub" ]},  
                  data: { "$addToSet": "$$ROOT" }
                }
              },
            {$project:{
                "$data.exam_id":1,
                count:{$sum:1}
            }}
              ])
                  const  topicwisereports = await SchoolExams.aggregate([
                      {
          "$match": {
            exam_type_cat: "C",
           exam_cat:list.masterid ,
           exam_sub:list.mainid,
           exam_sub_sub:list.subid,
           exam_status:{$ne:"D"},
           exam_date:startdate,
           endDate:enddate
          }
        },  
                {
                  $project: {
                   topicwisereports:{count:{$sum:1} }
          }
        },
    ])
                  const  fulltests = await SchoolExams.aggregate([
                      {
          "$match": {
           exam_type_cat: "B",
           exam_cat:list.masterid ,
           exam_sub:list.mainid,
           exam_sub_sub:list.subid,
           exam_status:{$ne:"D"},
           exam_date:startdate,
           endDate:enddate
          }
        },  
                {
                  $project: {
                   fulltests:{count:{$sum:1} }
          }
        },
              ])
                const  secsubject = await SchoolExams.aggregate([
                      {
          "$match": {
            sect_cutoff: "Y",
           exam_cat:list.masterid ,
           exam_sub:list.mainid,
           exam_sub_sub:list.subid,
           exam_status:{$ne:"D"},
           exam_date:startdate,
           endDate:enddate
          }
        },  
                {
                  $project: {
                   secsubject:{count:{$sum:1} }
          }
        },
              ])
               
                 const  sectiming = await SchoolExams.aggregate([
                      {
                    "$match": {
                          sect_timing: "Y",
                          exam_cat:list.masterid ,
                          exam_sub:list.mainid,
                          exam_sub_sub:list.subid,
                          exam_status:{$ne:"D"},
                          exam_date:startdate,
                          endDate:enddate
                             }
                    },  
                {
                  $project: {
                   sectiming:{count:{$sum:1} }
          }
        },
              ])
                whole_data.push({
                    mastercategory: list.mastercategory,
                    maincategory: list.maincategory,
                    subcategory: list.subcategory,
                    totalquestions: totalquestions[0].totalquestions != 0 ? totalquestions[0].totalquestions : 0,
                    topicwisereports: topicwisereports[0].topicwisereports != 0 ? topicwisereports[0].topicwisereports : 0,
                    fulltests: fulltests[0].fulltests != 0 ? fulltests[0].fulltests : 0,
                    secsubject: secsubject[0].secsubject != 0 ? secsubject[0].secsubject : 0,
                    sectiming: sectiming[0].sectiming != 0 ? sectiming[0].sectiming : 0
                });
            };
            // resolve({
            //     processeddata: whole_data
            // });
            return jsend({
                processeddata: whole_data
            })
        });
    } catch (error) {
        return jsend(500,error.message);
    }
}