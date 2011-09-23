App = new Ext.Application({
    
    name: "App",

    requireUser: function() {
        if(App.isAuthenticated()) return true;
        Ext.redirect('login');
        return false;
    },
    
    // does a session record exist and is the authToken set?
    isAuthenticated: function() {
        var store,
            model;
            
        store = App.stores.sessions;
        if (!store) return false;
        model = store.first();
        if (!model) return false;
        return (model.get("authToken") !== null);
    },

    launch: function() {
        this.views.viewport = new this.views.Viewport();
        
        this.views.main = this.views.viewport.down('#main');
        this.views.configForm = this.views.viewport.down('#configForm');
        this.views.loginForm = this.views.viewport.down('#loginForm');
    }
    
});
