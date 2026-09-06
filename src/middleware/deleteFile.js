const ProductModel = require('../app/models/Product');
const fs = require('fs');

// delete file
async function deleteFile (req, res, next) {
    const {haveFile} = req.params;
    // Nếu có file mới thì mới xóa file cũ
    if(haveFile === 'true') {
        ProductModel.findById(req.params.id , function (err, docs) {
            if (err){
                console.log(err);
            }
            else{
      
              try {
               
                  var imgs = docs.productImg ;
                  var videos = docs.productVideo;
            
                  function deleteFiles(files){
                    for (const file of files) {
                      fs.unlink((`${process.env.PUBLIC_PATH}${file}`), err => {
                    });
                    };
                  }
    
                  deleteFiles(imgs);
                  deleteFiles(videos);
    
              } catch (error) {
                  console.log(error)
              }
              
             next();
            }
        });
    }
    else {
        next();
    }
   
}

module.exports = {deleteFile}