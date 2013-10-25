lists = new Meteor.Collection("Lists");


if (Meteor.isClient) {
  //declare the adding_category flag
  Session.set('adding_category', false);
  //subscribe to categories
  Meteor.subscribe("Categories");
  Meteor.autosubscribe(function() {
    Meteor.subscribe("listdetails", Session.get('current_list')); // pass the ID of the currently viewed list
  });
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
  
  /***********************************************************************
  *     View States
  ***********************************************************************/
  Template.categories.new_cat = function() {
    return Session.equals('adding_category', true);
  };
  // Are we looking at a list?
  Template.list.list_selected = function() {
    return ((Session.get('current_list') != null) && !Session.equals('current_list', null));
  };
  // What list are we looking at?
  Template.categories.list_status = function() {
    if (Session.equals('current_list', this._id))
      return "btn-default";
    else
      return " btn-primary"
  };
  // Are we adding an item to a list?
  Template.list.list_adding = function() {
    return Session.equals('list_adding', true);
  };
  // Are we updating the lendees?
  Template.list.lendee_editing = function() {
    return Session.equals('lendee_input', this.Name);
  };
  ////////////////////////////////////////////////////////////////////////

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
    },
    'click .category': function(e,t) {
      Session.set('current_list', this._id);
    }
  });

  ///// Generic Helper Functions /////
  var focusText = function(i, val) {
    i.focus();
    i.value = val ? val : "";
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
          d.LendClass = d.LentTo ? "label-danger" : "label-success";
        };
        return cats.items;
      }
    }
  };

  Template.list.events({
    'click #btnAddItem': function(e,t) {
      Session.set('list_adding', true);
      Meteor.flush();
      // console.log(t.find('#item_to_add'));
      focusText(t.find('#item_to_add'));
    },
    'keyup #item_to_add': function(e,t) {
      if (e.which === 13) // enter
      {
        addItem(Session.get('current_list'), e.target.value);
        Session.set('list_adding', false);
      }
    },
    'focusout #item_to_add': function(e,t) {
      Session.set('list_adding', false);
    },
    'click .delete_item': function(e,t) {
      removeItem(Session.get('current_list'), e.target.id);
    },
    'click .lendee': function(e,t) {
      Session.set('lendee_input', this.Name);
      Meteor.flush();
      focusText(t.find('#edit_lendee'), this.LentTo);
    },
    'keyup #edit_lendee': function(e,t) {
      if (e.which === 13)
      {
        updateLendee(Session.get('current_list'), this.Name, e.target.value);
        Session.set('lendee_input', null);
      }
      if (e.which === 27)
      {
        Session.set('lendee_input', null);
      }
    }
  });

  var addItem = function (listId, itemName) {
    if (!(listId || itemName))
      return;
    lists.update({_id: listId}, {$addToSet:{items:{Name: itemName}}});
  };
  var removeItem = function (listId, itemName) {
    if(!(itemName || itemName))
      return;
    lists.update({_id: listId}, {$pull:{items:{Name: itemName}}});  //pull: ITEMS: {where}
  };
  var updateLendee = function(listId, itemName, lendeeName) {
    var l = lists.findOne({"_id": listId, "items.Name": itemName});
    if (l && l.items){
      for (var i = 0; i < l.items.length; i++) {
        if (l.items[i].Name === itemName){
          l.items[i].LentTo = lendeeName;
        }
      };
    }
    lists.update({_id: listId}, {$set: {items: l.items}});
  };

  /***********************************************************************
      /Chapter 4
  ***********************************************************************/
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  // CHAPTER 5
  Meteor.publish("Categories", function() {
    return lists.find({}, {fields:{Category:1}});
  });

  Meteor.publish("listdetails", function(category_id) {
    return lists.find({_id:category_id})
  });
}
