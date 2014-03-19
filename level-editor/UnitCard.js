var UnitCard = Class.extend({
    init: function(unit,unitcardSize,pathToImage) {
        this.unit = unit;
        this.pathToImage = pathToImage;
        this.unitcardSize = unitcardSize;
        var cardTexture = THREE.ImageUtils.loadTexture(pathToImage);
        var cardMaterial = new THREE.SpriteMaterial( { map: cardTexture, useScreenCoordinates: true} );
        this.spriteMesh = new THREE.Sprite( cardMaterial );
        this.spriteMesh.owner = this;
        this.color = unit.getUnitColor();
        this.oldColor = this.spriteMesh.material.color.clone();
    },

    
    toJson: function(card) {
        if (card == null)
            card = this;
        exportObject = {'unit': card.unit.toJson(this.unit),
                        'pathToImage': card.pathToImage,
                        'unitcardSize': card.xPos
        };
        return JSON.stringify(exportObject);
    },

    fromJson: function(jsonStr) {
        var jsonObject = JSON.parse(jsonStr);
        var unit_json = JSON.parse(jsonObject.unit);
        var new_unit = this.unit.fromJson(unit_json);

        return new UnitCard(new_unit, jsonObject.pathToImage, jsonObject.unitcardSize);
    },

    getCardMesh: function() {
        return this.spriteMesh;
    },

    getUnit: function() {
        return this.unit;
    },

    getCardSize: function() {
        return this.unitcardSize;
    },

    getClickedCard: function(last_display_units) {
        for (var i = 0; i < last_display_units.length; i++) {
            var card = last_display_units[i].owner;
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
            callback(this.unit);
            this.highlight(this.color);

        } 
    },

    onMouseOverFinished: function(scope) {
        if (!this.clicked) {
            this.highlight('0xffffff');
        }
    }
});