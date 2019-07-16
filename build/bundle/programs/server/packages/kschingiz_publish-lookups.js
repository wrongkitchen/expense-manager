(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"kschingiz:publish-lookups":{"publish-lookups.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/kschingiz_publish-lookups/publish-lookups.js                                     //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let PublishLookup;
module.link("./lookup", {
  default(v) {
    PublishLookup = v;
  }

}, 1);

Meteor.Collection.prototype.lookup = function (selector, options, lookups) {
  const collection = this;
  return new PublishLookup(collection, selector, options, lookups);
};
///////////////////////////////////////////////////////////////////////////////////////////////

},"lookup.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/kschingiz_publish-lookups/lookup.js                                              //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let debounced;
module.link("./utils", {
  debounced(v) {
    debounced = v;
  }

}, 0);

class PublishLookup {
  constructor(collection, selector, options, lookups) {
    this.collection = collection;
    this.selector = selector || {};
    this.options = options || {};
    this.lookups = lookups || [];
    this.primaryObserver = undefined;
    this.lookupObservers = [];
    this.calculateLookupFields();
    this.republishLookups = debounced(this.republishLookups.bind(this));
  }

  _getCollectionName() {
    return this.collection._name;
  }

  calculateLookupFields() {
    const lookupFields = this.lookups.reduce((acc, lookup) => {
      const {
        localField
      } = lookup;
      acc[localField] = 1;
      return acc;
    }, {});
    this.lookupFields = lookupFields;
  }

  republishLookups() {
    const {
      collection,
      sub,
      lookups,
      lookupFields
    } = this;

    const addedPrimaryDocIds = sub._documents.get(collection._name);

    this.lookupObservers.forEach(observer => observer.stop());

    if (addedPrimaryDocIds) {
      const primaryDocsIds = Array.from(addedPrimaryDocIds.keys());
      const primaryDocs = collection.find({
        _id: {
          $in: primaryDocsIds
        }
      }, {
        fields: lookupFields
      }).fetch();
      const localFieldValues = Object.keys(lookupFields).reduce((acc, localField) => {
        acc[localField] = [];
        primaryDocs.forEach(doc => {
          if (doc[localField] !== null && doc[localField] !== undefined) {
            acc[localField].push(doc[localField]);
          }
        });
        return acc;
      }, {});
      this.lookupObservers = lookups.map(({
        collection,
        localField,
        foreignField,
        selector = {},
        options = {}
      }) => {
        const joinQuery = (0, _objectSpread2.default)({}, selector, {
          [foreignField]: {
            $in: localFieldValues[localField]
          }
        });
        const joinedDocsCursor = collection.find(joinQuery, options);
        const observer = joinedDocsCursor.observeChanges({
          added: (id, fields) => {
            sub.added(collection._name, id, fields);
          },
          changed: (id, fields) => {
            sub.changed(collection._name, id, fields);
          },
          removed: id => {
            sub.removed(collection._name, id);
          }
        });
        return observer;
      });
    }
  }

  _publishCursor(sub) {
    this.sub = sub;
    this.publishLookups();
    return {
      stop: this.stop.bind(this)
    };
  }

  publishLookups() {
    const {
      collection,
      selector,
      options,
      sub
    } = this;
    const cursor = collection.find(selector, options);
    const observer = cursor.observeChanges({
      added: (id, fields) => {
        sub.added(collection._name, id, fields);
        this.republishLookups();
      },
      changed: (id, fields) => {
        sub.changed(collection._name, id, fields);
        const lookupFieldsKeys = Object.keys(this.lookupFields);
        const changedKeys = Object.keys(fields);
        const intersection = lookupFieldsKeys.filter(value => changedKeys.includes(value));
        const isLookupFieldChanged = intersection.length > 0;

        if (isLookupFieldChanged) {
          this.republishLookups();
        }
      },
      removed: id => {
        sub.removed(collection._name, id);
        this.republishLookups();
      }
    });
    this.primaryObserver = observer;
  }

  stop() {
    if (primaryObserver) {
      this.primaryObserver.stop();
    }

    this.lookupObservers.forEach(observer => {
      observer.stop();
    });
  }

}

module.exportDefault(PublishLookup);
///////////////////////////////////////////////////////////////////////////////////////////////

},"utils.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// packages/kschingiz_publish-lookups/utils.js                                               //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.export({
  debounced: () => debounced
});
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
const timeoutMs = 100;

const debounced = fn => {
  let timeoutId = undefined;
  return () => {
    if (timeoutId) {
      Meteor.clearTimeout(timeoutId);
    }

    timeoutId = Meteor.setTimeout(() => {
      fn();
    }, timeoutMs);
  };
};
///////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});

var exports = require("/node_modules/meteor/kschingiz:publish-lookups/publish-lookups.js");

/* Exports */
Package._define("kschingiz:publish-lookups", exports);

})();

//# sourceURL=meteor://💻app/packages/kschingiz_publish-lookups.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMva3NjaGluZ2l6OnB1Ymxpc2gtbG9va3Vwcy9wdWJsaXNoLWxvb2t1cHMuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL2tzY2hpbmdpejpwdWJsaXNoLWxvb2t1cHMvbG9va3VwLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9rc2NoaW5naXo6cHVibGlzaC1sb29rdXBzL3V0aWxzLmpzIl0sIm5hbWVzIjpbIk1ldGVvciIsIm1vZHVsZSIsImxpbmsiLCJ2IiwiUHVibGlzaExvb2t1cCIsImRlZmF1bHQiLCJDb2xsZWN0aW9uIiwicHJvdG90eXBlIiwibG9va3VwIiwic2VsZWN0b3IiLCJvcHRpb25zIiwibG9va3VwcyIsImNvbGxlY3Rpb24iLCJkZWJvdW5jZWQiLCJjb25zdHJ1Y3RvciIsInByaW1hcnlPYnNlcnZlciIsInVuZGVmaW5lZCIsImxvb2t1cE9ic2VydmVycyIsImNhbGN1bGF0ZUxvb2t1cEZpZWxkcyIsInJlcHVibGlzaExvb2t1cHMiLCJiaW5kIiwiX2dldENvbGxlY3Rpb25OYW1lIiwiX25hbWUiLCJsb29rdXBGaWVsZHMiLCJyZWR1Y2UiLCJhY2MiLCJsb2NhbEZpZWxkIiwic3ViIiwiYWRkZWRQcmltYXJ5RG9jSWRzIiwiX2RvY3VtZW50cyIsImdldCIsImZvckVhY2giLCJvYnNlcnZlciIsInN0b3AiLCJwcmltYXJ5RG9jc0lkcyIsIkFycmF5IiwiZnJvbSIsImtleXMiLCJwcmltYXJ5RG9jcyIsImZpbmQiLCJfaWQiLCIkaW4iLCJmaWVsZHMiLCJmZXRjaCIsImxvY2FsRmllbGRWYWx1ZXMiLCJPYmplY3QiLCJkb2MiLCJwdXNoIiwibWFwIiwiZm9yZWlnbkZpZWxkIiwiam9pblF1ZXJ5Iiwiam9pbmVkRG9jc0N1cnNvciIsIm9ic2VydmVDaGFuZ2VzIiwiYWRkZWQiLCJpZCIsImNoYW5nZWQiLCJyZW1vdmVkIiwiX3B1Ymxpc2hDdXJzb3IiLCJwdWJsaXNoTG9va3VwcyIsImN1cnNvciIsImxvb2t1cEZpZWxkc0tleXMiLCJjaGFuZ2VkS2V5cyIsImludGVyc2VjdGlvbiIsImZpbHRlciIsInZhbHVlIiwiaW5jbHVkZXMiLCJpc0xvb2t1cEZpZWxkQ2hhbmdlZCIsImxlbmd0aCIsImV4cG9ydERlZmF1bHQiLCJleHBvcnQiLCJ0aW1lb3V0TXMiLCJmbiIsInRpbWVvdXRJZCIsImNsZWFyVGltZW91dCIsInNldFRpbWVvdXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUlDLGFBQUo7QUFBa0JILE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFVBQVosRUFBdUI7QUFBQ0csU0FBTyxDQUFDRixDQUFELEVBQUc7QUFBQ0MsaUJBQWEsR0FBQ0QsQ0FBZDtBQUFnQjs7QUFBNUIsQ0FBdkIsRUFBcUQsQ0FBckQ7O0FBSWxGSCxNQUFNLENBQUNNLFVBQVAsQ0FBa0JDLFNBQWxCLENBQTRCQyxNQUE1QixHQUFxQyxVQUFTQyxRQUFULEVBQW1CQyxPQUFuQixFQUE0QkMsT0FBNUIsRUFBcUM7QUFDeEUsUUFBTUMsVUFBVSxHQUFHLElBQW5CO0FBRUEsU0FBTyxJQUFJUixhQUFKLENBQWtCUSxVQUFsQixFQUE4QkgsUUFBOUIsRUFBd0NDLE9BQXhDLEVBQWlEQyxPQUFqRCxDQUFQO0FBQ0QsQ0FKRCxDOzs7Ozs7Ozs7Ozs7Ozs7QUNKQSxJQUFJRSxTQUFKO0FBQWNaLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFNBQVosRUFBc0I7QUFBQ1csV0FBUyxDQUFDVixDQUFELEVBQUc7QUFBQ1UsYUFBUyxHQUFDVixDQUFWO0FBQVk7O0FBQTFCLENBQXRCLEVBQWtELENBQWxEOztBQUVkLE1BQU1DLGFBQU4sQ0FBb0I7QUFDbEJVLGFB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LENBQXFCYyxPQUFyQixDQUE2QkMsUUFBUSxJQUFJO0FBQ3ZDQSxjQUFRLENBQUNDLElBQVQ7QUFDRCxLQUZEO0FBR0Q7O0FBaEppQjs7QUFGcEJoQyxNQUFNLENBQUNtRSxhQUFQLENBcUplaEUsYUFySmYsRTs7Ozs7Ozs7Ozs7QUNBQUgsTUFBTSxDQUFDb0UsTUFBUCxDQUFjO0FBQUN4RCxXQUFTLEVBQUMsTUFBSUE7QUFBZixDQUFkO0FBQXlDLElBQUliLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFFcEQsTUFBTW1FLFNBQVMsR0FBRyxHQUFsQjs7QUFDTyxNQUFNekQsU0FBUyxHQUFHMEQsRUFBRSxJQUFJO0FBQzdCLE1BQUlDLFNBQVMsR0FBR3hELFNBQWhCO0FBRUEsU0FBTyxNQUFNO0FBQ1gsUUFBSXdELFNBQUosRUFBZTtBQUNieEUsWUFBTSxDQUFDeUUsWUFBUCxDQUFvQkQsU0FBcEI7QUFDRDs7QUFFREEsYUFBUyxHQUFHeEUsTUFBTSxDQUFDMEUsVUFBUCxDQUFrQixNQUFNO0FBQ2xDSCxRQUFFO0FBQ0gsS0FGVyxFQUVURCxTQUZTLENBQVo7QUFHRCxHQVJEO0FBU0QsQ0FaTSxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9rc2NoaW5naXpfcHVibGlzaC1sb29rdXBzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcblxuaW1wb3J0IFB1Ymxpc2hMb29rdXAgZnJvbSBcIi4vbG9va3VwXCI7XG5cbk1ldGVvci5Db2xsZWN0aW9uLnByb3RvdHlwZS5sb29rdXAgPSBmdW5jdGlvbihzZWxlY3Rvciwgb3B0aW9ucywgbG9va3Vwcykge1xuICBjb25zdCBjb2xsZWN0aW9uID0gdGhpcztcblxuICByZXR1cm4gbmV3IFB1Ymxpc2hMb29rdXAoY29sbGVjdGlvbiwgc2VsZWN0b3IsIG9wdGlvbnMsIGxvb2t1cHMpO1xufTtcbiIsImltcG9ydCB7IGRlYm91bmNlZCB9IGZyb20gXCIuL3V0aWxzXCI7XG5cbmNsYXNzIFB1Ymxpc2hMb29rdXAge1xuICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uLCBzZWxlY3Rvciwgb3B0aW9ucywgbG9va3Vwcykge1xuICAgIHRoaXMuY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gICAgdGhpcy5zZWxlY3RvciA9IHNlbGVjdG9yIHx8IHt9O1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgdGhpcy5sb29rdXBzID0gbG9va3VwcyB8fCBbXTtcbiAgICB0aGlzLnByaW1hcnlPYnNlcnZlciA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmxvb2t1cE9ic2VydmVycyA9IFtdO1xuXG4gICAgdGhpcy5jYWxjdWxhdGVMb29rdXBGaWVsZHMoKTtcbiAgICB0aGlzLnJlcHVibGlzaExvb2t1cHMgPSBkZWJvdW5jZWQodGhpcy5yZXB1Ymxpc2hMb29rdXBzLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX2dldENvbGxlY3Rpb25OYW1lKCkge1xuICAgIHJldHVybiB0aGlzLmNvbGxlY3Rpb24uX25hbWU7XG4gIH1cblxuICBjYWxjdWxhdGVMb29rdXBGaWVsZHMoKSB7XG4gICAgY29uc3QgbG9va3VwRmllbGRzID0gdGhpcy5sb29rdXBzLnJlZHVjZSgoYWNjLCBsb29rdXApID0+IHtcbiAgICAgIGNvbnN0IHsgbG9jYWxGaWVsZCB9ID0gbG9va3VwO1xuXG4gICAgICBhY2NbbG9jYWxGaWVsZF0gPSAxO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG5cbiAgICB0aGlzLmxvb2t1cEZpZWxkcyA9IGxvb2t1cEZpZWxkcztcbiAgfVxuXG4gIHJlcHVibGlzaExvb2t1cHMoKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9uLCBzdWIsIGxvb2t1cHMsIGxvb2t1cEZpZWxkcyB9ID0gdGhpcztcblxuICAgIGNvbnN0IGFkZGVkUHJpbWFyeURvY0lkcyA9IHN1Yi5fZG9jdW1lbnRzLmdldChjb2xsZWN0aW9uLl9uYW1lKTtcblxuICAgIHRoaXMubG9va3VwT2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIuc3RvcCgpKTtcblxuICAgIGlmIChhZGRlZFByaW1hcnlEb2NJZHMpIHtcbiAgICAgIGNvbnN0IHByaW1hcnlEb2NzSWRzID0gQXJyYXkuZnJvbShhZGRlZFByaW1hcnlEb2NJZHMua2V5cygpKTtcblxuICAgICAgY29uc3QgcHJpbWFyeURvY3MgPSBjb2xsZWN0aW9uXG4gICAgICAgIC5maW5kKHsgX2lkOiB7ICRpbjogcHJpbWFyeURvY3NJZHMgfSB9LCB7IGZpZWxkczogbG9va3VwRmllbGRzIH0pXG4gICAgICAgIC5mZXRjaCgpO1xuXG4gICAgICBjb25zdCBsb2NhbEZpZWxkVmFsdWVzID0gT2JqZWN0LmtleXMobG9va3VwRmllbGRzKS5yZWR1Y2UoXG4gICAgICAgIChhY2MsIGxvY2FsRmllbGQpID0+IHtcbiAgICAgICAgICBhY2NbbG9jYWxGaWVsZF0gPSBbXTtcblxuICAgICAgICAgIHByaW1hcnlEb2NzLmZvckVhY2goZG9jID0+IHtcbiAgICAgICAgICAgIGlmIChkb2NbbG9jYWxGaWVsZF0gIT09IG51bGwgJiYgZG9jW2xvY2FsRmllbGRdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgYWNjW2xvY2FsRmllbGRdLnB1c2goZG9jW2xvY2FsRmllbGRdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH0sXG4gICAgICAgIHt9XG4gICAgICApO1xuXG4gICAgICB0aGlzLmxvb2t1cE9ic2VydmVycyA9IGxvb2t1cHMubWFwKFxuICAgICAgICAoe1xuICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgbG9jYWxGaWVsZCxcbiAgICAgICAgICBmb3JlaWduRmllbGQsXG4gICAgICAgICAgc2VsZWN0b3IgPSB7fSxcbiAgICAgICAgICBvcHRpb25zID0ge31cbiAgICAgICAgfSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGpvaW5RdWVyeSA9IHtcbiAgICAgICAgICAgIC4uLnNlbGVjdG9yLFxuICAgICAgICAgICAgW2ZvcmVpZ25GaWVsZF06IHsgJGluOiBsb2NhbEZpZWxkVmFsdWVzW2xvY2FsRmllbGRdIH1cbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgY29uc3Qgam9pbmVkRG9jc0N1cnNvciA9IGNvbGxlY3Rpb24uZmluZChqb2luUXVlcnksIG9wdGlvbnMpO1xuXG4gICAgICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBqb2luZWREb2NzQ3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgICAgICAgIGFkZGVkOiAoaWQsIGZpZWxkcykgPT4ge1xuICAgICAgICAgICAgICBzdWIuYWRkZWQoY29sbGVjdGlvbi5fbmFtZSwgaWQsIGZpZWxkcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2hhbmdlZDogKGlkLCBmaWVsZHMpID0+IHtcbiAgICAgICAgICAgICAgc3ViLmNoYW5nZWQoY29sbGVjdGlvbi5fbmFtZSwgaWQsIGZpZWxkcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVtb3ZlZDogaWQgPT4ge1xuICAgICAgICAgICAgICBzdWIucmVtb3ZlZChjb2xsZWN0aW9uLl9uYW1lLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICByZXR1cm4gb2JzZXJ2ZXI7XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgX3B1Ymxpc2hDdXJzb3Ioc3ViKSB7XG4gICAgdGhpcy5zdWIgPSBzdWI7XG5cbiAgICB0aGlzLnB1Ymxpc2hMb29rdXBzKCk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3RvcDogdGhpcy5zdG9wLmJpbmQodGhpcylcbiAgICB9O1xuICB9XG5cbiAgcHVibGlzaExvb2t1cHMoKSB7XG4gICAgY29uc3QgeyBjb2xsZWN0aW9uLCBzZWxlY3Rvciwgb3B0aW9ucywgc3ViIH0gPSB0aGlzO1xuXG4gICAgY29uc3QgY3Vyc29yID0gY29sbGVjdGlvbi5maW5kKHNlbGVjdG9yLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IG9ic2VydmVyID0gY3Vyc29yLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgIGFkZGVkOiAoaWQsIGZpZWxkcykgPT4ge1xuICAgICAgICBzdWIuYWRkZWQoY29sbGVjdGlvbi5fbmFtZSwgaWQsIGZpZWxkcyk7XG5cbiAgICAgICAgdGhpcy5yZXB1Ymxpc2hMb29rdXBzKCk7XG4gICAgICB9LFxuICAgICAgY2hhbmdlZDogKGlkLCBmaWVsZHMpID0+IHtcbiAgICAgICAgc3ViLmNoYW5nZWQoY29sbGVjdGlvbi5fbmFtZSwgaWQsIGZpZWxkcyk7XG5cbiAgICAgICAgY29uc3QgbG9va3VwRmllbGRzS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMubG9va3VwRmllbGRzKTtcbiAgICAgICAgY29uc3QgY2hhbmdlZEtleXMgPSBPYmplY3Qua2V5cyhmaWVsZHMpO1xuXG4gICAgICAgIGNvbnN0IGludGVyc2VjdGlvbiA9IGxvb2t1cEZpZWxkc0tleXMuZmlsdGVyKHZhbHVlID0+XG4gICAgICAgICAgY2hhbmdlZEtleXMuaW5jbHVkZXModmFsdWUpXG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgaXNMb29rdXBGaWVsZENoYW5nZWQgPSBpbnRlcnNlY3Rpb24ubGVuZ3RoID4gMDtcblxuICAgICAgICBpZiAoaXNMb29rdXBGaWVsZENoYW5nZWQpIHtcbiAgICAgICAgICB0aGlzLnJlcHVibGlzaExvb2t1cHMoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHJlbW92ZWQ6IGlkID0+IHtcbiAgICAgICAgc3ViLnJlbW92ZWQoY29sbGVjdGlvbi5fbmFtZSwgaWQpO1xuXG4gICAgICAgIHRoaXMucmVwdWJsaXNoTG9va3VwcygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5wcmltYXJ5T2JzZXJ2ZXIgPSBvYnNlcnZlcjtcbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgaWYgKHByaW1hcnlPYnNlcnZlcikge1xuICAgICAgdGhpcy5wcmltYXJ5T2JzZXJ2ZXIuc3RvcCgpO1xuICAgIH1cbiAgICB0aGlzLmxvb2t1cE9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IHtcbiAgICAgIG9ic2VydmVyLnN0b3AoKTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaXNoTG9va3VwO1xuIiwiaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSBcIm1ldGVvci9tZXRlb3JcIjtcblxuY29uc3QgdGltZW91dE1zID0gMTAwO1xuZXhwb3J0IGNvbnN0IGRlYm91bmNlZCA9IGZuID0+IHtcbiAgbGV0IHRpbWVvdXRJZCA9IHVuZGVmaW5lZDtcblxuICByZXR1cm4gKCkgPT4ge1xuICAgIGlmICh0aW1lb3V0SWQpIHtcbiAgICAgIE1ldGVvci5jbGVhclRpbWVvdXQodGltZW91dElkKTtcbiAgICB9XG5cbiAgICB0aW1lb3V0SWQgPSBNZXRlb3Iuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBmbigpO1xuICAgIH0sIHRpbWVvdXRNcyk7XG4gIH07XG59O1xuIl19
