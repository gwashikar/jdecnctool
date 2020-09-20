/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your dashboard ViewModel code goes here
 */
define(['accUtils', 'knockout', 'ojs/ojarraydataprovider', 'ojs/ojknockout',
  'ojs/ojtable', 'ojs/ojaccordion', 'ojs/ojbutton', 'ojs/ojlabel',
  'ojs/ojinputtext', 'ojs/ojinputtext', 'ojs/ojlabel',
  'ojs/ojformlayout', 'ojs/ojlabelvalue'],
  function (accUtils, ko, ArrayDataProvider) {
    function DashboardViewModel() {
      let self = this;

      this.jdeLoginId = ko.observable();
      this.jdeLoginPassword = ko.observable();
      this.htmlServerURL = ko.observable();
      this.aisServerURL = ko.observable();
      this.jdeServerManagerURL = ko.observable();
      this.jdecnctoolServerURL = ko.observable("http://localhost:8888");
      /* Get defaults */
      fetch(this.jdecnctoolServerURL() + "/jdecnctool/api/v1.0/defaults")
        .then(response => response.json())
        .then((result) => {
          self.jdeServerManagerURL(result.defaultServerManager);
          self.htmlServerURL(result.defaultHtmlServer);
          self.aisServerURL(result.defaultAisServer);
          self.jdeLoginId(result.defaultUser);
        });

      var deptArray = [{ DepartmentId: 3, DepartmentName: 'ADFPM 1001 neverending', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 5, DepartmentName: 'BB', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 40, DepartmentName: 'Human Resources1', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 50, DepartmentName: 'Administration2', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 60, DepartmentName: 'Marketing3', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 70, DepartmentName: 'Purchasing4', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 80, DepartmentName: 'Human Resources5', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 90, DepartmentName: 'Human Resources11', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 100, DepartmentName: 'Administration12', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 110, DepartmentName: 'Marketing13', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 120, DepartmentName: 'Purchasing14', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 130, DepartmentName: 'Human Resources15', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 1001, DepartmentName: 'ADFPM 1001 neverending', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 1009, DepartmentName: 'BB', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 1011, DepartmentName: 'Administration', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 2011, DepartmentName: 'Marketing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 3011, DepartmentName: 'Purchasing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 4011, DepartmentName: 'Human Resources1', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 5011, DepartmentName: 'Administration2', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 6011, DepartmentName: 'Marketing3', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 7011, DepartmentName: 'Purchasing4', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 8011, DepartmentName: 'Human Resources5', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 9011, DepartmentName: 'Human Resources11', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 10011, DepartmentName: 'Administration12', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 11011, DepartmentName: 'Marketing13', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 12011, DepartmentName: 'Purchasing14', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 13011, DepartmentName: 'Human Resources15', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 14011, DepartmentName: 'ADFPM 1001 neverending', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 15011, DepartmentName: 'BB', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 21022, DepartmentName: 'Administration', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 22022, DepartmentName: 'Marketing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 23022, DepartmentName: 'Purchasing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 24022, DepartmentName: 'Human Resources1', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 25022, DepartmentName: 'Administration2', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 26022, DepartmentName: 'Marketing3', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 27022, DepartmentName: 'Purchasing4', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 28022, DepartmentName: 'Human Resources5', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 29022, DepartmentName: 'Human Resources11', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 310022, DepartmentName: 'Administration12', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 311022, DepartmentName: 'Marketing13', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 312022, DepartmentName: 'Purchasing14', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 313022, DepartmentName: 'Human Resources15', LocationId: 200, ManagerId: 300 }];
      this.dataprovider = new ArrayDataProvider(deptArray, { keyAttributes: 'DepartmentId', implicitSort: [{ attribute: 'DepartmentId', direction: 'ascending' }] });

      this.validateSetup = function (event) {


        async function pingJdeCncServer(page, jdeUrl, doorlock, doorkey) {

        }

        async function loginToJDE(page, jdeUrl, doorlock, doorkey) {
          await page.goto(jdeUrl, { waitUntil: 'networkidle0' });
          await page.type('input[name=User]', doorlock);
          await page.type('input[name=Password]', doorkey);
          await page.click('input[type="submit"]');
          await page.waitForSelector('#drop_mainmenu');
        }


        async function loginToServerManager(page, serverManagerUrl, doorlock, doorkey) {
          await page.goto(serverManagerUrl, { waitUntil: 'networkidle0' });
          await page.type('input[name=j_username]', doorlock);
          await page.type('input[name=j_password]', doorkey);
          await page.click('input[type="submit"]');
          await page.waitForSelector('#viewSelect');
          await page.waitForSelector('a[href="/manage/logon?action=logout"]');
        }


        async function logoutFromJDE(page) {
          await page.click('#userSessionDropdownArrow');
          await page.waitForSelector('#logoutIcon');
          await page.click('#logoutIcon');
        }

        async function logoutFromServerManager(page) {
          await page.click('a[href="/manage/logon?action=logout"]');
        }

        (async () => {
          const browser = await puppeteer.launch({ headless: false, slowMo: 10 });
          const page = await browser.newPage();
          await page.setViewport({
            width: 800,
            height: 1000,
            deviceScaleFactor: 1
          });

          await page.goto(self.htmlServerURL());
          await loginToJDE(page, self.htmlServerURL(), self.jdeLoginId(), self.jdeLoginPassword());
          await page.screenshot({ path: "validate_setup.png" });
          await logoutFromJDE(page);

          await page.goto(self.jdeServerManagerURL());
          await loginToServerManager(page, self.jdeServerManagerURL(), self.jdeLoginId(), self.jdeLoginPassword());
          await page.screenshot({ path: "servermanager_setup.png" });
          await logoutFromServerManager(page);

          await browser.close();
        })();
      }.bind(this);

      this.buttonClick = function (event) {
        console.log(event.currentTarget.id);
        (async () => {
          const browser = await puppeteer.launch({ headless: false });
          const page = await browser.newPage();
          await page.goto("https://example.com");
          await page.screenshot({ path: "example.png" });

          await browser.close();
        })();

      }.bind(this);

      // Below are a set of the ViewModel methods invoked by the oj-module component.
      // Please reference the oj-module jsDoc for additional information.

      /**
       * Optional ViewModel method invoked after the View is inserted into the
       * document DOM.  The application can put logic that requires the DOM being
       * attached here.
       * This method might be called multiple times - after the View is created
       * and inserted into the DOM and after the View is reconnected
       * after being disconnected.
       */
      this.connected = () => {
        accUtils.announce('Dashboard page loaded.', 'assertive');
        document.title = "Dashboard";
        // Implement further logic if needed
      };

      /**
       * Optional ViewModel method invoked after the View is disconnected from the DOM.
       */
      this.disconnected = () => {
        // Implement if needed
      };

      /**
       * Optional ViewModel method invoked after transition to the new View is complete.
       * That includes any possible animation between the old and the new View.
       */
      this.transitionCompleted = () => {
        // Implement if needed
      };
    }

    /*
     * Returns an instance of the ViewModel providing one instance of the ViewModel. If needed,
     * return a constructor for the ViewModel so that the ViewModel is constructed
     * each time the view is displayed.
     */
    return DashboardViewModel;
  }
);
