//-------------------------- Operator Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolOperatorSchema = new mongoose.Schema({
  
     
            op_id: {
                type: String,
                required: false,
            },
            op_name: {
                type: String,
                required: false,
            },
            op_uname: {
                type: String,
                required: false,
            },
            op_password: {
                type: String,
                required: false,
            },
            op_type: {
                type: String,
                required: false,
            },
            feat_id: {
                type: String,
                required: false,
            },
            op_status: {
                type: String,
                required: false,
            },
            op_dt: {
                type: Date,
                default: Date.now,
            },
            op_lastupdate: {
                type: Date,
                default: Date.now,
            },
            schoolid: {
                type: String,
                required: false,
            },
            main_category_id: {
                type: String,
                required: false,
            },
            sub_category_id: {
                type: String,
                required: false,
            },
                                                 
  }); 
  module.exports = mongoose.model("tbl__school_operator", SchoolOperatorSchema);

        
//-------------------------- Operator Model End ------------------------------//
