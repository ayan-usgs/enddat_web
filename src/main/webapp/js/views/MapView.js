/* jslint browser: true */

define([
	'underscore',
	'leaflet',
	'leaflet-providers',
	'loglevel',
	'utils/geoSpatialUtils',
	'views/BaseView',
	'views/PrecipDataView'
], function(_, L, leafletProviders, log, geoSpatialUtils, BaseView, PrecipDataView) {

	var siteIcon = new L.icon({
		iconUrl : 'img/time-series.png',
		iconSize : [10, 10]
	});
	var precipIcon = L.icon({
		iconUrl : 'img/national-precipitation.png',
		iconSize : [14, 14]
	});

	var MAP_WIDTH_CLASS = 'col-md-6';
	var DATA_VIEW_WIDTH_CLASS = 'col-md-6';

	var VARIABLE_CONTAINER_SEL = '.dataset-variable-container';

	var view = BaseView.extend({

		/*
		 * @param {Object} options
		 *		@prop {Jquery element or selector} el
		 *		@prop {String} mapDivId - id of the div where the map should be rendered
		 *		@prop {WorkflowStateModel} model
		 */
		initialize : function(options) {
			BaseView.prototype.initialize.apply(this, arguments);
			this.mapDivId = options.mapDivId;

			this.baseLayers = {
				'World Street' : L.tileLayer.provider('Esri.WorldStreetMap'),
				'World Physical': L.tileLayer.provider('Esri.WorldPhysical'),
				'World Imagery' : L.tileLayer.provider('Esri.WorldImagery')
			};
			this.controls = [
				L.control.layers(this.baseLayers, {})
			];

			this.projLocationMarker = L.marker([0, 0], {
				draggable : true,
				title : 'Project Location'
			});
			this.projLocationMarker.on('dragend', function() {
				var latlng = this.projLocationMarker.getLatLng();
				this.model.set({
					location : {
						latitude : latlng.lat,
						longitude : latlng.lng
					}
				});
			}, this);

			this.siteLayerGroup = L.layerGroup();
			this.precipLayerGroup = L.layerGroup();
		},

		render : function() {
			// We don't call the prototype render at all because we are not rendering
			// a handlebars template, but rather rendering a leaflet map.
			var self = this;

			if (_.has(this, 'map')) {
				this.map.remove();
			}
			this.map = L.map(this.mapDivId, {
				center: [41.0, -100.0],
				zoom : 4,
				layers : [this.baseLayers['World Street']]
			});
			_.each(this.controls, function(control) {
				this.map.addControl(control);
			}, this);
			this.map.addLayer(this.siteLayerGroup);
			this.map.addLayer(this.precipLayerGroup);


			this.$('#' + this.mapDivId).resize(function(ev) {
				self.map.invalidateSize();
			});

			this.updateLocationMarkerAndExtent(this.model, this.model.get('location'));
			this.listenTo(this.model, 'change:location', this.updateLocationMarkerAndExtent);
			this.listenTo(this.model, 'change:radius', this.updateExtent);

			if (this.model.has('datasetCollections')) {
				this.setupDatasetListeners(this.model, this.model.attributes.datasetCollections);
			}
			else {
				this.listenTo(this.model, 'change:datasetCollections', this.setupDatasetListeners);
			}

			return this;
		},

		remove : function() {
			if (_.has(this, 'map')) {
				this.map.remove();
			}
			BaseView.prototype.remove.apply(this, arguments);
		},

		/*
		 * We have to add handlers for both click and double click. If the click handler creates
		 * a timeout function that is executed if the dblclick event does not occur before it's
		 * timeout expires.
		 */
		setUpSingleClickHandlerToCreateMarker : function() {
			var self = this;

			var clickTimeout;
			this.createMarkClickHandler = function(ev) {
				var clickToAddMarkerToMap = function() {
					self.model.set({
						location : {
							latitude : ev.latlng.lat,
							longitude : ev.latlng.lng
						}
					});
				};

				if (!clickTimeout) {
					clickTimeout = setTimeout(clickToAddMarkerToMap, 500);
				}
			};
			this.createMarkDoubleClickHandler = function() {
				if (clickTimeout) {
					clearTimeout(clickTimeout);
					clickTimeout = null;
				}
			};
			this.map.on('click', this.createMarkClickHandler);
			this.map.on('dblclick', this.createMarkDoubleClickHandler);
		},

		removeSingleClickHandler : function() {
			this.map.off('click', this.createMarkClickHandler);
			this.map.off('dbclick', this.createMarkDoubleClickHandler);
		},

		/*
		 * Model event handlers
		*/

		/*
		 * Updates or adds a marker at location if location is valid and removes the single click handler
		 * to create the marker. Otherwise remove the marker and set up the single click handler so that
		 * a marker can be added.
		 * @param {WorkflowStateModel} model
		 * @param {Object} location - has properties latitude and longitude in order to be a valid location
		 */
		updateLocationMarkerAndExtent : function(model, location) {
			var mapHasMarker = this.map.hasLayer(this.projLocationMarker);
			var $tiles = this.$('.leaflet-tile');
			if (_.has(location, 'latitude') && (location.latitude) && _.has(location, 'longitude') && (location.longitude)) {
				if (!mapHasMarker) {
					this.map.addLayer(this.projLocationMarker);
				}
				this.projLocationMarker.setLatLng([location.latitude, location.longitude]);
				this.removeSingleClickHandler();
				$tiles.removeClass('leaflet-clickable');
				this.updateExtent(model, model.get('radius'));
			}
			else {
				if (mapHasMarker) {
					this.map.removeLayer(this.projLocationMarker);
				}
				$tiles.addClass('leaflet-clickable');
				this.setUpSingleClickHandlerToCreateMarker();
			}
		},

		updateExtent : function(model, radius) {
			if (radius && model.has('location')) {
				var location = model.get('location');
				if ((location.latitude) && (location.longitude)) {
					var bbox = geoSpatialUtils.getBoundingBox(location.latitude, location.longitude, radius);

					var southwest = L.latLng(bbox.south, bbox.west);
					var northeast = L.latLng(bbox.north, bbox.east);
					this.map.fitBounds(L.latLngBounds(southwest, northeast));
				}
			}
		},

		setupDatasetListeners : function(model, datasetCollections) {
			this.updateSiteMarker(datasetCollections[model.NWIS_DATASET]);
			this.updatePrecipGridPoints(datasetCollections[model.PRECIP_DATASET]);

			this.listenTo(datasetCollections[model.NWIS_DATASET], 'reset', this.updateSiteMarker);
			this.listenTo(datasetCollections[model.PRECIP_DATASET], 'reset', this.updatePrecipGridPoints);
		},
		/*
		 * Updates the siteLayerGroup to reflect the sites in the model
		 * @param {SiteModel} sites - has one or more site objects, each with properties
		 *	latitude and longitude in order to be a valid location
		 */
		updateSiteMarker : function(siteCollection) {
			var self = this;
			this.siteLayerGroup.clearLayers();

			siteCollection.each(function(siteModel) {
				var marker = L.marker([siteModel.attributes.lat, siteModel.attributes.lon], {
					icon: siteIcon,
					title: siteModel.attributes.name
				});
				self.siteLayerGroup.addLayer(marker);
			});
		},

		/*
		 * Updates the precipitation layer group to reflect the grid points in precipCollection
		 * @param {models/PrecipitationCollection} precipCollection
		 */
		updatePrecipGridPoints : function(precipCollection) {
			var self = this;
			this.precipLayerGroup.clearLayers();

			if (precipCollection) {
				precipCollection.each(function(precipModel) {
					var latLng = new L.latLng(precipModel.attributes.lat, precipModel.attributes.lon);
					var marker = L.marker(latLng, {
						icon : precipIcon,
						title : precipModel.attributes.y + ':' + precipModel.attributes.x
					});

					self.precipLayerGroup.addLayer(marker);
					marker.on('click', function(ev) {
						var $newContainer = $('<div />');

						// Update the highlight circle marker
						if (self.circleMarker) {
							self.circleMarker.setLatLng(latLng);
							self.map.addLayer(self.circleMarker);
						}
						else {
							self.circleMarker = new L.circleMarker(latLng,{
								radius : 15
							});
							if (!self.map.hasLayer(self.circleMarker)) {
								self.map.addLayer(self.circleMarker);
							}
						}

						//Update the precipDataView
						if (self.precipDataView) {
							self.precipDataView.remove();
						}
						self.$(VARIABLE_CONTAINER_SEL).append($newContainer);
						self.precipDataView = new PrecipDataView({
							el : $newContainer,
							model : precipModel,
							opened : true
						});
						if (!self.$('#' + self.mapDivId).hasClass(MAP_WIDTH_CLASS)) {
							self.$('#' + self.mapDivId).addClass(MAP_WIDTH_CLASS);
							self.map.invalidateSize();
							self.$(VARIABLE_CONTAINER_SEL).addClass(DATA_VIEW_WIDTH_CLASS);
						}
						self.precipDataView.render();
					});
				});
			}
		}
	});

	return view;
});

