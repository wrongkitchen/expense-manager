import { Meteor } from "meteor/meteor";

import Expenses from "../../../startup/both/Expenses";

Meteor.methods({
    "form.insert": (amount, date, fileId, desc, type) => {
        return Expenses.insert({ userId: Meteor.userId(), amount, date, fileId, desc, type })
    },
    "form.remove": (id) => {
        return Expenses.remove({ userId: Meteor.userId(), _id: id });
    }
});