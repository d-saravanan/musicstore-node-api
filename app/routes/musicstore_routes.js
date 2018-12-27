module.exports = function(app, db) {
    app.get('/albums', (req, res) => {
        console.log(req.body);
        // res.send(req);
        res.send('hello');
    });

    app.post('/genre', (req,res) => {
        // console.log('request body is :'+JSON.stringify(req.body));
        const genre = { name: req.body.name, description: req.body.description };
        db.collection('genres').insert(genre, (err, result)=>{
            if(err) {
                console.log('the following error occured while saving the genre'+ err);
            }

            if(result){
                console.log('the result is : '+JSON.stringify(result));
            }
        });

        console.log('done the insert statement');
        res.send("ok");
    });

    app.get('/genres', (req,res) => {
        var op = [];
        let genres = db.collection("genres").find({}).toArray(function(err, result) {
            if(err){console.log(err);}
            else if(result.length > 0) {
                res.send(result);
            }
        });
    });

    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
};