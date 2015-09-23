<%@ Control Language="vb" AutoEventWireUp="false" CodeFile="VisBuilder_Content_Core.ascx.vb" Inherits="MicroStrategy.VisBuilder_Content_Core"%>
<%@ Register TagPrefix="web" Namespace="MicroStrategy.Tags"%>

<div id="mainApp"></div>
<div id="mainAppMsg"></div>
<web:resource runat="server" type="custom-style" name="Html5ViPage.css"/>
<web:include runat="server" flush="false" path="Mojo_Config.ascx" />
<script type="text/javascript">
    window.console = window.console || {log: function(){}};  //avoid IE9 error
	window.mstr_profile = {
		enabled: true,
		timeStart: function(label) {
			if ( console.time && this.enabled ) {
				console.time(label);
			}
		},
		timeEnd: function(label) {
			if ( console.timeEnd && this.enabled ) {
				console.timeEnd(label);
			}
		},
		group: function() {
			if ( console.group && this.enabled ) {
				console.group(arguments);
			}
		},
		groupEnd: function() {
			if ( console.groupEnd && this.enabled ) {
				console.groupEnd();
			}
		},
		log: function() {
			if ( this.enabled ) {
				Function.prototype.apply.call(console.log, console, arguments);
			}
		}
	};
	mstr_profile.log("Initial Load started");
	mstr_profile.timeStart("Initial Load");
	// Add the Debug flags to the mstrConfig object.
	mstrConfig.debugFlags = <web:beanValue runat="server" mproperty="debugFlags"/>;
    mstrConfig.units = '<web:value runat="server" type="misc" name="units"/>';
    mstrConfig.unitsLabel = '<web:value runat="server" type="misc" name="unitsLabel"/>';
    mstrConfig.jsLibs = '../javascript-libraries/';
	mstrConfig.pluginsVisList = <web:value runat="server" type="misc" name="pluginsVisBuilder"/>;
    mstrConfig.pluginsWidgetVisMap = <web:value runat="server" type="misc" name="pluginsWidgetVisMap"/>;
    mstrConfig.paletteThemes = <web:value runat="server" type="misc" name="paletteThemes"/>;
   // Append application specific config.
    mstrConfig.mstrDescs = <web:bundleDescriptor runat="server" name="html5-vi,vi-gm,vi-heatmap,vi-network,mojo-map"/>;
    <web:ifFeature runat="server" type="systemPreference" name="validateRandNum"><web:mthen runat="server">
        mstrConfig.validateRandNum = '<web:value runat="server" type="httpSession" name="validateRandNum"/>';
    </web:mthen></web:ifFeature>
</script>
<web:resource runat="server" type="javascript" name="libraries/modernizr.js"/>
<web:resource runat="server" type="jsbundle" bundleName="html5-vi" debugBundleName="html5-vi-debug"/>
<web:ifFeature runat="server" type="misc" name="jsBundleDebug"><web:mthen runat="server">
	<web:resource runat="server" type="jsbundle" bundleName="vi-gm" />
	<web:resource runat="server" type="jsbundle" bundleName="vi-heatmap" />
	<web:resource runat="server" type="jsbundle" bundleName="vi-network" />
</web:mthen></web:ifFeature>
<web:ifFeature runat="server" name="auto-recover-objects">
    <web:mthen runat="server">
    <web:scriptlet runat="server">
        if (window.localStorage) {
            localStorage.setItem("lastMsgRecoveryInfo" + mstrConfig.lastMsgKey, '<web:beanValue runat="server" mproperty="lastMsgRecoveryInfo"/>');
        }
    </web:scriptlet>
  </web:mthen>
</web:ifFeature>
<script type="text/javascript">
//Derived Metric Editor
var isQuickSearchEnabled = <web:ifFeature runat="server" name="quick-search-enabled" ><web:mthen runat="server">true</web:mthen><web:melse runat="server">false</web:melse></web:ifFeature>;
var mstrApp = new mstrmojo.vi.VisualInsightApp({
        addJSessionIdToURL: <web:connectionValue runat="server" mproperty="addJSessionIdToURL" />,
        authMode: '<web:connectionValue runat="server" mproperty="authenticationMode"/>',
        displayLocaleId: '<web:connectionValue runat="server" mproperty="displayLocaleID"/>',
        enableAutomaticSessionRecovery: <web:ifFeature runat="server" name="auto-recover-objects"><web:mthen runat="server">1</web:mthen><web:melse runat="server">0</web:melse></web:ifFeature>,
        enableWarningSessionTimeout: <web:value runat="server" type="preference" name="enableWarningSessionTimeout"/>,
        features: {
            <web:value runat="server" type="features" name="create-folder,web-use-sharing-editor,edit-ive,warn-overwrite-flashVI,run-vi-flash,single-workingset,documents-design-mode,vi-unsupport-create-edit-in-memory-report,vi-unsupport-create-edit-dda-report,web-disable-manage-document-dataset,hide-objects-description,disable-save-dataset,disable-access-data-from-file,disable-access-data-from-database,disable-access-data-from-cloud-app,disable-reexecute-regular-report,disable-reexecute-view-report,disable-reexecute-cube-report,disable-dashboard-design,create-html-container,auto-add-history-list"/>
        },
        FlashResBundleURL : '<web:value runat="server" name="resBundles/DashboardViewerBundle_" type="flashResURL"/>',
        getPersistParams: function () {return this.persistTaskParams;},
        getShowVIWelcome: function(){return  '2' === '1';},
        getShowVISamples: function() {return '2' === '1';},
        getShowVITutorial: function(){return  '2' === '1';},
        helpLocaleId: '<web:connectionValue runat="server" mproperty="helpLocale"/>',
        helpUrl: '<web:value runat="server" type="systemPreference" name="helpUrl" />',
        httpSessionId: '<web:connectionValue runat="server" mproperty="containerSessionId" />',
        isShare: <web:value runat="server" type="requestKey" name="share"/>,
        jsMojoRoot: '../javascript/mojo/js/source/',
        jsRoot: '../javascript/',   <%-- TODO: Need to send down actual value --%>
        localeId: '<web:connectionValue runat="server" mproperty="locale"/>',
        maxSessionIdleTime: <web:value runat="server" type="misc" name="maxSessionIdleTime"/>,
        menubarModelData: <web:displayBean runat="server" beanName="menuBean" />,
        name: '<web:value runat="server" type="config" name="servletDeploymentName"/>',
        pageName: '<web:beanValue runat="server" mproperty="name"/>',
        pathInfo: <web:displayBean runat="server" beanName="pathBean" styleName="MojoPathStyle"/>,
        persistTaskParams: <web:value runat="server" type="persistParameters" name=""/>,
        placeholder: 'mainApp',
        preferences: {
            startPage: '<web:value runat="server" type="preference" name="startPage"/>'
        },
        customization: {
        	getCustomThresholds: function () {return <web:value runat="server" type="misc" name="customThresholds"/>;}
        },
        Privs : '<web:connectionValue runat="server" mproperty="privsXML"/>',
		projectName: '<web:connectionValue runat="server" mproperty="projectName"/>',
        searchAutoComplete: function(){return  '<web:value runat="server" type="preference" name="enableSearchAutoComplete" />' == '1';},
        searchAutoCompleteDelay: function(){return '<web:value runat="server" type="preference" name="searchAutoCompleteDelay" />';},
        serverName: '<web:connectionValue runat="server" mproperty="serverName"/>',
		serverPort: '<web:connectionValue runat="server" mproperty="serverPort"/>',
        serverProxy: new mstrmojo.ServerProxy({
            transport: mstrmojo.XHRServerTransport
        }),
        servletState: '<web:connectionValue runat="server" mproperty="servletState"/>',
        sessionState:'<web:connectionValue runat="server" mproperty="sessionState"/>',
        tbModelData: <web:displayBean runat="server" beanName="ribbonBean" />,
        timeBeforeSessionTimeoutWarning: <web:value runat="server" type="preference" name="timeBeforeSessionTimeoutWarning"/>,
        useQuickSearch: function() {return isQuickSearchEnabled && '<web:value runat="server" type="preference" name="enableQuickSearch" />' == '1';},
        getMsgID: function () {return mstrApp.rootCtrl.docCtrl.model.mid;},
        userHelpPage: '<web:value runat="server" type="systemPreference" name="userHelpPage" />',
        rwbBeanPath: '<web:beanValue runat="server" bean="rwb" mproperty="path"/>',
        <web:ifFeature runat="server" type="systemPreference" name="validateRandNum"><web:mthen runat="server">
            validateRandNum: '<web:value runat="server" type="httpSession" name="validateRandNum"/>'
        </web:mthen></web:ifFeature>
    });
</script>
<web:resource runat="server" type="javascript" name="../plugins/_VisBuilder/javascript/VisBuilder.js"/>
<script type="text/javascript">
<web:ifBeanValue runat="server" name="rwb" mproperty="getXMLStatus" value="4"> <!-- WebBeanRequestEndsInError -->
    <web:mthen runat="server">
        mstrApp.start({"mstrerr": <web:displayBean runat="server" beanName="rwb" />});
    </web:mthen>
    <web:melse runat="server">
        mstrApp.start({nsj: true,'bs': '<web:value runat="server" type="beanState" name="rwb"/>', 'mid': '<web:beanValue runat="server" bean="rwb" mproperty="messageID"/>'});
    </web:melse>
</web:ifBeanValue>
	mstr_profile.timeEnd("Initial Load");
</script>
