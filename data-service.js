let fs = require("fs");
let employees = [];
let departments = [];


//initialization
module.exports.initialize = function(){
    return new Promise((resolve, reject) => {
        try {
            fs.readFile("./data/employees.json", 'utf8',
                (err, data) => {
                    if (err) throw "Failure to read file employees.json!";
                    employees = JSON.parse(data);
                    
                });
            fs.readFile("./data/departments.json", 'utf8',
                (err, data) => {
                    if (err)throw "Failure to read file departments.json!";
                    departments = JSON.parse(data);

                });
        } catch (err) {
            reject("unable to read files.");
        }
        resolve("Read Success");
    })
};


//get All Employees
module.exports.getAllEmployees = function() {
    return new Promise((resolve, reject) => {
        debugger;
        if (employees.length === 0){
            reject("no results returned");
        } 
        else{
            resolve(employees);
        }
    });
};


//get Departments
module.exports.getDepartments = function (){
    return new Promise((resolve, reject) => {
        if (departments.length === 0){
            reject("no results returned");
        } 
        else{
            resolve(departments);
        }
    });
};

//Add Employees
module.exports.addEmployee = function(employeeData){
    return new Promise((resolve, reject) => {
        let isManager
        if (employeeData.isManager == undefined) {
            isManager = false
        } else {
            isManager = true
        }
        const employeeNumber = employees.length + 1
        const employeeObject = {
            "employeeNum": employeeNumber,
            "firstName": employeeData.firstName,
            "lastName": employeeData.lastName,
            "email": employeeData.email,
            "SSN": employeeData.SSN,
            "addressStreet": employeeData.addressStreet,
            "addressCity": employeeData.addressCity,
            "addressState": employeeData.addressState,
            "addressPostal": employeeData.addressPostal,
            "maritalStatus": "single",
            "isManager": isManager,
            "employeeManagerNum": employeeData.employeeManagerNum,
            "status": employeeData.status,
            "department": employeeData.department,
            "hireDate": employeeData.hireDate
        }
        employees.push(employeeObject)
        resolve()
    })
}


//Get Employee by Status
module.exports.getEmployeesByStatus = function(status){
    return new Promise((resolve, reject) => {
        const empStatus= []
        for (let index = 0; index < employees.length; index++) {
            if (employees[index].status == status)
            empStatus.push(employees[index])
        }
        resolve(empStatus)
        if (empStatus.length == 0) reject("employee by status not found")
    })
};



//Get Employee by department
module.exports.getEmployeesByDepartment = function(department){
    return new Promise((resolve, reject) => {
        const empDepartment= []
        for (let index = 0; index < employees.length; index++) {
            if (employees[index].department == department)
            empDepartment.push(employees[index])
        }
        resolve(empDepartment)
        if (empDepartment.length == 0) reject("employee by department not found")
    })
};


//Get Employee by Manager
module.exports.getEmployeesByManager = function(manager){
    return new Promise((resolve, reject) => {
        const empManager = []
        for (let index = 0; index < employees.length; index++) {
            if (employees[index].employeeManagerNum == manager)
            empManager.push(employees[index])
        }
        resolve(empManager)
        if (empManager.length == 0) reject("employee by manager not found")
    })
}


//get Employee by Number
module.exports.getEmployeeByNum = function(value){
    return new Promise((resolve,reject) => {
        var employeeNumber = employees.filter(employee => employee.employeeNum == value);
        if (employeeNumber.length == 0) {
            reject("employee by number not found");
        }
        resolve(employeeNumber);
    })
};


//update employee
module.exports.updateEmployee = function(employeeData){
    return new Promise((resolve, reject) => {
        for (let i = 0; i < employees.length; i++) {
            if (employeeData.employeeNum == employees[i].employeeNum) {
                employees[i].employeeNum = employeeData.employeeNumber,
                    employees[i].firstName = employeeData.firstName,
                    employees[i].lastName = employeeData.lastName,
                    employees[i].email = employeeData.email,
                    employees[i].SSN = employeeData.SSN,
                    employees[i].addressStreet = employeeData.addressStreet,
                    employees[i].addressCity = employeeData.addressCity,
                    employees[i].addressState = employeeData.addressState,
                    employees[i].addressPostal = employeeData.addressPostal,
                    employees[i].maritalStatus = "single",
                    employees[i].isManager = employeeData.isManager,
                    employees[i].employeeManagerNum = employeeData.employeeManagerNum,
                    employees[i].status = employeeData.status,
                    employees[i].department = employeeData.department,
                    employees[i].hireDate = employeeData.hireDate
            }
        }
        resolve();
    })
};