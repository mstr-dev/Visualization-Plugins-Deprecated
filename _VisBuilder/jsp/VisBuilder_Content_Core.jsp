<%@ taglib uri="/webUtilTL.tld" prefix="web" %>
<%@ page import="com.microstrategy.web.app.beans.PageComponent" %>

<div id="mainApp"></div>
<div id="mainAppMsg"></div>
<web:resource type="custom-style" name="Html5ViPage.css"/>
<jsp:include page='/jsp/Mojo_Config.jsp' flush="true"/>

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
	mstrConfig.debugFlags = <web:beanValue property="debugFlags"/>;


    mstrConfig.units = '<web:value type="misc" name="units"/>';
    mstrConfig.unitsLabel = '<web:value type="misc" name="unitsLabel"/>';
    mstrConfig.jsLibs = '../javascript-libraries/';
	mstrConfig.pluginsVisList = <web:value type="misc" name="pluginsVisBuilder"/>;
    mstrConfig.pluginsWidgetVisMap = <web:value type="misc" name="pluginsWidgetVisMap"/>;
    mstrConfig.paletteThemes = <web:value type="misc" name="paletteThemes"/>;

   // Append application specific config.
    mstrConfig.mstrDescs = <web:bundleDescriptor name="html5-vi,vi-gm,vi-heatmap,vi-network,mojo-map"/>;
    <web:ifFeature type="systemPreference" name="validateRandNum"><web:then>
        mstrConfig.validateRandNum = '<web:value type="httpSession" name="validateRandNum"/>';
    </web:then></web:ifFeature>
</script>

<web:resource type="javascript" name="libraries/modernizr.js"/>


<web:resource type="jsbundle" bundleName="html5-vi" debugBundleName="html5-vi-debug"/>
<web:ifFeature type="misc" name="jsBundleDebug"><web:then>
	<web:resource type="jsbundle" bundleName="vi-gm" />
	<web:resource type="jsbundle" bundleName="vi-heatmap" />
	<web:resource type="jsbundle" bundleName="vi-network" />
</web:then></web:ifFeature>

<web:ifFeature name="auto-recover-objects">
    <web:then>
    <web:scriptlet>
        if (window.localStorage) {
            localStorage.setItem("lastMsgRecoveryInfo" + mstrConfig.lastMsgKey, '<web:beanValue property="lastMsgRecoveryInfo"/>');
        }
    </web:scriptlet>
  </web:then>
</web:ifFeature>

<script type="text/javascript">
//Derived Metric Editor
var isQuickSearchEnabled = <web:ifFeature name="quick-search-enabled" ><web:then>true</web:then><web:else>false</web:else></web:ifFeature>;

var mstrApp = new mstrmojo.vi.VisualInsightApp({
        addJSessionIdToURL: <web:connectionValue property="addJSessionIdToURL" />,
        authMode: '<web:connectionValue property="authenticationMode"/>',
        displayLocaleId: '<web:connectionValue property="displayLocaleID"/>',
        enableAutomaticSessionRecovery: <web:ifFeature name="auto-recover-objects"><web:then>1</web:then><web:else>0</web:else></web:ifFeature>,
        enableWarningSessionTimeout: <web:value type="preference" name="enableWarningSessionTimeout"/>,
        features: {
            <web:value type="features" name="create-folder,web-use-sharing-editor,edit-ive,warn-overwrite-flashVI,run-vi-flash,single-workingset,documents-design-mode,vi-unsupport-create-edit-in-memory-report,vi-unsupport-create-edit-dda-report,web-disable-manage-document-dataset,hide-objects-description,disable-save-dataset,disable-access-data-from-file,disable-access-data-from-database,disable-access-data-from-cloud-app,disable-reexecute-regular-report,disable-reexecute-view-report,disable-reexecute-cube-report,disable-dashboard-design,create-html-container,auto-add-history-list"/>
        },
        FlashResBundleURL : '<web:value name="resBundles/DashboardViewerBundle_" type="flashResURL"/>',
        getPersistParams: function () {return this.persistTaskParams;},
        getShowVIWelcome: function(){return  '2' === '1';},
        getShowVISamples: function() {return '2' === '1';},
        getShowVITutorial: function(){return  '2' === '1';},
        helpLocaleId: '<web:connectionValue property="helpLocale"/>',
        helpUrl: '<web:value type="systemPreference" name="helpUrl" />',
        visBuidlerHelpUrl:'https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm',
        httpSessionId: '<web:connectionValue property="containerSessionId" />',
        isShare: <web:value type="requestKey" name="share"/>,
        jsMojoRoot: '../javascript/mojo/js/source/',
        jsRoot: '../javascript/',   <%-- TODO: Need to send down actual value --%>
        localeId: '<web:connectionValue property="locale"/>',
        maxSessionIdleTime: <web:value type="misc" name="maxSessionIdleTime"/>,
        menubarModelData: <web:displayBean beanName="menuBean" />,
        name: '<web:value type="config" name="servletDeploymentName"/>',
        pageName: '<web:beanValue property="name"/>',
        pathInfo: <web:displayBean beanName="pathBean" styleName="MojoPathStyle"/>,
        persistTaskParams: <web:value type="persistParameters" name=""/>,
        placeholder: 'mainApp',
        preferences: {
            startPage: '<web:value type="preference" name="startPage"/>'
        },
        customization: {
        	getCustomThresholds: function () {return <web:value type="misc" name="customThresholds"/>;}
        },
        Privs : '<web:connectionValue property="privsXML"/>',
		projectName: '<web:connectionValue property="projectName"/>',
        searchAutoComplete: function(){return  '<web:value type="preference" name="enableSearchAutoComplete" />' == '1';},
        searchAutoCompleteDelay: function(){return '<web:value type="preference" name="searchAutoCompleteDelay" />';},
        serverName: '<web:connectionValue property="serverName"/>',
		serverPort: '<web:connectionValue property="serverPort"/>',
        serverProxy: new mstrmojo.ServerProxy({
            transport: mstrmojo.XHRServerTransport
        }),
        servletState: '<web:connectionValue property="servletState"/>',
        sessionState:'<web:connectionValue property="sessionState"/>',
        tbModelData: <web:displayBean beanName="ribbonBean" />,
        timeBeforeSessionTimeoutWarning: <web:value type="preference" name="timeBeforeSessionTimeoutWarning"/>,
        useQuickSearch: function() {return isQuickSearchEnabled && '<web:value type="preference" name="enableQuickSearch" />' == '1';},
        getMsgID: function () {return mstrApp.rootCtrl.docCtrl.model.mid;},
        userHelpPage: '<web:value type="systemPreference" name="userHelpPage" />',
        rwbBeanPath: '<web:beanValue bean="rwb" property="path"/>',
        <web:ifFeature type="systemPreference" name="validateRandNum"><web:then>
            validateRandNum: '<web:value type="httpSession" name="validateRandNum"/>'
        </web:then></web:ifFeature>
    });
</script>

<web:resource type="javascript" name="../plugins/_VisBuilder/javascript/VisBuilder.js"/>

<script type="text/javascript">

<web:ifBeanValue name="rwb" property="getXMLStatus" value="4"> <!-- WebBeanRequestEndsInError -->
    <web:then>
        mstrApp.start({"mstrerr": <web:displayBean beanName="rwb" />});
    </web:then>
    <web:else>
        mstrApp.start({nsj: true,'bs': '<web:value type="beanState" name="rwb"/>', 'mid': '<web:beanValue bean="rwb" property="messageID"/>'});
    </web:else>
</web:ifBeanValue>

	mstr_profile.timeEnd("Initial Load");

</script>

