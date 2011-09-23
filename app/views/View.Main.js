App.views.Main = Ext.extend(Ext.Panel, {
    initComponent: function(){
        var settingsButton, titlebar;

        settingsButton = {
            itemId: 'settingsButton',
            iconCls: 'settings',
            iconMask: true,
            ui: 'plain',
            handler: this.onSettingsAction,
            scope: this
        };

        titlebar = {
            dock: 'top',
            xtype: 'toolbar',
            title: 'Main',
            items: [ settingsButton ]
        };

        Ext.apply(this, {
            html: 'placeholder',
            layout: 'fit',
            dockedItems: [titlebar]
        });

        App.views.Main.superclass.initComponent.call(this);
    },

    onSettingsAction: function() {
        Ext.dispatch({
            controller: 'Config',
            action: 'editForm'
        });
    }

});

Ext.reg('App.views.Main', App.views.Main);
