  Meteor.startup(function () {
    // code to run on server at startup
  });

  // CHAPTER 5
  Meteor.publish("Categories", function() {
    console.log("publishing lists for userId = " + this.userId );
    return lists.find({owner: this.userId}, {fields:{Category:1}});  //filter to only current user
  });

  Meteor.publish("listdetails", function(category_id) {
    return lists.find({_id:category_id})
  });
