App.models.Config = Ext.regModel('Config', {
    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'server',
            type: 'string'
        }, {
            name: 'key',
            type: 'string'
        }, {
            name: 'nickname',
            type: 'string',
        }, {
            name: 'email',
            type: 'string'
        }, {
            name: 'gravatar',
            type: 'string'
        }, {
		    name: 'messaging',
		    type: 'string',
		    defaultValue: 'Polling'
		},{
		    name: 'timerInterval',
		    type: 'int',
		    defaultValue: 500
		}
    ],

    validations: [
        {
            type: 'format',
            name: 'server',
            matcher: /^https?:\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
            message: 'must be a valid url'
        }, {
            type: 'length',
            name: 'key',
            min: 6,
            message: 'must be at least 6 characters'
        }, {
            type: 'format',
            name: 'nickname',
            matcher: /^[a-zA-Z0-9]+$/,
            message: 'must only contain characters and numbers'
        }, {
            type: 'format',
            name: 'email',
            matcher: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            message: 'must be a valid email'
        }, {
            type: 'inclusion',
            name: 'messaging',
            list: ['polling', 'asynchronous', 'off'],
            message: 'must be either polling, asynchronous or off'
        }
    ],

    proxy: {
        type: 'localstorage',
        id: 'config-settings'
    },
    
    // Update the gravatar field based upon the email value.
    updateGravatar: function() {
        var email = this.get('email'),
            gravatar = Ext.util.MD5(email);
        
        this.set('gravatar', gravatar);
        
    }
    
});