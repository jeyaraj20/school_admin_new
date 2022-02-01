//-------------------------- Admin Model Start ------------------------------//
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolExamtakenlistQcSchema = new mongoose.Schema({
  
     
            taken_id: {
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
            exam_id: {
                type: String,
                required: false,
            },
            exam_type: {
                type: String,
                required: false,
            },
            exam_type_cat: {
                type: String,
                required: false,
            },

            exam_type_id: {
                type: String,
                required: false,
            },
            post_mark: {
                type: String,
                required: false,
            },
            neg_mark: {
                type: String,
                required: false,
            },
            tot_quest: {
                type: String,
                required: false,
            },
            
            tot_attend: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },
            not_attend: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },
            not_answered: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },

            skip_quest: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },

            answ_crt: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },

            answ_wrong: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },
            tot_postimark: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },
            tot_negmarks: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },

            total_mark: {
                type: String,
                required: false,
                defaultValue: 0.0,
            },
            
            start_time: {
                type: Date,
                default: Date.now,
                defaultValue: '2000-01-01 00:00:00',
            },

            end_time: {
                type: Date,
                default: Date.now,
            },
            exam_status: {
                type: String,
                required: false,
            },
            ip_addr: {
                type: String,
                required: false,
            },
            lastupdate: {
                type: Date,
                default: Date.now,
            }
                                                       
  }); 
  module.exports = mongoose.model("tbl__schoolexamtaken_list_qc", SchoolExamtakenlistQcSchema);

        
    
//-------------------------- Admin Model End ------------------------------//
