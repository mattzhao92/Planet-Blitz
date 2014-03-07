var ApplyDamageStrategy = InteractStrategy.extend({
	init: function(dmgToApply) {
		this._super();
		this.dmgToApply = dmgToApply;
	},

	interact: function(ctxSprite, otherSprite, dispatcher) {
		if (this.checkOverlap(ctxSprite, otherSprite) && otherSprite instanceof Character) {
			if (otherSprite.team != ctxSprite.owner.team) {
				ctxSprite.destroy();
				otherSprite.applyDamage(this.dmgToApply);
			}
		}
	},

	checkOverlap: function(obj1, obj2) {
	    var combinedRadius = obj1.getRadius() + obj2.getRadius();
	    return combinedRadius * combinedRadius >= obj1.position.distanceToSquared(obj2.position);
	}
});