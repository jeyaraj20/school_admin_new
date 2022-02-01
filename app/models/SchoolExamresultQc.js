//-------------------------- Admin Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolExamresultQcSchema = new mongoose.Schema({
  
     
            result_id: {
                type: String,
                required: false,
            },
            school_id: {
                type: String,
                required: false,
            },
            stud_id: {
                type: String,
                required: false,
            },
            taken_id: {
                type: String,
                required: false,
            },
            exam_id: {
                type: String,
                required: false,
            },
            quest_id: {
                type: String,
                required: false,
            },
            sect_id: {
                 type: String,
                required: false,
            },
            attend_ans: {
                type: String,
                required: false,
            },
            review_val: {
                type: String,
                required: false,
            },
            crt_ans: {
                type: String,
                required: false,
            },
            crt_mark: {
                type: String,
                required: false,
            },
            neg_mark: {
                type: String,
                required: false,
            },
            ipaddress: {
                type: String,
                required: false,
            },
            attend_date: {
                type: Date,
                default: Date.now,
            },
            lastupdate: {
                type: Date,
                default: Date.now,
            }
                                      
  }); 
  module.exports = mongoose.model("tbl__schoolexam_result_qc", SchoolExamresultQcSchema);

   
//-------------------------- Admin Model End ------------------------------//
