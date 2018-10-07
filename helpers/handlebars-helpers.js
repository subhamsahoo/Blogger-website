const moment = require('moment');

module.exports = {

    select: function (selected, options) {

        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');

    },

    generateTime: function (date,format) {
        return moment(date).format(format);
    },

    postBody: function (data) {
        if(data.length<100)
            return data;
        return data.substring(0,100)+'...';
        
    }
};