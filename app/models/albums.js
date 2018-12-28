
function Albums() {
    this.getAlbumFromRequest = function(req) {
        this.Title = req.body.albumTitle;
        this.Artist = req.body.artistName;
        this.Genre = req.body.genre;
        return this;
    }
}