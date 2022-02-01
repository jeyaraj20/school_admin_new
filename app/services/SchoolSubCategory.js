"use strict";

const serviceLocator = require("../lib/service_locator");
const jsend = serviceLocator.get("jsend");
const createError = require("http-errors");
const moment = serviceLocator.get("moment"); 
const logger = serviceLocator.get("logger");
const mongoose = serviceLocator.get("mongoose"); 
const SchoolExams = mongoose.model("tbl__schoolexam");
const SchoolQuestion = mongoose.model("tbl__schoolquestion");
const SchoolQuestionCategory =mongoose.model("tbl__school_question_category");
module.exports = {

    // 1. Get All Active SubCategory
    getAllActiveSchoolSubCategory: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  rows = await SchoolQuestionCategory.find({
                    attributes: ["cat_id", "pid", "cat_name", "cat_slug",
                        "cat_code", "cat_desc", "cat_pos"],
                        cat_status: status,
                        pid: { $ne: 0 },
                        schoolid: req.payload.user.id
                }).sort({ cat_pos: 1 })
            if (!rows){
                 return jsend(404,{ category: "Sub Category Not Found !!!" });
            }
            const category = await SchoolQuestionCategory.find(
                {
                        attributes: ["cat_id", "cat_name"],
                        pid: 0,
                       schoolid: req.payload.user.id
                });
            const  waitingquestioncount = await SchoolQuestion .aggregate([
                        {
                        "$match": {
                           "quest_status":"W",
                           "schoolid":req.payload.user.id
                          }
                     },
                        {"$group": {
                            "_id": "$sub_id",
                           "data": { "$addToSet": "$$ROOT" }
                     }
                    },
                        {$project: {
                           sub_id: { $sum: 1 },
                            waitingcount:"$data.sub_id"
                          }
                        }
                   ])
            const  activequestioncount = await SchoolQuestion .aggregate([
                {
                   "$match": {
                       "quest_status":"Y",
                    "schoolid":req.payload.user.id
                   }
                },
                   {"$group": {
                              "_id": "$sub_id",
                              "data": { "$addToSet": "$$ROOT" }
                             }},
                {
                  $project: {
                    sub_id: { $sum: 1 },
                    activecount:"$data.sub_id"
                    }
                }
              ])
           return jsend(200,"data received Successfully", {
             count: rows.length, subcategory: rows,
             count_: category.length,category: category,
             counts: waitingquestioncount.length, waitingquestioncount: waitingquestioncount, 
             count__: activequestioncount.length, activequestioncount: activequestioncount
            });
        } catch (error) {
            logger.error(`Error at Get All Active SubCategory - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 2. Create SubCategory By Id
    createSchoolSubCategoryById: async (req, res, next) => {
        try {
            const { cat_name, cat_code, cat_desc, pid } = req.payload;
            if (!cat_name || !cat_code || !cat_desc || !pid)
            return jsend(400, "Please send valid request data")
            const exist = await SchoolQuestionCategory.find({
                 cat_name, 
                 cat_code, 
                 schoolid:req.payload.user.id, 
              }).catch((err) => {
                  return jsend(500, err.message)
              });
              if(exist.length>0){
                throw createError.Conflict(`${cat_name} - Exam Code Already Exists`);
            }else{
                const cat_id = await SchoolQuestionCategory.count()
                const created= new SchoolQuestionCategory({
                    cat_id: (cat_id) ? Number(cat_id) + 1 : 1,
                    cat_name,
                    cat_code,
                    cat_desc,
                    pid,
                    schoolid: req.payload.user.id,
                    cat_pos: 0,
                    cat_slug: "",
                    cat_image: "",
                    cat_status: "Y",
                    cat_dt: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
            });
            created.save()
            if (!created){
                throw createError.Conflict(
                    `Categrory - '${cat_name}' with Code - '${cat_code}' Already Exists !!!` );
            }else{
            return jsend(200,"data received Successfully", 
                { category:created });
            }}
        } catch (error) {
            logger.error(`Error at Create SubCategory By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 3. Get Category By Id
    getSchoolSubCategoryById: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == 0) return jsend(400, "Please send valid request data");
            const  category = await SchoolQuestionCategory .aggregate([
                {
                   "$match": {
                       "cat_status":"Y",
                   }},
                    { '$lookup': {
                       'from': "tbl__school_question_category",
                       'localField': 'cat_id',
                       'foreignField': 'pid',
                       'as': 'ExamData'
                     }},                      
                      { "$unwind": "$ExamData" },     
                    {
                   "$match": {
                       "ExamData.cat_status":"Y",
                       "ExamData.schoolid":req.payload.user.id,
                       "ExamData.cat_id":catId
                   }},
                {
                  $project: {
                    sub_id: { $sum: 1 },
                    MainCategory:"$cat_name", SubCategory:"$ExamData.cat_name",
                    UniqueCode:"$ExamData.cat_code", Description:"$ExamData.cat_desc",
                    Catid:"$ExamData.cat_id",Pid:"$cat_id"
                    }
                }
              ])
            if (!category){
                 return jsend(404,"Category Not Found !!!");
            }else{
                const count = category.length
            return jsend(200,"data received Successfully", 
                {count, category });
            }
        } catch (error) {
            logger.error(`Error at Get Category By Id - School : ${error.message}`);
            return jsend( 500,error.message);
        }
    },

    // 4. Update Sub Category By Id
    updateSchoolSubCategoryById: async (req, res, next) => {
        try {
            const { pid } = req.params;
            const { cat_name, cat_code, cat_desc } = req.payload;
      const result =  await SchoolQuestionCategory.findOneAndUpdate(
                {   cat_id: pid, 
                    schoolid: req.payload.user.id ,
                    cat_name,
                    cat_code,
                    cat_desc,
                    cat_lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                }).catch((err) => {
                    return jsend(500, err.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success"})
                }else{
                    return jsend(404,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Update Sub Category By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 5. Update 'Inactive'
    updateInactiveById: async (req, res, next) => {
        try {
            const { catId, status } = req.payload;
            if (!catId || !status) return jsend(400, "Please send valid request data");
            const result =  await SchoolQuestionCategory.findOneAndUpdate(
                { cat_status: status },
                { cat_id: catId, 
                   schoolid:req.payload.user.id,
                 }
                ).catch((err) => {
                    return jsend(500, err.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success",result })
                }else{
                    return jsend(500,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Update Sub Category Status - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Update 'Delete'
    updateSchoolDeleteById: async (req, res, next) => {
        try {
            const { catId } = req.payload;
            if (!catId)return jsend(400, "Please send valid request data");
            const result = await SchoolQuestionCategory.findOneAndUpdate(
                {   cat_id: catId, 
                    schoolid: req.payload.user.id, 
                    cat_status: "D" 
                }).catch((err) => {
                    return jsend(500, err.message)
                });
                if(result){
                    return jsend(200, "data received Successfully",
                    { message: "Updated Success",result })
                }else{
                    return jsend(500,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Delete Sub Category By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    
    // 7. Get All Inactive SubCategory
    getAllInActiveSchoolSubCategory: async (req, res, next) => {
        try {
            const  category = await SchoolQuestionCategory .aggregate([
                {
                   "$match": {
                       "cat_status":"Y",
                   }
                },
                { '$lookup': {
                       'from': "tbl__school_question_category",
                       'localField': 'cat_id',
                       'foreignField': 'pid',
                       'as': 'ExamData'
                     }},                      
                      { "$unwind": "$ExamData" },     
                { "$match": {
                        "ExamData.cat_status":"N",
                        "ExamData.schoolid":req.payload.user.id,
                   }
                    },
                {
                  $project: {
                    sub_id: { $sum: 1 },
                    MainCategory:"$cat_name", SubCategory:"$ExamData.cat_name",
                    UniqueCode:"$ExamData.cat_code",Description:"$ExamData.cat_desc",
                    Catid:"$ExamData.cat_id",Pid:"cat_id"
                    }
                }
              ])
            if (!category) {
               return jsend(404,"SubCategory Not Found !!!");
            }else{
            const count = category.length;
            return jsend(200,"data received Successfully", 
                { count, category });
            }
        } catch (error) {
            logger.error(`Error at Get All Inactive SubCategory - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 8. Get QBank Sub Category Count Only
    getSchoolSubCategoryCount: async (req, res, next) => {
        try {
            const { cat_status } = req.params;
           if (cat_status == null) return jsend(400, "Please send valid request data");
        //  const count = 0;
        const   count = await SchoolQuestionCategory.count({
                cat_status:cat_status,
                 pid: { $ne: 0 }, 
                 schoolid: req.payload.user.id
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            return jsend(200, "data received Successfully", { count });
        } catch (error) {
            logger.error(`Error at Get QBank Sub Category Count Only : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //9.Get All Active SubCategory Alone
    getAllActiveSubCategoryAlone: async (req, res, next) => {
        try {
            const { status } = req.params;
            const  rows  = await SchoolQuestionCategory.find(
                {
                    attributes: ["cat_id", "pid", "cat_name", "cat_slug",
                        "cat_code", "cat_desc"],
                        cat_status: status,
                        pid: { $ne: 0 },
                }).sort({cat_pos:1})
            if (!rows){
                 return jsend(404,{ category: "Sub Category Not Found !!!" });
            }
            const category = await SchoolQuestionCategory.find(
                {
                    attributes: ["cat_id", "cat_name"],
                        cat_status: status,
                        pid: 0
                });
            if (!rows) {
                return jsend(500,"ActiveSubCategory Not Found !!!");
            }
            else{
                const Count = rows.length
                const count = category.length
            return jsend(200, "data received Successfully",
            {Count, subcategory: rows,count, category: category });
            }
        } catch (error) {
            logger.error(`Error at Get All Active SubCategory : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //10.Get SubCategory By CatId
    getSubCategoryByCatId: async (req, res, next) => {
        try {
            const { catId } = req.params;
            if (catId == 0) return jsend(400, "Please send valid request data");
            const subcategory = await SchoolQuestionCategory .aggregate([
                {
                   "$match": {
                     pid:catId,
                      cat_status:"Y"
                   }
                },
                { $sort: { cat_name: 1} },
                {
                  $project: {
                    sub_id: { $sum: 1 },
                    MainCategory:"$cat_name", SubCategory:"$ExamData.cat_name",Catid:"$ExamData.cat_id",
                    UniqueCode:"$ExamData.cat_code", Description:"$ExamData.cat_desc", Pid:"$cat_id"
                    }
                }
              ])
            if (!subcategory) {
                return jsend(404,"Sub Category Not Found !!!");
            }else{
                const count = subcategory.length
            return jsend(200,"data received Successfully", 
                {count, subcategory });
            }
        } catch (error) {
            logger.error(`Error at Get Sub Category By CatId : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    //11.Get Search Result
    getSearchResult: async (req, res, next) => {
        try {
            const { searchString, cat_id, subcat_id, status } = req.payload;
            if (searchString == null || cat_id == null) return jsend(400, "Please send valid request data");
         //  if (!!searchString) searchString = `%${searchString}%`;
         //   if (!searchString) searchString ={$regex : '.*'+searchString+'.*'};
         if (!searchString) searchString = { $text: { $search: "searchString" } }
           let conditions;
            if (!searchString && !cat_id) {
              //  conditions = `(cat_name LIKE '${searchString}' OR cat_code LIKE '${searchString}') AND pid = '${cat_id}'`;
              const  conditions  = await SchoolQuestionCategory.find({
                  cat_name:searchString,
                   cat_code:searchString ,
                   pid:cat_id })
             // console.log(conditions)
            } else {
               // conditions = `(cat_name LIKE '${searchString}' OR cat_code LIKE '${searchString}') OR pid = '${cat_id}'`;
               const  conditions  = await SchoolQuestionCategory.find( {
                cat_name:searchString,
                cat_code:searchString,
                   pid:cat_id})
               //console.log(conditions)
            }
            if (subcat_id && subcat_id!='M') { 
                //  conditions = `(cat_name LIKE '${searchString}' OR cat_code LIKE '${searchString}') OR pid = '${cat_id}' and cat_id = '${subcat_id}'`;
              const conditions   = await  SchoolQuestionCategory.find({
                  cat_name:searchString,
                  cat_code:searchString,
                  pid:cat_id,
                  cat_id:subcat_id
                })
               // conditions.save()
           //  console.log(conditions)
               }else { 
                   conditions
             }
   const  subcategory = await SchoolQuestionCategory.aggregate([
                      {
          "$match": {
               cat_status: status,
                      pid:{$ne:"0"},
                     conditions
                        }
                    },  
                {
                  $project: {
              cat_id:"$cat_id",pid:"$pid",cat_name:"$cat_name",
              cat_slug:"$cat_slug",cat_code:"$cat_code",
              cat_desc:"$cat_desc",
                  }
                }
              ])
            if (!subcategory) {
                return jsend(400,{ category: "Sub Category Not Found !!!" });
            }
            const category = await SchoolQuestionCategory.find(
                {
                   // attributes: ["cat_id", "cat_name"],
                        pid: "0"
                });
               const  waitingquestioncount = await SchoolQuestion.aggregate([
                      {
                      "$match": {
                        quest_status: 'W'
                                }
                        },  
                 {
                     $group: {
                         _id: { name1: "$sub_id" },
                        data: { "$addToSet": "$$ROOT" }
                       }
                 },
                {
                  $project: {waitingcount:[{
                       waitingcount:"$data.sub_id",
                        sub_id : { $sum: 1 }
                }]}
                }
              ])
         
               const  activequestioncount = await SchoolQuestion.aggregate([
                      {
          "$match": {
            quest_status: 'Y'
          }
        },  
                 {
          $group: {

            _id: { name1: "$sub_id" },
            data: { "$addToSet": "$$ROOT" }
          }
           },
                {
                  $project: {activecount:[{
              activecount:"$data.sub_id",
              sub_id : { $sum: 1 }
                   } ]}
                }
              ])
            return jsend(200,"data received Successfully",{
             count: subcategory.length, subcategory,
             categoryCount: subcategory.length, category: category,
             waitingquestionCount: waitingquestioncount.length,
             waitingquestioncount: waitingquestioncount,
             activequestionCount: activequestioncount.length, 
             activequestioncount: activequestioncount
            });
        } catch (error) {
            logger.error(`Error at Exam Sub Category Search Result : ${error.message}`);
            return jsend(500,error.message);
        }
    },
    
    
};
