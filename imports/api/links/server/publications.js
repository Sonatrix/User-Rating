// All links-related publications

import { Meteor } from 'meteor/meteor';
import { UsersRating } from '../links.js';


Meteor.publish('usersRating', function() {
    return UsersRating.find();
});