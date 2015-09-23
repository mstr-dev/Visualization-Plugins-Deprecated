###Description
The Visualization Builder is a tool that helps you create custom HTML5 visualizations that consume and display MicroStrategy data. With the Visualization Builder, you can find an interesting D3 visualization online and quickly create your own custom visualization that is integrated with MicroStrategy.The Visualization Builder comes with a set of sample visualizations that you can use as the basis for creating your own custom visualizations.

###How To Use
Steps to use visualization plugins in this repo:

1. Clone the repo and copy the Visualization Builder folders to `{Web folder}/plugins`,
2. Restart the web server.

Once the Visualization Builder is installed, you can create custom visualizations in several ways:

- [Using an existing D3 visualization](https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/CreatingCustomD3Visualizations.htm)
- [Using the sample visualizations](https://lw.microstrategy.com/msdz/MSDL/_CurrentGARelease/docs/projects/VisSDK_All/default.htm#topics/HTML5/UsingVisBuilderSamples.htm)

###Difference Between JSP & ASP Version
This folder contains all files for both JSP and ASP server. The default setting is for JSP server. If you are using JSP, following steps above and no file needs to be changed. If you are using ASP, please remove WEB-INF\xml\pageConfig.xml and and rename pageConfig_ASP.xml to pageConfig.xml. The alternative way is to manually change the following line in WEB-INF\xml\pageConfig.xml

file-name="/plugins/_VisBuilder/jsp/VisBuilder_Content_Core.jsp"

to

file-name="/plugins/_VisBuilder/asp/VisBuilder_Content_Core.ascx"