/* jslint browser : true */

define([
	'underscore',
	'bootstrap', // Needed by the bootstrap navbar and modal
	'loglevel',
	'Config',
	'views/BaseView',
	'hbs!hb_templates/workflowNav'
], function(_, bootstrap, log, Config, BaseView, hb_template) {
	"use strict";

	var getDatasetFragment = function(model) {
		var datasetUrlIds = [];
		var fragment = '';

		if (model.attributes.datasets) {
			datasetUrlIds = _.map(model.attributes.datasets, function(dataset) {
				var result = dataset;
				if (dataset === Config.GLCFS_DATASET) {
					result += '_' + model.attributes.datasetCollections[Config.GLCFS_DATASET].getLake();
				}
				return result;
			});
			fragment = datasetUrlIds.join('/');
		}
		return fragment;
	};

	var getChooseDataUrl = function(model) {
		var state = model.attributes;
		var aoi = model.attributes.aoi;
		var dataDateFilter = model.has('dataDateFilter') ? state.dataDateFilter : {};
		var isBySite = ((state.step === Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP) ||
			(state.step === Config.CHOOSE_DATA_BY_SITE_VARIABLES_STEP));
		var isByVariables = (state.step === Config.CHOOSE_DATA_BY_VARIABLES_STEP);

		var startDate = (dataDateFilter.start) ? '/startdate/' + dataDateFilter.start.format(Config.DATE_FORMAT_URL) : '';
		var endDate = (dataDateFilter.end) ? '/enddate/' + dataDateFilter.end.format(Config.DATE_FORMAT_URL) : '';

		var datasetFragment = (isBySite) ? '/dataset/' + getDatasetFragment(model) : '';
		var variableKinds = (state.variableKinds) ? state.variableKinds.join('/') : '';
		var variableKindFragment = (isByVariables) ? '/variable/' + variableKinds : '';

		var aoiFragment = '';
		if (aoi.usingProjectLocation()) {
			var latitude = (aoi.attributes.latitude) ? aoi.attributes.latitude : '';
			var longitude = (aoi.attributes.longitude) ? aoi.attributes.longitude : '';
			var radius = (aoi.attributes.radius) ? aoi.attributes.radius : '';
			aoiFragment = 'lat/' + latitude + '/lng/' + longitude + '/radius/' + radius;
		}
		else if (aoi.usingAOIBox()) {
			var aoiBox = aoi.attributes.aoiBox;
			aoiFragment = 'aoiBbox/' + aoiBox.south + ',' + aoiBox.west + ',' + aoiBox.north + ',' + aoiBox.east;
		}

		return aoiFragment + startDate + endDate + datasetFragment + variableKindFragment;
	};

	var setBtnDisabled = function($el, isDisabled) {
		if (isDisabled) {
			$el.addClass('disabled');
		}
		else {
			$el.removeClass('disabled');
		};
		$el.find('a').prop('disabled', isDisabled);
	};

	var view = BaseView.extend({
		template : hb_template,

		events : {
			'click .nav-specify-aoi a' : 'showWarning',
			'click .nav-choose-data a' : 'showChooseDataWorkflowModal',
			'click .nav-process-data a' : 'goToProcessDataStep',
			'click .nav-warning-modal .ok-button' : 'goToProjectLocationStep',
			'change .choose-data-workflow-modal select' : 'goToChooseDataStep'
		},

		/*
		 * @param {Object} options
		 *		@prop {Jquery element or selector string} el
		 *		@prop {WorkflowStateModel} model
		 *		@prop {Backbone.Router} router
		 */
		initialize : function(options) {
			BaseView.prototype.initialize.apply(this, arguments);

			this.navSelector = {};
			this.navSelector[Config.SPECIFY_AOI_STEP] = '.nav-specify-aoi';
			this.navSelector[Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP] = '.nav-choose-data';
			this.navSelector[Config.CHOOSE_DATA_BY_SITE_VARIABLES_STEP] = '.nav-choose-data';
			this.navSelector[Config.CHOOSE_DATA_BY_VARIABLES_STEP] = '.nav-choose-data';
			this.navSelector[Config.PROCESS_DATA_STEP] = '.nav-process-data';

			this.listenTo(this.model, 'change', this.updateNavigation);
			this.listenTo(this.model.get('aoi'), 'change', this.updateAOI);
		},

		render : function() {
			BaseView.prototype.render.apply(this, arguments);
			this.$('.nav-warning-modal').modal({show : false});
			this.updateNavigation(this.model, true);
			return this;
		},

		/*
		 * DOM Event handlers
		 */
		showWarning : function(ev) {
			ev.preventDefault();
			this.$('.nav-warning-modal').modal('show');
		},

		showChooseDataWorkflowModal : function(ev) {
			var showModal = _.bind(function() {
				var $modal = this.$('.choose-data-workflow-modal');
				$modal.find('select').val('');
				$modal.modal('show');
			}, this);
			ev.preventDefault();
			if (this.model.get('step') === Config.PROCESS_DATA_STEP) {
				if (!_.isEmpty(this.model.get('datasets'))) {
					this.model.set('step', Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP);
				}
				else if (!_.isEmpty(this.model.get('variableKinds'))) {
					this.model.set('step', Config.CHOOSE_DATA_BY_VARIABLES_STEP);
				}
				else {
					showModal();
				}
			}
			else {
				showModal();
			}
		},

		goToProjectLocationStep : function(ev) {
			ev.preventDefault();
			if (this.model.get('step') === Config.SPECIFY_AOI_STEP) {
				// Need to do this so that the event handler for this step is triggered
				this.model.set('step', '');
			}
			this.model.set('step', Config.SPECIFY_AOI_STEP);
			this.$('.nav-warning-modal').modal('hide');
		},
		goToChooseDataStep : function(ev) {
			var step = $(ev.target).val();

			ev.preventDefault();
			this.$('.choose-data-workflow-modal').modal('hide');
			this.model.set('step', step);
		},
		goToProcessDataStep : function(ev) {
			ev.preventDefault();
			if (this.model.get('step') !== Config.PROCESS_DATA_STEP) {
				this.model.set({step : Config.PROCESS_DATA_STEP});
			}
		},

		/*
		 * Model event handlers
		 */

		updateNavigation : function(model, isRendering) {
			var stepHasChanged = _.isBoolean(isRendering) ? isRendering : model.hasChanged('step');
			var newStep = model.get('step');

			var $chooseDataBtn = this.$(this.navSelector[Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP]);
			var $processDataBtn= this.$(this.navSelector[Config.PROCESS_DATA_STEP]);
			var currentStepSelector;

			if (stepHasChanged) {
				currentStepSelector = this.navSelector[newStep] + ' a';
				this.$('.navbar-nav li a').not(currentStepSelector).removeClass('active');
				this.$(currentStepSelector).addClass('active');
			}
			switch(newStep) {
				case Config.SPECIFY_AOI_STEP:
					setBtnDisabled($chooseDataBtn, !model.get('aoi').hasValidAOI());
					setBtnDisabled($processDataBtn, true);

					this.router.navigate('');
					break;

				case Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP:
					setBtnDisabled($processDataBtn, true);

					if (model.get('aoi').hasValidAOI()) {
						this.router.navigate(getChooseDataUrl(model));
					}
					break;

				case Config.CHOOSE_DATA_BY_SITE_VARIABLES_STEP:
				case Config.CHOOSE_DATA_BY_VARIABLES_STEP:
					setBtnDisabled($processDataBtn, !model.get('hasSelectedVariables'));

					if (model.get('aoi').hasValidAOI()) {
						this.router.navigate(getChooseDataUrl(model));
					}
					break;

				case Config.PROCESS_DATA_STEP:
					break;
			}
		},

		updateAOI : function() {
			var $chooseDataBtn = this.$(this.navSelector[Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP]);

			switch(this.model.get('step')) {
				case Config.SPECIFY_AOI_STEP:
					setBtnDisabled($chooseDataBtn, !this.model.get('aoi').hasValidAOI());
					break;

				case Config.CHOOSE_DATA_BY_SITE_FILTERS_STEP:
				case Config.CHOOSE_DATA_BY_SITE_VARIABLES_STEP:
				case Config.CHOOSE_DATA_BY_VARIABLES_STEP:
					if (this.model.get('aoi').hasValidAOI()) {
						this.router.navigate(getChooseDataUrl(this.model));
					}
					break;
			}
		}
	});

	return view;
});


