$(function() {
	//"use strict";
/*
	_.templateSettings = {
	  interpolate : /\{\{(.+?)\}\}/g
	};
*/
	// Generate four random hex digits.
	function S4() {
	   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

	// Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
	   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};


	var Book = Backbone.Model.extend({
		defaults: function() {
               return {
               	    "coverImage": "img/book.png",
               	    "title": "",
               	    "author": "(No Name)",
               	    "releaseDate": "N/A",
               	    "keywords": ""
               }
		},
		idAttribute:"_id",
		parse:function (response) {
			console.log(response);
			response.id = response._id;
			return response;
		}
	});

	var Library = Backbone.Collection.extend({
		"model": Book,
		"url": "/api/books"

	});

	//var books = new Library;

	var BookView = Backbone.View.extend({
		tagName: 'section',
		className: "book-section",
		template: _.template($("#section-template").html()),

		initialize: function() {
		  this.listenTo(this.model, "change", this.render);
		  this.listenTo(this.model, "destroy", this.remove);
		},

		events: {
              "click .delete": "deleteBook",
              "click .edit": "editBook",
		},

		render: function() {
             this.$el.html(this.template(this.model.toJSON()));
             return this;
		},
		deleteBook: function(e) {
			e.preventDefault();
			this.model.destroy();
		},

          editBook: function(e) {
              model.id = guid();
          }

	});

/*
var books = [{title:"JS the good parts", author:"John Doe", releaseDate:"2012", keywords:"Javascript"},
    {title:"CS the better parts", author:"John Doe", releaseDate:"2012", keywords:"CoffeeScript"},
    {title:"Scala for the impatient", author:"John Doe", releaseDate:"2012", keywords:"Scala"},
    {title:"American Psyco", author:"Bret Easton Ellis", releaseDate:"2012", keywords:"Novel"},
    {title:"Eloquent JavaScript", author:"John Doe", releaseDate:"2012", keywords:"JavaScrip"}];
*/
	var LibraryView = Backbone.View.extend({
		el: '#library',

		initialize: function() {

		    this.$el.find('#releaseDate').datepicker();

              globalColletion = this.collection = new Library();
 
              this.collection.on("reset", this.render, this);
              this.collection.on("add", this.addBook, this);

             this.collection.fetch();
		},
		events: {
              "click #addBtn": "addNew"
		},
          addNew: function(e) {
          	    e.preventDefault();
              // var vals = this.$el.find("form").serialize();
              var formData = {};
              this.$el.find("form").find("input").each(function() {
                   var inputName = this.name;
                    if (!inputName || "coverImage" === inputName)  return;

                    if ("releaseDate" === inputName) {
                       formData[inputName] = $(this).datepicker("getDate").getTime();
                    } else  if ("keywords" === inputName) {
                    	   var rawValArr = this.value.split(",");
                    	   var keywords = [];
                    	   $.each(rawValArr, function(index, val) {
                            keywords.push({"keyword":val});
                    	   });

                       formData[inputName] = keywords;
                    } else {
                      formData[inputName] = this.value;   
                    }
              });
              //var book = new Book(formData);
              // will trigger the add event
              //this.collection.add(book);
              this.collection.create(formData);
          },
		render: function() {
			//debugger;
                //this.collection.each(this.addBook, this);
		},
		addBook: function(book) {
			var bookView = new BookView({model: book});
			this.$el.append(bookView.render().el);
		}

	});	

     new LibraryView;

});