/* jslint browswer: true */

define([
    'underscore',
    'module',
    'loglevel',
    'views/BaseCollapsiblePanelView',
    'hbs!hb_templates/shpfileUpload'
], function(_, module, log, BaseCollapsiblePanelView, hbTemplate){
	"use strict";
	
   var view = BaseCollapsiblePanelView.extend({
	   template: hbTemplate,
	   panelHeading: 'Upload a Shapefile',
	   panelBodyId: 'upload-shapefile-panel-body',
	   
		initialize : function(options) {
			BaseCollapsiblePanelView.prototype.initialize.apply(this, arguments);
			//this._createFileUploader($('#fileInput'));
			this.listenTo(this.model, 'change', this.updatePanelContents);
		},

		render : function() {
			this.context = this.model.attributes.aoiBox;
			BaseCollapsiblePanelView.prototype.render.apply(this, arguments);
			return this;
		},

		updatePanelContents : function() {
			//Don't want to re-render the whole panel just the contents
			this.$('.panel-body').html(this.template(this.model.attributes.aoiBox));
		},
		
		_createFileUploader : function($fileUploaderInput
				//$uploadIndicator
				) {
			var self = this;
			var params = {
					'maxfilesize': 167772160,
					'response.encoding': 'xml',
					'filename.param': 'shpFileInput',
					'use.crs.failover': 'true',
					'projection.policy': 'reproject'
			};
			$fileUploaderInput.fileupload({
				url : GDP.BASE_URL + 'uploadhandler?' +  $.param(params),
				type: 'POST',
				dataType: 'xml',
				send : function(e, data) {
					data.url = data.url + '&shpFileInput=' + data.files[0].name;
					//$uploadIndicator.show();
				},
				done : function(e, data) {
					//$uploadIndicator.hide();

					var $resp = $(data.result);
					// Determine if the response indicated an error
					var success = $resp.find('success').first().text();
					if (success === 'true') {
						var warning = $resp.find('warning').first().text();
						var layer = $resp.find('name').first().text();

						if (warning) {
							self.alertView.show('alert-warning', 'Upload succeeded with warning ' + warning);
						}
						else {
							self.alertView.show('alert-success', 'Upload was successful.');
						}

						self.getAvailableFeatures().then(function() {
							$('#select-aoi').val(layer);
							self.model.set('aoiExtent', GDP.util.mapUtils.transformWGS84ToMercator(GDP.OGC.WFS.getBoundsFromCache(layer)));
							self.model.set('aoiName', layer);
						},
						function() {
							self.alertView('alert-danger', 'Unable to read uploaded shapefile attributes.');
						});

					}
					else {
						var error = $resp.find('error').first().text();
						var exception = $resp.find('exception').first().text();
						self.alertView.show('alert-danger', 'File Upload error: ' + error + '. ' + exception);
					}

				},
				fail : function(e, data) {
					//$uploadIndicator.hide();
					self.alertView.show('alert-danger', 'Upload failed');
				}
			});
		}
   });
   return view;
});