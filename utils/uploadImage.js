const admin=require('../config/firebase');



const uploadImage=async(file)=>{
    try{
        if(!file) return "file not present";
        console.log(file);
        const remoteFilePath = `image/${file}`;
        const bucket = admin.storage().bucket();
        const audioImage=await bucket.upload(file, {
            destination: remoteFilePath,
            metadata: {
                contentType: 'image/png', 
            },
        });
        const fileData =  bucket.file(remoteFilePath);
        const url = await fileData.getSignedUrl({
          action: 'read',
          expires: '03-01-2500' 
        });
        return url[0];
    }catch(err){
        console.log(err);
        return err;
    }
}


module.exports=uploadImage