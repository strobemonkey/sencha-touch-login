/*
 * Example: to add a before filter to a controller add the following
 *   beforeFilter: App.requireUser
 * where App.requireUser is a method you've defined on the App object.
 */

Ext.Dispatcher.on('before-dispatch', function(interaction) {
    console.log("before-dispatch");
    if(Ext.isFunction(interaction.controller.beforeFilter)) {
        console.log("before-dispatch - beforeFilter defined");
        return interaction.controller.beforeFilter.call();
    };
    return true;
});

Ext.Dispatcher.on('dispatch', function(interaction) {
    if(Ext.isFunction(interaction.controller.afterFilter)) {
        return interaction.controller.afterFilter.call();
    };
    return true;
});