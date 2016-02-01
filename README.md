# enddat_web
Web UI for ENDDaT

## About EnDDaT
EnDDaT is a tool used to discover data from our natural environment. This tool accesses data from a variety of data sources, compiles and processes the data, and performs common transformations. The end result is that environmental data from multiple sources is sorted into a single table. See the user guide for step-by-step instructions on obtaining data, specifying transforms, and processing data.

## Build instructions
This project has been built and deployed using maven ?, java ? and tomcat ?.
To build the war execute the following command in the directory where you cloned the repository.
```
mvn clean package
```
This will produce a .war file in the `target` directory. You can deploy this war file to tomcat like any other war.

The project requires the following JNDI variables in the context.xml. Example values are given.
```
<Resource auth="Container" driverClassName="oracle.jdbc.OracleDriver" logAbandoned="true" maxActive="20" maxIdle="10" maxWait="10" name="jdbc/enddat" password="get_the_password" removeAbandoned="true" removeAbandonedTimeout="60" type="javax.sql.DataSource" url="jdbc:oracle:thin:@cida-eros-dbdev.er.usgs.gov:1521:devtrans" username="get_the_username" validationQuery="select * from dual"/> 

<Environment name="enddat.gdp-process-url" type="java.lang.String" value="http://cida-eros-enddatgeodev.er.usgs.gov:8080/gdp-process-wps/" override="true"/> 
```

## Use Cases
* Select a project location.
* Set bounding box for the project that indicates area used to discover data.
* Choose data sources to discover data for the bounding area.
* Upload a shapefile for radar-indicated rain data (optional).
* Choose data sources to retrieve available data for bounding area..
* Set time range and filter options for data to be retrieved.
* Determine beach orientation (optional).
* Select data to download and set transformation options.
* Download data directly with URL saved from previous inquiry (optional).

## GeoServer Service
This service is called for mapping functions.
http://<URL to Application>/beaches-geoserver/web/
example
http://cida.usgs.gov/enddat/geo/wfs?service=WFS&version=1.1.0&request=GetCapabilities

This service is called to get map tiles.
http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/?/?/?
example
http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/3/3/1

## ENDDAT-WEBAPP Web Services
These services are part of enddat-webapp project and are called by the client.  These services are all proxy services except for the Date Service.

http://<URL to Application>/service/*
* use:  To get the data after the project and data sources are selected and transformations are specified.  This makes a call to the loosely coupled enddat-services, which parses the parameters and builds another service call(s) to an external service provider(s). 
* proxy url:  http://localhost:8080/enddat-services/
* example:  http://cida.usgs.gov/enddat/service/execute?style=tab&fill=&download=&DateFormat=Excel&beginPosition=2015-12-31&endPosition=2016-01-31&Lake=michigan&TZ=0_GMT&BeachName=&BeachLat=39.5616159&BeachLon=-105.321744&shapefile=&shapefileFeature=null&filterId=&timeInt=6&NWIS=06710385%3A00060%3A00003%21Discharge%2C+cubic+feet+per+second+Daily+Mean%3A+06710385
http://<URL to Application>/uv
* use:  To get NWIS unit values
* proxy url:  http://webvastage6.er.usgs.gov/ogc-swie/uv/sos
* example: 
http://<URL to Application>/precip15
* use:  To get 15 minute precip data from radar indicated rain models
* proxy url:  http://gis.ncdc.noaa.gov/webservices/cdo/precip15/MapServer/WFSServer
*example: 
http://<URL to Application>/precipHR
* use:  To get hourly precipitation from radar
* proxy url:  http://gis.ncdc.noaa.gov/webservices/cdo/preciphr/MapServer/WFSServer
* example:  http://<URL to Application>/debug/proxy/*
* use:  ???
* proxy url:  http://internal.cida.usgs.gov/glri/glos_portal_dev/debug/
* example:  http://<URL to Application>/gdp/*
* use:  Geo Data Portal
* proxy url:  http://cida.usgs.gov/gdp/process/
* example: 
http://<URL to Application>/dv
* used for:  to get NWIS daily values
* proxy url:  http://webvastage6.er.usgs.gov/ogc-swie/dv/sos
* example:  
http://<URL to Application>/waterService/*
* use:  NWISWeb query to find sites within a bounding area
* proxy url:  http://waterservices.usgs.gov/nwis/site/
* example:  http://cida.usgs.gov/enddat/waterService/?format=rdb&bBox=-105.415605,39.489254,-105.227883,39.633977&outputDataTypeCd=iv,dv&hasDataTypeCd=iv,dv&siteType=OC,LK,ST,SP,AS,AT
http://<URL to Application>/pcmodes
* use:  To get list of NWIS parameter codes
* proxy url:  http://nwis.waterdata.usgs.gov/nwis/pmcodes/pmcodes
* example:  http://cida.usgs.gov/enddat/pmcodes?radio_pm_search=param_group&pm_group=Physical&format=rdb&show=parameter_nm
http://<URL to Application>/stcodes
* use:  To get list of NWIS statistic codes
* proxy url:  http://help.waterdata.usgs.gov/code/stat_code_query?fmt=rdb
* example:  http://cida.usgs.gov/enddat/stcodes?read_file=stat&format=rdb
http://<URL to Application>/bouy
* use:  National Bouy data set (needs to be setup)
* proxy url:  http://sdf.ndbc.noaa.gov/sos/server.php
* example: 
http://<URL to Application>/qw/*
* use:  Water Quality Portal
* proxy url:  http://www.waterqualitydata.us/
* example:  http://cida.usgs.gov/enddat/qw/Station/search?north=&west=&east=&south=&within=5&lat=39.5616159&long=-105.321744&sampleMedia=Water&countrycode=US&siteType=Estuary%3BLake%2C+Reservoir%2C+Impoundment%3BAggregate+surface-water-use%3BStream%3BSpring&providers=NWIS&mimeType=xml
http://<URL to Application>/OPeNDAP/*
* use:  Great Lakes Coastal Forecasting System (GLCFS)
* proxy url:  http://tds.glos.us/thredds/dodsC/glos/glcfs/
* example:  http://cida.usgs.gov/enddat/OPeNDAP/archivecurrent/michigan/ncfmrc-2d/Lake_Michigan_-_Nowcast_-_2D_-_Current_Year_best.ncd.dds
http://<URL to Application>/radar/*
* use:  rain?  real-time vs historic?
* proxy url:  http://cida.usgs.gov/thredds/
* example: 
http://<URL to Application>/geo/*
* use:  Something to do with shapefile...
* proxy url:  http://localhost:8080/beaches-geoserver/
* example: 
http://<URL to Application>/geoupload/*
* use:  Upload shapefile for radar-indicated rain data
* proxy url:  http://localhost:8080/beaches-geoserver/
* example: 
http://<URL to Application>/a/service/data/*
* use:  Date Service to handle date formatting and conversion.
* example: 

## ENDDAT-SERVICES Web Services
These services are part of the enddat-services project and loosely coupled with enddat-webapp.   http://<URL to Application>/enddat-services/
http://<URL to Application>/enddat-services/execute/*
http://<URL to Application>/enddat-services/async/*
http://<URL to Application>/enddat-services/retrieve/*
http://<URL to Application>/enddat-services/model/*

## External Web Services
These are services external to enddat-webapp and enddat-services that are called to get data about a project area, as well as, data for the selected project.  These services are listed under the “proxy url” label within the “ENDDAT-WEBAPP Web Services” section.  

## User Documentation
http://cida.usgs.gov/enddat/UserGuide.jsp
