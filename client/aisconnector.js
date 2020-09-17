const axios = require('axios');

const AISConnector = new function () {
    /* AIS Service Name constants*/
    this.FORM_SERVICE = "/formservice";
    this.DATA_SERVICE = "/dataservice";
    this.BATCH_FORM_SERVICE = "/batchformservice";
    this.APP_STACK_SERVICE = "/appstack";
    this.PO_SERVICE = "/poservice";
    this.LOG_SERVICE = "/log";
    this.JARGON_SERVICE = "/jargon";
    this.PREFERENCE_SERVICE = "/preference";
    this.WATCHLIST_SERVICE = "/watchlist";
    this.UDO_GETALL_SERVICE = "/udomanager/getallobjects";
    this.UDO_GETKEY_SERVICE = "/udomanager/getobjectbykey";
    this.MEDIA_OBJECT_TEXT = "/file/gettext";
    this.MEDIA_OBJECT_UPDATETEXT = "/file/updatetext";
    this.MEDIA_OBJECT_ADDTEXT = "/file/addtext";
    this.MEDIA_OBJECT_DELETE = "/file/delete";
    this.MEDIA_OBJECT_LIST = "/file/list";
    this.ORCHESTRATOR = "/orchestrator";
    this.SETTINGS = "/settings.ais";
    this.CAPABILITIES = "/capabilities.ais";
    this.SERVICE_VERSION_2 = "v2";
    this.DISCOVER_SERVICE = "/discover";
    this.DISCOVER_NOTIFICATIONS = "/notification/discover";
    this.MONITOR = "/monitor";
    this.REPORT_EXECUTE = "/report/execute";
    this.REPORT_DISCOVER = "/report/discover";
    this.REPORT_STATUS = "/report/status";

    let connectorThis = this;

    // Set this to 'v2' to default to Version 2 AIS Services
    this.AIS_SERVICE_VERSION = "";


    this.AIS_HOST = "aisServerHost";
    this.AIS_PORT = "aisServerPort";


    this.AIS_PROTOCOL = "http";

    this.JAS_SERVER = null;
    this.USER_NAME = "aisServerUserName";
    this.PASSWORD = "aisServerPasword";
    this.ENVIRONMENT = null;
    this.ROLE = null;
    this.DEVICE_NAME = "aisServerDeviceName"
    this.NODE_JS_SERVER = null;

    this.prepareAISCallParameter = function (aisInfo) {

        this.AIS_HOST = aisInfo.aisServerHost;
        this.AIS_PORT = aisInfo.aisServerPort;

        this.USER_NAME = aisInfo.aisServerUserName;
        this.PASSWORD = aisInfo.aisServerPassword;
        this.DEVICE_NAME = aisInfo.aisServerDeviceName;
        /*
        this.JAS_SERVER = null;
        this.ENVIRONMENT = null;
        this.ROLE = null;
        this.NODE_JS_SERVER = null;    
        */
    }

    /* Code to invoke services offered by JDE AIS Server to  */

    //Local developent version of e1 page helper only used for AIS data access

    // Helper methods for application and UBE launch from custom E1 Pages hosted on the JAS server
    // function to expose running an e1 application from an E1 Page for customers
    // appId and formId are required

    this.formInterconnectAvailable = function () {
        if (typeof FISTRUCT !== "undefined") {
            if (FISTRUCT != null) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    this.getFormInterconnectByDesc = function (description) {
        //make sure the FI structure is available, only there when running as an app
        if (formInterconnectAvailable()) {
            for (var i = 0; i < FISTRUCT.length; i++) {
                if (FISTRUCT[i].description == description) {
                    return FISTRUCT[i].value;
                }
            }
        }
    }
    // search up through window tree (exclude the current window) to find the closet window object who has global function with given name defined
    this.getAPIhanddler = function (apiName) {
        console.log("function getAPIhanddler(" + apiName + ") Not Available in Local Development Environment");
    }


    // NOTE: The E1 Page Generator, since version 3.1, contains a copy of this file for reference purposes.
    // Please manually synchronize any changes you make to this file with the copy located here:
    // ..\EclipseProjects\EngineeringTools\E1PagesGenerator\Generator\reference

    this.runE1App = function (appId, formId, version, menuSysCode, taskName, formDSTmpl, formDSData) {
        console.log("function runE1App(" + appId + "," + formId + "," + version + "," + menuSysCode + "," + taskName + "," + formDSTmpl + "," + formDSData + ") Not Available in Local Development Environment");
    }

    //Helper function to set the launchAction to promptForVersion explicitly
    //Use this when you don't want to send that parm into the runE1UBE function
    this.runE1App = function (ubeId, version, promptPO) {
        console.log("function runE1UBEVersion(" + ubeId + "," + version + ", " + promptPO + ") Not Available in Local Development Environment");
    }

    //Helper function to set the launchAction to promptForBlindExecution explicitly
    //Use this when you don't want to send that parm into the runE1UBE function
    this.runE1UBEBlind = function (ubeId, version, promptPO) {
        console.log("function runE1UBEBlind(" + ubeId + ", " + version + ", " + promptPO + ") Not Available in Local Development Environment");
    }

    //function to expose running an e1 ube from an E1 Page for customers
    //Customer must send in at least appId (which is actually the UBE name)
    //Possible launch action values (promptForBlindExecution, promptForVersion, promptForValue, promptForDS)
    this.runE1UBE = function (ubeId, launchAction, version, promptPO) {
        console.log("function runE1UBE(" + ubeId + ", " + launchAction + ", " + version + ", " + promptPO + ") Not Available in Local Development Environment");
    }

    // Wrappers to support existing portal RunOWApp functions
    this.RunOWApp = function (callingFormId) {
        console.log("function RunOWApp(" + callingFormId + ") Not Available in Local Development Environment");
    }

    // Wrapper for backward compatibility of portal RunOWApp
    this.addRunOWAppFI = function (templ, values) {
        console.log("function addRunOWAppFI(" + templ + ", " + values + ") Not Available in Local Development Environment");
    }

    // Function to allow switching to another E1 Page
    this.goToTabByLabel = function (event, label) {
        console.log("function goToTabByLabel(" + event + ", " + label + ") Not Available in Local Development Environment");
    }

    /* Function to return icon information for a particular app/report. 
     */
    this.getIcons = function (appIdArr, formIdArr, pCodeArr, callback, extraInfArr) {
        console.log("function getIcons(" + appIdArr + ", " + formIdArr + ", " + pCodeArr + ", " + callback + ", " + extraInfArr + ") Not Available in Local Development Environment");
    }

    this.iconServiceExists = function () {
        console.log("function iconServiceExists() Not Available in Local Development Environment");
    }

    this.getIconVersion = function () {
        console.log("function getIconVersion() Not Available in Local Development Environment");
    }

    /* This method can be used to execute an E1Task 
     *    E.g.,  runE1Task('3/G01')
     * This API will still execute tasks, even if the fastpath has been disabled.  
     * Commands such as runE1Task('G01') will not work if the fastpath is disabled.
     */
    this.runE1Task = function (str) {
        console.log("function runE1Task(str) Not Available in Local Development Environment");
    }

    /* This method retrives the currently logged in User Id 
     * - the current session must be valid
     * - display system information option must be enabled
     */
    this.getUserId = function () {
        console.log("function getUserId() Not Available in Local Development Environment");
    }

    /* This method retrives the currently logged in User Name
     * - if the current user does not have a full name then the user id is displayed
     * - show name in menu option must be enabled
     */
    this.getUserName = function () {
        console.log("Not Available in Local Development Environment");
    }

    /* This method retrives the currently logged in Environment 
     * - the current session must be valid
     * - display system information option must be enabled
     */
    this.getEnvironment = function () {
        console.log("function getEnvironment() Not Available in Local Development Environment");
    }

    /* This method retrives the currently logged in Role for the user 
     * - the current session must be valid
     * - display system information option must be enabled
     */
    this.getLoginRole = function () {
        console.log(" function getLoginRole() Not Available in Local Development Environment");
    }

    /* This method retrives the currently logged in Role for the user 
     * - the current session must be valid
     * - display system information option must be enabled
     */
    this.getUserLang = function () {
        return '';
        //console.log(" function getUserLang() Not Available in Local Development Environment");
    }

    this.runE1AppWithQuery = function (appId, formId, version, queryWOBNM, formDSTmpl, formDSData, adhocQueryJSON) {
        console.log("function runE1AppWithQuery(" + appId + "," + formId + "," + version + "," + queryWOBNM + "," + formDSTmpl + "," + formDSData + "," + adhocQueryJSON + ") Not Available in Local Development Environment");
    }

    this.getResourcePath = function (resource) {
        var path = "../../";

        if (resource != null) {
            path = path + resource;
        }
        return (path);
    }

    /* This method retrives the user info. object. That object offers access to the following properties: 
     * - userId - object.userId
     * - fullName - object.fullName
     * - role - object.role
     * - env - object.env
     * - servicePack - object.servicePack
     * - lang - object.lang
     * - locale - object.locale
     */
    this.getUserInfo = function () {
        //console.log("Not Available in Local Development Environment");
        var userPreference =
        {
            addressNumber: "6001",
            country: " ",
            dateFormat: "MDE",
            dateSeperator: "/",
            decimalFormat: ".",
            dstRule: "",
            env: "JDV920",
            fullName: "Allen, Ray",
            lang: "en",
            locale: "en",
            role: "*All",
            servicePack: "9.2.1",
            simpleDateFormat: "MM/dd/yyyy",
            timeFormat: "24",
            userId: "JDE",
            userTimeZone: "26",
            e1Lang: "  "
        };
        return userPreference;
    }


    // Set the default AIS Service Version to V2
    this.setAISServiceVersionV2 = function () {
        this.AIS_SERVICE_VERSION = this.SERVICE_VERSION_2;
    }


    /*  
     * Call an AIS Service
     */
    this.callAISService = function (input, service, callback) {

        this.AIS_SERVICE_VERSION = this.AIS_SERVICE_VERSION || "";
        if (this.AIS_SERVICE_VERSION == this.SERVICE_VERSION_2 || this.AIS_SERVICE_VERSION == this.SERVICE_VERSION_2.toUpperCase()) {
            this.callAISServiceV2(input, service, callback);
        }
        else {
            this.aisServiceRequest(input, service, false, callback);
        }

    }
    this.callAISServiceV2 = function (input, service, callback) {
        this.AISCall.aisServiceRequest(input, service, false, callback, SERVICE_VERSION_2);
    }

    /*  
     * Call an AIS Orchestration
     */
    this.callAISOrchestration = function (orchestration, input, callback) {

        this.AIS_SERVICE_VERSION = this.AIS_SERVICE_VERSION || "";
        if (this.AIS_SERVICE_VERSION == this.SERVICE_VERSION_2 || this.AIS_SERVICE_VERSION == this.SERVICE_VERSION_2.toUpperCase()) {
            this.callAISOrchestrationV2(orchestration, input, callback);
        }
        else {
            this.callOrchestration(orchestration, input, callback);
        }

    }

    this.callAISOrchestrationV2 = function (orchestration, input, callback) {
        this.callOrchestration(orchestration, input, callback, this.SERVICE_VERSION_2);
    }

    this.isAppLaunch = function () {
        // alwasy indicate false for running in app (Developer Can Change it Here to Test)
        return false;
    }

    /*  
     * Call node JS Script
     */
    this.callNodeJS = function (nodescript, input, callback) {
        this.AISCall.aisServiceRequest(input, nodescript, true, callback);
    }

    this.settings = function (callback) {
        this.url = this.AIS_PROTOCOL + "://" + this.AIS_HOST + ":" + this.AIS_PORT;
        axios.get(this.url + "/jderest/defaultconfig")
            .then(response => {
                let responseData = response.data;
                responseData.capabilityList = null;
                callback(JSON.stringify(responseData));
            })
            .catch(e => {
                console.log("Error: ", e);
            })
            .finally(() => {
                // console.log("Done!");
            });
    };

    this.capabilites = function (callback) {
        this.url = this.AIS_PROTOCOL + "://" + this.AIS_HOST + ":" + this.AIS_PORT;
        axios.get(this.url + "/jderest/defaultconfig")
            .then(response => {
                callback(JSON.stringify(response.data));
            })
            .catch(e => {
                console.log("Error: ", e);
            })
            .finally(() => {
                // console.log("Done!");
            });
    };


    this.login = function (callback) {
        let self = this;
        //console.log('Start Log In-----------: ' +  + new Date().getTime());
        this.loginCalled = true;
        if (this.loginResponse == null) {
            this.url = this.AIS_PROTOCOL + "://" + this.AIS_HOST + ":" + this.AIS_PORT;
            var input = {
                jasserver: this.JAS_SERVER,
                deviceName: this.DEVICE_NAME,
                environment: this.ENVIRONMENT,
                role: this.ROLE,
                username: this.USER_NAME,
                password: this.PASSWORD
            }
            var postData = JSON.stringify(input);
            axios.post(this.url + "/jderest/tokenrequest", postData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                self.loginResponse = response.data;
                // console.log(this.loginResponse);
                // console.log(JSON.stringify(this.loginResponse));
                //console.log('Logged In-----------: ' + AISCall.loginResponse.userInfo.token);
                callback();
            }).catch(function (error) {
                console.log(error);
            });
        }
    };

    this.logout = function (callback) {
        let self = this;
        if (this.loginResponse != null) {
            var input =
            {
                token: this.loginResponse.userInfo.token
            }

            if (this.JAS_SERVER != null) {
                input.jasserver = this.JAS_SERVER;
            }
            //if not already logging out this token
            if (input.token != this.loggingOutToken && input.token != this.usingToken) {
                this.loggingOutToken = this.loginResponse.userInfo.token;
                this.usingToken = null;
                //console.log('Logging Out-----------: ' + input.token);
                var postData = JSON.stringify(input);

                axios.post(this.url + "/jderest/tokenrequest/logout", postData, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function (response) {
                    self.loginCalled = false;
                    self.loginResponse = null;
                    //console.log('Logged Out-----------: ' + input.token);
                    callback();
                }).catch(function (error) {
                    console.log(error);
                });
            }
        }
    };

    this.callOrchestration = function (orchestration, input, callback, serviceversion) {
        //form url of an orchestration
        service = this.ORCHESTRATOR + "/" + orchestration;
        this.aisServiceRequest(input, service, false, callback, serviceversion);

    }

    this.aisServiceRequest = function (input, service, nodejs, callback, serviceversion) {
        let self = this;

        if (service.includes(this.SETTINGS)) {
            this.settings(callback);
            return;
        }

        if (service.includes(this.CAPABILITIES)) {
            this.capabilites(callback);
            return;
        }

        if (!this.callCount) {
            this.callCount = 0;
        }

        //console.log("aisServiceRequest " + new Date().getTime());
        if (!service.includes(connectorThis.ORCHESTRATOR)) {
            input.aliasNaming = true;
        }

        if (this.loginResponse == null) {
            if (!this.loginCalled) {
                //login not called yet call it now then recall the method
                this.login(function () {

                    self.aisServiceRequest(input, service, nodejs, callback, serviceversion);
                });
            }
            else {
                //wait 1 second and recall the method - login is in progress
                setTimeout(function () {
                    self.aisServiceRequest(input, service, nodejs, callback, serviceversion);
                }, 1000);
            }
        }
        else {
            //console.log("AISCall.loginResponse " + AISCall.loginResponse.userInfo.token);
            if (nodejs) {
                this.nodeJSCall(input, service, function (response) {
                    callback(response);
                    setTimeout(function () {
                        self.logout(function () {
                            //console.log("After Logout");
                        });
                    }, 1000);
                });
            }
            else {
                this.callCount++;
                //                console.log(AISCall.callCount);
                this.serviceCall(input, service, function (response) {
                    callback(response);
                    self.callCount--;
                    //                    console.log(AISCall.callCount);
                    if (self.callCount == 0) {
                        setTimeout(function () {
                            if (self.callCount == 0) {
                                self.logout(function () {
                                    //                                console.log("After Logout");
                                });
                            }
                        }, 8000);
                    }
                }, serviceversion);
            }
        }
    };

    this.serviceCall = function (input, service, callback, serviceversion) {
        let self = this;
        //console.log("service " + new Date().getTime());
        //register token as being used, so it won't be logged out by other concurent calls
        this.usingToken = this.loginResponse.userInfo.token;
        input.token = this.loginResponse.userInfo.token;
        input.jasserver = this.JAS_SERVER;

        //don't call without a token
        if (input.token != null) {
            if (input.deviceName == null) {
                input.deviceName = this.DEVICE_NAME;
            }
            if (this.JAS_SERVER != null) {
                input.jasserver = this.JAS_SERVER;
            }

            var root = "/jderest";
            if (serviceversion) {
                root = root + "/" + serviceversion;
            }
            var postData = JSON.stringify(input);
            axios.post(this.url + root + service, postData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                self.usingToken = null;
                if (typeof input === 'object') {
                    //return the response as an object
                    if (callback && typeof (callback) == "function") {
                        callback(response.data);
                    }
                }
                else {
                    //return the response as a string
                    if (callback && typeof (callback) == "function") {
                        callback(JSON.stringify(response.data));
                    }
                }
            }).catch(function (error) {
                callback(error);
            });
        }
    };

    this.sleepFor = function (sleepDuration) {
        var now = new Date().getTime();
        while (new Date().getTime() < now + sleepDuration) {
            /* do nothing */
        }
    };
}


module.exports = AISConnector;