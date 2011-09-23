App.models.Session = Ext.regModel('Session', {
    fields: [
        {
            name: 'id',
            type: 'int'
        }, {
            name: 'username',
            type: 'string',
        }, {
            name: 'password',
            type: 'string'
		}, {
		    name: 'authToken',
		    type: 'string'
	    }
    ],

    proxy: {
        type: 'sessionstorage',
        id: 'login-user'
    }
    
});