 
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolExamChaptersSchema = new mongoose.Schema({
  
  
            chapt_id: {
                type: String,
                required: false,
            },
            exa_cat_id: {
                type: String,
                required: false,
            },
            schoolid: {
                type: String,
                required: false,
            },
            exmain_cat: {
                type: String,
                required: false,
            },
            exsub_cat: {
                type: String,
                required: false,
            },
            chapter_name: {
                type: String,
                required: false,
            },
            chapter_date: {
                type: String,
                required: false,
            },
            chapter_status: {
                type: String,
                required: false,
            },
            lastupdate: {
                type: Date,
                default: Date.now
            },
                           
  }); 
  module.exports = mongoose.model("tbl__schoolexamchapters", SchoolExamChaptersSchema);
