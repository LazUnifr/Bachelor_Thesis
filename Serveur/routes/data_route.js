const Router = require ('koa-router');

const {deleteById,updateDataById,createdTempListing,createdColorListing,getColorFromTo,
    createMultipleListings,getAllTemp,getAllColor,deleteAll,findTempById,findColorById
    ,PutMaxTemp,getMaxTemp, getTempFromTo,latestTemp,latestColor} = require('../dataBase/dbOperations');

const {publishColor,publishWarning,publishLastTemp} = require('../mqtt/mqtt_methods')


// define route main prefix. => Here: www.localhost:PORT/data  
const router = new Router({
    prefix:'/data'
});
/** 
 * @swagger 
 * definitions:
 *   Temp:
 *     type: object
 *     properties:
 *       id:
 *         type: number 
 *       temp: 
 *         type: number 
 *       timestamp: 
 *         type: string
 *   TempPartial:
 *     type: object
 *     properties:
 *       temp: 
 *         type: number 
 *       timestamp: 
 *         type: string
 *     required:
 *       - temp
 *       - timestamp
 *     exemple:
 *       temp: 12
 *       timestamp: 2016-05-18T16:00:00Z
 *   Color:
 *     type: object
 *     properties:
 *       id:
 *         type: number 
 *       color: 
 *         type: string 
 *       timestamp: 
 *         type: string
 *   ColorPartial:
 *     type: object
 *     properties:
 *       color: 
 *          type: string 
 *       timestamp: 
 *         type: string
 *     required:
 *       - color
 *       - timestamp
 *     exemple:
 *       color: yellow
 *       timestamp: 2016-05-18T16:00:00Z
 * 
 * 
*/

/**
 * @swagger
 * /data/temp:
 *   get:
 *     summary: Get all temperatures in the Mongo database
 *     tags:
 *       - Temperature
 *     responses:
 *       200:
 *         description: Returns temperatures from Mongo database.
 */
router.get('/temp', async ctx =>{
    let results= await getAllTemp();
    if(results.length !=0){
        ctx.body=results
        ctx.response.body=results
    }
    else{
        ctx.body="Empty database !"
    }
    ctx.response.status=200;
});
/**
 * @swagger
 * /data/color:
 *   get:
 *     summary: Get all light_colors from the Mongo database
 *     tags:
 *       - Color
 *     responses:
 *       200:
 *         description: Returns light_colors from Mongo database.
 */
router.get('/color', async ctx =>{
    let results= await getAllColor();
    if(results.length !=0){
        ctx.body=results
    }
    else{
        ctx.body="Empty database !"
    }
});
/**
 * @swagger
 * /data/temp:
 *    post: 
 *      summary: Post a temp in the MongoDB, and publish into the MQTT channel, when the max. temp is reached
 *      tags:
 *        - Temperature
 *      consumes:
 *        - "application/json"
 *      parameters:
 *        - in: body
 *          name: temp data
 *          descriptions: temp be added in mongoDB
 *          schema: 
 *            $ref: '#/definitions/TempPartial'   
 *            
 *      produces:
 *        - "application/json"
 *        - "application/xml"
 *      responses:
 *        200:
 *          description: Data was successfully insered.
 */
router.post('/temp', async ctx =>{
    let product = ctx.request.body;
    //console.log(product);
    let now=new Date()
    product.timestamp=now
    product = await createdTempListing(product);
    //console.log(product);
    ctx.response.status=200;
    var lastTemp = await findTempById(product)
    publishLastTemp(String(lastTemp));
    publishWarning(String(lastTemp))
    //ctx.body=product;
    
});
/**
 * @swagger
 * /data/temp/last:
 *   get:
 *     summary: Get the most recent temperature in the database
 *     tags:
 *       - Temperature
 *     responses:
 *       200:
 *         description: Returns latest recorded temperature.
 */
router.get('/temp/last',async ctx=>{
    const last = await latestTemp();
    ctx.response.status=200;
    ctx.body=last;
});

/**
 * @swagger
 * /data/color:
 *    post: 
 *      summary: Post the current color of the light in the MongoDB, and publish into the MQTT channel, each time the color of the light changes
 *      tags:
 *        - Color
 *      consumes:
 *        - "application/json"
 *      parameters:
 *        - in: body
 *          name: light_color data
 *          descriptions: temp be added in mongoDB
 *          schema: 
 *            $ref: '#/definitions/ColorPartial'   
 *            
 *      produces:
 *        - "application/json"
 *        - "application/xml"
 *      responses:
 *        200:
 *          description: Data was successfully insered.
 */
router.post('/color',async ctx =>{
    let product = ctx.request.body;
    product.timestamp=new Date();
    //console.log(product);
    product = await createdColorListing(product);
    ctx.response.status=200;
    var color = await findColorById(product)
    //console.log(color);
    publishColor(color);
});

/**
 * @swagger
 * /data/color/last:
 *   get:
 *     summary: Get the last color registered in the database
 *     tags:
 *       - Color
 *     responses:
 *       200:
 *         description: Returns latest recorded light color of the office.
 */
router.get('/color/last',async ctx=>{
    const last = await latestColor();
    ctx.response.status=200;
    ctx.body=last;
});


/**
 * @swagger
 * /data/temp/range/GetArray?start={start}&end={end}:
 *   get:
 *     summary: Get all temperatures from a certain date range.
 *     tags:
 *       - Temperature
 *     description: Get all temperatures from a certain date range.
 *     parameters:    
 *       - in: path
 *         name: start
 *         description: start date range
 *         required: true
 *         type: string
 *       - in: path  
 *         name: end 
 *         description: end date range
 *         required: true
 *         type: string 
 *     responses:
 *       200:
 *         description: Returns all temperatures from a certain date range.
 */
router.get('/temp/range/:range',async ctx =>{
    var startRange = ctx.query.start;
    var endRange = ctx.query.end;
    startRange=new Date(startRange);
    endRange=new Date(endRange);
    //console.log(startRange);
    //console.log(endRange);
    result = await getTempFromTo(startRange,endRange);
    //console.log(result.length);
    if(result.length>0){
        ctx.body=result;
    }
    else{
        ctx.body=""
    }

    ctx.response.status=200;
});

/**
 * @swagger
 * /data/color/range/GetArray?start={start}&end={end}:
 *   get:
 *     summary: Get all office's lights colors from a certain date range.
 *     tags:
 *       - Color
 *     description: Get all office's lights colors from a certain date range.
 *     parameters:    
 *       - in: path
 *         name: start
 *         description: start date range
 *         required: true
 *         type: string
 *       - in: path  
 *         name: end 
 *         description: end date range
 *         required: true
 *         type: string 
 *     responses:
 *       200:
 *         description: Returns all office's lights colors from a certain date range.
 */
router.get('/color/range/:range',async ctx =>{
    var startRange = ctx.query.start;
    var endRange = ctx.query.end;
    startRange=new Date(startRange);
    endRange=new Date(endRange);
    //console.log(startRange);
    //console.log(endRange);
    result = await getColorFromTo(startRange,endRange);
    if(result.length>0){
        ctx.body=result;
    }
    else{
        ctx.body=""
    }
    ctx.response.status=200;
    //console.log(result);
});

router.delete('/temp', async ctx =>{
    await deleteAll("temp");
});

router.delete('/color', async ctx =>{
    await deleteAll("color");
});

//Variables data endpoints
/**
 * @swagger
 * /data/var/warningTemp/{temp}:
 *    put:
 *      summary: Update the value of the temperature maximum bound 
 *      tags:
 *        - Variables
 *      description: Update the value of the temperature maximum bound
 *      parameters:
 *        - in: path
 *          name: temp
 *          description: new maximum value
 *          required: true
 *          type: integer
 *          format: int32
 *      responses:
 *        200:
 *          description: Maximum temperature updated
 *        404: 
 *          description: Variable not found :(
 */
router.put('/var/warningTemp/:temp', async ctx =>{
    const MaxTemp = ctx.params.temp
    //console.log(MaxTemp)
    await PutMaxTemp(Number(MaxTemp));
    ctx.response.status=200;
    console.log("new max temp= "+MaxTemp)
});
/**
 * @swagger
 * /data/var/warningTemp:
 *    get:
 *      summary: Get the value of the maximum temparture bound 
 *      tags:
 *        - Variables
 *      description: Get the value of the temperature maximum bound
 *      responses:
 *        200:
 *          description: Maximum temperature found
 *        404: 
 *          description: Variable not found :(
 */
router.get('/var/warningTemp', async ctx =>{
    const MaxTemp= await getMaxTemp(); 
    ctx.response.status=200;
    ctx.body = "Trigger alert when temperature = " + MaxTemp
});

module.exports = router