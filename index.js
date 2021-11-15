require("dotenv").config()
const express = require("express")
const stripe= require("stripe")(process.env.SK_KEY);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to the API",
    })
})
app.post("/create-payment-intent", async (req, res ) => {
    try {
        const { amount, currency, description ,name,line1,phone,postal_code,country} = req.body;
        const total=Number(amount)*100;
        const paymentIntent = await stripe.paymentIntents.create({
        amount: total.toFixed(0),
        description,
        currency,
        shipping: {
            name,
            address:{
                line1,
                postal_code,
                country
            },
            phone
          },
    });
    //console.log(paymentIntent)
    return res.status(200).json({
        success: true,
        paymentIntent
    })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})
app.post("/confirm-payment", async (req, res ) => {
    try {
  const paymentIntents = await stripe.paymentIntents.retrieve(
    req.body.data
  );
    if(paymentIntents.status=="succeeded"){
        console.log(paymentIntents)
        return res.status(200).json({
            success: true,
            message:"payment successfull",
            paymentIntents
        })
    }
    else{
        res.status(500).json({
            success:false,
            message:"payment failed"
        })
    }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})