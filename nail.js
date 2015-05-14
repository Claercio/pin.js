function Nail(container) {
	this.$el = $(container);
	this.$ell = $(container)[0];
	this.$parentt = this.$ell.parentNode;
	this.$window = $(window);

	this.init();
}

Nail.prototype.init = function() {
	this.bind();
	this.calcPositions();

	// simulates the window scroll, in case the user is already
	// in the middle of the scroll bar when the page loads (default browser action)
	this.onWindowScroll();
};

Nail.prototype.calcPositions = function() {
	this.positions = {
		offset: this.getOffset(this.$ell),
		parentOffset: this.getParentOffset(),
		stopTop: (this.$parentt.offsetHeight + this.getOffset(this.$parentt).top) - this.$ell.offsetHeight
	};
};

Nail.prototype.getOffset = function(element) {
	var de = document.documentElement;
	var box = element.getBoundingClientRect();
	var top = box.top + window.pageYOffset - de.clientTop;
	var left = box.left + window.pageXOffset - de.clientLeft;

	return {
		top: top, left: left
	};
};

Nail.prototype.getParentOffset = function() {
	return {
		left: this.$ell.offsetLeft
	}
};

Nail.prototype.bind = function() {
	window.onscroll = this.onWindowScroll.bind(this);
	window.onresize = this.reload.bind(this);
};

Nail.prototype.reload = function() {
	this.setCss();
	this.calcPositions();
	this.onWindowScroll();
};

/**
* Lots of things happens on this method
* It checks the window size, the position of the scroll
* If the container is touching the bottom and other
* stuff. That's why it looks like a mess
* :|
**/
Nail.prototype.onWindowScroll = function() {
	var newTop;

	// if the window is smaller then it won't stick
	if(this.windowIsSmaller()) return;

	// if the window got to the bottom of the parent element
	// of the container element, it stops the element
	if(this.touchBottom()) return;

	newTop = this.$window.scrollTop() - this.positions.offset.top;

	// some checks to stop unecessary code repetition
	if(newTop > 0 && this.$el.css('position') === 'fixed') return;
	if(newTop <= 0 && this.$el.css('position') === 'relative') return;

	this.setCss({
		position: (newTop > 0 ? 'fixed' : ''),
		// adds the left and top property, minus the margins,
		// so the element sticks in the same position it was before
		left: (newTop > 0 ? this.positions.offset.left : ''),
		top: (newTop > 0 ? 0 : ''),
		marginLeft: (newTop > 0 ? 0 : ''),
		marginTop: (newTop > 0 ? 0 : ''),
		bottom: ''
	});
};

Nail.prototype.touchBottom = function() {
	// if the scroll passed the end of the parent
	if(this.$window.scrollTop() > this.positions.stopTop) {
		this.setCss({
			top: '',
			marginLeft: '',
			bottom: 0,
			position: 'absolute',
			left: this.positions.parentOffset.left
		});

		return true;
	} else {
		return false;
	}
};

Nail.prototype.setCss = function(properties) {
	if(!properties) {
		this.$el.attr('style', '');
		return;
	}
	this.$el.css(properties);
};


Nail.prototype.windowIsSmaller = function() {
	return this.$window.innerHeight() < this.$el.height();
};
