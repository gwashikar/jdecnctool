/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/*
 * Your application specific code will go here
 */
define(['knockout', 'ojs/ojmodule-element-utils', 'ojs/ojknockouttemplateutils', 'ojs/ojcorerouter', 'ojs/ojmodulerouter-adapter', 'ojs/ojknockoutrouteradapter', 'ojs/ojurlparamadapter', 'ojs/ojresponsiveutils', 'ojs/ojresponsiveknockoututils', 'ojs/ojarraydataprovider',
        'ojs/ojoffcanvas', 'ojs/ojmodule-element', 'ojs/ojknockout'],
  function(ko, moduleUtils, KnockoutTemplateUtils, CoreRouter, ModuleRouterAdapter, KnockoutRouterAdapter, UrlParamAdapter, ResponsiveUtils, ResponsiveKnockoutUtils, ArrayDataProvider, OffcanvasUtils) {
     function ControllerViewModel() {

      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

      // Handle announcements sent when pages change, for Accessibility.
      this.manner = ko.observable('polite');
      this.message = ko.observable();
      announcementHandler = (event) => {
          this.message(event.detail.message);
          this.manner(event.detail.manner);
      };

      document.getElementById('globalBody').addEventListener('announce', announcementHandler, false);


      // Media queries for repsonsive layouts
      const smQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      this.smScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      const mdQuery = ResponsiveUtils.getFrameworkQuery(ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      this.mdScreen = ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      let navData = [
        { path: '', redirect: 'tech_team' },
        { path: 'tech_team', detail: { label: 'Tech Team', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'dev_team', detail: { label: 'Dev Team', iconClass: 'oj-ux-ico-contact-group' } },        
        { path: 'dist_team', detail: { label: 'Dist Team', iconClass: 'oj-ux-ico-contact-group' } },        
        { path: 'mfg_team', detail: { label: 'Mfg Team', iconClass: 'oj-ux-ico-contact-group' } },        
        { path: 'finance_team', detail: { label: 'Finance Team', iconClass: 'oj-ux-ico-contact-group' } },
        { path: 'europe_team', detail: { label: 'Europe Team', iconClass: 'oj-ux-ico-contact-group' } },        
        { path: 'apac_team', detail: { label: 'APAC Team', iconClass: 'oj-ux-ico-contact-group' } },                
        { path: 'about', detail: { label: 'About', iconClass: 'oj-ux-ico-information-s' } }
      ];

      // Router setup
      let router = new CoreRouter(navData, {
        urlAdapter: new UrlParamAdapter()
      });
      router.sync();

      // , 

      this.moduleAdapter = new ModuleRouterAdapter(router, {"require": requirejs});

      this.selection = new KnockoutRouterAdapter(router);

      // Setup the navDataProvider with the routes, excluding the first redirected
      // route.
      this.navDataProvider = new ArrayDataProvider(navData.slice(1), {keyAttributes: "path"});

      // Drawer
      // Close offcanvas on medium and larger screens
      this.mdScreen.subscribe(() => {OffcanvasUtils.close(this.drawerParams);});
      this.drawerParams = {
        displayMode: 'push',
        selector: '#navDrawer',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      this.toggleDrawer = () => {
        this.navDrawerOn = true;
        return OffcanvasUtils.toggle(this.drawerParams);
      }

      // Header
      // Application Name used in Branding Area
      this.appName = ko.observable("JDE CNC Tool");
      // User Info used in Global Navigation area
      this.userLogin = ko.observable("girish_washikar@trekbikes.com");

      // Footer
      this.footerLinks = [
        /*
        {name: 'About Trek', linkId: 'aboutOracle', linkTarget:'https://www.trekbikes.com/us/en_US/'},
        { name: "Contact Us", id: "contactUs", linkTarget: "https://www.trekbikes.com/us/en_US/contactUs/" }
        { name: "Legal Notices", id: "legalNotices", linkTarget: "https://www.trekbikes.com/us/en_US/" },
        { name: "Terms Of Use", id: "termsOfUse", linkTarget: "" },
        { name: "Your Privacy Rights", id: "yourPrivacyRights", linkTarget: "" },
        */
      ];
     }

     return new ControllerViewModel();
  }
);
