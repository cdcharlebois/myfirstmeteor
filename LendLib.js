lists = new Meteor.Collection("Lists");
/****
  Checks to see if the current user making the request to update is the admin user
****/
var isAdminUser = function(userId) {
  var adminUser = Meteor.users.findOne({username:"admin"});
  return userId && adminUser && userId == adminUser._id;
};

lists.allow({
  insert: function(userId, doc) {
    console.log("processing insert userId = "+userId + ", doc.owner = "+doc.owner);
    return (isAdminUser(userId) || (userId && doc.owner === userId));
  },
  update: function(userId, docs, fields, modifier) {
    console.log("updating...");
    console.log("userId = " + userId);
    return isAdminUser(userId) ||
    _.all(docs, function(doc) {
      console.log("doc.owner = " + doc.owner);
      return doc.owner === userId;
    });
  },
  remove: function(userId, docs) {
    return isAdminUser(userId) || 
    _.all(docs, function(doc) {
      return doc.owner === userId;
    });
  }
});