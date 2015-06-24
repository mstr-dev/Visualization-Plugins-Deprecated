###Note
This branch is used to host all the visualizations customized for MicroStrategy 9.4.1. In MicroStrategy 9.4.1, although the Visual Insight is programmed with Flash, it doesn't support the Java Script based 3rd party visualizations. The interactive mode document can support those 3rd party visualizations. You can plugin the visualizations in this repo and enable them in document interactive mode.  

###Description
Goal of this repo is to share/collect customer created/customized visualizations of MicroStrategy dashboards. MicroStrategy provides several out-of-box visulizations in our platform. Now, you can extend your visualization pool with more choices. MicroStrategy visualizations are based on JavaScript, so it is possible to create or adjust existing visualizations to fit the platform. Some great work such as [D3](https://github.com/mbostock/d3) makes it even more convenient.

###How To Use
Steps to use visualization plugins in this repo:

1. Clone the repo and copy the visualization folders you like to `{Web folder}/plugins`,
2. Restart the web server.

###Create Customized Visualiztions 
You can follow the [introduction](https://lw.microstrategy.com/msdz/MSDL/10/docs/projects/VisSDK_All/default.htm#topics/HTML5/Creating_an_HTML5_visualization.htm) to create a new customized visualization.

###Sharing Your Visualizations
Sharing your visualizations is highly encouraged. We would appreciate your contribution to the MicroStrategy community.

Steps to share:

1. Fork this repo and clone it in your PC.
2. Add your visualization or fix issues.
3. Send a pull request.

###License of Visualizations
For all the Custom Visualizations submitted to this GitHub Repository, we assume that they are aligned to the open source principle and allowed to share to the MSTR community. If you have a specific license statement, please put it at the begining of your Visualization JavaScript code. 

For more info, please refer to the [Wiki Site](https://github.com/mstr-dev/Visualization-Plugins/wiki).
