
"use strict";

const serviceLocator = require("../lib/service_locator");
const XLSX = require("xlsx");
const fs = serviceLocator.get("fs");
const path = serviceLocator.get("path");
const jsend = serviceLocator.get("jsend");
const createError = require("http-errors");
const logger = serviceLocator.get("logger");
const moment = serviceLocator.get("moment"); 
const multer = serviceLocator.get("multer");
const mongoose = serviceLocator.get("mongoose");
const trimRequest = serviceLocator.get('trimRequest');
const helper = serviceLocator.get("imageFilter");
const School = mongoose.model("tbl__school");
const SchoolStudent = mongoose.model("tbl__school_student");
var uploadPath = __dirname + "/uploads/";
console.log( __dirname)
// const crypto = require("crypto");


//-------------------------- Multer Part Start ----------------------------------//

// // Ensure Questions Directory directory exists
var homeCategoryDir = path.join(process.env.schoolStudentsExcel);
//fs.existsSync(homeCategoryDir) || fs.mkdirSync(homeCategoryDir);

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, process.env.schoolStudentsExcel);
    },
    filename: (req, file, callBack) => {
        callBack(null, `file-${Date.now()}${path.extname(file.originalname)}`);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: helper.ExcelFilter,
    limits: { fileSize: "2mb" },
}).fields([
    {
        name: "excel",
        maxCount: 1,
    },
]);

//-------------------------- Multer Part End ---------------------------------------//

module.exports = {
    // 1. Get All Student
    getAllStudent: async (req, res, next) => {
        try {
            const { stud_status } = req.params;
            if (stud_status == 0) return jsend(400, "Please send valid request data");
            const   rows  = await SchoolStudent.find({
                 stud_status: stud_status,
                 school_id: req.payload.user.schoolid 
            }).sort({ stud_regno: 1 })
            .catch((err) => {
               return jsend(500,err.message);
            });
            if (!rows){
                return jsend ( 404,"Student Not Found !!!");
            }else{
                const count = rows.length
            return jsend(200,"data received Successfully", 
                { count, Student: rows });
            }
            } catch (error) {
                  logger.error(`Error at Get All Student - School : ${error.message}`);
                            return jsend(500,error.message);
        }
    },

    // 2. Get Student By Id
    getStudentById: async (req, res, next) => {
        try {
            const { stud_id, school_id } = req.payload;
            if (stud_id == 0 || school_id == 0)  return jsend(400, "Please send valid request data");
            const Student = await SchoolStudent.findOne({
                 stud_id:stud_id, 
                 school_id :school_id,
            }).catch((err) => {
                return jsend(400, "Please send valid request data");
            });
            if (!Student){
                 return jsend(404,{ message: "Student Not Found !!!" });
            }else{
                const count = Student.length
            return jsend(200,"data received Successfully", 
                { count,Student });
            }
            } catch (error) {
                   logger.error(`Error at Get Student By Id - School : ${error.message}`);
                       return jsend(500,error.message);
        }
    },

    // 3. Create Many Student
    createBulkStudent: async (req, res, next) => {
        try {
            const { students, school_id, ipaddress, category_id } = req.payload;
            if (!students || !school_id || !ipaddress || !category_id)
            return jsend(400, "Please send valid request data");
            let alreadyExists = [];
            for (let val of students) {
                console.log("Val ===>", val);
                // Check if the student exist or not
                const studCount = await SchoolStudent.count({
                    $or:[{stud_email: val.Email,stud_mobile: val.Mobile }]
                }).catch((err) => {
                    return jsend(400, "Please send valid request data");
                });
                console.log("studCount", studCount);
                // If, Not Exist
                if (studCount == 0) {
                    // OTP and Password for Student
                    const otpNo = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
                    const stud_pass = Math.random().toString(36).slice(-6).toLocaleUpperCase();
                    let studPassword = Buffer.from(stud_pass).toString("base64");
                    console.log("OTP", otpNo, "Password", studPassword);
                    const examExist = await SchoolStudent.find({
                        school_id: school_id,
                          exam_status:{ $ne: "D" },
                          $or: [
                            { stud_email: val.Email },
                            { stud_mobile: val.Mobile },
                            { stud_regno: val.RegisterNo},
                        ],
                        }
                    ).catch((err) => {
                        return jsend(400, "Please send valid request data");
                    });
                    if(examExist && examExist.length>0){
                        throw createError.Conflict(`${exam_code} - Exam Code Already Exists`);
                    }else{
                        const exam= examExist[0];
                    // Add Student to tbl__school_student
                    const  examData = new SchoolStudent({
                            category_id,
                            stud_regno: val.RegisterNo,
                            stud_fname: val.FirstName,
                            stud_lname: val.LastName,
                            stud_email: val.Email,
                            stud_mobile: val.Mobile,
                            stud_gender: val.Gender,
                            school_id,
                            mob_otp: otpNo,
                            otp_status: "Y",
                            stud_pass: studPassword,
                            edu_qual: "",
                            med_opt: "",
                            country_id: "0",
                            state_id: "0",
                            city_id: "0",
                            parent_name: "",
                            state: "",
                            district: "",
                            location: "",
                            address: "",
                            pincode: "0",
                            parent_relation: "",
                            parent_mobile: "0",
                            stud_image: "",
                            stud_dob:  moment(Date.now()).format("YYYY-MM-DD"),
                            stud_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                            stud_status: "Y",
                            ipaddress,
                            lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                    }).catch((err) => {
                        return jsend(500,err.message);
                    });
                    examData.save()

                    if (examData) {
                        // Send Mail
                        helper.SendPasswordMail(student.stud_email, "Question Cloud", stud_pass);
                        // Send SMS
                        helper.SendOtpSms(student.stud_mobile, stud_pass, val.FirstName);
                    } else {
                        alreadyExists.push(val);
                      throw createError.Conflict(`${stud_fname} ${stud_lname} Already Exists`);
                    }}
                } else {
                    alreadyExists.push(val);
                 throw createError.Conflict(`${stud_fname} ${stud_lname} - Already Exists`);
                }
            }
            if (alreadyExists.length > 0) {
                return jsend(404,{
                    status: false,
                    message: "Some Students Already Exists",
                    students: alreadyExists,
                });
            } else {
                return jsend(200,"data received Successfully",
                    { status: true, message: "All Students Uploaded Successfully !!" });
            }
        } catch (error) {
            logger.error(`Error at Create Many Student - School : ${error.message}`);
            return jsend(error.message);
        }
    },

    // 4. Update Student
    updateStudent: async (req, res, next) => {
        try {
            const { id } = req.params;
    const {
    category_id,stud_regno,stud_fname,stud_lname,stud_email, 
    stud_mobile,stud_gender,ipaddress,} = req.payload;
     if (
          !category_id || !stud_regno || !stud_fname || !stud_lname ||!stud_email ||!stud_mobile ||
                !stud_gender ||!ipaddress ) return jsend(400, "Please send valid request data");
           const response =  await SchoolStudent.findOneAndUpdate(
                    {
                        school_id:req.payload.user.id,
                        stud_id: id ,
                        category_id,
                        school_id: req.payload.user.id,
                        stud_regno,
                        stud_fname,
                        stud_lname,
                        stud_email,
                        stud_mobile,
                        stud_gender
                    } ).catch((err) => {
                  return jsend(400, "Please try again after sometime");
                });
                if(response){
                    return jsend(200, "data received Successfully", 
                         {message: "Students Updated Success !!!",response})
                }else{
                    return jsend(500,"Please try again after sometime");
                }
        } catch (error) {
            logger.error(`Error at Update Student By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 5. Update 'Inactive / Active / Delete'
    updateStatus: async (req, res, next) => {
        try {
            const { status, stud_id } = req.payload;
            if (!stud_id || !status)return jsend(400, "Please send valid request data");
         const response =  await SchoolStudent.findOneAndUpdate({
                school_id: req.payload.user.id,
                stud_id ,
                stud_status: status 
        } ).catch((err) => {
            return jsend(400, "Please try again after sometime");
          });
          if(response){
              return jsend(200,"data received Successfully", 
                { message: "Students Updated Success !!!",Data:response })
          }else{
              return jsend(500,"Please try again after sometime");
          }
        } catch (error) {
            logger.error(`Error at Update Student Status - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },

    // 6. Read Multi Student (Excel Upload)
    readBulkStudent: async (req, res, next) => {
        const updateProfileImg = req.payload.file;
        

       // if (req.payload.hasOwnProperty("file")) {
            
           /// await helper.ExcelFilter(req, updateProfileImg, async function (err) {
               
                // if (req.fileValidationError) {
                //     return jsend(400, req.fileValidationError);
                // } else if (err) {
                //     return jsend(500, err);
                // } else {
                    console.log(req.payload.path)
                   await fs.readFile(req.payload.path, function (err, data) {
                       
                        if (err) return jsend(500, err);
                        
                        fs.writeFile(uploadPath + "excal.xls", data, function (err) {
                            if (err) return jsend(500, err);
                            else {
           
            //let filePath = path.join(__dirname, "../public/excels/" + req.files.excel[0].filename);
            let filePath = uploadPath +"excal.xls";
            //console.log(path.normalize(filePath));

            var workbook = XLSX.readFile(filePath);
            var sheet_name_list = workbook.SheetNames;
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
   return xlData
                            }
                        })
                    })

                // }
           // })
        
       
    },

    // 7. Download Sample format excel file
    getSampleExcelFile: async (req, res, err) => {
        /* original data */
        var data = [{ RegNo: "", FirstName: "", LastName: "", Email: "", Mobile: "", Gender: "" }];
        /* make the worksheet */
        var ws = XLSX.utils.json_to_sheet(data);

        /* add to workbook */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Students");

        /* generate an XLSX file */
        let exportFileName = `sampleformat.xls`;
        let filePath = path.join(__dirname, "../public/excels/sampleformat.xls");
        XLSX.writeFile(wb, filePath);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader("Content-Disposition", "attachment; filename=" + exportFileName);
        res.sendFile(filePath, function (err) {
            console.log("Error downloading file: " + err);
        });
    },

    // 8. Create One Student
    createStudent: async (req, res, next) => {
        try {
            const school_id =req.payload.user.schoolid;
      const {
         category_id,stud_regno, stud_fname,stud_lname,stud_email,
         stud_mobile,stud_gender, ipaddress } = req.payload;
        if (
             !category_id || !stud_regno ||!stud_fname ||!stud_lname ||
             !stud_email || !stud_mobile ||!stud_gender ||!ipaddress )
             return jsend(404, "Please send valid request data");

            // Check if the student exist or not
            const studCount = await SchoolStudent.count({
                $or: [{ stud_email },
                     { stud_mobile }] 
            }).catch((err) => {
                return jsend(404, "Please send valid request data");
            });
            // If, Not Exist
            if (studCount === 0) {
                // OTP and Password for Student
                const otpNo = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
                const stud_pass = Math.random().toString(36).slice(-6).toLocaleUpperCase();
                let studPassword = Buffer.from(stud_pass).toString("base64");
               console.log("OTP", otpNo, "Password", studPassword);
                const exist = await SchoolStudent.find({
                       $or: [{ stud_email },
                         { stud_mobile }, 
                         { stud_regno }],
                           school_id,
                });
                if(exist.length>0){
                    return jsend(201,
                        `Categrory - '${stud_email}' with Code - '${stud_mobile}' Already Exists !!!`
                    );
                }else{
                    const stud_id = await SchoolStudent.count()
                    const created=new SchoolStudent({
                // Add Student to tbl__school_student
                        stud_id: (stud_id) ? Number(stud_id) + 1 : 1,
                        category_id,
                        school_id:req.payload.user.id,
                        stud_regno,
                        stud_fname,
                        stud_lname,
                        stud_email,
                        stud_mobile,
                        stud_gender,
                        school_id,
                        mob_otp: otpNo,
                        otp_status: "Y",
                        stud_pass: studPassword,
                        edu_qual: "",
                        med_opt: "",
                        country_id: "0",
                        state_id: "0",
                        city_id: "0",
                        parent_name: "",
                        state: "",
                        district: "",
                        location: "",
                        address: "",
                        pincode: "0",
                        parent_relation: "",
                        parent_mobile: "0",
                        stud_image: "",
                        stud_dob: moment(Date.now()).format("YYYY-MM-DD"),
                        stud_date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                        stud_status: "Y",
                        ipaddress,  
                        lastupdate: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
                })
                await created.save()
                if (created) {
                    // Send Mail
                    helper.SendPasswordMail(stud_email, "Question Cloud", stud_pass);
                    // Send SMS
                    helper.SendOtpSms(stud_mobile, stud_pass, stud_fname);
                    return jsend(200,"data received Successfully", 
                        { student:created });
                } else {
                    throw createError.Conflict(`${stud_fname} ${stud_lname} Already Exists`);
                }}
                } else {
                    throw createError.Conflict(`${stud_fname} ${stud_lname} - Already Exists`);
                }
                } catch (error) {
                 logger.error(`Error at Create One Student - School : ${error.message}`);
                      return jsend(500,error.message);
                  }
    },

    //9.stud_mobile
    getStudentBymobileNo: async (req, res, next) => {
        try {
            const { mobileNo } = req.params;
            const Student = await SchoolStudent.findOne({
                stud_mobile:mobileNo, 
            }).catch((err) => {
                return jsend(400, "Please send valid request data!!!");
            });
            if (!Student){
                 return jsend(404,{ message: "Student Not Found !!!" });
            }else{
            return jsend(200,"data received Successfully",
                { Student:Student });
            }
        } catch (error) {
            logger.error(`Error at Get Student By Id - School : ${error.message}`);
            return jsend(500,error.message);
        }
    },
 
};
