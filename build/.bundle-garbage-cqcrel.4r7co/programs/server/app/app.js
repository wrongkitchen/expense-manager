var require = meteorInstall({"imports":{"api":{"form":{"server":{"methods.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/api/form/server/methods.js                                                        //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Expenses;
module.link("../../../startup/both/Expenses", {
  default(v) {
    Expenses = v;
  }

}, 1);
Meteor.methods({
  "form.insert": (amount, date, fileId, desc, type) => {
    return Expenses.insert({
      userId: Meteor.userId(),
      amount,
      date,
      fileId,
      desc,
      type
    });
  },
  "form.remove": id => {
    return Expenses.remove({
      userId: Meteor.userId(),
      _id: id
    });
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/api/form/server/publications.js                                                   //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
let Expense;
module.link("../../../startup/both/Expenses", {
  default(v) {
    Expense = v;
  }

}, 1);
let Images;
module.link("../../../startup/both/Images", {
  default(v) {
    Images = v;
  }

}, 2);
let Promise;
module.link("meteor/promise", {
  Promise(v) {
    Promise = v;
  }

}, 3);
let Moment;
module.link("moment", {
  default(v) {
    Moment = v;
  }

}, 4);
Meteor.publish('expense.six_month', () => {
  if (!Meteor.userId()) return false;
  let current_date = Moment().endOf('month').endOf('day').format();
  let target_date = Moment().startOf('month').startOf('day').subtract(5, 'months').format();
  return Expense.find({
    userId: Meteor.userId(),
    date: {
      $gte: new Date(target_date),
      $lt: new Date(current_date)
    }
  });
});
Meteor.publish('expense.this_month', function () {
  if (!Meteor.userId()) return false;
  let first_run = true;
  const self = this;
  const start_date = Moment().startOf('month').startOf('day').format();
  const end_date = Moment().endOf('month').endOf('day').format();
  const query = {
    userId: Meteor.userId(),
    date: {
      $gte: new Date(start_date),
      $lt: new Date(end_date)
    }
  };
  Expense.find(query).observeChanges({
    added: (id, obj) => {
      if (!first_run) {
        newImage = Images.findOne(obj.fileId);

        if (newImage) {
          self.added('expenses', id, (0, _objectSpread2.default)({}, obj, {
            image: newImage.fetch()
          }));
        }
      }
    },
    removed: id => {
      if (!first_run) {
        self.removed('expenses', id);
      }
    }
  });

  const fetchHandle = () => {
    const expenses = Promise.await(Expense.aggregate([{
      $match: query
    }, {
      $lookup: {
        from: "Images",
        localField: "fileId",
        foreignField: "_id",
        as: "image"
      }
    }, {
      "$project": {
        "_id": 1,
        "amount": 1,
        "desc": 1,
        "image": 1
      }
    }]).toArray());
    expenses.map(obj => {
      self.added("expenses", obj._id, (0, _objectSpread2.default)({}, obj));
    });

    if (first_run) {
      first_run = false;
      self.ready();
    }
  };

  fetchHandle();
});
///////////////////////////////////////////////////////////////////////////////////////////////

}}},"users":{"server":{"methods.js":function(){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/api/users/server/methods.js                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
///////////////////////////////////////////////////////////////////////////////////////////////

},"publications.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/api/users/server/publications.js                                                  //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
let Meteor;
module.link("meteor/meteor", {
  Meteor(v) {
    Meteor = v;
  }

}, 0);
Meteor.publish('users', () => Meteor.users.find());
///////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup":{"both":{"Expenses.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/startup/both/Expenses.js                                                          //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
let Mongo;
module.link("meteor/mongo", {
  Mongo(v) {
    Mongo = v;
  }

}, 0);
module.exportDefault(Expenses = new Mongo.Collection('expenses'));
///////////////////////////////////////////////////////////////////////////////////////////////

},"Images.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/startup/both/Images.js                                                            //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.export({
  StoragePath: () => StoragePath
});
let FilesCollection;
module.link("meteor/ostrio:files", {
  FilesCollection(v) {
    FilesCollection = v;
  }

}, 0);
const StoragePath = Meteor.settings.STORAGE_PATH;
const Images = new FilesCollection({
  collectionName: 'Images',
  storagePath: StoragePath
});
module.exportDefault(Images);
///////////////////////////////////////////////////////////////////////////////////////////////

}},"server":{"api.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/startup/server/api.js                                                             //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.link("../both/Images");
module.link("../../api/form/server/methods");
module.link("../../api/form/server/publications");
module.link("../../api/users/server/methods");
module.link("../../api/users/server/publications");
///////////////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/startup/server/index.js                                                           //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.link("./api");
module.link("./route");
///////////////////////////////////////////////////////////////////////////////////////////////

},"route.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// imports/startup/server/route.js                                                           //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
let Picker;
module.link("meteor/meteorhacks:picker", {
  Picker(v) {
    Picker = v;
  }

}, 0);
let StoragePath;
module.link("../both/Images", {
  StoragePath(v) {
    StoragePath = v;
  }

}, 1);
let fs;
module.link("fs", {
  default(v) {
    fs = v;
  }

}, 2);
Picker.route('/file/:path', function (params, req, res, next) {
  if (fs.existsSync(StoragePath + "/" + params.path)) {
    const file = fs.readFileSync(StoragePath + "/" + params.path);
    res.end(file);
  } else {
    res.end("File not found.");
  }
});
///////////////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                           //
// server/main.js                                                                            //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////
                                                                                             //
module.link("../imports/startup/server/index");
///////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});

require("/server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZm9ybS9zZXJ2ZXIvbWV0aG9kcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9hcGkvZm9ybS9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL2FwaS91c2Vycy9zZXJ2ZXIvcHVibGljYXRpb25zLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvYm90aC9FeHBlbnNlcy5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL2JvdGgvSW1hZ2VzLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2FwaS5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9pbmRleC5qcyIsIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL3NlcnZlci9yb3V0ZS5qcyIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL21haW4uanMiXSwibmFtZXMiOlsiTWV0ZW9yIiwibW9kdWxlIiwibGluayIsInYiLCJFeHBlbnNlcyIsImRlZmF1bHQiLCJtZXRob2RzIiwiYW1vdW50IiwiZGF0ZSIsImZpbGVJZCIsImRlc2MiLCJ0eXBlIiwiaW5zZXJ0IiwidXNlcklkIiwiaWQiLCJyZW1vdmUiLCJfaWQiLCJFeHBlbnNlIiwiSW1hZ2VzIiwiUHJvbWlzZSIsIk1vbWVudCIsInB1Ymxpc2giLCJjdXJyZW50X2RhdGUiLCJlbmRPZiIsImZvcm1hdCIsInRhcmdldF9kYXRlIiwic3RhcnRPZiIsInN1YnRyYWN0IiwiZmluZCIsIiRndGUiLCJEYXRlIiwiJGx0IiwiZmlyc3RfcnVuIiwic2VsZiIsInN0YXJ0X2RhdGUiLCJlbmRfZGF0ZSIsInF1ZXJ5Iiwib2JzZXJ2ZUNoYW5nZXMiLCJhZGRlZCIsIm9iaiIsIm5ld0ltYWdlIiwiZmluZE9uZSIsImltYWdlIiwiZmV0Y2giLCJyZW1vdmVkIiwiZmV0Y2hIYW5kbGUiLCJleHBlbnNlcyIsImF3YWl0IiwiYWdncmVnYXRlIiwiJG1hdGNoIiwiJGxvb2t1cCIsImZyb20iLCJsb2NhbEZpZWxkIiwiZm9yZWlnbkZpZWxkIiwiYXMiLCJ0b0FycmF5IiwibWFwIiwicmVhZHkiLCJ1c2VycyIsIk1vbmdvIiwiZXhwb3J0RGVmYXVsdCIsIkNvbGxlY3Rpb24iLCJleHBvcnQiLCJTdG9yYWdlUGF0aCIsIkZpbGVzQ29sbGVjdGlvbiIsInNldHRpbmdzIiwiU1RPUkFHRV9QQVRIIiwiY29sbGVjdGlvbk5hbWUiLCJzdG9yYWdlUGF0aCIsIlBpY2tlciIsImZzIiwicm91dGUiLCJwYXJhbXMiLCJyZXEiLCJyZXMiLCJuZXh0IiwiZXhpc3RzU3luYyIsInBhdGgiLCJmaWxlIiwicmVhZEZpbGVTeW5jIiwiZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUlBLE1BQUo7QUFBV0MsTUFBTSxDQUFDQyxJQUFQLENBQVksZUFBWixFQUE0QjtBQUFDRixRQUFNLENBQUNHLENBQUQsRUFBRztBQUFDSCxVQUFNLEdBQUNHLENBQVA7QUFBUzs7QUFBcEIsQ0FBNUIsRUFBa0QsQ0FBbEQ7QUFBcUQsSUFBSUMsUUFBSjtBQUFhSCxNQUFNLENBQUNDLElBQVAsQ0FBWSxnQ0FBWixFQUE2QztBQUFDRyxTQUFPLENBQUNGLENBQUQsRUFBRztBQUFDQyxZQUFRLEdBQUNELENBQVQ7QUFBVzs7QUFBdkIsQ0FBN0MsRUFBc0UsQ0FBdEU7QUFJN0VILE1BQU0sQ0FBQ00sT0FBUCxDQUFlO0FBQ1gsaUJBQWUsQ0FBQ0MsTUFBRCxFQUFTQyxJQUFULEVBQWVDLE1BQWYsRUFBdUJDLElBQXZCLEVBQTZCQyxJQUE3QixLQUFzQztBQUNqRCxXQUFPUCxRQUFRLENBQUNRLE1BQVQsQ0FBZ0I7QUFBRUMsWUFBTSxFQUFFYixNQUFNLENBQUNhLE1BQVAsRUFBVjtBQUEyQk4sWUFBM0I7QUFBbUNDLFVBQW5DO0FBQXlDQyxZQUF6QztBQUFpREMsVUFBakQ7QUFBdURDO0FBQXZELEtBQWhCLENBQVA7QUFDSCxHQUhVO0FBSVgsaUJBQWdCRyxFQUFELElBQVE7QUFDbkIsV0FBT1YsUUFBUSxDQUFDVyxNQUFULENBQWdCO0FBQUVGLFlBQU0sRUFBRWIsTUFBTSxDQUFDYSxNQUFQLEVBQVY7QUFBMkJHLFNBQUcsRUFBRUY7QUFBaEMsS0FBaEIsQ0FBUDtBQUNIO0FBTlUsQ0FBZixFOzs7Ozs7Ozs7Ozs7Ozs7QUNKQSxJQUFJZCxNQUFKO0FBQVdDLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGVBQVosRUFBNEI7QUFBQ0YsUUFBTSxDQUFDRyxDQUFELEVBQUc7QUFBQ0gsVUFBTSxHQUFDRyxDQUFQO0FBQVM7O0FBQXBCLENBQTVCLEVBQWtELENBQWxEO0FBQXFELElBQUljLE9BQUo7QUFBWWhCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaLEVBQTZDO0FBQUNHLFNBQU8sQ0FBQ0YsQ0FBRCxFQUFHO0FBQUNjLFdBQU8sR0FBQ2QsQ0FBUjtBQUFVOztBQUF0QixDQUE3QyxFQUFxRSxDQUFyRTtBQUF3RSxJQUFJZSxNQUFKO0FBQVdqQixNQUFNLENBQUNDLElBQVAsQ0FBWSw4QkFBWixFQUEyQztBQUFDRyxTQUFPLENBQUNGLENBQUQsRUFBRztBQUFDZSxVQUFNLEdBQUNmLENBQVA7QUFBUzs7QUFBckIsQ0FBM0MsRUFBa0UsQ0FBbEU7QUFBcUUsSUFBSWdCLE9BQUo7QUFBWWxCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUNpQixTQUFPLENBQUNoQixDQUFELEVBQUc7QUFBQ2dCLFdBQU8sR0FBQ2hCLENBQVI7QUFBVTs7QUFBdEIsQ0FBN0IsRUFBcUQsQ0FBckQ7QUFBd0QsSUFBSWlCLE1BQUo7QUFBV25CLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLFFBQVosRUFBcUI7QUFBQ0csU0FBTyxDQUFDRixDQUFELEVBQUc7QUFBQ2lCLFVBQU0sR0FBQ2pCLENBQVA7QUFBUzs7QUFBckIsQ0FBckIsRUFBNEMsQ0FBNUM7QUFPblRILE1BQU0sQ0FBQ3FCLE9BQVAsQ0FBZSxtQkFBZixFQUFvQyxNQUFNO0FBQ3RDLE1BQUcsQ0FBQ3JCLE1BQU0sQ0FBQ2EsTUFBUCxFQUFKLEVBQXFCLE9BQU8sS0FBUDtBQUNyQixNQUFJUyxZQUFZLEdBQUdGLE1BQU0sR0FBR0csS0FBVCxDQUFlLE9BQWYsRUFBd0JBLEtBQXhCLENBQThCLEtBQTlCLEVBQXFDQyxNQUFyQyxFQUFuQjtBQUNBLE1BQUlDLFdBQVcsR0FBR0wsTUFBTSxHQUFHTSxPQUFULENBQWlCLE9BQWpCLEVBQTBCQSxPQUExQixDQUFrQyxLQUFsQyxFQUF5Q0MsUUFBekMsQ0FBa0QsQ0FBbEQsRUFBcUQsUUFBckQsRUFBK0RILE1BQS9ELEVBQWxCO0FBQ0EsU0FBT1AsT0FBTyxDQUFDVyxJQUFSLENBQWE7QUFDaEJmLFVBQU0sRUFBRWIsTUFBTSxDQUFDYSxNQUFQLEVBRFE7QUFFaEJMLFFBQUksRUFBRTtBQUNGcUIsVUFBSSxFQUFFLElBQUlDLElBQUosQ0FBU0wsV0FBVCxDQURKO0FBRUZNLFNBQUcsRUFBRSxJQUFJRCxJQUFKLENBQVNSLFlBQVQ7QUFGSDtBQUZVLEdBQWIsQ0FBUDtBQU9ILENBWEQ7QUFhQXRCLE1BQU0sQ0FBQ3FCLE9BQVAsQ0FBZSxvQkFBZixFQUFxQyxZQUFXO0FBQzVDLE1BQUcsQ0FBQ3JCLE1BQU0sQ0FBQ2EsTUFBUCxFQUFKLEVBQXFCLE9BQU8sS0FBUDtBQUNyQixNQUFJbUIsU0FBUyxHQUFHLElBQWhCO0FBQ0EsUUFBTUMsSUFBSSxHQUFHLElBQWI7QUFDQSxRQUFNQyxVQUFVLEdBQUdkLE1BQU0sR0FBR00sT0FBVCxDQUFpQixPQUFqQixFQUEwQkEsT0FBMUIsQ0FBa0MsS0FBbEMsRUFBeUNGLE1BQXpDLEVBQW5CO0FBQ0EsUUFBTVcsUUFBUSxHQUFHZixNQUFNLEdBQUdHLEtBQVQsQ0FBZSxPQUFmLEVBQXdCQSxLQUF4QixDQUE4QixLQUE5QixFQUFxQ0MsTUFBckMsRUFBakI7QUFDQSxRQUFNWSxLQUFLLEdBQUc7QUFDVnZCLFVBQU0sRUFBRWIsTUFBTSxDQUFDYSxNQUFQLEVBREU7QUFFVkwsUUFBSSxFQUFFO0FBQ0ZxQixVQUFJLEVBQUUsSUFBSUMsSUFBSixDQUFTSSxVQUFULENBREo7QUFFRkgsU0FBRyxFQUFFLElBQUlELElBQUosQ0FBU0ssUUFBVDtBQUZIO0FBRkksR0FBZDtBQU9BbEIsU0FBTyxDQUFDVyxJQUFSLENBQWFRLEtBQWIsRUFBb0JDLGNBQXBCLENBQW1DO0FBQy9CQyxTQUFLLEVBQUUsQ0FBQ3hCLEVBQUQsRUFBS3lCLEdBQUwsS0FBYTtBQUNoQixVQUFHLENBQUNQLFNBQUosRUFBYztBQUNWUSxnQkFBUSxHQUFHdEIsTUFBTSxDQUFDdUIsT0FBUCxDQUFlRixHQUFHLENBQUM5QixNQUFuQixDQUFYOztBQUNBLFlBQUcrQixRQUFILEVBQVk7QUFDUlAsY0FBSSxDQUFDSyxLQUFMLENBQVcsVUFBWCxFQUF1QnhCLEVBQXZCLGtDQUNPeUIsR0FEUDtBQUVJRyxpQkFBSyxFQUFFRixRQUFRLENBQUNHLEtBQVQ7QUFGWDtBQUlIO0FBQ0o7QUFDSixLQVg4QjtBQVkvQkMsV0FBTyxFQUFHOUIsRUFBRCxJQUFRO0FBQ2IsVUFBRyxDQUFDa0IsU0FBSixFQUFjO0FBQ1ZDLFlBQUksQ0FBQ1csT0FBTCxDQUFhLFVBQWIsRUFBeUI5QixFQUF6QjtBQUNIO0FBQ0o7QUFoQjhCLEdBQW5DOztBQWtCQSxRQUFNK0IsV0FBVyxHQUFHLE1BQU07QUFDdEIsVUFBTUMsUUFBUSxHQUFHM0IsT0FBTyxDQUFDNEIsS0FBUixDQUFjOUIsT0FBTyxDQUFDK0IsU0FBUixDQUFrQixDQUM3QztBQUFFQyxZQUFNLEVBQUViO0FBQVYsS0FENkMsRUFFN0M7QUFDSWMsYUFBTyxFQUFFO0FBQ0xDLFlBQUksRUFBRSxRQUREO0FBRUxDLGtCQUFVLEVBQUUsUUFGUDtBQUdMQyxvQkFBWSxFQUFFLEtBSFQ7QUFJTEMsVUFBRSxFQUFFO0FBSkM7QUFEYixLQUY2QyxFQVU3QztBQUNJLGtCQUFZO0FBQ1IsZUFBTyxDQURDO0FBRVIsa0JBQVUsQ0FGRjtBQUdSLGdCQUFRLENBSEE7QUFJUixpQkFBUztBQUpEO0FBRGhCLEtBVjZDLENBQWxCLEVBa0I1QkMsT0FsQjRCLEVBQWQsQ0FBakI7QUFtQkFULFlBQVEsQ0FBQ1UsR0FBVCxDQUFjakIsR0FBRCxJQUFTO0FBQ2xCTixVQUFJLENBQUNLLEtBQUwsQ0FBVyxVQUFYLEVBQXVCQyxHQUFHLENBQUN2QixHQUEzQixrQ0FBcUN1QixHQUFyQztBQUNILEtBRkQ7O0FBR0EsUUFBR1AsU0FBSCxFQUFhO0FBQ1RBLGVBQVMsR0FBRyxLQUFaO0FBQ0FDLFVBQUksQ0FBQ3dCLEtBQUw7QUFDSDtBQUNKLEdBM0JEOztBQTRCQVosYUFBVztBQUNkLENBNURELEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCQSxJQUFJN0MsTUFBSjtBQUFXQyxNQUFNLENBQUNDLElBQVAsQ0FBWSxlQUFaLEVBQTRCO0FBQUNGLFFBQU0sQ0FBQ0csQ0FBRCxFQUFHO0FBQUNILFVBQU0sR0FBQ0csQ0FBUDtBQUFTOztBQUFwQixDQUE1QixFQUFrRCxDQUFsRDtBQUdYSCxNQUFNLENBQUNxQixPQUFQLENBQWUsT0FBZixFQUF3QixNQUFNckIsTUFBTSxDQUFDMEQsS0FBUCxDQUFhOUIsSUFBYixFQUE5QixFOzs7Ozs7Ozs7OztBQ0hBLElBQUkrQixLQUFKO0FBQVUxRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxjQUFaLEVBQTJCO0FBQUN5RCxPQUFLLENBQUN4RCxDQUFELEVBQUc7QUFBQ3dELFNBQUssR0FBQ3hELENBQU47QUFBUTs7QUFBbEIsQ0FBM0IsRUFBK0MsQ0FBL0M7QUFBVkYsTUFBTSxDQUFDMkQsYUFBUCxDQUVleEQsUUFBUSxHQUFHLElBQUl1RCxLQUFLLENBQUNFLFVBQVYsQ0FBcUIsVUFBckIsQ0FGMUIsRTs7Ozs7Ozs7Ozs7QUNBQTVELE1BQU0sQ0FBQzZELE1BQVAsQ0FBYztBQUFDQyxhQUFXLEVBQUMsTUFBSUE7QUFBakIsQ0FBZDtBQUE2QyxJQUFJQyxlQUFKO0FBQW9CL0QsTUFBTSxDQUFDQyxJQUFQLENBQVkscUJBQVosRUFBa0M7QUFBQzhELGlCQUFlLENBQUM3RCxDQUFELEVBQUc7QUFBQzZELG1CQUFlLEdBQUM3RCxDQUFoQjtBQUFrQjs7QUFBdEMsQ0FBbEMsRUFBMEUsQ0FBMUU7QUFFakUsTUFBTTRELFdBQVcsR0FBRy9ELE1BQU0sQ0FBQ2lFLFFBQVAsQ0FBZ0JDLFlBQXBDO0FBRUEsTUFBTWhELE1BQU0sR0FBRyxJQUFJOEMsZUFBSixDQUFvQjtBQUMvQkcsZ0JBQWMsRUFBRSxRQURlO0FBRS9CQyxhQUFXLEVBQUVMO0FBRmtCLENBQXBCLENBQWY7QUFKQTlELE1BQU0sQ0FBQzJELGFBQVAsQ0FVZTFDLE1BVmYsRTs7Ozs7Ozs7Ozs7QUNBQWpCLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaO0FBQThCRCxNQUFNLENBQUNDLElBQVAsQ0FBWSwrQkFBWjtBQUE2Q0QsTUFBTSxDQUFDQyxJQUFQLENBQVksb0NBQVo7QUFBa0RELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdDQUFaO0FBQThDRCxNQUFNLENBQUNDLElBQVAsQ0FBWSxxQ0FBWixFOzs7Ozs7Ozs7OztBQ0EzS0QsTUFBTSxDQUFDQyxJQUFQLENBQVksT0FBWjtBQUFxQkQsTUFBTSxDQUFDQyxJQUFQLENBQVksU0FBWixFOzs7Ozs7Ozs7OztBQ0FyQixJQUFJbUUsTUFBSjtBQUFXcEUsTUFBTSxDQUFDQyxJQUFQLENBQVksMkJBQVosRUFBd0M7QUFBQ21FLFFBQU0sQ0FBQ2xFLENBQUQsRUFBRztBQUFDa0UsVUFBTSxHQUFDbEUsQ0FBUDtBQUFTOztBQUFwQixDQUF4QyxFQUE4RCxDQUE5RDtBQUFpRSxJQUFJNEQsV0FBSjtBQUFnQjlELE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLGdCQUFaLEVBQTZCO0FBQUM2RCxhQUFXLENBQUM1RCxDQUFELEVBQUc7QUFBQzRELGVBQVcsR0FBQzVELENBQVo7QUFBYzs7QUFBOUIsQ0FBN0IsRUFBNkQsQ0FBN0Q7QUFBZ0UsSUFBSW1FLEVBQUo7QUFBT3JFLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZLElBQVosRUFBaUI7QUFBQ0csU0FBTyxDQUFDRixDQUFELEVBQUc7QUFBQ21FLE1BQUUsR0FBQ25FLENBQUg7QUFBSzs7QUFBakIsQ0FBakIsRUFBb0MsQ0FBcEM7QUFJbktrRSxNQUFNLENBQUNFLEtBQVAsQ0FBYSxhQUFiLEVBQTRCLFVBQVNDLE1BQVQsRUFBaUJDLEdBQWpCLEVBQXNCQyxHQUF0QixFQUEyQkMsSUFBM0IsRUFBaUM7QUFDekQsTUFBR0wsRUFBRSxDQUFDTSxVQUFILENBQWNiLFdBQVcsR0FBRyxHQUFkLEdBQW9CUyxNQUFNLENBQUNLLElBQXpDLENBQUgsRUFBa0Q7QUFDOUMsVUFBTUMsSUFBSSxHQUFHUixFQUFFLENBQUNTLFlBQUgsQ0FBZ0JoQixXQUFXLEdBQUcsR0FBZCxHQUFvQlMsTUFBTSxDQUFDSyxJQUEzQyxDQUFiO0FBQ0FILE9BQUcsQ0FBQ00sR0FBSixDQUFRRixJQUFSO0FBQ0gsR0FIRCxNQUdPO0FBQ0hKLE9BQUcsQ0FBQ00sR0FBSixDQUFRLGlCQUFSO0FBQ0g7QUFDSixDQVBELEU7Ozs7Ozs7Ozs7O0FDSkEvRSxNQUFNLENBQUNDLElBQVAsQ0FBWSxpQ0FBWixFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNZXRlb3IgfSBmcm9tIFwibWV0ZW9yL21ldGVvclwiO1xuXG5pbXBvcnQgRXhwZW5zZXMgZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvYm90aC9FeHBlbnNlc1wiO1xuXG5NZXRlb3IubWV0aG9kcyh7XG4gICAgXCJmb3JtLmluc2VydFwiOiAoYW1vdW50LCBkYXRlLCBmaWxlSWQsIGRlc2MsIHR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuIEV4cGVuc2VzLmluc2VydCh7IHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBhbW91bnQsIGRhdGUsIGZpbGVJZCwgZGVzYywgdHlwZSB9KVxuICAgIH0sXG4gICAgXCJmb3JtLnJlbW92ZVwiOiAoaWQpID0+IHtcbiAgICAgICAgcmV0dXJuIEV4cGVuc2VzLnJlbW92ZSh7IHVzZXJJZDogTWV0ZW9yLnVzZXJJZCgpLCBfaWQ6IGlkIH0pO1xuICAgIH1cbn0pOyIsIi8qIGVzbGludC1kaXNhYmxlIGltcG9ydC9uby11bnJlc29sdmVkICovXG5pbXBvcnQgeyBNZXRlb3IgfSBmcm9tICdtZXRlb3IvbWV0ZW9yJztcbmltcG9ydCBFeHBlbnNlIGZyb20gXCIuLi8uLi8uLi9zdGFydHVwL2JvdGgvRXhwZW5zZXNcIjtcbmltcG9ydCBJbWFnZXMgZnJvbSBcIi4uLy4uLy4uL3N0YXJ0dXAvYm90aC9JbWFnZXNcIjtcbmltcG9ydCB7IFByb21pc2UgfSBmcm9tICdtZXRlb3IvcHJvbWlzZSc7XG5pbXBvcnQgTW9tZW50IGZyb20gXCJtb21lbnRcIjtcblxuTWV0ZW9yLnB1Ymxpc2goJ2V4cGVuc2Uuc2l4X21vbnRoJywgKCkgPT4ge1xuICAgIGlmKCFNZXRlb3IudXNlcklkKCkpIHJldHVybiBmYWxzZTtcbiAgICBsZXQgY3VycmVudF9kYXRlID0gTW9tZW50KCkuZW5kT2YoJ21vbnRoJykuZW5kT2YoJ2RheScpLmZvcm1hdCgpO1xuICAgIGxldCB0YXJnZXRfZGF0ZSA9IE1vbWVudCgpLnN0YXJ0T2YoJ21vbnRoJykuc3RhcnRPZignZGF5Jykuc3VidHJhY3QoNSwgJ21vbnRocycpLmZvcm1hdCgpO1xuICAgIHJldHVybiBFeHBlbnNlLmZpbmQoeyBcbiAgICAgICAgdXNlcklkOiBNZXRlb3IudXNlcklkKCksIFxuICAgICAgICBkYXRlOiB7XG4gICAgICAgICAgICAkZ3RlOiBuZXcgRGF0ZSh0YXJnZXRfZGF0ZSksXG4gICAgICAgICAgICAkbHQ6IG5ldyBEYXRlKGN1cnJlbnRfZGF0ZSlcbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG5cbk1ldGVvci5wdWJsaXNoKCdleHBlbnNlLnRoaXNfbW9udGgnLCBmdW5jdGlvbigpIHtcbiAgICBpZighTWV0ZW9yLnVzZXJJZCgpKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IGZpcnN0X3J1biA9IHRydWU7XG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgY29uc3Qgc3RhcnRfZGF0ZSA9IE1vbWVudCgpLnN0YXJ0T2YoJ21vbnRoJykuc3RhcnRPZignZGF5JykuZm9ybWF0KCk7XG4gICAgY29uc3QgZW5kX2RhdGUgPSBNb21lbnQoKS5lbmRPZignbW9udGgnKS5lbmRPZignZGF5JykuZm9ybWF0KCk7XG4gICAgY29uc3QgcXVlcnkgPSB7IFxuICAgICAgICB1c2VySWQ6IE1ldGVvci51c2VySWQoKSxcbiAgICAgICAgZGF0ZToge1xuICAgICAgICAgICAgJGd0ZTogbmV3IERhdGUoc3RhcnRfZGF0ZSksXG4gICAgICAgICAgICAkbHQ6IG5ldyBEYXRlKGVuZF9kYXRlKVxuICAgICAgICB9XG4gICAgfTtcbiAgICBFeHBlbnNlLmZpbmQocXVlcnkpLm9ic2VydmVDaGFuZ2VzKHtcbiAgICAgICAgYWRkZWQ6IChpZCwgb2JqKSA9PiB7XG4gICAgICAgICAgICBpZighZmlyc3RfcnVuKXtcbiAgICAgICAgICAgICAgICBuZXdJbWFnZSA9IEltYWdlcy5maW5kT25lKG9iai5maWxlSWQpO1xuICAgICAgICAgICAgICAgIGlmKG5ld0ltYWdlKXtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRlZCgnZXhwZW5zZXMnLCBpZCwgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLm9iaixcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBuZXdJbWFnZS5mZXRjaCgpXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICByZW1vdmVkOiAoaWQpID0+IHtcbiAgICAgICAgICAgIGlmKCFmaXJzdF9ydW4pe1xuICAgICAgICAgICAgICAgIHNlbGYucmVtb3ZlZCgnZXhwZW5zZXMnLCBpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBmZXRjaEhhbmRsZSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgZXhwZW5zZXMgPSBQcm9taXNlLmF3YWl0KEV4cGVuc2UuYWdncmVnYXRlKFtcbiAgICAgICAgICAgIHsgJG1hdGNoOiBxdWVyeSB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRsb29rdXA6IHtcbiAgICAgICAgICAgICAgICAgICAgZnJvbTogXCJJbWFnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxGaWVsZDogXCJmaWxlSWRcIixcbiAgICAgICAgICAgICAgICAgICAgZm9yZWlnbkZpZWxkOiBcIl9pZFwiLFxuICAgICAgICAgICAgICAgICAgICBhczogXCJpbWFnZVwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcIiRwcm9qZWN0XCI6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJfaWRcIjogMSxcbiAgICAgICAgICAgICAgICAgICAgXCJhbW91bnRcIjogMSxcbiAgICAgICAgICAgICAgICAgICAgXCJkZXNjXCI6IDEsXG4gICAgICAgICAgICAgICAgICAgIFwiaW1hZ2VcIjogMVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgXSkudG9BcnJheSgpKTtcbiAgICAgICAgZXhwZW5zZXMubWFwKChvYmopID0+IHtcbiAgICAgICAgICAgIHNlbGYuYWRkZWQoXCJleHBlbnNlc1wiLCBvYmouX2lkLCB7IC4uLm9iaiB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGlmKGZpcnN0X3J1bil7XG4gICAgICAgICAgICBmaXJzdF9ydW4gPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYucmVhZHkoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmZXRjaEhhbmRsZSgpO1xufSk7IiwiLyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLXVucmVzb2x2ZWQgKi9cbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5NZXRlb3IucHVibGlzaCgndXNlcnMnLCAoKSA9PiBNZXRlb3IudXNlcnMuZmluZCgpKTsiLCJpbXBvcnQgeyBNb25nbyB9IGZyb20gJ21ldGVvci9tb25nbyc7XG5cbmV4cG9ydCBkZWZhdWx0IEV4cGVuc2VzID0gbmV3IE1vbmdvLkNvbGxlY3Rpb24oJ2V4cGVuc2VzJyk7XG4iLCJpbXBvcnQgeyBGaWxlc0NvbGxlY3Rpb24gfSBmcm9tICdtZXRlb3Ivb3N0cmlvOmZpbGVzJztcblxuY29uc3QgU3RvcmFnZVBhdGggPSBNZXRlb3Iuc2V0dGluZ3MuU1RPUkFHRV9QQVRIO1xuXG5jb25zdCBJbWFnZXMgPSBuZXcgRmlsZXNDb2xsZWN0aW9uKHtcbiAgICBjb2xsZWN0aW9uTmFtZTogJ0ltYWdlcycsXG4gICAgc3RvcmFnZVBhdGg6IFN0b3JhZ2VQYXRoXG59KTtcblxuZXhwb3J0IHsgU3RvcmFnZVBhdGggfTtcbmV4cG9ydCBkZWZhdWx0IEltYWdlczsiLCIvKipcbiAqIHVzZXJzXG4gKi9cblxuaW1wb3J0IFwiLi4vYm90aC9JbWFnZXNcIjtcbmltcG9ydCBcIi4uLy4uL2FwaS9mb3JtL3NlcnZlci9tZXRob2RzXCI7XG5pbXBvcnQgXCIuLi8uLi9hcGkvZm9ybS9zZXJ2ZXIvcHVibGljYXRpb25zXCI7XG5pbXBvcnQgJy4uLy4uL2FwaS91c2Vycy9zZXJ2ZXIvbWV0aG9kcyc7XG5pbXBvcnQgJy4uLy4uL2FwaS91c2Vycy9zZXJ2ZXIvcHVibGljYXRpb25zJzsiLCJpbXBvcnQgJy4vYXBpJztcbmltcG9ydCAnLi9yb3V0ZSc7XG4iLCJpbXBvcnQgeyBQaWNrZXIgfSBmcm9tICdtZXRlb3IvbWV0ZW9yaGFja3M6cGlja2VyJztcbmltcG9ydCB7IFN0b3JhZ2VQYXRoIH0gZnJvbSBcIi4uL2JvdGgvSW1hZ2VzXCI7XG5pbXBvcnQgZnMgZnJvbSBcImZzXCI7XG5cblBpY2tlci5yb3V0ZSgnL2ZpbGUvOnBhdGgnLCBmdW5jdGlvbihwYXJhbXMsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgaWYoZnMuZXhpc3RzU3luYyhTdG9yYWdlUGF0aCArIFwiL1wiICsgcGFyYW1zLnBhdGgpKXtcbiAgICAgICAgY29uc3QgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhTdG9yYWdlUGF0aCArIFwiL1wiICsgcGFyYW1zLnBhdGgpO1xuICAgICAgICByZXMuZW5kKGZpbGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcy5lbmQoXCJGaWxlIG5vdCBmb3VuZC5cIik7XG4gICAgfVxufSk7IiwiaW1wb3J0ICcuLi9pbXBvcnRzL3N0YXJ0dXAvc2VydmVyL2luZGV4JztcbiJdfQ==
