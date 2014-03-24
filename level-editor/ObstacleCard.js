var ObstacleCard = Class.extend({
    init: function(obstacle,obstaclecardSize,pathToImage) {
        this.obstacle = obstacle;
        this.pathToImage = pathToImage;// TODO remove this hard-code
        this.obstaclecardSize = obstaclecardSize;
        var cardTexture = THREE.ImageUtils.loadTexture(this.pathToImage);
        var cardMaterial = new THREE.SpriteMaterial( { map: cardTexture, useScreenCoordinates: true} );
        this.spriteMesh = new THREE.Sprite( cardMaterial );
        this.spriteMesh.owner = this;
        this.color = '0xffffff';
    },

    toJson: function(card) {

        if (card == null)
            card = this;
        exportObject = {'obstacle': card.obstacle.toJson(this.obstacle),
                        'pathToImage': card.pathToImage,
                        'obstaclecardSize': card.obstaclecardSize
        };
        return JSON.stringify(exportObject);
    },

    fromJson: function(jsonStr) {
        var jsonObject = JSON.parse(jsonStr);
        var obstacle_json = JSON.parse(jsonObject.obstacle);
        var new_obstacle = this.obstacle.fromJson(obstacle_json);

        return new ObstacleCard(new_obstacle, jsonObject.pathToImage, jsonObject.obstaclecardSize);
    },

    getCardMesh: function() {
        return this.spriteMesh;
    },

    getObstacle: function() {
        return this.obstacle;
    },

    getCardSize: function() {
        return this.obstaclecardSize;
    },

    getClickedCard: function(last_display_obstacles) {
        for (var i = 0; i < last_display_obstacles.length; i++) {
            var card = last_display_obstacles[i].owner;
            if (card.clicked == true && card != this) {
                return card;
            }
        }
        return null;
    },

    highlight: function(color) {
        this.spriteMesh.material.color.setHex(color);
    },

    onMouseOver: function(scope) {
        if (!this.clicked) {
            this.highlight(this.color);
        }
    },

    onMouseClicked: function(scope, callback) {
        if (this.clicked) {
            this.clicked = false;
        } else {
            var card = this.getClickedCard(scope);
            if (card != null) {
                card.clicked = false;
                card.onMouseOverFinished();
            }
            this.clicked = true;
            callback(this.obstacle);
            this.highlight(this.color);

        } 
    },

    onMouseOverFinished: function(scope) {
        if (!this.clicked) {
            this.highlight('0xffffff');
        }
    }
});