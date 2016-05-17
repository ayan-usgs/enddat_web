/* jslint browser */

/* global expect */

define([
	'underscore',
	'moment',
	'models/BaseVariableCollection'
], function(_, moment, BaseVariableCollection) {
	"use strict";

	describe('models/BaseVariableCollection', function() {
		var testCollection;
		var DATE_FORMAT = 'YYYY-MM-DD';

		describe('Tests for hasSelectedVariables', function() {
			it('Expects that an empty collection will return false', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.hasSelectedVariables()).toBe(false);
			});

			it('Expects that a collection with no models selected with return false', function() {
				testCollection = new BaseVariableCollection([
					{selected : false},
					{selected : false},
					{}
				]);

				expect(testCollection.hasSelectedVariables()).toBe(false);
			});

			it('Expects that a collection with at least one model selected will return true', function() {
				testCollection = new BaseVariableCollection([
					{selected : false},
					{selected : true},
					{}
				]);

				expect(testCollection.hasSelectedVariables()).toBe(true);
			});
		});

		describe('Tests for getSelectedVariables', function() {
			it('Expects that an empty collection returns an empty array', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.getSelectedVariables()).toEqual([]);
			});

			it('Expects that a collection containing no selected models will return an empty array', function() {
				testCollection = new BaseVariableCollection([
					{selected : false},
					{selected : false},
					{}
				]);

				expect(testCollection.getSelectedVariables()).toEqual([]);
			});

			it('Expects that a collection containing some selected models will return an array containing those models', function() {
				var result;
				testCollection = new BaseVariableCollection([
					{selected : true, myId : 1},
					{selected : false, myId : 2},
					{myId : 3},
					{selected : true, myId : 4}
				]);
				result = testCollection.getSelectedVariables();

				expect(result.length).toBe(2);
				expect(_.find(result, function(model) { return model.get('myId') === 1; }));
				expect(_.find(result, function(model) { return model.get('myId') === 4; }));
			});
		});

		describe('Tests for getDateRange', function() {
			it('Expects that an empty collection will return undefined', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.getDateRange()).toBeUndefined();
			});

			it('Expects that the date range of a collection a variables is returned', function() {
				var result;
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04')}
				]);
				result = testCollection.getDateRange();

				expect(result.start.format(DATE_FORMAT)).toEqual('2001-01-04');
				expect(result.end.format(DATE_FORMAT)).toEqual('2010-01-04');
			});
		});

		describe('Tests for getSelectedDateRange', function() {
			it('Expects that an empty collection will return undefined', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.getSelectedDateRange()).toBeUndefined();
			});

			it('Expects that a collection with variables where none are selected will return undefined', function() {
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04')}
				]);

				expect(testCollection.getSelectedDateRange()).toBeUndefined();
			});

			it('Expects that a collection with selected variables returns the appropriate date range', function() {
				var result;
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04'), selected : true},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2011-01-04'), selected : true},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04')}
				]);
				result = testCollection.getSelectedDateRange();

				expect(result.start.format(DATE_FORMAT)).toEqual('2002-01-04');
				expect(result.end.format(DATE_FORMAT)).toEqual('2011-01-04');
			});
		});

		describe('Tests for getOverlappingDateRange', function() {
			it('Expects that an empty collection will return undefined', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.getOverlappingDateRange()).toBeUndefined();
			});

			it('Expects that a collection with overlapping date ranges returns that date range', function() {
				var result;
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04')}
				]);
				result = testCollection.getOverlappingDateRange();

				expect(result.start.format(DATE_FORMAT)).toEqual('2006-01-04');
				expect(result.end.format(DATE_FORMAT)).toEqual('2007-01-04');
			});

			it('Expects that a collection without overlapping date ranges returns undefined', function() {
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2005-01-04')}
				]);

				expect(testCollection.getOverlappingDateRange()).toBeUndefined();
			});
		});

		describe('Tests for getSelectedOverlappingDateRange', function() {
			it('Expects than an empty collection will return undefined', function() {
				testCollection = new BaseVariableCollection();

				expect(testCollection.getSelectedOverlappingDateRange()).toBeUndefined();
			});

			it('Expects that a collection with no selected models will return undefined', function() {
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04')}
				]);

				expect(testCollection.getSelectedOverlappingDateRange()).toBeUndefined();
			});

			it('Expects that a collection with selected variables will return the ovelapping date range', function() {
				var result;
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04')},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04'), selected : true},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2007-01-04'), selected : true}
				]);
				result = testCollection.getSelectedOverlappingDateRange();

				expect(result.start.format(DATE_FORMAT)).toEqual('2006-01-04');
				expect(result.end.format(DATE_FORMAT)).toEqual('2007-01-04');
			});

			it('Expects that collection with selected variables but no overlapping date range returns undefined', function() {
				testCollection = new BaseVariableCollection([
					{startDate : moment('2002-01-04', DATE_FORMAT), endDate : moment('2010-01-04'), selected : true},
					{startDate : moment('2006-01-04', DATE_FORMAT), endDate : moment('2010-01-04'), selected : true},
					{startDate : moment('2001-01-04', DATE_FORMAT), endDate : moment('2005-01-04'), selected : true}
				]);

				expect(testCollection.getSelectedOverlappingDateRange()).toBeUndefined();
			});
		});
	});
});
