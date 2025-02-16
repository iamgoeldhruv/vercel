const  path=require('path')
const { exec } = require('child_process'); // Import exec
const fs = require('fs');
const { dir } = require('console');
var mime = require('mime-types')
const {
     S3Client,
     PutObjectCommand,
   
  } =require( "@aws-sdk/client-s3")
  const client = new S3Client({
    region:"Asia Pacific (Mumbai) ap-south-1",
    credentials:{
        
    }
  });
  const projectId=process.env.PROJECT_ID;
  
async function init(){
    
    console.log("excuting script.js")
    const outputPath=path.join(__dirname,'output')
    const process=exec(`cd ${outputPath} && npm install && npm run build`)
    process.stdout.on('data', (data) => {
        console.log(data.toString()); // Print normal logs
    });

    // Capture stderr (errors/warnings)
    process.stderr.on('data', (data) => {
        console.error(data.toString()); // Print errors/warnings
    });

    // Capture when the process completes
    process.on('close', async (code) => {
        if (code === 0) {
            console.log("Build successful ✅");
            const distFolder=path.join(__dirname,'output','dist')
            const distContents = fs.readdirSync(distFolder);
            for(const filePath in distContents){
                if(fs.statSync(filePath)===dir){
                    continue;
                }
                const command = new PutObjectCommand({
                    Bucket: 'vercel-file',
                    Key: `__output/${projectId}/filePath`,
                    Body: fs.createReadStream(filePath),
                    ContentType:mime.lookup(filePath)
                  });
                  try {
                    const response = await client.send(command);
                    console.log(response)
                    console.log("file uploaded successfully")
                    
                  } catch (error) {
                    console.log("error occurred uploading object to s3 bucket",error)
                    
                  }

            }
        } else {
            console.error(`Build failed ❌ with exit code ${code}`);
        }
    });
}
init()