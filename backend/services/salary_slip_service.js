var multer  =   require('multer');
var path = require('path');
var uploadFolderPath = path.resolve('public/uploads');
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, uploadFolderPath)
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var uploadSingle = multer({ //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.csv') {
        return callback('Only csv file is allowed.')
    }
    callback(null, true)
},
}).single('file');

var service = {};

service['uploadSingle'] = function(req, res, callback) {
  try {
    uploadSingle(req,res,function(err){
        if(err){
            return callback(err);
        } else {
            return callback(null, req.file)
        }
    })
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;