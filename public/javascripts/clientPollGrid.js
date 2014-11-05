function openPanel() {
	$('#gridPanel').panel('open');
	$('.js-masonry').width(window.innerWidth-$('#gridPanel').width()-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
	$('.js-masonry').data('masonry').columnWidth = $('.grid-sizer').width()
	$('.item').width($('.grid-sizer').width());
	$('.item').height($('.grid-sizer').width());
	$('.item').css('margin-bottom', $('.gutter-sizer:first').width());
	$('.big').width(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
	$('.big').height(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
	$('.js-masonry').data('masonry').layout();
}

function closePanel() {
	$('#gridPanel').panel('close');
	$('.js-masonry').width(window.innerWidth-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
	$('.js-masonry').data('masonry').columnWidth = $('.grid-sizer').width()
	$('.item').width($('.grid-sizer').width());
	$('.item').height($('.grid-sizer').width());
	$('.item').css('margin-bottom', $('.gutter-sizer:first').width());
	$('.big').width(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
	$('.big').height(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
	$('.js-masonry').data('masonry').layout();
}

function getScrollbarWidth() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

    document.body.appendChild(outer);

    var widthNoScroll = outer.offsetWidth;
    // force scrollbars
    outer.style.overflow = "scroll";

    // add innerdiv
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner);

    var widthWithScroll = inner.offsetWidth;

    // remove divs
    outer.parentNode.removeChild(outer);

    return widthNoScroll - widthWithScroll;
}

$(window).load(function() {
	$('.ui-footer').hide();
	$('.ui-header').hide();

	$('.js-masonry').width(window.innerWidth-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
	$('.js-masonry').data('masonry').columnWidth = $('.grid-sizer').width()
	$('.big').removeClass('big');
	$('.item').width($('.grid-sizer').width());
	$('.item').height($('.grid-sizer').width());
	$('.js-masonry').css('padding', '0px');
	$('.js-masonry').data('masonry').reloadItems();
	$('.js-masonry').data('masonry').layout();

	$('.item').on('click', function() {
		console.log(this);
		if($('#gridPanel').hasClass('ui-panel-open')) {
			$('.js-masonry').width(window.innerWidth-$('#gridPanel').width()-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
		} else {
			$('.js-masonry').width(window.innerWidth-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
		}

		$('.js-masonry').data('masonry').columnWidth = $('.grid-sizer').width()
		$('.big').removeClass('big');
		$('.item').width($('.grid-sizer').width());
		$('.item').height($('.grid-sizer').width());
		$('.item').css('margin-bottom', $('.gutter-sizer:first').width());
		this.classList.add('big');
		$('.big').width(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
		$('.big').height(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
		$('.js-masonry').data('masonry').reloadItems();
		$('.js-masonry').data('masonry').layout();

		// remove old graph

		// draw new graph with some of old graph's options
	});
});
