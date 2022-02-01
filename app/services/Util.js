"use strict";
const serviceLocator = require("../lib/service_locator");
const jsend = serviceLocator.get("jsend");
const createError = require("http-errors");
const moment = serviceLocator.get("moment"); 
const logger = serviceLocator.get("logger");
const mongoose = serviceLocator.get("mongoose"); 
const SchoolExamSectionDetails = mongoose.model("tbl__schoolexam_sectdetails");
const SchoolQuestionCategory =mongoose.model("tbl__school_question_category");
const SchoolExamMainCategory = mongoose.model("tbl__school_exam_category"); 
const SchoolExamtakenlistQc=mongoose.model("tbl__schoolexamtaken_list_qc");
const SchoolExamtakenlist = mongoose.model("tbl__schoolexamtaken_list");
const SchoolExamQuestions = mongoose.model("tbl__schoolexamquestions");
const SchoolQCExam = mongoose.model("tbl__school_questioncloud_exam");
const SchoolExamChapters = mongoose.model("tbl__schoolexamchapters");
const SchoolExamTypes = mongoose.model("tbl__schoolexamtypes");
const SchoolQuestion = mongoose.model("tbl__schoolquestion");
const SchoolStudent = mongoose.model("tbl__school_student");
const SchoolExams = mongoose.model("tbl__schoolexam");
const School = mongoose.model("tbl__school");
module.exports = {
  
    getSchoolAllDocumentCount: async (req, res, next) => {
        try {
            const SchoolExams1 = await SchoolExams .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExams",
                    }
                }
              ])
              const SchoolQuestion1 = await SchoolQuestion .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolQuestion",
                    }
                }
              ])
              const SchoolQuestionCategory1 = await SchoolQuestionCategory .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolQuestionCategory",
                    }
                }
              ])
              const SchoolExamMainCategory1 = await SchoolExamMainCategory .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamMainCategory",
                    }
                }
              ])
              const School1 = await School .aggregate([
                {
                  $project: {
                    SchoolExams:"$School",
                    }
                }
              ])
              const SchoolQCExam1 = await SchoolQCExam .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolQCExam",
                    }
                }
              ])
              const SchoolExamTypes1 = await SchoolExamTypes .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamTypes",
                    }
                }
              ])
              const SchoolExamChapters1 = await SchoolExamChapters .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamChapters",
                    }
                }
              ])
              const SchoolExamtakenlist1 = await SchoolExamtakenlist .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamtakenlist",
                    }
                }
              ])
              const SchoolExamSectionDetails1 = await SchoolExamSectionDetails .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamSectionDetails",
                    }
                }
              ])
              const SchoolExamQuestions1 = await SchoolExamQuestions .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamQuestions",
                    }
                }
              ])
              const SchoolExamtakenlistQc1 = await SchoolExamtakenlistQc .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolExamtakenlistQc",
                    }
                }
              ])
              const SchoolStudent1 = await SchoolStudent .aggregate([
                {
                  $project: {
                    SchoolExams:"$SchoolStudent",
                    }
                }
              ])
            if (!SchoolExams1) {
                     return jsend(500, "Please try again after sometime")
                    }else{
                const SchoolCont =School1.length
                const SchoolExamsCount = SchoolExams1.length
                const SchoolQCExamCount = SchoolQCExam1.length
                const SchoolQuestionCount=SchoolQuestion1.length
                const SchoolExamTypesCount = SchoolExamTypes1.length
                const SchoolExamChaptersCount= SchoolExamChapters1.length
                const SchoolExamQuestionsCount=SchoolExamQuestions1.length
                const SchoolExamtakenlistCount =SchoolExamtakenlist1.length
                const SchoolExamtakenlistQcCount =SchoolExamtakenlistQc1.length
                const SchoolQuestionCategoryCount= SchoolQuestionCategory1.length
                const SchoolExamMainCategoryCount = SchoolExamMainCategory1.length
                const SchoolExamSectionDetailsCount=SchoolExamSectionDetails1.length
                
                const SchoolStudent=SchoolStudent1.length
                return jsend(200,"data received Successfully", 
                {   SchoolCont,
                    SchoolStudent,
                    SchoolExamsCount,
                    SchoolQCExamCount,
                    SchoolQuestionCount,
                    SchoolExamTypesCount,
                    SchoolExamChaptersCount,
                    SchoolExamtakenlistCount,
                    SchoolExamQuestionsCount,
                    SchoolExamtakenlistQcCount,
                    SchoolExamMainCategoryCount,
                    SchoolQuestionCategoryCount,
                    SchoolExamSectionDetailsCount,
                });
            }
            } catch (error) {
                   logger.error(`Error at Get Sub Category By CatId : ${error.message}`);
                        return jsend(500,error.message);
              }
    },
  
};
