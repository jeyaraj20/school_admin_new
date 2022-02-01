//-------------------------- Operator Model Start ------------------------------//

"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolStaffAssignSchema = new mongoose.Schema({
  
            staffassign_id: {
                type: String,
                required: false,
            },
            school_id: {
                type: String,
                required: false,
            },
            staff_id: {
                type: String,
                required: false,
            },
            examcategory_id: {
                type: String,
                required: false,
            },
            create_date:{
                type: Date,
                default: Date.now,
            },
            lastupdate: {
                type: Date,
                default: Date.now,
            }                               
  }); 
  module.exports = mongoose.model("tbl__school_staffassign", SchoolStaffAssignSchema);


     
//-------------------------- Operator Model End ------------------------------//
