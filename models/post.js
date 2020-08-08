export default class Post {

    constructor(id, sender, image, description, type, location, time= Date.now()){
        this.id = id;
        this.sender = sender;
        this.image = image;
        this.description= description;
        this.type = type;
        this.location = location;
        this.time = time;
    }
}