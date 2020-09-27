const clientConfig = require("config");
const axios = require("axios");
const puppeteer = require('puppeteer');
const { Command } = require('commander');
const log4js = require("log4js");
const jdecnctool = require("jdecnctool-utils");
const AISServerConnector = jdecnctool.AISServerConnector;
const HTMLServerConnector = jdecnctool.HTMLServerConnector;
const moment = require('moment');


const program = new Command();
let logger = log4js.getLogger();

program
    .requiredOption('-ts, --cncToolServerUrl <cncToolServerUrl>', 'JDE CNC Tool Server url')
    .option('-dl, --doorlock <doorLock>', 'door lock name')
    .option('-dk, --doorkey <doorKey>', 'door lock key')
    .option('-th  --testHTML', 'test HTML server')
    .option('-ta  --testAIS', 'test AIS server')
    .option('-f, --filter <filterCriteria>', 'run for matching jde endpoints');

program.parse(process.argv);

axios.get(`${program.cncToolServerUrl}/jdecnctool/api/v1.0/config`)
    .then((result) => {
        return result.data;
    })
    .then(serverConfig => {

        jdecnctool.mergeConfiguration(clientConfig, serverConfig);

        log4js.configure({
            appenders: { jdecnctool: { type: "file", filename: clientConfig.loggerConfig.logFile } },
            categories: { default: { appenders: [clientConfig.loggerConfig.logKey], level: clientConfig.loggerConfig.logLevel } }
        });

        logger = log4js.getLogger(clientConfig.loggerConfig.logKey);

        if (!program.doorlock) {
            program.doorlock = clientConfig.doorlock;
        } else {
            clientConfig.doorlock = program.doorlock;
        }

        if (!program.doorkey) {
            program.doorkey = clientConfig.doorkey;
        } else {
            clientConfig.doorkey = program.doorkey;
        }

        logger.trace('NODE_ENV: ' + clientConfig.util.getEnv('NODE_ENV'));
        logger.trace("filter: ", program.filter);
        logger.trace("doorlock: ", program.doorlock);
        // logger.trace("doorkey: ", program.doorkey);
        logger.trace("CNC Tool Server: " + clientConfig.jdecnctoolServer);
        logger.trace("Client Config JSON: " + JSON.stringify(clientConfig));
        if (program.testHTML) {
            performJdeHTMLServerTesting();
        }
        return serverConfig;
    })
    .then(serverConfig => {
        if (program.testAIS) {
            performJdeAISServerTesting();
        }
        return serverConfig;
    });


function performJdeAISServerTesting() {
    clientConfig.jdeAISServer.jdeAISServerEndPointList.filter(jasInfo => {
        if (program.filter) {
            let flag = false;
            for ([key, val] of Object.entries(jasInfo)) {
                logger.trace(key, val);
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
        clientConfig.jdeAISServer.jdeAISServiceList.forEach(async aisService => {
            // "serviceType":"formservice",
            // "appName": "P574021",
            // "appFormName": "W574021B",
            // "appVersion": "TEU001",
            // "testData":
            if (aisService.serviceType === "formservice") {
                aisInfo.aisServerUserName = program.doorlock;
                aisInfo.aisServerPassword = program.doorkey;
                AISServerConnector.prepareAISCallParameter(aisInfo);
                let resultData;
                resultData = await AISServerConnector.invokeJDEApp(aisService);
                if (resultData.response && resultData.response.status != 200) {
                    console.log(JSON.stringify(resultData));
                }
            } else if(aisService.serviceType === "orchestrator") {
                resultData = await AISServerConnector.invokeJDEOrchestration(aisService);
                if (resultData.response && resultData.response.status != 200) {
                    console.log(JSON.stringify(resultData));
                }
            }
        });
    });

    async function invokeJDEOrchestration(orchestration) {
        return new Promise(resolve => {
            input = { "addressBookNumber": "16487" };
            AISServerConnector.callAISOrchestration(orchestration, input, (data) => {
                resolve(data);
            });
        });
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

            AISServerConnector.callAISService(input, AISServerConnector.FORM_SERVICE, function (formData) {
                resolve(formData);
            });
        });
    }
}

function performJdeHTMLServerTesting() {
    let jasInfoList = clientConfig.jdeHTMLServer.jdeHTMLServerEndPointList.filter(jasInfo => {
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
            headless: clientConfig.puppeteerConfig.headless,
            slowMo: clientConfig.puppeteerConfig.slowMo,
            dumpio: clientConfig.puppeteerConfig.dumpio,
            devtools: clientConfig.puppeteerConfig.devtools
        });
        const page = await browser.newPage();
        page.setDefaultTimeout(clientConfig.pageDefaultTimeout);
        await page.setViewport({
            width: clientConfig.puppeteerConfig.viewportWidth,
            height: clientConfig.puppeteerConfig.viewportHeight,
            deviceScaleFactor: clientConfig.puppeteerConfig.deviceScaleFactor
        });

        // page.on('request', httpRequest => {
        // logger.trace(`REQUEST:${httpRequest.url()}:${httpRequest.url()}`);
        // });

        // page.on('response', httpResponse => {
        // logger.trace(`RESPONSE:${httpResponse.url()}`);
        // });

        await HTMLServerConnector.loginToJDE(page, jasInfo.jdeUrl, program.doorlock, program.doorkey);

        for (let i = 0; i < clientConfig.jdeHTMLServer.jdeAppList.length; i++) {
            let jdeApp = clientConfig.jdeHTMLServer.jdeAppList[i].jdeApp;
            let htmlSelector = clientConfig.jdeHTMLServer.jdeAppList[i].htmlSelector;
            // let startTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a");
            let startTime = new Date();
            await HTMLServerConnector.launchJDEAppOnFastPath(page, jdeApp, htmlSelector);
            await HTMLServerConnector.closeJDEAppUsingCloseButton(page, jdeApp, htmlSelector);
            // let endTime = moment().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a");
            let endTime = new Date();
            logger.debug(`JDE_URL=${jasInfo.jdeUrl},JDE_APP=${jdeApp},START_TIME=${startTime},END_TIME=${endTime},DURATION=${endTime - startTime}`);
            await page.waitForTimeout(clientConfig.puppeteerConfig.waitAfterLaunch);
        }

        await HTMLServerConnector.logoutFromJDE(page);

        let metrics = await page.metrics();

        // logger.trace("Page Matrix Timestamp =", metrics.Timestamp);
        // logger.trace("Page Matrix Documents = ", metrics.Documents);
        // logger.trace("Page Matrix Frames =", metrics.Frames);
        // logger.trace("Page Matrix Nodes = ", metrics.Nodes);
        // logger.trace("Page Matrix TaskDuration = ", metrics.TaskDuration);

        // await page.waitFor(clientConfig.puppeteerConfig.waitBeforClose);

        await browser.close();
        let url = `${clientConfig.jdecnctoolServer}/jdecnctool/api/v1.0/ping`;
        logger.debug("Sending collected data to : " + url);
        axios.get(url).then(response => {
            logger.debug(`Received on ${response.headers.date}} from  ${response.config.url} : ${response.data}`);
        });
    }
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
