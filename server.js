import 'dotenv/config';
import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import nodemailer from 'nodemailer';

const app  = express()

app.use(morgan('dev'))
app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended:true }))

const visits = []

app.get('/',(req,res)=>{
    res.statusCode(200).json({
        status:200,
        message:"CKK Welcomes You"
    })
})

app.post('/traffic',(req,res)=>{
    
    const { ip,country } = req.body;
    let found = "";

    for(const visit of visits){
        if(visit.ip === ip && visit.country === country){
            found = visit
        }
    }

    if(found !== ""){
        if(Date.now() - found.timeStamp !== 86400){
            visits.push({
                ip, country,
                timeStamp: Date.now()
            })
        }
    }else{
        visits.push({
            ip, country,
            timeStamp: Date.now()
        })
    }

    res.statusCode(200).json({
        status:200,
        message: 'Vised counted succesfuly'
    })
})

app.post('/mail',async (req,res)=>{
    try{
        const { message,name,tel,email,owner_email,owner_password } = req.body;
        
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, 
            auth: {
              user: owner_email,
              pass: owner_password 
            }
          });

        const messageFormat = ` <div style="padding:10px">
                                    <h1>Message</h1>
                                    <p>
                                        ${message}
                                    </p>
                                    <span style="background:#333;color:white;border-radius:5px;padding:5px;">🙎 ${name}</span><br/><br/>
                                    <span style="background:#333;color:white;border-radius:5px;padding:5px;margin:20px 0">📬 ${email}</span><br/><br/>
                                    <span style="background:#333;color:white;border-radius:5px;padding:5px">☎ ${tel}</span>
                                </div>`;

        await transport.sendMail({
            from: `'From ${name}' 👻 ${owner_email}`, 
            to: owner_email, 
            subject: "Portfolio Message ✔", 
            text: message, 
            html: messageFormat
        });

        res.status(200).json({
            status: 200,
            message:"Email sent success"
        })

    }catch(err){
        res.status(500).json({
            status: 500,
            message: err
        })
    }
})

app.use((req, res) =>
  res.status(404).json({
    status: 404,
    error: ' PAGE NOT FOUND '
  })
);

const port = process.env.PORT || 5000

app.listen(port,()=> console.log('running port 5000'))
