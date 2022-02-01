"use strict";

const serviceLocator = require("../lib/service_locator");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const jsend = serviceLocator.get("jsend");
const mongoose = serviceLocator.get("mongoose"); 
const moment = serviceLocator.get("moment"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolExamQuestions = mongoose.model("tbl__schoolexamquestions");
const SchoolQuestions =mongoose.model("tbl__schoolquestion");
const SchoolExamSectionDetails =mongoose.model("tbl__schoolexam_sectdetails");
module.exports = {
    // 1. Create ExamQuestion (Assign)
    createSchoolExamQuestion: async (req, res, next) => {
    try {
      const { exam_id, sect_id,ip_addr, qid} = req.payload;
     if ( !exam_id || !ip_addr ||!qid )
     return jsend(400, "Please send valid request data");
            const Exam = await SchoolExams.findOne({
                 exam_id: req.payload.exam_id,
                 schoolid:req.payload.user.id,
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
    const {
        exam_cat, exam_sub, exam_name, exam_code,tot_questions, quest_type } = Exam;
            const { count } = await SchoolExamQuestions.find({
                        exam_id: exam_id,
                        exam_queststatus: 'Y',
                        schoolid: req.payload.user.id
                }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            let allowedquestion = tot_questions - count;
            console.log(allowedquestion);
            let examQuestionsList = [];
            let pushedQuestion = 1;
            const { rows } = await SchoolQuestions.find(
                        { qid: qid, schoolid: req.payload.user.id }
            ).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            rows.forEach((index) => {
                if (pushedQuestion <= allowedquestion) {
                    const qid =  SchoolQuestions.count()
                    examQuestionsList.push({
                        schoolid: req.payload.user.id,
                        qid: (qid) ? Number(qid) + 1 : 1,
                        exam_id: exam_id,
                        exam_cat: exam_cat,
                        exam_subcat: exam_sub,
                        sect_id: sect_id,
                        exam_name: exam_name,
                        exam_code: exam_code,
                        quest_type: quest_type,
                        quest_assigned_type: "S",
                        quest_assigned_id: req.payload.user.id,
                        quest_assigned_name: req.payload.user.username,
                        qid: index.qid,
                        cat_id: index.cat_id,
                        sub_id: index.sub_id,
                        q_type: index.q_type,
                        question: index.question,
                        quest_desc: index.quest_desc,
                        opt_type1: index.opt_type1,
                        opt_type2: index.opt_type2,
                        opt_type3: index.opt_type3,
                        opt_type4: index.opt_type4,
                        opt_type5: index.opt_type5,
                        opt_1: index.opt_1,
                        opt_2: index.opt_2,
                        opt_3: index.opt_3,
                        opt_4: index.opt_4,
                        opt_5: index.opt_5,
                        crt_ans: index.crt_ans,
                        quest_level: index.quest_level,
                        exam_questpos: "1",
                        exam_queststatus: "Y",
                        exam_questadd_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                        ip_addr: ip_addr,
                        last_update: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                    });
                    console.log(examQuestionsList);
                }
                pushedQuestion = pushedQuestion + 1;
            });
            await SchoolExamQuestions.create(examQuestionsList, {
            }).catch((err) => {
                return jsend(500, "Please send valid request data");
            });
            return jsend(200,"data received Successfully", 
                { message: "Exam Updated Success !!!" });
        } catch (error) {
            logger.error(`Error at Create ExamQuestion (Assign) - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Get Assigned Question Count
    getAssignedSchoolExamQuestionsCount: async (req, res, next) => {
        try {
            const { exam_id, exam_cat, exam_subcat, sect_id, schoolid } = req.payload;
            if (!exam_id || !exam_cat || !exam_subcat || !schoolid)
            return jsend(400, "Please send valid request data");
            const count = await SchoolExamQuestions.count(
                {  exam_id, exam_cat, exam_subcat, sect_id, schoolid  },
            ).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            return jsend(200,"data received Successfully", 
                { count });
        } catch (error) {
            logger.error(`Error at Get Assigned Question Count - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 3.Create School Bank ExamQuestion
    createSchoolBankExamQuestion: async (req, res, next) => {
        try {
      const {
            exam_id, sect_id, ip_addr,qid } = req.payload;
      if (
           !exam_id || !ip_addr ||!qid  )
           return jsend(400, "Please send valid request data");
            let Exam = await SchoolExams.findOne({
                exam_id: req.payload.exam_id,
                 schoolid: req.payload.user.id ,
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
      const {
           exam_cat, exam_sub, exam_name, exam_code, tot_questions, quest_type } = Exam;
            const { count } = await SchoolExamQuestions.find({
                        exam_id: exam_id,
                        sect_id: sect_id,
                        exam_queststatus: 'Y', 
                        schoolid: req.payload.user.id
                    }
            ).catch((err) => {
                return jsend(500, "Please send valid request data");
            });
            const examSection = await SchoolExamSectionDetails.findOne({
                 sect_id: sect_id, 
                 schoolid: req.payload.user.id ,
            }).catch((err) => {
                return jsend(500, "Please send valid request data");
            });
            const { no_ofquest } = examSection;
            let allowedquestion = no_ofquest - count;
            let examQuestionsList = [];
            let pushedQuestion = 1;
            const { rows } = await SchoolQuestions.find(
                {
                        //{ qid: qid, schoolid: req.payload.user.id }
                       qid: qid
                }).catch((err) => {
                    return jsend(500, "Please send valid request data");
            });
            rows.forEach((index) => {
                const qid =  SchoolQuestions.count()
                if (pushedQuestion <= allowedquestion) {
                    examQuestionsList.push({
                        qid: (qid) ? Number(qid) + 1 : 1,
                        exam_id: exam_id,
                        exam_cat: exam_cat,
                        exam_subcat: exam_sub,
                        sect_id: sect_id,
                        schoolid: req.payload.user.id,
                        exam_name: exam_name,
                        exam_code: exam_code,
                        quest_type: quest_type,
                        quest_assigned_type: "S",
                        quest_assigned_id: req.payload.user.id,
                        quest_assigned_name: req.payload.user.username,
                        qid: index.qid,
                        cat_id: index.cat_id,
                        sub_id: index.sub_id,
                        q_type: index.q_type,
                        question: index.question,
                        quest_desc: index.quest_desc,
                        opt_type1: index.opt_type1,
                        opt_type2: index.opt_type2,
                        opt_type3: index.opt_type3,
                        opt_type4: index.opt_type4,
                        opt_type5: index.opt_type5,
                        opt_1: index.opt_1,
                        opt_2: index.opt_2,
                        opt_3: index.opt_3,
                        opt_4: index.opt_4,
                        opt_5: index.opt_5,
                        crt_ans: index.crt_ans,
                        quest_level: index.quest_level,
                        exam_questpos: "1",
                        exam_queststatus: "Y",
                        exam_questadd_date: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss"),
                        ip_addr: ip_addr,
                        last_update: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                    });
                }
                pushedQuestion = pushedQuestion + 1;
            });
            await SchoolExamQuestions.create(examQuestionsList, {
            }).catch((err) => {
                return jsend(500, "Please send valid request data");
            });
            return jsend(200, "data received Successfully",
                { message: "Exam Updated Success !!!" });
        } catch (error) {
            logger.error(`Error at Create Bank Exam Question - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //4.Get Assigned School Exam Questions
    getAssignedSchoolExamQuestions: async (req, res, next) => {
        try {
            const { exam_id, exam_cat, exam_subcat } = req.payload;
            if (!exam_id || !exam_cat || !exam_subcat)
            return jsend(400, "Please send valid request data");
        const [examquestion] = await SchoolExamQuestions.aggregate([ 
                    {$limit:300},                   
            { "$match":{  exam_id:exam_id,
                 exam_cat:exam_cat,
                 exam_subcat:exam_subcat,
                 schoolid: req.payload.user.id,
                 exam_queststatus:'Y'
    }},
          { '$lookup': {
       'from': "tbl__school_question_category",
       'localField': 'cat_id',
       'foreignField': 'cat_id',
       'as': 'ExamData'
     }},                      
      { "$unwind": "$ExamData" },                     
      { '$lookup': {
        'from': "tbl__school_question_category",
        'localField': 'sub_id',
        'foreignField': 'cat_id',
        'as': 'ExamChapters'
      }},                     
       { "$unwind": "$ExamChapters" },   
    
     {$project:{
      Category:"$ExamData.cat_name",
        ExamData:"$ExamData",
        Subcategory:"$ExamChapters.cat_name",
        _id:0 ,count:{$sum:1} }}                 
          ])
            if (!examquestion)
                return jsend(404,"Questions Not Found !!!");
            return jsend({ count: examquestion.length, examquestion });

        } catch (error) {
            logger.error(`Error at get Assigned School ExamQuestions - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //5.Remove Assigned School Question
    removeAssignedSchoolQuestion: async (req, res, next) => {
        try {
            const { exq_id } = req.payload;
            if (!exq_id) return jsend(400, "Please send valid request data");
            const result  = await SchoolExamQuestions.findOneAndUpdate({
                             exq_id: exq_id, 
                             schoolid: req.payload.user.id ,
                             exam_queststatus: 'N' 
                            })
                    if(result){
                        return jsend(200, "data received Successfully",
                        { message: "Update Success !!!",result })
                       }else{
                        return jsend(500, "Please try again after sometime" )
                       }
                    } catch (error) {
                    logger.error(`Error at Update Exam Package Status : ${error.message}`);
                    return jsend(500, error.message)
                }
     },

     //6.Get Assigned Exam Questions Count
    getAssignedExamQuestionsCount: async (req, res, next) => {
        try {
            const { exam_id, exam_cat, exam_subcat } = req.payload;
            if (!exam_id || !exam_cat || !exam_subcat)
            return jsend(400, "Please send valid request data");
            const count = await SchoolExamQuestions.count( {
                  exam_id, exam_cat,
                  exam_subcat,
                  exam_queststatus: 'Y', 
                  schoolid: req.payload.user.id  
                } ).catch((err) => {
                    return jsend(400, "Please send valid request data");
            })
              if(count){
                return jsend(200, "data received Successfully", 
                { count });
            }else{
                return jsend(500, "Please try again after sometime")
            }
        } catch (error) {
            logger.error(`Error at Get Assigned Question Count : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    
};
