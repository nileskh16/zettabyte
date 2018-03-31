var express = require('express');
var router = express.Router();
var model = require('../models/users');
var util = require('util');
var isNul = util.isNullOrUndefined;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', (req, res) => {
  if(!util.isNullOrUndefined(req.params.id)) {
    const userId = req.params.id;
    model.findById(userId, '-createdAt -updatedAt -_id -__v', (err, userData) => {
      if(!isNul(userData)) res.status(200).send({status: true, msg: "The user data was found", data: userData});
      else res.status(500).send({status: true, msg: "Some Error Occurred", data: err});
    });
  } else {
    res.status(400).send({status: false, msg: "The User id is required in the request", data: null});
  }
});

router.post('/', (req, res) => {
  if(!isNul(req.body.userData)) {
    const userData = req.body;
    const validatedResult = checkUserValidation(userData);
    if(validatedResult.validity) {
      model.find({$or: [{email: userData.email}, { contact: userData.mobile }]}, (err, result) => {
        if(!isNul(result) && result.length > 0) {
          res.send({status: false, msg: "The user with email or mobile already exists", data: null});
        } else {
          var newUser = new model(userData);
          newUser.save((err, data) => {
            if(!isNul(data)) res.status(200).send({status: true, msg: "User saved successfully", data: data});
            else res.status(500).send({status: false, msg: "Something went wrong on server", data: null});
          });
        }
      });
    } else {
      res.status(400).send({status: false, msg: "Some mandatory fields are missing", data: validatedResult.missingFields});
    }
  } else {
    res.status(400).send({status: false, msg: "Please send mandatory info", data: null});
  }
});

router.put('/:id', (req, res) => {
  if(!isNul(req.params.id)) {
    if(!isNul(req.body)) {
      var updateData = {};
      if(!isNul(req.body.name)) updateData['name'] = req.body.name;
      if(!isNul(req.body.mobile)) updateData['mobile'] = req.body.mobile;
      if(!isNul(req.body.email)) updateData['email'] = req.body.email;

      model.findOneAndUpdate({_id: req.params.id}, {$set: updateData}, {upsert: true, new: true}, (err, newData) => {
        if(!isNul(newData)) {
          res.status(200).send({status: true, msg: "User data updated successfully", data: newData});
        } else {
          res.status(500).send({status: false, msg: "Some error occurred at server", data: null});
        }
      });
    } else {
        res.status(400).send({status: false, msg: "Please send mandatory info", data: null});
    }
  } else {
    res.status(400).send({status: false, msg: "User id is required", data: null});
  }
});

router.delete('/:id', (req, res) => {
  if(!isNul(req.params.id)) {
    model.findOneAndRemove({_id: req.params.id}, (err, data) => {
        if(!isNul(data)) {
            res.status(200).send({status: true, msg: "User data updated successfully", data: newData});
        } else {
            res.status(500).send({status: false, msg: "Some error occurred at server", data: err});
        }
    });
  } else {
      res.status(400).send({status: false, msg: "User id is required", data: null});
  }
});

function checkUserValidation(data) {
  var isValid = true,
  missingFields = [];
  isValid = isValid && !isNul(data.name);
  appendField(missingFields, isValid, "Username");
  isValid = isValid && !isNul(data.email);
  appendField(missingFields, isValid, "Email");
  isValid = isValid && !isNul(data.mobile);
  appendField(missingFields, isValid, "Mobile Number");
  return {validity: isValid, missingFields: missingFields};
}

function appendField(missingFields, isValid, fieldName) {
  if(!isValid) missingFields.push(fieldName);
}

module.exports = router;
