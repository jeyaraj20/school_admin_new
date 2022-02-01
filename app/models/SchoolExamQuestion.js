//-------------------------- ExamQuestions Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolExamQuestionsSchema = new mongoose.Schema({
  
            exq_id: {
                type: String,
                required: false,
            },
            exam_id: {
                type: String,
                required: false,
            },
            schoolid: {
                type: String,
                required: false,
            },
            exam_cat: {
                type: String,
                required: false,
            },
            exam_subcat: {
                type: String,
                required: false,
            },
            sect_id: {
                type: String,
                required: false,
            },
            exam_name: {
                type: String,
                required: false,
            },
            exam_code: {
                type: String,
                required: false,
            },
            quest_type: {
                type: String,
                required: false,
            },
            quest_assigned_type: {
                type: String,
                required: false,
            },
            quest_assigned_id: {
                type: String,
                required: false,
            },
            quest_assigned_name: {
                type: String,
                required: false,
            },
            qid: {
                type: String,
                required: false,
            },
            cat_id: {
                type: String,
                required: false,
            },
            sub_id: {
                type: String,
                required: false,
            },
            q_type: {
                type: String,
                required: false,
            },
            question: {
                type: String,
                required: false,
            },
            quest_desc: {
                type: String,
                required: false,
            },
            opt_type1: {
                type: String,
                required: false,
            },
            opt_type2: {
                type: String,
                required: false,
            },
            opt_type3: {
                type: String,
                required: false,
            },
            opt_type4: {
                type: String,
                required: false,
            },
            opt_type5: {
                type: String,
                required: false,
            },
            opt_1: {
                type: String,
                required: false,
            },
            opt_2: {
                type: String,
                required: false,
            },
            opt_3: {
                type: String,
                required: false,
            },
            opt_4: {
                type: String,
                required: false,
            },
            opt_5: {
                type: String,
                required: false,
            },
            crt_ans: {
                type: String,
                required: false,
            },
            quest_level: {
                type: String,
                required: false,
            },
            exam_queststatus: {
                type: String,
                required: false,
            },
            exam_questpos:{
                type: String,
                required: false,
            },
            exam_questadd_date: {
                type: String,
                required: false,
            },
            ip_addr: {
                type: String,
                required: false,
            },
            last_update: {
                type: Date,
                default: Date.now,
            },
                                 
  }); 
  module.exports = mongoose.model("tbl__schoolexamquestions", SchoolExamQuestionsSchema);

   

//-------------------------- ExamQuestions Model End ------------------------------//
