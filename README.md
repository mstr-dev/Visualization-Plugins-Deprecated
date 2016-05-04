###Description
The purpose of this repository is to provide a space to share and collect independently created custom visualizations that can be used in MicroStrategy dashboards and documents. While MicroStrategy provides a number of graph types of out-of-the-box, this repository, along with our [Community Custom Visualization Gallery](TBD), enables you to expand your pool of visualizations by downloading new types of graphs made by others. 

Please note that this repository is a shared develeopment environment that contains independent contributions and experimental content.  Please deploy these plugins at your own risk and adhere to the posted license.

If you would like to develop your own custom visualizations, you can create or modify graphs using D3.js, Google Charts, or other external frameworks, then use the MicroStrategy JavaScript framework to package them to work within the MicroStrategy platform.  The overview below will point you in the right direction. 


###How To Use
####Download visualizations from GitHub and deploy to MicroStrategy Web or Desktop

#####Option 1
1. Clone this repository or download it as a ZIP file.
2. Unzip and copy the visualization folders you want directly to your [Web or Desktop plugins folder](https://lw.microstrategy.com/msdz/MSDL/10/docs/projects/VisSDK_All/default.htm#topics/HTML5/Deploying_a_custom_visualization.htm).
3. Restart your MicroStrategy Web server or Desktop.

#####Option 2 (Desktop 10.2+)
1. Clone this repository or download it as a ZIP file.
2. Ensure the folders for the visualizations you want are individually zipped.
3. Open Desktop.  From the File menu, select Import Visualization and select a zipped visualization folder.

Note: The visualizations in this branch are designed for MicroStrategy 10. They should work in document Express/Interactive mode (Web) and dashboards (Web/Desktop). If you are looking for visualizations customized for MicroStrategy 9.4.1, please check the [9.4.1 branch](https://github.com/mstr-dev/Visualization-Plugins/tree/9.4.1).

####Build a new custom visualization
Documentation on how to create a custom visualization can be found in the [Developer Zone](http://community.microstrategy.com/t5/custom/page/page-id/developer-zone), under [Creating an HTML5 Visualization](https://lw.microstrategy.com/msdz/MSDL/10/docs/projects/VisSDK_All/default.htm#topics/HTML5/Deploying_a_custom_visualization.htm). Creating your custom visualization typically requires only a few steps:

1. **Create a folder for your plug-in.** Give it a meaningful name and save it under the plugins folder in your MicroStrategy Web or Desktop installation directory.
2. **Create a JavaScript file with the code to render the visualization.** In this file, you add your own custom code to render the visualization. It uses the MicroStrategy JavaScript framework, as well as any other frameworks needed to render the visualization. Save it in javascript/mojo/js/source in the plug-in folder you just created.
  * Use the [Data Interface API](https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/Data_Interface_API.htm) to connect the data MicroStrategy provides to your code that renders the visualization. You may need to transform the data yourself.  
  * Use ENUM_RAW_DATA_FORMAT.TREE and ENUM_RAW_DATA_FORMAT.ROWS to get data in a format your D3.js visualization can likely more easily consume.
6. **Create a visualizations.xml configuration file.** In this file, you define the visualization so that it is added to the visualization gallery for use in a dashboard or document. Save it under WEB-IN/xml/config in the plug-in folder you just created.
7. **Create a styleCatalog.xml configuration file.** In this file, you define the style to render the HTML code for the visualization and any styles needed for optional actions. Save it under WEB-IN/xml in the plug-in folder you just created.

The [Visualization Builder](https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/UsingVisBuilderTool.htm) is a tool to help you build visualization plug-ins. A plug-in itself, it automates a lot of folder creation and other MicroStrategy-specific things you need to do to create your own visualization plug-in. You can also easily apply your code to MicroStrategy data to test behavior on-the-fly. You will need access to a MicroStrategy Web environment to use the Builder.


####Share Your Visualization
We encourage you to share your visualizations and appreciate your contribution to the MicroStrategy community. To give others access to your custom visualizations:

1. Fork this repo and clone it in your PC.
2. Add your visualization or fix issues.
3. Send a pull request.

###License
The MicroStrategy Visualizations Sites terms and conditions at [http://www.microstrategy.com/us/licensing](http://www.microstrategy.com/us/licensing) apply to your access and use of this site.
