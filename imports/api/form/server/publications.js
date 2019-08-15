/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import Expense from "../../../startup/both/Expenses";
import Images from "../../../startup/both/Images";
import { Promise } from 'meteor/promise';
import Moment from "moment";

Meteor.publish('expense.six_month', () => {
    if(!Meteor.userId()) return false;
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

Meteor.publish('expense.this_month', function() {
    if(!Meteor.userId()) return false;
    let first_run = true;
    const self = this;
    const start_date = Moment().startOf('month').startOf('day').format();
    const end_date = Moment().endOf('month').endOf('day').format();
    const query = { 
        userId: Meteor.userId()
    };
    Expense.find(query).observeChanges({
        added: (id, obj) => {
            if(!first_run){
                newImage = Images.findOne(obj.fileId);
                if(newImage){
                    self.added('expenses', id, { 
                        ...obj,
                        image: newImage.fetch()
                    })
                }
            }
        },
        removed: (id) => {
            if(!first_run){
                self.removed('expenses', id);
            }
        }
    });
    const fetchHandle = () => {
        const expenses = Promise.await(Expense.aggregate([
            { $match: query },
            {
                $lookup: {
                    from: "Images",
                    localField: "fileId",
                    foreignField: "_id",
                    as: "image"
                }
            },
            {
                "$project": {
                    "_id": 1,
                    "amount": 1,
                    "desc": 1,
                    "image": 1,
                    "date": 1
                }
            }
        ]).toArray());
        expenses.map((obj) => {
            self.added("expenses", obj._id, { ...obj });
        });
        if(first_run){
            first_run = false;
            self.ready();
        }
    }
    fetchHandle();
});