// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { UsersRating } from './links.js';

Meteor.methods({
    'rating.insert' (username, rating) {
        console.log(username, rating);
        return UsersRating.insert({
            username,
            rating,
            createdAt: new Date(),
        });
    },
    'getListOfUsers' () {
        return UsersRating.find().count();
    }
});