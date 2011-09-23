# Sencha Touch login

The Config controller requires authentication for access, this is implemented by a 'filter'.

Once 'authenticated' then you can access the Config screen.

Note: you still need to create the code to perform the actual server authentication in the save method of the Sessions controller.