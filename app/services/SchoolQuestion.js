
"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose");
const ImageFilter = serviceLocator.get("imageFilter");
const trimRequest = serviceLocator.get('trimRequest');
const auth = serviceLocator.get('jwtHelper');
const moment = serviceLocator.get("moment");
const multer = serviceLocator.get("multer");
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const School = mongoose.model("tbl__school");
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolQuestions = mongoose.model("tbl__schoolquestion");
const SchoolExamQuestions = mongoose.model("tbl__schoolexamquestions");
const SchoolQuestionCategory = mongoose.model("tbl__school_question_category");

// require("dotenv").config();

//-------------------------- Multer Part Start ----------------------------------//

// // Ensure Questions Directory directory exists
 var homeCategoryDir = path.join(process.env.schoolQuestions);
// fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, process.env.schoolQuestions);
    },
    filename: (req, file, callBack) => {
        if (
            req.opt_type1 == "T" ||
            req.opt_type2 == "T" ||
            req.opt_type3 == "T" ||
            req.opt_type4 == "T" ||
            req.opt_type5 == "T"
        ) {
            return;
        } else {
            callBack(
                null,
                `file-${Date.now()}${path.extname(file.originalname)}`
            );
        }
    },
});

const upload = multer({
    storage: storage,
    fileFilter: ImageFilter,
    limits: { fileSize: "2mb" },
}).fields([{
        name: "question",
        maxCount: 1,
    },
    {
        name: "opt_1",
        maxCount: 1,
    },
    {
        name: "opt_2",
        maxCount: 1,
    },
    {
        name: "opt_3",
        maxCount: 1,
    },
    {
        name: "opt_4",
        maxCount: 1,
    },
    {
        name: "opt_5",
        maxCount: 1,
    },
]);

//-------------------------- Multer Part End ---------------------------------------//


module.exports = {
    // 1. Get All Active Question
    getAllSchoolQuestion: async(req, res, next) => {
        try {
            const { status, cat_id, sub_id } = req.payload;
            if (!status || !cat_id || !sub_id)  return jsend(400, "Please send valid request data");
            const  rows  = await SchoolQuestions.find({
                 quest_status: status,
                 cat_id, sub_id,
                 schoolid: req.payload.user.id ,
            });
            if (!rows) {
                return jsend("Question Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200, "data received Successfully",
                { count, questions: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Question - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Get All Active Question
    getSchoolQuestionByCategories: async(req, res, next) => {
        try {
            const { sub_id } = req.params;
            if (sub_id == 0)return jsend(400, "Please send valid request data");
            const  rows  = await SchoolQuestions.find({
                sub_id: sub_id,
                schoolid: req.payload.user.id,
            });
            if (!rows) {
            return jsend(404,"Question Not Found !!!");
            }else{
               const count = rows.length
            return jsend(200, "data received Successfully",
                { count, questions: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Question - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 3. Create Question
    createSchoolQuestion: async(req, res, next) => {
        try {
          //  let question_code;
          upload(req, res, function(err) {
                if (req.fileValidationError) {
                    return jsend(req.fileValidationError);
                } else if (err instanceof multer.MulterError) {
                    return jsend(err);
                } else if (err) {
                    return jsend(err);
                } else {
                    console.log("Success", req.files);
                }
                // req.file contains information of uploaded file
                // req.body contains information of text fields, if there were any
   const {
            cat_id, sub_id, q_type, question,quest_desc, opt_type1, opt_1, opt_type2,opt_type3,
            opt_type4, opt_type5, opt_2, opt_3, opt_4, opt_5, crt_ans, quest_level, quest_pos,
            quest_ipaddr, } = req.payload;
                //const { id, name, type } = req.payload.user;
                getSchoolQuestionNumber (cat_id, sub_id, req.payload.user.id)
                    .then(
                        (res) => {
                            const qid =  SchoolQuestions.count()
                            SchoolQuestions.create({
                                qid: (qid) ? Number(qid) + 1 : 1,
                                cat_id,
                                sub_id,
                                schoolid: req.payload.user.id,
                                quest_add_type: "A", //type,
                                q_type,
                                question: q_type == "I" ?
                                    req.files.question[0].filename :question,
                                question_code: res,
                                quest_desc,
                                opt_type1,
                                opt_1: opt_type1 == "I" ?
                                    req.files.opt_1[0].filename : opt_1,
                                opt_type2,
                                opt_type3,
                                opt_type4,
                                opt_type5,
                                opt_2: opt_type2 == "I" ?
                                    req.files.opt_2[0].filename : opt_2,
                                opt_3: opt_type3 == "I" ?
                                    req.files.opt_3[0].filename :opt_3,
                                opt_4: opt_type4 == "I" ?
                                    req.files.opt_4[0].filename :opt_4,
                                opt_5: opt_type5 == "I" ?
                                    req.files.opt_5[0].filename : opt_5,
                                crt_ans,
                                quest_level,
                                quest_add_id: req.payload.user.id, //id,
                                quest_add_by: req.payload.user.username, //name,
                                quest_pos,
                                quest_status: "Y", //type == "A" ? "Y" : "W",
                                quest_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                                aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                                quest_ipaddr,
                                lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                            })
                                .catch((err) => { return jsend(500,err.message);  });  
                                } )
                           if(message){
                                  return jsend(200, "data received Successfully",
                                         { message })
                            }else{
                                 return jsend(404,"Please try again after sometime");
                                    }
                              }); 
                      } catch (error) {
                             logger.error(`Error at Create Category : ${error.message}`);
                                           return jsend(500,err.message);
                                           }
                                                     },

    //4.Get School Question By Id
    getSchoolQuestionById: async(req, res, next) => {
        try {
            const { qId } = req.params;
            if (qId == 0)  return jsend(400, "Please send valid request data");
            const question = await SchoolQuestions.findOne({
                    qid: qId,
                    quest_status: "Y",
                    schoolid: req.payload.user.id,
            });
            if (!question){
                return jsend(404,"Question Not Found !!!");
            }else{
            return jsend(200, "data received Successfully",
                { question });
            }
        } catch (error) {
            logger.error(`Error at Get Question By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //5.Get Allocate School Question
    getAllocateSchoolQuestion: async(req, res, next) => {
        try {
            const {pagecount,  exam_id, exam_master_id, exam_cat_id } = req.payload;
            if ( !pagecount||!exam_id || !exam_master_id || !exam_cat_id)
            return jsend(400, "Please send valid request data");
            let Exam =await SchoolExams.findOne({
                             exam_id: exam_id 
                        });
            let offset = (pagecount - 1) * 1000;
        const  question = await SchoolQuestions.aggregate([
            //limit 1000 OFFSET ${offset}
            {
               "$match": {
                 quest_level: Exam.exam_level,
                quest_status:"Y",
               schoolid:req.payload.user.id,
               qid:"0"// a.qid not in
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
            '$lookup': {
                 'from': "tbl__school_question_category",
                 'localField': 'sub_id',
                 'foreignField': 'cat_id',
                 'as': 'ExamQcData'
               }
              },
           { "$unwind": "$ExamQcData" },
          { $sort: { "qid": -1, } },
            {
              $project: {
               qid:1,q_type:1,question:1,quest_add_by:1,quest_date:1,
               quest_level:1, quest_status:1,question_code:1,
               Category: "$ExamData.cat_name",Subcategory:"$ExamQcData.cat_name",total:"$cat_id",
               count : { $sum: 1 }
                }
            }
          ])
             const  qid = await SchoolExamQuestions.aggregate([
               {
               "$match": {
                exam_id: exam_id,
                exam_cat:exam_master_id,
                exam_queststatus:exam_cat_id,
                schoolid:req.payload.user.id
               }
            },
             ])

          const  examQuestionsList = [];
            question.forEach((row) => {
                examQuestionsList.push(row.qid);
            });

            if (!question) return jsend(404,"Questions Not Found !!!");
            const questiondata = examQuestionsList.join();
            if (examQuestionsList.length != 0) {
                const  examquestion = await SchoolExamQuestions.aggregate([
                    {
                       "$match": {
                             exam_id:{$ne:"exam_id"},
                             exam_queststatus:"Y",
                             exam_cat:exam_master_id,
                             exam_subcat:exam_cat_id,
                             schoolid:req.payload.user.id,
                             qid:questiondata
                       }
                    },
                          {
                          $group: {
                            _id:  "$qid" ,
                            data: { "$addToSet": "$$ROOT" }
                          }
                        },
                    {
                      $project: {
                        count: { $sum: 1 },
                        qid:"$data.qid"
                        }
                    }
                  ])
                  if(Exam){
                return jsend(200, "data received Successfully",
                    { count: question.length, question, examquestion });
                  }
            } else {
                const examquestion = [];
                return jsend(500, "data received Successfully",
                    { count: question.length, question, examquestion });
            }
        } catch (error) {
            logger.error(`Error at get Allocate School Question - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Update Question By Id
    updateSchoolQuestionById: async(req, res, next) => {
        try {
            upload(req, res, function(err) {
                if (req.fileValidationError) {
                    return jsend(req.fileValidationError);
                } else if (err instanceof multer.MulterError) {
                    return jsend(err);
                } else if (err) {
                    return jsend(err);
                } else {
                    console.log("Success", req.files);
                }
                // req.file contains information of uploaded file
                // req.body contains information of text fields, if there were any
                let { qId } = req.params;
                if (qId == 0)  return jsend(400, "Please send valid request data");

      const {
               cat_id, sub_id,schoolid,  q_type, question, question_code, quest_desc, opt_type1, opt_1,
               opt_type2, opt_type3, opt_type4, opt_type5, opt_2, opt_3, opt_4, opt_5,crt_ans,
               quest_level,quest_pos, quest_ipaddr, } = req.payload;
                const { id, name, type } = req.payload.user;
                console.log(req.payload.user);
           const message  =  SchoolQuestions.findOneAndUpdate({
                        qid: qId,
                        schoolid: req.payload.user.id ,
                        cat_id,
                        sub_id,
                        schoolid,
                        quest_add_type: "A", //type,
                        q_type,
                        question: q_type == "I" ?
                            req.files.question[0].filename :question,
                        question_code,
                        quest_desc,
                        opt_type1,
                        opt_1: opt_type1 == "I" ? req.files.opt_1[0].path : opt_1,
                        opt_type2,
                        opt_type3,
                        opt_type4,
                        opt_type5,
                        opt_2: opt_type2 == "I" ?
                            req.files.opt_2[0].filename :opt_2,
                        opt_3: opt_type3 == "I" ?
                            req.files.opt_3[0].filename : opt_3,
                        opt_4: opt_type4 == "I" ?
                            req.files.opt_4[0].filename :opt_4,
                        opt_5: opt_type5 == "I" ?
                            req.files.opt_5[0].filename : opt_5,
                        crt_ans,
                        quest_level,
                        quest_add_id: req.payload.user.id, //id,
                        quest_add_by: req.payload.user.username, //name,
                        quest_pos,
                        quest_status: "Y", //type == "A" ? "Y" : "W",
                        quest_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                        aproved_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                        quest_ipaddr,
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                    }).catch((err) => { return jsend(500,err.message);  });  
                    if(message) {
                        return jsend(200,
                            { message: "Update Success !!!" })
                     }else{
                       return jsend(404,err.message);
                  }
            });
        } catch (error) {
            logger.error(`Error at Update Question By Id - School : ${error.message}`);
            return jsend(error.message);
        }
    },
    
    // 7. Question Number
    getSchoolQuestionNo: async(req, res, next) => {
        try {
            const { cat_id, sub_id } = req.payload;
            if (!cat_id || !sub_id) return jsend(400, "Please send valid request data");
            let count = 0;
            let catCode = "";
         const   counts = await SchoolQuestions.count({
                       cat_id,
                       sub_id,
                       schoolid:req.payload.user.id
                     });
                if (counts) { count = counts;  }
                const   result = await SchoolQuestionCategory.findOne({
                    attributes: ["cat_code"],
                        cat_id: sub_id,
                        pid: cat_id,
                        schoolid:req.payload.user.id,
                })
                if (!result) {
                    return jsend(404,{message: "Please enter valid data"});
                }else{
            catCode = result.cat_code
            return jsend(200, "data received Successfully",
                { catCode,questionNo: catCode + (count + 1).toString().padStart(4, "0")});
        }
        } catch (error) {
            logger.error(`Error at Question Number - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 8. Update 'Active / Inactive / Delete'
    updateSchoolStatusById: async(req, res, next) => {
        try {
            const { qid, status } = req.payload;
            if (!qid || !status)  return jsend(400, "Please send valid request data");
               const result = await SchoolQuestions.findOneAndUpdate({ 
                           qid: qid,
                           schoolid: req.payload.user.id,
                           quest_status: status })
           if(result){
            return jsend(200, "data received Successfully",
            { message: "Update Success !!!",result })
           }else{
            return jsend(500, "Please try again after sometime")
           }
        } catch (error) {
            logger.error(`Error at Update Question Status - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 9. Get Dashboard Count
    getSchoolQuestionsCount: async(req, res, next) => {
        try {
            const count = await SchoolQuestions.count({
                quest_status: "Y",
                schoolid: req.payload.user.id ,
            }).catch((err) => {
                 return jsend(404, "Please send valid request data");
              });
              return jsend(200, "data received Successfully", { count });
        } catch (error) {
            logger.error(`Error at Get Dashboard Count - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 10. Get Questions Count Only
    getSchoolQuestionsCountOnly: async(req, res, next) => {
        try {
            const { quest_status, sub_id, cat_id } = req.payload;
            if (!quest_status || !sub_id || !cat_id)
             return jsend(404, "Please send valid request data");
            let count = 0;
             quest_add_id:req.payload.user.id,
            // Add this to where quest_add_id
               count = await SchoolQuestions.count({ 
                     quest_status:quest_status, 
                     sub_id:sub_id,
                     cat_id:cat_id, 
                     schoolid:req.payload.user.id 
             }).catch(
                (err) => {
                    return jsend(500,err.message);
                });
            return jsend(200, "data received Successfully",  { count });
        } catch (error) {
            logger.error(`Error at Get Questions Count Only : ${error.message}`);
            return jsend(500,error.message);
        }
    },

     //11.Get Allocate Question Total Count
    getAllocateQuestionTotalCount: async(req, res, next) => {
        try {
            const { exam_id, exam_master_id, exam_cat_id } = req.payload;
            if (!exam_id || !exam_master_id || !exam_cat_id) 
            return jsend(404, "Please send valid request data");
        const schoolid= req.payload.user.schoolId
           const Exam = await SchoolExams.findOne({
                 exam_id: exam_id, 
                 schoolid:schoolid,
            });
                   const   Exams=Exam.exam_level
            const  Question = await SchoolQuestions.aggregate([
                {
                   "$match": {
                   quest_level:Exams,
                    quest_status:"Y",
                    schoolid:schoolid,
                   qid:{$ne:"0"}
                   }
                },
                {
                  $project: {
                    totalcount: { $sum: 1 },
                   qid:1
                    }
                }
              ])
               const  questions = await SchoolExamQuestions.aggregate([
                {
                   "$match": {
                     exam_id: exam_id,
                     exam_cat:exam_master_id,
                     exam_subcat:exam_cat_id,
                     exam_queststatus:"Y",
                    schoolid:schoolid
                   }
                },  
                {
                  $project: {
                    count:{ $sum: 1 },qid:1
                    }
                }
              ])
            return jsend(200,"data received Successfully",
                {Exam, totalcount: Question,questions:questions});
        } catch (error) {
            logger.error(`Error at Allocate Question Total Count : ${error.message}`);
            return jsend(500,error.message);
        }
    },

     //12.Get Category Name
    getCategoryName: async(req, res, next) => {
        try {
            const { cat_id, sub_id } = req.payload;
            if (!cat_id || !sub_id)  return jsend(400, "Please send valid request data");
            const  category = await SchoolQuestionCategory.aggregate([
                {
                   "$match": {
                       cat_id:cat_id,
                       schoolid:req.payload.user.id,
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
                      "ExamData.cat_id":sub_id,
                        }
                     },   
                {
                  $project: {
                    examcategoryname: { $sum: 1 },
                   maincategory:"$cat_name",
                    subcategory:"$ExamData.cat_name"
                    }
                }
              ])
            if (!category) {
                return jsend( 404,"Question Not Found !!!");
            }else{
          return jsend(200, "data received Successfully",
          { maincategory: category[0].maincategory, subcategory: category[0].subcategory}
                );
            }
        } catch (error) {
            logger.error(`Error at Get All Active Question : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //13.Get Question By Id
    getQuestionById: async(req, res, next) => {
        try {
            const { qId } = req.params;
            if (qId == 0)  return jsend(400, "Please send valid request data");

            const question = await SchoolQuestions.findOne({
                    qid: qId,
                 schoolid:req.payload.user.id
            });
            if (!question) {
                return jsend(404,"Question Not Found !!!");
            }else{
            return jsend(200, "data received Successfully", {question});
            }
        } catch (error) {
            logger.error(`Error at Get Question By Id : ${error.message}`);
            return jsend(500,error.message);
        }
    },

}

function getSchoolQuestionNumber(cat_id, sub_id, schoolid) {
    return new Promise((resolve, reject) => {
        try {
            let count = 0;
            let catCode = "";
        const  counts  =    SchoolQuestions.count({
                   cat_id, sub_id, schoolid: schoolid  })
                //       .then((counts) => {
                //     count = counts;
                // });
                if (counts) {
                    count = counts;
                }
         const  result =  SchoolQuestionCategory.findOne({
                  //  attributes: ["cat_code"],
                        cat_id: sub_id,
                        pid: cat_id,
                        schoolid: schoolid
                })
                // .then((result) => {
                //     catCode = result.cat_code;
                // });
                if (result) {
                    catCode = result.cat_code;
                }
                const questionNo =
                    catCode + (count + 1).toString().padStart(4, "0");
               // resolve(questionNo);
               return(questionNo)
           // });
        } catch (error) {
            return jsend(500,error.message);
        }
    });
}