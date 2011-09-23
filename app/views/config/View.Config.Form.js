App.views.ConfigForm = Ext.extend(Ext.form.FormPanel, {
    defaultInstructions: 'This page requires authentication to be able to see it.',

    initComponent: function(){
        var titlebar, cancelButton, buttonbar, fields, config;

        cancelButton = {
            text: 'cancel',
            ui: 'back',
            handler: this.onCancelAction,
            scope: this
        };

        titlebar = {
            id: 'configFormTitlebar',
            xtype: 'toolbar',
            title: 'Create config',
            items: [ cancelButton ]
        };

        buttonbar = {
            xtype: 'toolbar',
            dock: 'bottom',
            items: []
        };
        
        fields = {
            xtype: 'fieldset',
            id: 'configFormFieldset',
            title: 'Config details',
            instructions: this.defaultInstructions,
            defaults: {
                xtype: 'textfield',
                labelAlign: 'left',
                labelWidth: '40%',
                required: false,
                useClearIcon: true,
                autoCapitalize : false
            },
            items: [
            ]
        };

        config = {
            scroll: 'vertical',
            dockedItems: [ titlebar, buttonbar ],
            items: [ fields ]
        };

        Ext.apply(this, config);

        App.views.ConfigForm.superclass.initComponent.call(this);
    },

    onCancelAction: function() {
        Ext.dispatch({
            controller: 'Main',
            action: 'index'
        });
    }

});

Ext.reg('App.views.ConfigForm', App.views.ConfigForm);
