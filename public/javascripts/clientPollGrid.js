
var scrollbarWidth = getScrollbarWidth();
var svg;
var parent;
var grandparent;
var masonry;
var items;
var gridSizer;
var gutterSizer;
var gridPanel;

function redrawAll() {
	parent.height(grandparent.height()).width(grandparent.width());
	svg.height(grandparent.height());
	svg.width(grandparent.width());
}

function suppressPieChartInteractions() {
	$('svg').find(':not(.big):not(.big *).c3-chart-arc').attr('class', '').children().children().css('stroke', 'rgba(255, 255, 255, 0)');
}

function openPanel() {
	var start = new Date();
	var panelStart = new Date();
	gridPanel.panel('open');
	console.log('Execution time: Panel:  '+String(new Date() - panelStart));
	var jQueryStart = new Date();
	masonry.width(window.innerWidth-gridPanel.width()-2*parseInt(masonry.parent().css('padding'))-scrollbarWidth).data('masonry').columnWidth = gridSizer.width();
	items.css('max-height', '').width(gridSizer.width()).height(gridSizer.width()).css('margin-bottom', gutterSizer.width());
	$('.big').width(6*gridSizer.width()+5*gutterSizer.width()).height(6*gridSizer.width()+5*gutterSizer.width());
	console.log('Execution time: jQuery: '+String(new Date() - jQueryStart));
	var redrawStart = new Date();
	redrawAll();
	console.log('Execution time: Redraw: '+String(new Date() - redrawStart));
	var masonryStart = new Date();
	//$('.js-masonry').data('masonry').reloadItems();
	masonry.data('masonry').layout();
	console.log('Execution time: Masonry:'+String(new Date() - masonryStart));
	console.log('Execution time: '+String(new Date() - start));
}

function closePanel() {
	var start = new Date();
	var panelStart = new Date();
	gridPanel.panel('close');
	console.log('Execution time: Panel:  '+String(new Date() - panelStart));
	var jQueryStart = new Date();
	masonry.width(window.innerWidth-2*parseInt(masonry.parent().css('padding'))-scrollbarWidth).data('masonry').columnWidth = gridSizer.width();
	items.css('max-height', '').width(gridSizer.width()).height(gridSizer.width()).css('margin-bottom', gutterSizer.width());
	$('.big').width(6*gridSizer.width()+5*gutterSizer.width()).height(6*gridSizer.width()+5*gutterSizer.width());
	console.log('Execution time: jQuery: '+String(new Date() - jQueryStart));
	var redrawStart = new Date();
	redrawAll();
	console.log('Execution time: Redraw: '+String(new Date() - redrawStart));
	var masonryStart = new Date();
	//$('.js-masonry').data('masonry').reloadItems();
	masonry.data('masonry').layout();
	console.log('Execution time: Masonry:'+String(new Date() - masonryStart));
	console.log('Execution time: '+String(new Date() - start));
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

	var url = window.location.origin+'/pollroute/exportpolljson/'+window.location.pathname.split('grid/').pop();
	var array = [0,1,2,3,4];
	var options = {tooltip : false, legend : false, axis : false};
	var container = '.js-masonry';
	maggio.visualizeSet(url, container, array, options, function() {

		// initialize Masonry
		new Masonry(container, { "columnWidth": ".grid-sizer", "itemSelector": ".item", "gutter": ".gutter-sizer" })

		// set up cached values for open/close panel
		svg = $('svg');
		masonry = $('.js-masonry');
		items = $('.item');
		gridSizer = $('.grid-sizer');
		gutterSizer = $('.gutter-sizer');
		gridPanel = $('#gridPanel');

		svg.parent().wrapInner('<div style="position:relative; margin:0 auto;"></div>');
		svg.css('position', 'absolute').each(function () { $(this)[0].setAttribute('viewBox', '0 0 '+gridSizer.width()+' '+gridSizer.width() ) });
		parent = svg.parent();
		grandparent = parent.parent();
		//parent.height(grandparent.height());

		masonry.width(window.innerWidth-2*parseInt(masonry.parent().css('padding'))-scrollbarWidth);
		masonry.data('masonry').columnWidth = gridSizer.width()
		$('.big').removeClass('big');
		items.width(gridSizer.width());
		items.height(gridSizer.width());
		masonry.css('padding', '0px');

		suppressPieChartInteractions();
		masonry.data('masonry').reloadItems();
		masonry.data('masonry').layout();

		items.on('click', function() {
			console.log(this);
			if($('#gridPanel').hasClass('ui-panel-open')) {
				masonry.width(window.innerWidth-$('#gridPanel').width()-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
			} else {
				masonry.width(window.innerWidth-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
			}
				masonry.data('masonry').columnWidth = $('.grid-sizer').width()
				if($('.big:first').length > 0) {
					$('.big:first').width($('.grid-sizer').width());
					$('.big:first').height($('.grid-sizer').width());
					transformer.removeInfo('#'+$('.big:first')[0].id);
					$('.big').removeClass('big');
				}
				$('.item').width($('.grid-sizer').width());
				$('.item').height($('.grid-sizer').width());
				$('.item').css('margin-bottom', $('.gutter-sizer:first').width());
				this.classList.add('big');
				$('.big').width(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
				$('.big').height(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
				$('.big').css('max-height', '');
				//transformer.resize('#'+this.id);
				transformer.addChartInfo('#'+this.id);
				suppressPieChartInteractions();
				$('.js-masonry').data('masonry').reloadItems();
				$('.js-masonry').data('masonry').layout();
		});

		console.log('Visualize callback complete.');
	});

});



/*

		$('.item').on('click', function() {
			console.log(this);
			if($('#gridPanel').hasClass('ui-panel-open')) {
				$('.js-masonry').width(window.innerWidth-$('#gridPanel').width()-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
			} else {
				$('.js-masonry').width(window.innerWidth-2*parseInt($('.js-masonry').parent().css('padding'))-getScrollbarWidth());
			}
				$('.js-masonry').data('masonry').columnWidth = $('.grid-sizer').width()
				if($('.big:first').length > 0) {
					$('.big:first').width($('.grid-sizer').width());
					$('.big:first').height($('.grid-sizer').width());
					transformer.removeInfo('#'+$('.big:first')[0].id);
					$('.big').removeClass('big');
				}
				$('.item').width($('.grid-sizer').width());
				$('.item').height($('.grid-sizer').width());
				$('.item').css('margin-bottom', $('.gutter-sizer:first').width());
				this.classList.add('big');
				$('.big').width(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
				$('.big').height(6*$('.grid-sizer').width()+5*$('.gutter-sizer').width());
				$('.big').css('max-height', '');
				//transformer.resize('#'+this.id);
				transformer.addChartInfo('#'+this.id);
				$('.js-masonry').data('masonry').reloadItems();
				$('.js-masonry').data('masonry').layout();
		});
	});
*/