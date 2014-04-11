var ApplyDamageStrategy = InteractStrategy.extend({
	init: function(dmgToApply) {
		this._super();
		this.dmgToApply = dmgToApply;
		this.shouldApplyDamage = true;
	},

	interact: function(ctxSprite, otherSprite, dispatcher) {
		if (this.checkOverlap(ctxSprite, otherSprite)) {
            if (otherSprite instanceof Character) {
			    if (otherSprite.team != ctxSprite.owner.team) {
			    	if (this.shouldApplyDamage) {
						ctxSprite.destroy();
						sendHitMsg(ctxSprite, otherSprite, this.dmgToApply);			    		
			    		this.shouldApplyDamage = false;
			    	}
			    }
            } else if (otherSprite instanceof Obstacle) {
                ctxSprite.destroy();
            }
		}
	},

	checkOverlap: function(obj1, obj2) {
	    var combinedRadius = obj1.getRadius() + obj2.getRadius();
	    return combinedRadius * combinedRadius >= obj1.getRepr().position.distanceToSquared(obj2.getRepr().position);
	}
});
