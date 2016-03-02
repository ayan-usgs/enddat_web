/* jslint browser: true */

define([
	'jquery',
	'backbone',
	'utils/ParseRDB',
	'models/ParameterCodes',
	'models/StatisticCodes',
	'module'
], function ($, Backbone, ParseRDB, ParameterCodes, module) {
	"use strict";

	//does this need to be a collection?
	var model = Backbone.Model.extend({
		//need to figure out changes to service call for radius rather than bounding box
		//need to figure out how to reference incoming parameters from stateflow model
		//need to figure out how to get bounding box values from radius
		url: config().proxyUrl + 'waterService/?format=rdb&bBox=-105.213267,39.646356,-105.025118,39.791079&outputDataTypeCd=iv,dv&hasDataTypeCd=iv,dv&siteType=OC,LK,ST,SP,AS,AT',

		parse: function(data) {
			var sites = {};

			var importantColumns = {
				"site_no" : null,
				"station_nm" : null,
				"dec_lat_va" : null,
				"dec_long_va" : null,
				"parm_cd" : null,
				"stat_cd" : null,
				"loc_web_ds" : null,
				"begin_date" : null,
				"end_date" : null,
				"count_nu" : null
			};
			var lines = data.split("\n");
			parseRDB(lines, importantColumns, function(colVals) {
				var site
				//Add the info to the sites
				if (!sites.hasOwnProperty(colVals["site_no"])) {
					site = {};
					site.name = colVals["station_nm"];
					site.lat = colVals["dec_lat_va"];
					site.lon = colVals["dec_long_va"];
					site.parameters = [];
				} else {
					site = sites[colVals["site_no"]];
				}

				var name = "Unknown parameter " + colVals["parm_cd"] + " " + colVals["stat_cd"];
				if (ParameterCodes.NWIS_PARAMETER_CODE_DEFINITIONS && StatisticCodes.NWIS_STAT_CODE_DEFINITIONS) {
					if (colVals["parm_cd"]) {
						name = ((NWIS_PARAMETER_CODE_DEFINITIONS[colVals["parm_cd"]])?NWIS_PARAMETER_CODE_DEFINITIONS[colVals["parm_cd"]]:"PCode " + colVals["parm_cd"]);
						name += ((colVals["loc_web_ds"])?" (" + colVals["loc_web_ds"] + ")":"");
					}
					if (colVals["stat_cd"]) {
						name += " Daily " + ((NWIS_STAT_CODE_DEFINITIONS[colVals["stat_cd"]])?NWIS_STAT_CODE_DEFINITIONS[colVals["stat_cd"]]:colVals["stat_cd"]);
					} else {
						name += " Instantaneous";
						colVals["stat_cd"] = "00000";
					}
				}

				site.parameters.push({
					name : name,
					parameterCd : colVals["parm_cd"],
					statCd : colVals["stat_cd"],
					startDate : colVals["begin_date"],
					endDate : colVals["end_date"],
					count : colVals["count_nu"]
				});

				sites[colVals["site_no"]] = site;
			});
		}

	});

	return model;	
});