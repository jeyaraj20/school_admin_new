"use strict";

const serviceLocator = require("../lib/service_locator");
const jsend = serviceLocator.get("jsend");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const moment = serviceLocator.get("moment"); 
const mongoose = serviceLocator.get("mongoose"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolExamTypes = mongoose.model("tbl__schoolexamtypes");
const SchoolExamChapters = mongoose.model("tbl__schoolexamchapters");
const SchoolExamtakenlist = mongoose.model("tbl__schoolexamtaken_list");
const SchoolExamSectionDetails = mongoose.model("tbl__schoolexam_sectdetails");
module.exports = {
         // 1. Get All Exam By Status
         getAllSchoolExam: async (req, res, next) => {
         try {
            const { type, status, exa_cat_id, schoolid } = req.payload;
            if (!type || !status || !exa_cat_id)  return jsend(400, "Please send valid request data");
            const  rows  = await SchoolExams.find({
                    exam_type: type,
                    exam_status: status,
                    exam_sub_sub: exa_cat_id,
                    schoolid: req.payload.user.id
            }).sort({ exam_id: 1 });
            if (!rows) {
                return jsend(404,"Exam Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200,"data received Successfully",
               { count, Exam: rows });
            }
         } catch (error) {
            logger.error(`Error at Get All Exam By Status - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 2. Get Exam By Id
         getSchoolExamById: async (req, res, next) => {
         try {
            const { id } = req.params;
            if (id == 0)  return jsend(400, "Please send valid request data");
            const Exam = await SchoolExams.findOne({
               exam_id: id,
               schoolid: req.payload.user.id ,
               include: { $in:[{ model: SchoolExamSectionDetails}]}
            });
            if (!Exam) {return jsend(404,"Exam Not Found !!!");
         }else{
            return jsend(200,"data received Successfully",
                { Exam});
         }
         } catch (error) {
            logger.error(`Error at Get Exam By Id - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 3. Create Common Exam
         createSchoolExam: async (req, res, next) => {
         try {
         const {
         exam_cat, exam_sub, exam_sub_sub, exam_name, exam_slug, assign_test_type, exam_type, exam_code,
         exam_level, sect_cutoff,sect_timing, tot_questions, tot_mark,mark_perquest, neg_markquest,
         total_time, quest_type, exam_type_cat,exam_type_id, exam_pos, ip_addr, payment_flag, selling_price,
         offer_price, startDate,endDate } = req.payload;
         if (
         !exam_cat || !exam_sub ||!exam_sub_sub || !exam_name || !assign_test_type || !exam_type ||
         !exam_code ||!exam_level || !tot_questions || !tot_mark || !mark_perquest ||!neg_markquest ||
         !total_time ||!quest_type || !exam_type_cat ||!exam_type_id ||!ip_addr )
          return jsend(400, "Please send valid request data");
         const schoolid="2012"
         const exist = await SchoolExams.find({
         exam_code:exam_code, schoolid:req.payload.user.id 
           });
          if(exist.length>0){
         return jsend(201,
            `Categrory - '${exam_code}' with Code - '${schoolid}' Already Exists !!!`
         );
         }else{
            const exam_id = await SchoolExams.count()
         const categoryData=new SchoolExams({
                    exam_id: (exam_id) ? Number(exam_id) + 1 : 1,
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    schoolid:schoolid,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: req.payload.user.id,
                    exam_add_name: req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    ip_addr,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                    payment_flag,
                    selling_price,
                    offer_price,
                    startDate,
                    endDate
            })
            await categoryData.save()
           
            if (!categoryData) {
                throw createError.Conflict( `${exam_code} - Exam Code Already Exists` );
            }else{
            return jsend(200,"data received Successfully",
                { message: "Exam Created Success !!!" ,exam:categoryData});
            }}
         } catch (error) {
            logger.error(`Error at Create Common Exam - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 4. Create Bank Exam
         createSchoolBankExam: async (req, res, next) => {
         try {
          const {
            exam_cat, exam_sub,exam_sub_sub, exam_name,exam_slug, assign_test_type, exam_type,exam_code,
            exam_level, sect_cutoff,sect_timing,tot_questions, tot_mark, mark_perquest,neg_markquest,
            total_time,quest_type, exam_type_cat,exam_type_id,exam_pos, ip_addr, sections, payment_flag,
            selling_price, offer_price, startDate, endDate } = req.payload;
            if  (
            !exam_cat ||!exam_sub || !exam_sub_sub || !exam_name || !exam_slug || !assign_test_type ||
            !exam_type ||!exam_code || !exam_level || !sect_cutoff || !sect_timing ||!tot_questions ||
            !tot_mark || !mark_perquest ||!neg_markquest ||!total_time || !quest_type ||!exam_type_cat ||
            !exam_type_id ||!exam_pos || !ip_addr || !sections )
            return jsend(400, "Please send valid request data");
            const schoolId=req.payload.user.id 
            const exist = await SchoolExams.find({
                exam_code:exam_code, schoolid:schoolId 
            });
            if(exist.length>0){
                return jsend(201,
                    `Categrory - '${exam_code}' with Code - '${schoolId}' Already Exists !!!`
                );
            }else{
               const exam_id = await SchoolExams.count()
                const created=new SchoolExams({
                    exam_id: (exam_id) ? Number(exam_id) + 1 : 1,
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    schoolid:schoolId,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: req.payload.user.id,
                    exam_add_name: req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    ip_addr,
                    last_update: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss" ),
                    payment_flag,
                    selling_price,
                    offer_price,
                    startDate,
                    endDate
            })
           await created.save()
            if (created) {
                let examSectionsList = [];
                sections.forEach((list) => {
                    examSectionsList.push({
                        exam_id: exam.exam_id,
                        schoolid:schoolId,
                        main_cat: "0",
                        sub_cat: "0",
                        menu_title: list.menu_title,
                        no_ofquest: list.no_ofquest,
                        mark_perquest: list.mark_perquest,
                        tot_marks: list.tot_marks,
                        neg_mark: list.neg_mark,
                        cut_off: list.cut_off,
                        sect_time: list.sect_time,
                        sect_date: moment(Date.now()).format("YYYY-MM-DD"),
                        lastupdate: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                    });
                  });
                // 2. tbl__exam_sectdetails insert
                await SchoolExamSectionDetails.create(examSectionsList, {
                }).catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
                return jsend(200, "data received Successfully",
                    { message: "Bank Exam Created Success !!!" });
            } else {
                throw createError.Conflict(`${exam_code} - Exam Code Already Exists` );
             }}
         } catch (error) {
            logger.error(`Error at Create Bank Exam - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 5. Update Exam
         updateSchoolExamById: async (req, res, next) => {
         try {
            const { id } = req.params;
         const {
         exam_cat, exam_sub, exam_sub_sub, exam_name, exam_slug, assign_test_type, exam_type,
         exam_code, exam_level,sect_cutoff, sect_timing, tot_questions, tot_mark, mark_perquest,
         neg_markquest, total_time,quest_type,exam_type_cat,exam_type_id,exam_pos,ip_addr,
         startDate,endDate } = req.payload;
            if (
         !exam_cat || !exam_sub || !exam_sub_sub ||!exam_name || !exam_slug || !assign_test_type ||
         !exam_type || !exam_code || !exam_level ||!sect_cutoff || !sect_timing || !tot_questions ||
         !tot_mark || !mark_perquest || !neg_markquest ||!total_time ||!quest_type || !exam_type_cat ||
         !exam_type_id || !ip_addr )
         return jsend(400, "Please send valid request data");
         const schoolId=req.payload.user.id 
         const result  =  await SchoolExams.findOneAndUpdate(
                { exam_id: id, 
                    schoolid:schoolId,
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    schoolid: schoolId,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id: req.payload.user.id,
                    exam_add_name:req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD"),
                    ip_addr,
                    last_update: moment(Date.now()).format(  "YYYY-MM-DD HH:mm:ss" ),
                    startDate,
                    endDate
                },
            ).catch((err) => {
                return jsend(500,err.message);
            });
            if(result){
                return jsend(200, "data received Successfully",
                { message: "Update Success !!!",result })
               }else{
                return jsend(500, "Please try again after sometime" )
               }
         } catch (error) {
            logger.error(`Error at Update Common Exam - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 6. Update Bank Exam
         updateSchoolBankExamById: async (req, res, next) => {
         try {
            const { id } = req.params;
         const {
           exam_cat, exam_sub,exam_sub_sub, exam_name, exam_slug,assign_test_type, exam_type, exam_code,
           exam_level, sect_cutoff, sect_timing,tot_questions, tot_mark, mark_perquest, neg_markquest,
           total_time, quest_type, exam_type_cat,exam_type_id, exam_pos, ip_addr, sections,
           startDate, endDate} = req.payload;
         if (
          !exam_cat || !exam_sub || !exam_sub_sub ||!exam_name || !exam_slug || !assign_test_type ||
          !exam_type || !exam_code ||!exam_level || !sect_cutoff || !sect_timing || !tot_questions ||
          !tot_mark ||!mark_perquest ||!neg_markquest || !total_time || !quest_type || !exam_type_cat ||
          !exam_type_id || !ip_addr || !sections )
          
          return jsend(400, "aaa Please send valid request data");
          const schoolid=req.payload.user.id
          const result  =  await SchoolExams.findOneAndUpdate(
            {       exam_id: id,schoolid:schoolid},{
                     
                    exam_cat,
                    exam_sub,
                    exam_sub_sub,
                    exam_name,
                    exam_slug,
                    assign_test_type,
                    exam_type,
                    exam_code,
                    exam_level,
                    sect_cutoff,
                    sect_timing,
                    tot_questions,
                    tot_mark,
                    mark_perquest,
                    neg_markquest,
                    total_time,
                    quest_type,
                    exam_type_cat,
                    exam_type_id,
                    schoolid:schoolid,
                    exam_pos,
                    exam_status: "W",
                    exam_add_type: "S",
                    exam_add_id:req.payload.user.id,
                    exam_add_name: req.payload.user.username,
                    exam_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    ip_addr,
                    last_update: moment(Date.now()).format( "YYYY-MM-DD HH:mm:ss" ),
                    startDate,
                    endDate
                },
            ).catch((err) => {
                return jsend(400, "tt Please send valid request data");
            });
            // 2. tbl__exam_sectdetails delete
            await SchoolExamSectionDetails.findOneAndUpdate(
                {  exam_id: id,
                     schoolid:schoolid,
                     exam_id: "0" }
            ).catch((err) => {
                return jsend(400, "rr Please send valid request data");
            });

            let examSectionsList = [];
         sections.forEach((list) => {
                    examSectionsList.push({
                    exam_id: id,
                    schoolid: req.payload.user.id,
                    main_cat: "0",
                    sub_cat: "0",
                    menu_title: list.menu_title,
                    no_ofquest: list.no_ofquest,
                    mark_perquest: list.mark_perquest,
                    tot_marks: list.tot_marks,
                    neg_mark: list.neg_mark,
                    cut_off: list.cut_off,
                    sect_time: list.sect_time,
                    sect_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                });
            });
            // 3. tbl__exam_sectdetails insert
            await SchoolExamSectionDetails.create(examSectionsList, {
            }).catch((err) => {
               
                return jsend(400, "Please send valid request data");
            });
            return jsend(200, "data received Successfully",
               { message: "Exam Updated Success !!!",result });
         } catch (error) {
            logger.error(`Error at Update Bank Exam - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         // 7. Update Exam Status 'Inactive / Active / Delete'
         updateSchoolStatusById: async (req, res, next) => {
         try {
            const { exam_id, status } = req.payload;
            if (!exam_id || !status)return jsend(400, "Please send valid request data");
         const result = await SchoolExams.findOneAndUpdate(
                    {   exam_id: exam_id, schoolid: req.payload.user.id , 
                     exam_status: status },
                ).catch((err) => {
                    return jsend(400, "Please send valid request data");
                });  if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Update Success !!!",result })
                   }else{
                    return jsend(500, "Please try again after sometime" )
                   }
         } catch (error) {
            logger.error(`Error at Update Exam Status - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         //8.Get School PreviousYear
         getSchoolPreviousYear: async (req, res, next) => {
         try {
            const { exam_cat, exam_sub } = req.payload;
            if (!exam_cat || !exam_sub) return jsend(400, "Please send valid request data");
            const  rows = await SchoolExams.find({
                    schoolid:req.payload.user.id,
                    exam_type: 'C',
                    exam_cat: exam_cat,
                    exam_sub: exam_sub,
                    exam_status: 'Y'
            }).sort({ exam_id: 1 })
            .catch((err) => {
                return jsend(400, "Please send valid request data");
            }); 
            if (!rows){
               return jsend(404,"Previous year question Not Found !!!");
            }else{
               const count = rows.length
            return jsend(200, "data received Successfully",
                {count,  Exam: rows });
            }
         } catch (error) {
            logger.error(`Error at Get Previous Year - School : ${error.message}`);
             return jsend(500,error.message);
         }
         },

          //9.Get School Test Types
         getSchoolTestTypes: async (req, res, next) => {
         try {
            const { sub_cat_id } = req.params;
            const  category = await SchoolExamTypes.aggregate([
                {
                   "$match": {
                     exa_cat_id:sub_cat_id,
                     extype_status:"Y"
                   }
                },
                 { $sort: { "extype_id": 1 } },
                {
                  $project: {
                    count: { $sum: 1 },extype_id:"$extype_id",extest_type:"$extest_type"
                    }
                }
              ])
         const result  =   await SchoolExams .aggregate([
                {
                   "$match": {
                     exam_sub_sub:sub_cat_id,
                   //  assign_test_type:"D",
                   //  exam_status:{$ne:"D"}
                   }
                },
                 { $sort: { "exam_type_id": 1 } },
                {
                  $project: {
                    count: { $sum: 1 },exam_type_id:1
                    }
                }
              ])
            if (!category){
                return jsend(404,"Test types Not Found !!!");
            }else{
              const  count = category.length
            return jsend(200, "data received Successfully",
                { count, category,result });
            }
         } catch (error) {
            logger.error(`Error at School Test Types - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         //10.Get School Chapters
         getSchoolChapters: async (req, res, next) => {
         try {
            const { sub_cat_id } = req.params;
         const  category = await SchoolExamChapters.aggregate([
                   {
                      "$match": {
                         exa_cat_id:sub_cat_id,
                         chapter_status:"Y",
                        }
                   },
                    { $sort: { "chapt_id": 1 } },
                   {
            $project: {
                      chapt_id:1,  count: { $sum: 1 }
            }
         }
         ])
         const  Exam = await SchoolExams .aggregate([
          {
           "$match": {
            schoolid:req.payload.user.id,
            exam_type_cat:"C",
            assign_test_type:"D",
            exam_status:{$ne:"D"},
            exam_sub_sub:sub_cat_id
           }
         },
            ])
            if (!category){
                return jsend(500,"chapters list Not Found !!!");
            }else{
              const count= category.length
              const ExamCount=Exam.length
            return jsend(200, "data received Successfully",
                {
                  count,category,
                  ExamCount,Exam 
               });
            }
         } catch (error) {
            logger.error(`Error at School Chapters - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },
    
         //11.Get School Test Types Edit
         getSchoolTestTypesEdit: async (req, res, next) => {
         try {
            const { sub_cat_id } = req.params;
            const  category = await SchoolExamTypes.aggregate([
                {
                   "$match": {
                    exa_cat_id:sub_cat_id,
                     extype_status:"Y",
                     schoolid:payload.user.id
                   }
                },
                 { $sort: { "extype_id": 1 } },
              ])
            if (!category){
               return jsend(404, "Test types Not Found !!!");
            }else{
               const count = category.length
            return jsend(200, "data received Successfully",
                { count, category });
            }
         } catch (error) {
            logger.error(`Error at School Test Types Edit - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         //12.Get School Chapters Edit
         getSchoolChaptersEdit: async (req, res, next) => {
         try {
            const { sub_cat_id } = req.params;
            const  category = await SchoolExamChapters.aggregate([
                {
                   "$match": {
                    exa_cat_id:sub_cat_id,
                    chapter_status:"Y",
                    schoolid:req.payload.user.id
                   }
                   },
                { $sort: { "chapt_id": 1 } },
                ])
            if (!category){
                return jsend(404,"chapters list Not Found !!!");
            }else{
               const count = category.length
            return jsend(200, "data received Successfully",
                { count, category });
            }
         } catch (error) {
            logger.error(`Error at School Chapter Edit - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

         //13.Get School Section
         getSchoolSection: async (req, res, next) => {
         try {
            const { exam_id } = req.params;
            if (exam_id == 0 || !exam_id)return jsend(400, "Please send valid request data");

            const   rows  = await  SchoolExamSectionDetails.find({
                    exam_id: exam_id,
                    schoolid:req.payload.user.id
            }).sort({ sect_id: 1 });
            if (!rows) {
                return jsend(404,"Exam Section Not Found !!!");
            }else{
                const count = rows.length;
                return jsend(200, "data received Successfully",
                { count, Section: rows });
            }
         } catch (error) {
            logger.error(`Error at Get School Section - School : ${error.message}`);
            return jsend(500,error.message);
         }
         },

          //14.Get All Exam With Assignedcount
         getAllExamWithAssignedcount: async (req, res, next) => {
         try {
            const { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id)  return jsend(400, "Please send valid request data");
         const  Exam = await SchoolExams.aggregate([
            {
               "$match": {
                exam_type:type,
                exam_status:status,
                exam_sub_sub:exa_cat_id
               }
            },
            { '$lookup': {
              'from': "tbl__schoolexamquestions",
              'localField': 'exam_id',
              'foreignField': 'exam_id',
              'as': 'ExamData'
            }},                      
             { "$unwind": "$ExamData" },                     
               {
               "$match": {
               "ExamData.exam_queststatus":"Y",
                }
                },
               { $sort: { "exam_id": 1,  } },
            {
              $group: {
    
                _id:  "$exam_id",
                data: { "$addToSet": "$$ROOT" }
              }
            },
            {
              $project: {
                totalassigned:"$data.exam_id",ExamData:"$data.ExamData",
               count: { $sum: 1 }
                }
            }
          ])
            if (!Exam) {
                return jsend(404,"Exam Not Found !!!");
            }
            return jsend(200, "data received Successfully",
                { count: Exam.length, Exam: Exam });
         } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500,error.message);
         }
         },

          //15.Get All Exam Count
         getAllExamCount: async (req, res, next) => {
         try {
            const { type, status, exa_cat_id } = req.payload;
            if (!type || !status || !exa_cat_id) return jsend(400, "Please send valid request data");
            const  count = await SchoolExams.count({
                  exam_type: type,
                  exam_status: status,
                  exam_sub_sub: exa_cat_id 
            }).catch((err) => {
              return jsend(404,"Exam Not Found !!!");
            });
            return jsend(200, "data received Successfully",
                { count });
         } catch (error) {
            logger.error(`Error at Get All Exam By Status : ${error.message}`);
            return jsend(500,error.message);
         }
          },

         //16.Get Exam Resutl Report
         getExamResutlReport: async (req, res, next) => {
         try {
            const { schoolId } = req.params;
            if (!schoolId)  return jsend(400, "Please send valid request data");
            const  result = await SchoolExamtakenlist.aggregate([
                {
                   "$match": {
                    school_id:schoolId,
                    exam_status:"C",
                   }
                },
                { '$lookup': {
                  'from': "tbl__school",
                  'localField': 'school_id',
                  'foreignField': 'id',
                  'as': 'ExamData'
                }},                      
                 { "$unwind": "$ExamData" },  
        
                  { '$lookup': {
                  'from': "tbl__school_student",
                  'localField': 'stud_id',
                  'foreignField': 'stud_id',
                  'as': 'StudentData'
                }},                      
                 { "$unwind": "$StudentData" },   
        
                 { '$lookup': {
                  'from': "tbl__schoolexam",
                  'localField': 'exam_id',
                  'foreignField': 'exam_id',
                  'as': 'SchoolExamData'
                }},                      
                 { "$unwind": "$SchoolExamData" }, 
        
                  { '$lookup': {
                  'from': "tbl__schoolexamchapters",
                  'localField': 'SchoolExamData.exam_sub_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'SchoolExamChapters'
                }},                      
                 { "$unwind": "$SchoolExamChapters" },   
                 { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'SchoolExamData.exam_sub',
                  'foreignField': 'exa_cat_id',
                  'as': 'SchoolExamCategory'
                }},                      
                 { "$unwind": "$SchoolExamCategory" },   
                   { '$lookup': {
                  'from': "tbl__school_exam_category",
                  'localField': 'SchoolExamData.exam_cat',
                  'foreignField': 'exa_cat_id',
                  'as': 'SchoolExamChaptersMain'
                }},                      
                 { "$unwind": "$SchoolExamChaptersMain" }, 
                {$project: {
           post_mark: "$post_mark", tot_quest:"$tot_quest",tot_attend:"$tot_attend",
           not_answered:"$not_answered",answ_crt :"$answ_crt", answ_wrong :"$answ_wrong",
           tot_postimark :"$tot_postimark", tot_negmarks :"$tot_negmarks",total_mark :"$total_mark",
           start_time :"$start_time", end_time :"$end_time",exam_statu:"$exam_statu",
           stud_fnam:"$StudentData.stud_fnam", stud_lname:"$StudentData.stud_lname",
           stud_dob:"$StudentData.stud_dob", stud_regno:"$StudentData.stud_regno",
           stud_email: "$StudentData.stud_email",stud_mobile:"$StudentData.stud_mobile",
           mainCategory:"$SchoolExamChaptersMain.exa_cat_name",exam_name:"$SchoolExamData.exam_name",
           subCategory:"$SchoolExamCategory.exa_cat_name",chapter_name:"$SchoolExamChapters.chapter_name",
           _id: 0,count: { $sum: 1 }
                    }
                }
              ])
          if (!result) {
         return jsend(400, "Please send valid request data");
         }else{ 
         const    count = result.length
         return jsend(200, "data received Successfully",
          {count,  res : result});//{  res : result[0]});
            }
          } catch (error) {
            logger.error(`Error at Get Test Types : ${error.message}`);
           return jsend(500, error.message)
             }
         },
             };
