// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { UsersRating } from '../../api/links/links.js';

Meteor.startup(() => {
    // if the Links collection is empty
    if (UsersRating.find().count() === 0) {
        const data = [{
                username: 'abc@gmail.com',
                rating: 3,
                createdAt: new Date(),
            },
            {
                username: 'a@gmail.com',
                rating: 3,
                createdAt: new Date(),
            },
            {
                username: 'b@gmail.com',
                rating: 3,
                createdAt: new Date(),
            },
            {
                username: 'c@gmail.com',
                rating: 3,
                createdAt: new Date(),
            },
        ];

        data.forEach(user => UsersRating.insert(user));
    }

    Accounts.onCreateUser(function(options, user) {
        // Use provided profile in options, or create an empty object
        user.profile = options.profile || {};
        // Assigns first and last names to the newly created user object
        user.rating = 0;
        // Returns the user object
        return user;
    });
});