let Album = require('../models/albums')
let ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {
    
    app.put('/genre', (req,res) => {
        // console.log('request body is :'+JSON.stringify(req.body));
        const genre = { name: req.body.name, description: req.body.description };
        db.collection('genres').insert(genre, (err, result)=>{
            if(err) {
                // console.log('the following error occured while saving the genre'+ err);
                res.status(500);
            }

            if(result){
                res.send("OK");
                // console.log('the result is : '+JSON.stringify(result));
            }
        });
        // console.log('done the insert statement');
        res.send("ok");
    });

    app.get('/genres', (req,res) => {
        db.collection("genres").find({}).toArray(function(err, result) {
            if(err) {
                console.log(err);
            }
            else if(result.length > 0) {
                res.send(result);
            }
        });
    });

    app.put('/albums', (req, res) => {
        const album = getAlbumFromRequest(req);

        db.collection('albums').insert(album, (err, result) => {
            if(err) {
                console.log('error occured while adding a new album: '+JSON.stringify(err));
                res.status(500);
            }

            if(result) {
                res.status(200);
            }
        });

        res.send("album created successfully");
    });

    app.get('/albums', (req, res) => {
        db.collection("albums").find({}).toArray(function(err, result) {

            if(err) { 
                console.log(err);
                res.sendStatus(500);
            }
            else if(result) {
                res.send(result);
            }
        })
        
    });

    app.get('/albums/:id', async (req, res) => {
        let albumId = req.params.id;
        
        let album = await getAlbumById(albumId);

        let idQuery = { '_id' : new ObjectID(albumId)};
        db.collection("albums").findOne(idQuery, (err, result) => {
            
            if(err) {
                console.log('The following error occured while getting the album by its id: '+ JSON.stringify(err));
                res.send(404);
            }

            if(result) {
                res.send(result);
            }
        });
    });

    app.get('/api/songs/:albumId', (req, res)=> {
        let albumId = req.params.albumId;
        let idQuery = { '_id' : new ObjectID(albumId)};

        db.collection("albums").findOne(idQuery, (err, album) => {
            if(err) {
                res.send(400);
            }

            if(!album) {
                res.send(404);
            }

            res.send(album.songs);
        });
    })

    app.post('/addSong/:id', (req, res) => {
        let albumId = req.params.id;
        let idQuery = { '_id' : new ObjectID(albumId)};

        var song = getSongFromRequest(req);

        if(!song) {
            res.sendStatus(400);// invalid song data posted to the server.
        }

        db.collection("albums").findOne(idQuery, (err, album) => {
            
            if(err) {
                console.log('The following error occured while getting the album by its id: '+ JSON.stringify(err));
                res.sendStatus(404);
            }

            if(album) {
                if(!album.songs) {
                    album.songs = [];
                }
                album.songs.push(song);

                db.collection("albums").update(idQuery, album, (err, output) => {
                    if(err) {
                        console.log('the following exception occured while adding the songs to the album. '+JSON.stringify(err));
                        res.status(500);
                    }
        
                    if(output) {
                        res.status(200);
                    }
                });
            }
        });
        res.sendStatus(200);
        // res.sendStatus(400); //for now, lets send a bad request...
    });

    const getSongFromRequest = (req) => {
        return {
            Title: req.body.songTitle,
            Duration: req.body.songDuration,
            Popularity: req.body.songRating,
            Cost: req.body.songPrice
        };
    }

    const getAlbumFromRequest = (req) => {
        return { 
            Artist: req.body.artistName, 
            Title: req.body.albumTitle, 
            Genre: req.body.genre, 
            Rating: req.body.rating, 
            Cost: req.body.price,
            CoverImageUrl: req.body.coverUrl, //image link
            ReleaseDate: req.body.releasedOn, // datetime
            Type: req.body.albumType, //AudioCD, VideoCD / DVD,
            Songs: []
        };
    }
};