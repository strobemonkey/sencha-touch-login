Ext.regController('UserSessions', {
    
    store: App.stores.sessions,

    new: function() {
        
        this.destroy();
        
        var model = new App.models.Session();

        App.views.loginForm.load(model);
        
        App.views.loginForm.query('#loginFormLoginButton')[0].on({
            tap: function() { this.save(model, App.views.loginForm.getValues(), this); },
            scope: this
        });
        
        App.views.loginForm.query('#loginFormResetButton')[0].on({
            tap: function() { App.views.loginForm.reset() },
            scope: this
        });
        
        App.views.viewport.reveal('loginForm');
        
    },
    
    save: function(record, data, form) {

        console.log("Controller.Sessions.save");
        
        data.authToken = this.getAuthToken();

        record.set(data);
        var errors = record.validate();

        if (errors.isValid()) {
            this.store.create(data);
            console.log("Controller.Sessions.save login success");

            Ext.dispatch({
                controller: 'Main',
                action: 'index'
            });
            
        } else {
            console.log("Controller.Sessions.save login failed");
            form.showErrors(errors);
        }
        
    },

    destroy: function() {
        console.log("Controller.Sessions.destroy");
    },
    
    getAuthToken: function() {
        // TODO put your server login code here
        // and set the authToken
        return "notavalidauthtoken";
    }
    
});
