const config = require("config");
const axios = require("axios");
const puppeteer = require('puppeteer');
const { Command } = require('commander');
const log4js = require("log4js");
const AISConnector = require("./aisconnector");
const moment = require('moment');

const program = new Command();
let logger = log4js.getLogger();

program
    .option('-f, --filter <filterCriteria>', 'run for matching jde endpoints')
    .option('-dl, --doorlock <doorLock>', 'door lock name')
    .option('-dk, --doorkey <doorKey>', 'door lock key')
    .option('-th  --testHTML', 'test HTML server')
    .option('-ta  --testAIS', 'test AIS server');
program.parse(process.argv);
// console.log(process.argv);


log4js.configure({
    appenders: { jdecnctool: { type: "file", filename: config.loggerConfig.logFile } },
    categories: { default: { appenders: [config.loggerConfig.logKey], level: config.loggerConfig.logLevel } }
});

if (!program.doorlock) {
    program.doorlock = config.doorlock;
}

if (!program.doorkey) {
    program.doorkey = config.doorkey;
}

logger = log4js.getLogger(config.loggerConfig.logKey);

logger.trace('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
logger.trace("filter: ", program.filter);
logger.trace("doorlock: ", program.doorlock);
logger.trace("doorkey: ", program.doorkey);
logger.trace("Eone MPA Server: " + config.jdecnctoolServer);

if (program.testHTML) {
    performJdeHTMLServerTesting();
}

if (program.testAIS) {
    performJdeAISServerTesting();
}

function performJdeAISServerTesting() {
    config.jdeAISServer.jdeAISServerEndPointList.filter(jasInfo => {
        if (program.filter) {
            let flag = false;
            for ([key, val] of Object.entries(jasInfo)) {
                // logger.trace(key, val);
                if (val.includes(program.filter)) {
                    flag = true;
                }
            }
            return flag;
        } else {
            return true;
        }
    }).forEach(async (aisInfo) => {
        logger.trace(aisInfo);
        config.jdeAISServer.jdeAISServiceList.forEach(async aisService => {
            // "serviceType":"formservice",
            // "appName": "P574021",
            // "appFormName": "W574021B",
            // "appVersion": "TEU001",
            // "testData":
            if (aisService.serviceType === "formservice") {
                aisInfo.aisServerUserName =  program.doorlock;
                aisInfo.aisServerPassword = program.doorkey;
                prepareAISCallParameter(aisInfo);
                let formData = await invokeJDEApp(aisService, { itemNumber: "578877", BusinessUnit: "         NCI" });
                console.log(JSON.stringify(formData));

                let orchData = await invokeJDEOrchestration("TestJavaCustomOrch");
                console.log(JSON.stringify(orchData));
            }
        });
    });



async function invokeJDEOrchestration(orchestration) {
    return new Promise(resolve => {
        let benchMark = {};
        benchMark[orchestration] = [];
        benchMark[orchestration].push(new Date());
        input = { "addressBookNumber": "16487" };
        AISConnector.callAISOrchestration(orchestration, input, (data) => {
            resolve(data);
        });        
    })
}


    async function invokeJDEApp(setup, testRecord) {
        return new Promise(resolve => {
            let input =
            {
                formName: setup["appName"] + "_" + setup["appFormName"],
                version: setup["appVersion"],
                formActions: [
                    { command: "SetControlValue", controlID: "17", value: testRecord.itemNumber },
                    { command: "SetControlValue", controlID: "23", value: testRecord.BusinessUnit },
                    { command: "DoAction", controlID: '15' },
                    { command: "DoAction", controlID: "find" }
                ],
            };

            // setAISServiceVersionV2();
            AISConnector.callAISService(input, AISConnector.FORM_SERVICE, function (formData) {
                resolve(formData);
            });
        })
    }
}

function performJdeHTMLServerTesting() {
    let jasInfoList = config.jdeHTMLServer.jdeHTMLServerEndPointList.filter(jasInfo => {
        if (program.filter) {
            let flag = false;
            for ([key, val] of Object.entries(jasInfo)) {
                // logger.trace(key, val);
                if (val.includes(program.filter)) {
                    flag = true;
                }
            }
            return flag;
        } else {
            return true;
        }
    });

    async function forOf() {
        for (const jasInfo of jasInfoList) {
            await performTest(jasInfo);
        }
    }

    forOf();

    async function performTest(jasInfo) {
        logger.trace(`Running bechmark on - ${jasInfo.title} - ${jasInfo.jdeUrl}`);
        const browser = await puppeteer.launch({
            headless: config.puppeteerConfig.headless,
            slowMo: config.puppeteerConfig.slowMo,
            dumpio: config.puppeteerConfig.dumpio,
            devtools: config.puppeteerConfig.devtools
        });
        const page = await browser.newPage();
        page.setDefaultTimeout(config.pageDefaultTimeout);
        await page.setViewport({
            width: config.puppeteerConfig.viewportWidth,
            height: config.puppeteerConfig.viewportHeight,
            deviceScaleFactor: config.puppeteerConfig.deviceScaleFactor
        });

        // page.on('request', httpRequest => {
        // logger.trace(`REQUEST:${httpRequest.url()}:${httpRequest.url()}`);
        // });

        // page.on('response', httpResponse => {
        // logger.trace(`RESPONSE:${httpResponse.url()}`);
        // });

        await loginToJDE(page, jasInfo.jdeUrl, program.doorlock, program.doorkey);

        for (let i = 0; i < config.jdeHTMLServer.jdeAppList.length; i++) {
            let jdeApp = config.jdeHTMLServer.jdeAppList[i].jdeApp;
            let htmlSelector = config.jdeHTMLServer.jdeAppList[i].htmlSelector;
            // let startTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a");
            let startTime = new Date();
            await launchJDEAppOnFastPath(page, jdeApp, htmlSelector);
            await closeJDEAppUsingCloseButton(page, jdeApp, htmlSelector);
            // let endTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a");
            let endTime = new Date();
            logger.debug(`JDE_URL=${jasInfo.jdeUrl},JDE_APP=${jdeApp},START_TIME=${startTime},END_TIME=${endTime},DURATION=${endTime - startTime}`);
            await page.waitFor(config.puppeteerConfig.waitAfterLaunch);
        }

        await logoutFromJDE(page);

        let metrics = await page.metrics();

        // logger.trace("Page Matrix Timestamp =", metrics.Timestamp);
        // logger.trace("Page Matrix Documents = ", metrics.Documents);
        // logger.trace("Page Matrix Frames =", metrics.Frames);
        // logger.trace("Page Matrix Nodes = ", metrics.Nodes);
        // logger.trace("Page Matrix TaskDuration = ", metrics.TaskDuration);

        // await page.waitFor(config.puppeteerConfig.waitBeforClose);

        await browser.close();
        let url = `${config.jdecnctoolServer}/jdecnctool/api/v1.0/ping`;
        logger.debug("Sending collected data to : " + url);
        axios.get(url).then(response => {
            logger.debug(`Received on ${response.headers.date}} from  ${response.config.url} : ${response.data}`);
        });
    }
}

async function loginToJDE(page, jdeUrl, doorlock, doorkey) {
    await page.goto(jdeUrl, { waitUntil: 'networkidle0' });
    await page.type('input[name=User]', doorlock);
    await page.type('input[name=Password]', doorkey);
    await page.click('input[type="submit"]');
    await page.waitForSelector('#drop_mainmenu');
    await page.waitFor(1000);
}

async function  logoutFromJDE(page) {
    await page.click('#userSessionDropdownArrow');
    await page.waitForSelector('#logoutIcon');
    await page.click('#logoutIcon');
    await page.waitFor(1000);
}

async function launchJDEAppOnFastPath(page, appName, htmlSelector) {
    await page.waitForSelector('#drop_mainmenu');
    await page.click('#drop_mainmenu');
    await page.waitForSelector('#TE_FAST_PATH_BOX');
    await page.type('#TE_FAST_PATH_BOX', appName);
    await page.click('a#fastPathButton', { waitUntil: 'networkidle0' });
    const elementHandle = await page.$(
        'iframe[name="e1menuAppIframe"]',
    );
    const frame = await elementHandle.contentFrame();
    await frame.waitForSelector(`form[name="${htmlSelector}"]`, { visible: true });
    await frame.waitForSelector('img#hc_Close', { visible: true });
}

async function closeJDEAppUsingCloseButton(page, appName, htmlSelector) {
    const elementHandle = await page.$(
        'iframe[name="e1menuAppIframe"]',
    );
    const frame = await elementHandle.contentFrame();
    // await frame.waitForSelector('form[name="P0006_W0006B"]', { visible: true });
    await frame.waitForSelector(`form[name="${htmlSelector}"]`, { visible: true });
    await frame.waitForSelector('img#hc_Close', { visible: true });
    await frame.click('img#hc_Close', { waitUntil: 'networkidle0' });
}


function prepareAISCallParameter(aisInfo) {

    AISConnector["AIS_HOST"] = aisInfo.aisServerHost;
    AISConnector["AIS_PORT"] = aisInfo.aisServerPort;

    AISConnector["USER_NAME"] = aisInfo.aisServerUserName;
    AISConnector["PASSWORD"] = aisInfo.aisServerPassword;
    AISConnector["DEVICE_NAME"] = aisInfo.aisServerDeviceName;
    /*
    this.JAS_SERVER = null;
    this.ENVIRONMENT = null;
    this.ROLE = null;
    this.NODE_JS_SERVER = null;    
    */
}

async function studyFrameTree(page, appName) {
    const elementHandle = await page.$(
        'iframe[name="e1menuAppIframe"]',
    );
    const frame = await elementHandle.contentFrame();

    await frame.waitForSelector('form[name="P0006_W0006B"]', { visible: true });
    await frame.waitForSelector('img#hc_Close', { visible: true });
    await frame.click('img#hc_Close');

    function dumpFrameTree(frame, indent) {
        logger.trace(indent + appName + " : " + frame.name() + " ---- " + frame.url());
        for (const child of frame.childFrames()) {
            dumpFrameTree(child, indent + 'Frame --- ');
        }
    }

    dumpFrameTree(frame, "Frame --- ");
}
