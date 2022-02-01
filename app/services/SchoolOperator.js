"use strict";

const serviceLocator = require("../lib/service_locator");
const { Console } = require("winston/lib/winston/transports");
const createError = require("http-errors");
const jsend = serviceLocator.get("jsend");
const logger = serviceLocator.get("logger");
const moment = serviceLocator.get("moment"); 
const mongoose = serviceLocator.get("mongoose"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolOperator = mongoose.model("tbl__school_operator");
module.exports = {
    // 1. Get All Active Operator
    getAllActiveSchoolOperator: async (req, res, next) => {
         try {
            const { status } = req.params;
         const  Operator = await SchoolOperator.aggregate([
         {
           "$match": {
             op_status:status,
            schoolid:req.payload.user.id,
           }
        },
        { '$lookup': {
          'from': "tbl__schoolquestion",
          'localField': 'op_id',
          'foreignField': 'quest_add_id',
          'as': 'ExamData'
         }},                      
         { "$unwind": "$ExamData" }, 
         //  { '$lookup': {
         //   'from': "tbl__schoolquestion",
         //   'localField': 'ExamData.op_uname',
         //   'foreignField': 'ExamData.quest_add_by',
         //   'as': 'ExamQcData'
         // }},                      
         //  { "$unwind": "$ExamQcData" }, 
         {
          "$match": {
          quest_status:{$ne:"D"},
          }
       },
       {
        $group: {
          _id:  "$op_id" ,
          data: { "$addToSet": "$$ROOT" }
        }
      },
        {
          $project: {
            ExamData:"$data.ExamData",
            actcount:"$data.ExamData.quest_status",
           count: { $sum: 1 }
            }
        }
      ])
            if (!Operator){
                 return jsend(404,"Operator Not Found !!!");
            }else{
                const count = Operator.length;
            return jsend(200, "data received Successfully", 
                { count, Operator });
            }
        } catch (error) {
            logger.error(`Error at Get All Active Operator - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Get All InActive Operator
    getAllInactiveSchoolOperator: async (req, res, next) => {
        try {
            const   rows  = await SchoolOperator.find({
                op_status: "N",
               schoolid: req.payload.user.id
            }).sort({ op_type: 1 });
            if (!rows) {
               return jsend(404,"Operator Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200, "data received Successfully", 
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
                    schoolid: req.payload.user.id,
            });
            if (!Operator){
                 return jsend(404,"Operator Not Found !!!");
            }else{
                const count = Operator.length
            return jsend(200, "data received Successfully", 
                { count,Operator });
            }
        } catch (error) {
            logger.error(`Error at Get Operator By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 4. Create Operator
    createSchoolOperator: async (req, res, next) => {
        try {
            const { schoolid, op_name, op_uname, op_password, op_type, feat_id, 
                mainCategory, subCategory } = req.payload;
            if (!op_name || !op_uname || !op_password || !op_type || !feat_id)
            return jsend(400, "Please send valid request data");
            const password = Buffer.from(op_password).toString("base64");
            const Operator = await SchoolOperator.findOne({
                op_uname
            });
            if(!Operator){
                const op_id= await SchoolOperator.count()
              const message =   await SchoolOperator.create(
                        {
                            op_id: (op_id) ? Number(op_id) + 1 : 1,
                            schoolid:req.payload.user.id,
                            op_name,
                            op_uname,
                            op_password: password,
                            op_type,
                            feat_id,
                            op_status: "Y",
                            op_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            op_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            main_category_id : String(mainCategory),
                            sub_category_id : String(subCategory)
                         } )  .catch((err) => {
                        console.log(err.message)
                        return jsend(404,"Data Not Found !!!");
                    });    
                       if(message){
                        return jsend(200, "data received Successfully",
                        { message })
                    }
            }else{
                logger.error(`Operator Already Exists`);
                return jsend(201,"Operator Already Exists");
            }
        } catch (error) {
            logger.error(`Error at Create Operator - School : ${error.message}`);
            return jsend(500, error.message);
        }
    },

    // 5. Update Operator By Id
    updateSchoolOperatorById: async (req, res, next) => {
        try {
            const { opId } = req.params;
            if (opId == 0)  return jsend(400, "Please send valid request data");
            const { schoolid, op_name, op_uname, op_password, op_type, feat_id, mainCategory, 
                subCategory } = req.payload;
            if (!op_name || !op_uname || !op_password || !op_type || !feat_id)
            return jsend(404, "Please send valid request data");
            const password = Buffer.from(op_password).toString("base64");
        const result =  await SchoolOperator.findOneAndUpdate(
                    {   op_id: opId, 
                        schoolid: req.payload.user.id ,
                        schoolid,
                        op_name,
                        op_uname,
                        op_password: password,
                        op_type,
                        feat_id,
                        op_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        main_category_id : String(mainCategory),
                        sub_category_id : String(subCategory)
                    }).catch((err) => {
                        return jsend(500, err.message)
                    });
                    if(result){
                        return jsend(200, "data received Successfully",
                        { message: "Updated Success" ,result})
                    }else{
                        return jsend(404,"Please try again after sometime");
                    }
                    } catch (error) {
                      logger.error(`Error at Update Category Status : ${error.message}`);
                        return jsend(500, error.message)
            }
        },

    // 6. Update 'Inactive / Active / Delete'
    updateInactiveById: async (req, res, next) => {
        try {
            const { opId, status } = req.payload;
            if (!opId || !status) return jsend(400, "Please send valid request data");
      const result = await SchoolOperator.findOneAndUpdate(
                    {   op_id: opId, 
                        schoolid: req.payload.user.id , 
                         op_status: status }
                 ).catch((err) => {
                    return jsend(500, err.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success",result })
                }else{
                    return jsend(404,"Please try again after sometime");
                }
              } catch (error) {
                 logger.error(`Error at Update Category Status : ${error.message}`);
                    return jsend(500, error.message)
        }
    },
    
    //7.GetAllOperator
    getAllOperator: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  Operator = await SchoolOperator.aggregate([
                {
                    "$match": {
                      op_status:status
                    }
                },
                { $sort: { op_name: 1} }
            ])
            if (!Operator){ 
                return jsend(404,"Operator Not Found !!!");
        }else{
            return jsend(200,"data received Successfully",
                { count: Operator.length, Operator });
        }
        } catch (error) {
            logger.error(`Error at Get All Active Operator : ${error.message}`);
            return jsend(500,error.message);
        }
    },
};
