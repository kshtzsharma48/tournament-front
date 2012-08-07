define([
    'jquery',
    'underscore',
    'backbone',
    'handlebars',
    'backbone-paginator',
    'collections/participants',
    'text!templates/participants/pagination.html',
    'pubsub'
], function ($, _, Backbone, Handlebars, BackbonePaginator, ParticipantsCollection, paginationTemplate, Pubsub) {

    var PaginationView = Backbone.View.extend({

        template:Handlebars.compile(paginationTemplate),

        handlers:[],

        events:{
            "click a":"changePage"
        },

        type:'pagination',

        initialize:function () {

            var self = this;

            Handlebars.registerHelper('pages', function (items, options) {

                var info = self.collection.info();
                var klass;

                var out = "<ul>";

                out = out + "<li class=" + (info.prev ? '' : 'disabled') + "><a href='?page=" + info.prev + "' >< Prev</a></li>";
                for (var i = 1; i <= info.totalPages; i++) {
                    klass = (info.currentPage == i) ? "active" : "";
                    out = out + "<li class=" + klass + "><a href='?page=" + i + "' >" + i + "</a></li>";
                }
                out = out + "<li class=" + (info.next ? '' : 'disabled') + "><a href='?page=" + info.next + "' >Next ></a></li>";

                return new Handlebars.SafeString(out + "</ul>");
            });
        },

        initBindings:function () {

        },

        render:function (collection) {
            this.collection = collection;

            this.$el.html(this.template());

            return this;
        },

        changePage:function (event) {
            event.stopPropagation();
            event.preventDefault();

            var target = event.currentTarget;
            var pattern = "page=";
            var href = $(target).attr("href");
            var pageId = href.substring(href.indexOf(pattern) + pattern.length);
            if (pageId.indexOf("&") >= 0) {
                pageId = pageId.substring(0, pageId.indexOf("&"));
            }

            Pubsub.publish(Events.NEW_PAGE, [pageId]);

        }

    });

    return PaginationView;
})
;