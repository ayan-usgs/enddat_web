<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
	<head>
		<%@include file="WEB-INF/jsp/head.jsp"%>
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<link rel="stylesheet" type="text/css" href="css/custom.css" />
		<style type="text/css">
		.bigButton {
			-moz-box-shadow:inset 0px 50px 42px -23px #bbdaf7;
			-webkit-box-shadow:inset 0px 50px 42px -23px #bbdaf7;
			box-shadow:inset 0px 50px 42px -23px #bbdaf7;
			background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #79bbff), color-stop(1, #378de5) );
			background:-moz-linear-gradient( center top, #79bbff 5%, #378de5 100% );
			filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#79bbff', endColorstr='#378de5');
			background-color:#79bbff;
			-moz-border-radius:34px;
			-webkit-border-radius:34px;
			border-radius:34px;
			border:4px solid #84bbf3;
			display:inline-block;
			color:#ffffff;
			font-family:arial;
			font-size:24px;
			font-weight:normal;
			padding:27px 58px;
			text-decoration:none;
			text-shadow:0px -8px 22px #528ecc;
		}.bigButton:hover {
			background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #378de5), color-stop(1, #79bbff) );
			background:-moz-linear-gradient( center top, #378de5 5%, #79bbff 100% );
			filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#378de5', endColorstr='#79bbff');
			background-color:#378de5;
		}.bigButton:active {
			position:relative;
			top:1px;
		}
		a.bigButton:link {
			color:#ffffff;
		}
		a.bigButton:visited {
			color:#ffffff;
		}
		a.bigButton:hover {
			color:#ffffff;
		}			
		a.bigButton:active {
			color:#ffffff;
		}
		/* This imageless css button was generated by CSSButtonGenerator.com */

/*			a:link {color:#ffffff;}       unvisited link 
		a:visited {color:#ffffff;}   visited link 
		a:hover {color:#ffffff;}   mouse over link 
		a:active {color:#ffffff;}   selected link  */

		.littleButton {
			-moz-box-shadow:inset 0px 19px 25px 3px #bbdaf7;
			-webkit-box-shadow:inset 0px 19px 25px 3px #bbdaf7;
			box-shadow:inset 0px 19px 25px 3px #bbdaf7;
			background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #79bbff), color-stop(1, #378de5) );
			background:-moz-linear-gradient( center top, #79bbff 5%, #378de5 100% );
			filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#79bbff', endColorstr='#378de5');
			background-color:#79bbff;
			-moz-border-radius:18px;
			-webkit-border-radius:18px;
			border-radius:18px;
			border:3px solid #84bbf3;
			display:inline-block;
			color:#ffffff;
			font-family:arial;
			font-size:21px;
			font-weight:bold;
			padding:12px 38px;
			text-decoration:none;
			text-shadow:0px -5px 7px #528ecc;
		}.littleButton:hover {
			background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #378de5), color-stop(1, #79bbff) );
			background:-moz-linear-gradient( center top, #378de5 5%, #79bbff 100% );
			filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#378de5', endColorstr='#79bbff');
			background-color:#378de5;
		}.littleButton:active {
			position:relative;
			top:1px;
		}			


	</style>
</head>
<body>
	<jsp:include page="template/USGSHeader.jsp">
		<jsp:param name="site-title" value="Environmental Data Discovery and Transformation" />
	</jsp:include>
	<div id="tagline">Access and Integrate Environmental Observations for Coastal Decision Support</div>      
	<table>
	  <tr>
		  <td width="175">
			  <jsp:include page="WEB-INF/jsp/sidebar.jsp"></jsp:include>
		  </td>
		  <td>				  
			  <h1>Overview</h1>
Welcome to the Environmental Data Discovery and Transformation (EnDDaT) service.  EnDDaT is a tool used to discover data from our natural environment.  This tool accesses data from a variety of data sources, compiles and processes the data, and performs common transformations.  The end result is that environmental data from multiple sources is sorted into a single table. See the user guide for step-by-step instructions on obtaining data, specifying transforms, and processing data.<br>  
			  <br>
			  <table>
				  <tr>
					  <td>
						  <a href="datadiscovery" class="bigButton" style="text-decoration: none; ">Begin Data Discovery</a>	
					  </td>
					  <td>
						  <a href="" class="bigButton" style="text-decoration: none;">User Guide</a>
					  </td>
				  </tr>
			  </table>			  			  
			<br>
			<h1>Motivation</h1>
As environmental models have become more intricate and comprehensive, the amount of data necessary to build and run the models has increased significantly. As a result, efficient data discovery, aggregation and processing can be a barrier to environmental modeling efforts. For example, in order to develop near-shore water quality forecasting models, which are often times used to predict bacteria concentrations at recreational beaches, two to five years of historical data is commonly needed for model driven and model predicted parameters. 
Furthermore, real-time or near real-time data is necessary to run models for accurate and time-relevant forecasting.  In order to run the model from the previous example, real-time data with as little lag time as possible (< 6 hours) is necessary in order to predict the bacteria concentrations for that day at a particular beach. 
To meet these needs associated with environmental modeling, the Environmental Data Discovery and Transformation (EnDDaT) tool was developed with the capabilities of retrieving publicly available data resources through standard Web services, aggregating the disparate data sources, and processing the data through a single Web-accessible user interface. In addition, the tool provides a variety of output formats and data visualization tools. Therefore, these capabilities aid in model development and implementation by allowing scientists to efficiently obtain, aggregate and manipulate the data necessary for these purposes. <br><br>

			<h1>Data Sources</h1>
EnDDaT is not the owner or provider of any data.  Instead, EnDDaT gathers data from a variety of data providers. The data providers are listed on the left side bar. 
EnDDaT has been designed especially to gather data that uses recognized web standards such as SOS, WQX, and Thredds.  However, if data is deemed useful for environmental modeling, custom data gathering tools and data parsers can be included.<br><br>

			<h1>Feedback</h1>
Questions, comments, and requests are welcome.  Please email enddat@usgs.gov<br><br>


		  </td>
	  </tr>
	</table>
	<br />
	<jsp:include page="template/USGSFooter.jsp">
		<jsp:param name="site-url" value="http://cida.usgs.gov/enddat" />
		<jsp:param name="contact-info" value="<a href='mailto:enddat@usgs.gov'>Enddat Team</a>" />
	</jsp:include>
   </body>
</html>
