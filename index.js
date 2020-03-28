var express = require("express");
var fs = require('fs');
var app = express();
app.use(express.json());

var content = fs.readFileSync('assets/all_week.geojson');
var heatmap = JSON.parse(content);
// const bodyParser = require('body-parser');
// app.use(bodyParser);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});


app.post("/addFire", (req, res, next) => {
    console.info(req.body);
    heatmap.features.push({
        type: "Feature",
        properties: { name: req.body.name, contact: req.body.contact },
        geometry: req.body.geometry        
    });
    res.status(202)
    res.end()
    
    /*
    fs.appendFile('assets/all_week.geojson', txt, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      */
});

app.post("/saveData", (req,res,next) => {
    const data = new Uint8Array(Buffer.from(JSON.stringify(heatmap)));
    /*
    fs.writeFile('message.txt', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
    });
    */
});

app.get("/getLocations", (req, res, next) => {
    res.status(200).send(heatmap)
});

app.use('/', express.static('.'))

