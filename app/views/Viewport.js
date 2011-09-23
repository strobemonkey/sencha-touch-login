App.views.Viewport = Ext.extend(Ext.Panel, {
    fullscreen: true,
    layout: 'card',
    
    initComponent: function() {
        Ext.apply(this, {
            items: [
                { xtype: 'App.views.Main', id: 'main' },
                { xtype: 'App.views.ConfigForm', id: 'configForm' },
                { xtype: 'App.views.LoginForm', id: 'loginForm' },
            ]
        });
        App.views.Viewport.superclass.initComponent.apply(this, arguments);
    },

    reveal: function(target) {
        var direction = (target === 'main') ? 'right' : 'left';
        this.setActiveItem(
            App.views[target],
            { type: 'slide', direction: direction }
        );
    }
});