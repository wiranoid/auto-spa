// Filename: routes/appRouter.js

define([
    'jquery',
    'underscore', 
    'backbone',
    'models/vehicle',
    'models/client',
    'collections/vehicles',
    'collections/clients',
    'views/vehiclesCollection',
    'views/clientsCollection',
    'views/vehicleFullInfo',
    'views/manageDb'
    ], function($, _, Backbone, Vehicle,
                                Client, 
                                Vehicles, 
                                Clients, 
                                VehiclesCollectionView,
                                ClientsCollectionView, 
                                VehicleFullInfoView, 
                                ManageDbView) {
    var AppRouter = Backbone.Router.extend({        

        routes: {
            '': 'index',
            'page=:pageNumber': 'getVehicles',
            'db': 'manageDb',
            'clients?productId=:productId': 'assignVehicleToClient',
            'vehicles?clientId=:clientId': 'getClientVehicles',
            'clients': 'maganeClients',
            'vehicle/:id': 'getVehicleById',
            'search/vehicle?*query' : 'findVehicles'
        },

        initialize: function() {
            this.on('route', function() {
                $(window).unbind('scroll');
                $('.topLine').css('display', 'none');
            });
        },

        index: function() {
            var vehicles = new Vehicles();

            vehicles.fetch({                // this makes a call to the server and populates the collection based on the response.
                success: function() {
                    var vehiclesViewCollection = new VehiclesCollectionView({
                        collection: vehicles
                    });
                    vehiclesViewCollection.render();
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        getVehicles: function(pageNumber) {
            var vehicles = new Vehicles();

            vehicles.fetch({
                data: { 
                    startPage: 1,
                    endPage: pageNumber
                },
                success: function() {
                    var vehiclesViewCollection = new VehiclesCollectionView({
                        collection: vehicles
                    });
                    vehiclesViewCollection.render(pageNumber);
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        manageDb: function() {
            var manageDbView = new ManageDbView();
            manageDbView.render();
        },

        maganeClients: function() {
            var clients = new Clients();

            clients.fetch({
                success: function() {
                    var clientsViewCollection = new ClientsCollectionView({
                        collection: clients
                    });
                    clientsViewCollection.render();
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        assignVehicleToClient: function(productId) {
            var clients = new Clients();

            clients.fetch({
                success: function() {
                    var clientsViewCollection = new ClientsCollectionView({
                        collection: clients
                    });
                    clientsViewCollection.render(productId);
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        getClientVehicles: function(clientId) {
            var vehicles = new Vehicles();

            vehicles.fetch({
                data: { 
                    clientId: clientId
                },
                success: function() {
                    var vehiclesViewCollection = new VehiclesCollectionView({
                        collection: vehicles,
                        isClient: true
                    });
                    vehiclesViewCollection.render();
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        getVehicleById: function(id) {
            var vehicle = new Vehicle({
                id: id
            });
            vehicle.fetch({
                success: function() {
                    $('html, body').scrollTop(0);

                    var vehicleFullInfoView = new VehicleFullInfoView( { model: vehicle } );
                    vehicleFullInfoView.render();
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        //TODO: add pagination
        findVehicles: function(query) {
            var params = this.parseQueryString(query),
                vehicles = new Vehicles();

            vehicles.url = '/api/search/vehicle';

            vehicles.fetch({
                data: params,
                success: function() {
                    var vehiclesViewCollection = new VehiclesCollectionView({
                        collection: vehicles
                    });
                    vehiclesViewCollection.render();
                },
                error: function() {
                    console.log('fetch error');
                }
            });
        },

        back: function() {
            window.history.back();
        },

        parseQueryString: function(queryString) {
            var params = { };

            if (queryString) {
                _.each(
                    _.map(decodeURI(queryString).split(/&/g), function(el, i) {
                        var aux = el.split('='),
                            o = { };

                        if( aux.length >= 1 ) {
                            var val;

                            if(aux.length == 2) {
                                val = aux[1];
                            }
                            o[ aux[0] ] = val;
                        }

                        return o;
                    }),
                    function(o) {
                        _.extend(params, o);
                    }
                );
            }

            return params;
        }

    });

    return AppRouter;
});
