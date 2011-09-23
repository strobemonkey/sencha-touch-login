Ext.regController('Config', {
    
    beforeFilter: App.requireUser,
    
    store: App.stores.config,

    editForm: function() {
        
        App.views.configForm.addEvents('beforeactivate');
        App.views.configForm.addListener({
            beforeactivate: function() {
                var deleteButton = this.down('#configFormDeleteButton'),
                    titlebar = this.down('#configFormTitlebar'),
                    model = this.getRecord();

            }
        });

        App.views.viewport.reveal('configForm');

    }

});
