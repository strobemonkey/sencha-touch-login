App.views.LoginForm = Ext.extend(Ext.form.FormPanel, {

    initComponent: function() {
        
        var saveButton, resetButton, config;

        saveButton = {
            id: 'loginFormLoginButton',
            text: 'save',
            ui: 'confirm',
            scope: this
        };

        resetButton = {
            id: 'loginFormResetButton',
            text: 'reset',
            ui: 'drastic',
            scope: this
        };

        config = {
            scroll: 'vertical',
            fullscreen: true,
            url: 'login',
            items: [{
                xtype: 'textfield',
                label: 'Login',
                name: 'username'
            },{
                xtype: 'passwordfield',
                label: 'Password',
                name: 'password'
            }],
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                    resetButton
                    ,
                    saveButton
                    ]
            }]
        };

        Ext.apply(this, config);
        
        App.views.LoginForm.superclass.initComponent.call(this);
    }
});

Ext.reg('App.views.LoginForm', App.views.LoginForm);