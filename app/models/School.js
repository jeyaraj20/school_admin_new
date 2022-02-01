//-------------------------- School Model Start ------------------------------//

   
"use strict";
const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose");
mongoose.pluralize(null)
const SchoolSchema = new mongoose.Schema({
  
  
       
            id: {
                type: String,
                required: false,
            },
            schoolName: {
                type: String,
                required: false,
            },
            schoolLogo: {
                type: String,
                required: false,
            },
            address1: {
                type: String,
                required: false,
            },
            address2: {
                type: String,
                required: false,
            },
            phoneNumber: {
                type: String,
                required: false,
            },
            emailId: {
                type: String,
                required: false,
            },
            password: {
                type: String,
                required: false,
            },
            contactPerson: {
                type: String,
                required: false,
            },
            mobileNumber: {
                type: String,
                required: false,
            },
            totalStudents: {
                type: String,
                required: false,
            },
            schoolStatus: {
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
                default: Date.now
            },
            updatedBy: {
                type: String,
                required: false,
            },
            updatedTimestamp: {
                type: String,
                required: false,
            },
            expiryDate: {
                type: Date,
                default: Date.now
            },
                          
  }); 
  module.exports = mongoose.model("tbl__school", SchoolSchema);

     

//-------------------------- School Model End ------------------------------//
