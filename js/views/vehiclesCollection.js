// Filename: views/vehiclesCollection.js

define([
    'jquery',
    'underscore', 
    'backbone',
    'views/vehicle'
    ], function($, _, Backbone, VehicleView) {
    var VehiclesViewCollection = Backbone.View.extend({
        tagname: 'section',
        className: 'vehiclesCollection',

        initialize: function(options) {
            if (options.isClient) {
                //we do not need pagination setup when viewing client's vehicles
                return;
            }

            var that = this;
            this.pageNumber = 2;
            this.processing = false;

            this.listenTo(this.collection, 'reset', function() {
                var vehiclesCollectionHtml = that.getVehicleCollectionHtml();
                that.$el.append( vehiclesCollectionHtml );
            });


            _.bindAll(this, 'loadMoreVehicles');
            // bind to window
            $(window).scroll(this.loadMoreVehicles);
        },

        render: function(pageNumber) {
            this.pageNumber = pageNumber || this.pageNumber;
            var vehiclesCollectionHtml = this.getVehicleCollectionHtml();
            $('.mainContent').html( this.$el.html(vehiclesCollectionHtml) );
            return this;
        },

        loadMoreVehicles: function(event) {
            var that = this;

            if ( /search/.test(Backbone.history.getFragment()) ) {
                return false;
            }

            if (this.processing) {
                return false;
            }

            if ( $(window).scrollTop() >= ( $(document).height() - $(window).height() ) - 200 ) {
                this.processing = true;

                //maybe, improve...
                if (this.collection.size() === 0) {
                    return;
                }

                require('app').router.navigate('page=' + this.pageNumber);

                this.collection.fetch( { 
                    data: { page: that.pageNumber },
                    reset: true,
                    remove: false,
                    success: function(){
                        that.processing = false;
                        that.pageNumber++;
                    },
                    error: function() {
                        console.log('error');
                    }
                });
            }

        },

        getVehicleCollectionHtml: function() {
            if (this.collection.size() > 0) {
                return this.collection.map(function(vehicle) {
                       return new VehicleView( { model: vehicle } ).render().el;
                   });
            }
            else if ( /client/.test(Backbone.history.getFragment()) ) {
                //should return something funny, but life is not a bed of roses
                return 'Empty';
            }
        }

    });

    return VehiclesViewCollection;
});
