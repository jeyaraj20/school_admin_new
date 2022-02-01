//-------------------------- School Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolQCExamSchema = new mongoose.Schema({
  
     
     
            id: {
                type: String,
                required: false,
            },
            schoolRefId: {
                type: String,
                required: false,
            },
            masterCategory: {
                type: String,
                required: false,
            },
            mainCategory: {
                type: String,
                required: false,
            },
            subCategory: {
                type: String,
                required: false,
            },
            activeStatus: {
                type: String,
                required: false,
            },
            ipAddress: {
                type: String,
                required: false,
            },
            createdBy: {
                type: String,
                required: false,
            },
            createdTimestamp: {
                type: Date,
                default: Date.now,
            },
            updatedBy: {
                type: String,
                required: false,
            },
            updatedTimestamp: {
                type: Date,
                default: Date.now,
            },
                                            
  }); 
  module.exports = mongoose.model("tbl__school_questioncloud_exam", SchoolQCExamSchema);

   
//-------------------------- School Model End ------------------------------//
