lists = new Meteor.Collection("Lists");


if (Meteor.isClient) {
  //declare the adding_category flag
  Session.set('adding_category', false);
/*  Template.hello.greeting = function () {
    return "my list.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });*/

  Template.categories.lists = function() {
    return lists.find({}, {sort:{Category:1}});
  };
  
  Template.categories.new_cat = function() {
    return Session.equals('adding_category', true);
  };

  Template.categories.events({
    'click #btnNewCat': function(e,t) {
      Session.set('adding_category', true);
      Meteor.flush();
      focusText(t.find('#add-category'));
    },
    'keyup #add-category': function(e,t) {
      if(e.which === 13)
      {
        var catVal = String(e.target.value || "");
        if (catVal)
        {
          lists.insert({Category:catVal});
          Session.set('adding_category', false);
        }
      }
    },
    'focusout #add-category': function(e,t) {
      Session.set('adding_category', false);
    }
  });

  ///// Generic Helper Functions /////
  function focusText(i) {
    i.focus();
    i.select();
  };
  ////////////////////////////////////

  /***********************************************************************
      Chapter 4 
  ***********************************************************************/
  Template.list.items = function() {
    if(Session.equals('current_list', null))
      return null;
    else
    {
      var cats = lists.findOne({_id:Session.get('current_list')});
      if ( cats && cats.items )
      {
        for (var i = 0; i < cats.items.length; i++) {
          var d = cats.items[i];
          d.Lendee = d.LentTo ? d.LentTo : "free";
          d.LendClass = d.LentTo ? "label-danget" : "label-success";
        };
        return cats.items;
      }
    }
  };

  /***********************************************************************
      /Chapter 4
  ***********************************************************************/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
