const asyncWrapper = require("../error/asyncWrapper");
const cloudConfig=require("../config/cloudinary");
const cloudinay=require('cloudinary');
const fs=require('fs');
const { google } = require('googleapis');



const  uploadFile=async(file)=>{
    try{
        const result=await cloudinay.uploader.upload(file.path,{
            public_id:`${Date.now()}`,
            resource_type:"auto",
            folder:"images"
        });
    
        return result.url;
    }    
    catch (error) {
        return error.message;
    }
    
}




const uploadAudio=async(file)=> {
  const FILE_PATH = file.tempFilePath;
  const FILE_NAME = file.name;

  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID1,
      process.env.CLIENT_SECRET1,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN1 });

    const accessToken = await oAuth2Client.getAccessToken();

    const drive = google.drive({
      version: 'v3',
      auth: oAuth2Client,
    });

    const fileContent = fs.createReadStream(FILE_PATH);

    const fileMetadata = {
      name: FILE_NAME,
      parents: [process.env.FOLDER_ID],
      mimeType: 'audio/mpeg',
    };

    // Define the media for the file
    const media = {
      mimeType: 'audio/mpeg',
      body: fileContent,
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id',
      access_token: accessToken,
    });
    const fileId = response.data.id;

    const url=`https://drive.google.com/uc?id=${fileId}&export=download`

    return url;
  } catch (err) {
    console.log(err);
    return err;
  }
}





module.exports ={uploadFile,uploadAudio};