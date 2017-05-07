import './rating.html';
import { UsersRating } from '/imports/api/links/links.js';
import { Meteor } from 'meteor/meteor';

Template.rating.onCreated(function helloOnCreated() {
    Meteor.subscribe('usersRating');
});

Template.rating.rendered = () => {
    renderRatingChart();
};

Template.rating.helpers({
    users() {
        let users = UsersRating.find({});
        if (users) {
            let uniuesrs = _.uniq(users.map((user, index) => {
                return user.username;
            }));
            let data = [];
            let chartData = [];
            for (let i = 0; i < uniuesrs.length; i++) {
                let json = {};
                json['_id'] = i;
                json['username'] = uniuesrs[i];
                json['rating'] = 0;
                let filteredData = users.map((user) => {
                    if (user.username === uniuesrs[i])
                        return user.rating;
                });
                chartData.push([uniuesrs[i], getAvg(filteredData)]);
                data.push(json);
            }
            setTimeout(() => {
                renderRatingChart('container', chartData);
            }, 1000);

            return data;
        }
    },
});

Template.rating.events({
    'submit .info-link-add' (event) {
        event.preventDefault();

        const target = event.target;
        const username = target.username;
        const rating = target.rating;
        Meteor.call('rating.insert', username.value, rating.value, (error) => {
            if (error) {
                alert(error.error);
            } else {
                username.value = '';
                rating.value = '';
            }
        });
    },
    'click .incrementRating' (event) {
        event.preventDefault();
        let id = $(event.currentTarget).attr('id');
        let username = $('#user_' + id).val();
        let rating = $('#rating_' + id).val();
        if (rating > 0 && rating <= 5) {
            Meteor.call('rating.insert', username, rating, (error) => {
                if (error) {
                    alert(error.error);
                } else {
                    //nothing to do
                }
            });
        } else {
            alert('please enter rating between 1-5');
        }

    },
    'click .addMeRating' (event) {
        let email = Meteor.user().emails[0].address;
        Meteor.call('rating.insert', email, 0, (error) => {
            if (error) {
                alert(error.error);
            } else {
                //nothing to do
            }
        });
    }
});

let getAvg = (data) => {
    let sum = 0,
        l = 0;
    for (let i = 0; i < data.length; i++) {
        sum += parseFloat(data[i] != undefined ? data[i] : 0);
        if (data[i] && data[i] != 0)
            l += 1;
    }
    if (sum) {
        return sum / l;
    }
    return sum;
}

let renderRatingChart = (container, data) => {
    Highcharts.chart(container, {
        chart: {
            type: 'bar'
        },
        title: {
            text: 'Average Rating of users'
        },
        subtitle: {
            text: ''
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: 0,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Rating'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Rating: <b>{point.y:.2f}</b>'
        },
        credits: {
            enabled: false
        },
        series: [{
            name: 'Rating',
            data: data,
            dataLabels: {
                enabled: true,
                color: '#FFFFFF',
                align: 'right',
                format: '{point.y:.2f}', // one decimal
                y: 0, // 10 pixels down from the top
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        }]
    });
}