"use strict";

const serviceLocator = require("../lib/service_locator");
const mongoose = serviceLocator.get("mongoose"); 
const logger = serviceLocator.get("logger");
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");
const moment = serviceLocator.get("moment"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolOperator =mongoose.model("tbl__school_operator");
const SchoolStaffAssign = mongoose.model("tbl__school_staffassign");
module.exports = {
    // 1. Get All Active Operator
    getAllStaffAssign: async (req, res, next) => {
        try {          
 const  Operator = await SchoolStaffAssign .aggregate([
        {
           "$match": {
               "school_id":req.payload.user.id,
           }
        },
            { '$lookup': {
               'from': "tbl__school_exam_category",
               'localField': 'examcategory_id',// > 0
               'foreignField': 'exa_cat_id',
               'as': 'ExamData'
             }},                      
              { "$unwind": "$ExamData" },     
              { '$lookup': {
               'from': "tbl__school_operator",
               'localField': 'staff_id',
               'foreignField': 'op_id',
               'as': 'ExamDataQc'
             }},                      
              { "$unwind": "$ExamDataQc" },  
              { $sort: { "ExamData.exa_cat_name": 1,"ExamData.exa_cat_id":1 } },
               {
              $group: {
                _id: "$staffassign_id",
                data: { "$addToSet": "$$ROOT" }
              }
            },
        {
          $project: {
             examcategoryname:[{
             staffassign_id: "$data.staffassign_id",
             examcategory_id:"$data.examcategory_id",
             op_name: "$data.ExamDataQc.op_name", 
             op_id: "$data.ExamDataQc.op_id",
             op_type:"$data.ExamDataQc.op_type",
             count:{ $sum: 1 }
            }]
           }
        }
      ])
            if (!Operator) {
                return jsend(404,"Operator Not Found !!!");
            }else{
            return jsend(200,"data received Successfully", 
                { count: Operator.length, examcategoryname:Operator });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Operator - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Get All InActive Operator
    getAllInactiveSchoolOperator: async (req, res, next) => {
        try {
            const rows  = await SchoolOperator.find({
                 op_status: "N", 
                 schoolid: req.payload.user.id 
            }).sort({ op_type: 1 });
            if (!rows) {
               return jsend(404,"Operator Not Found !!!");
            }else{
                const count =rows.length
            return jsend(200,"data received Successfully", 
                { count, Operator: rows });
            }
        } catch (error) {
            logger.error(`Error at Get All InActive Operator - School : ${error.message}`);
        return jsend(500,error.message);
        }
    },

    // 3. Get Operator By Id
    getSchoolOperatorById: async (req, res, next) => {
        try {
            const { opId } = req.params;
            if (opId == 0) return jsend(400, "Please send valid request data");
            const Operator = await SchoolOperator.findOne({
                    op_id: opId,
                    op_status: "Y",
                    schoolid:req.payload.user.id
            });
            if (!Operator){
                 return jsend(500,"Operator Not Found !!!");
            }else{
            return jsend(200,"data received Successfully", 
                { Operator:Operator });
            }
        } catch (error) {
            logger.error(`Error at Get Operator By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 4. Create Operator
    assignSchoolStaff: async (req, res, next) => {
        try {
    const { school_id, staff_id, examcategory_id } = req.payload;
            if (!school_id || !staff_id || !examcategory_id)
            return jsend(400, "Please send valid request data");
            const staffassign_id = await SchoolStaffAssign.count()
           const result = await SchoolStaffAssign.create({
                        staffassign_id: (staffassign_id) ? Number(staffassign_id) + 1 : 1,
                        school_id,
                        staff_id,
                        examcategory_id,
                        create_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    } ).catch((err) => {
                        return jsend(404,"Please try again after sometime");
                    });
                    if(result){
                        return jsend(200, "data received Successfully",
                        { message: "Create Success",result })
                    }else{
                        return jsend(404, "Please try again after sometime")
                    }
                    } catch (error) {
                          logger.error(`Error at Create Operator - School : ${error.message}`);
                               return jsend(500,error.message);
                        }
    },

    // 5. Update Operator By Id
    updateSchoolStaff: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (id == 0)return jsend(400, "Please send valid request data");
       const {school_id,  staff_id, examcategory_id } = req.payload;
            if (!school_id || !staff_id || !examcategory_id)
            return jsend(400, "Please send valid request data");
           const result =  await SchoolStaffAssign.findOneAndUpdate({  
                        staffassign_id: id,
                         school_id: req.payload.user.id  },
                      { school_id,
                        staff_id,
                        examcategory_id,
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    }  ).catch((err) => {
                        return jsend(404, err.message);
                    });
                    if (result) {
                        return jsend(200, "data received Successfully",
                            { message: "Update Success",result })
                    } else {
                        return jsend(500, "Please try again after sometime")
                    }
                    } catch (error) {
                       logger.error(`Error at Update Operator By Id - School : ${error.message}`);
                        return jsend(500,error.message);
                          }
    },

    // 6. Update 'Inactive / Active / Delete'
    updateInactiveById: async (req, res, next) => {
        try {
            const { opId, status } = req.payload;
            if (!opId || !status) return jsend(400, "Please send valid request data");
            const result =  await SchoolOperator.findOneAndUpdate( {
                       op_status: status ,
                       op_id: opId,
                       schoolid: req.payload.user.id,
                       op_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                         }
                   ).catch((err) => {
                    return jsend(404, err.message);
                });
                if (result) {
                    return jsend(200, "data received Successfully",
                        { message: "Update Success",result })
                } else {
                    return jsend(500, "Please try again after sometime")
                }
                } catch (error) {
                   logger.error(`Error at Update Operator Status - School : ${error.message}`);
                   return jsend(500,error.message);
        }
    },
};
