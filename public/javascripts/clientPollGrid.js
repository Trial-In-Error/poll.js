var scrollbarWidth = getScrollbarWidth();
var svg;
var parent;
var grandparent;
var $container;
var items;
var gridSizer;
var gutterSizer;
var gridPanel;
var masonryBig = 5;
var sortOn;

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
	$container.width(window.innerWidth-gridPanel.width()-2*parseInt($container.parent().css('padding'))-scrollbarWidth).isotope({ packery: {columnWidth: gridSizer.width(), gutter: gutterSizer.width()} });
	items.css('max-height', '').width(gridSizer.width()).height(gridSizer.width());
	$('.big').width(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width()).height(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width());
	console.log('Execution time: jQuery: '+String(new Date() - jQueryStart));
	var redrawStart = new Date();
	redrawAll();
	console.log('Execution time: Redraw: '+String(new Date() - redrawStart));
	var masonryStart = new Date();
	//$container.isotope('reloadItems');
	$container.isotope('layout');
	console.log('Execution time: Masonry:'+String(new Date() - masonryStart));
	console.log('Execution time: '+String(new Date() - start));
}

function closePanel() {
	var start = new Date();
	var panelStart = new Date();
	gridPanel.panel('close');
	console.log('Execution time: Panel:  '+String(new Date() - panelStart));
	var jQueryStart = new Date();
	$container.width(window.innerWidth-2*parseInt($container.parent().css('padding'))-scrollbarWidth).isotope({ packery: {columnWidth: gridSizer.width(), gutter: gutterSizer.width()} });
	items.css('max-height', '').width(gridSizer.width()).height(gridSizer.width());
	$('.big').width(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width()).height(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width());
	console.log('Execution time: jQuery: '+String(new Date() - jQueryStart));
	var redrawStart = new Date();
	redrawAll();
	console.log('Execution time: Redraw: '+String(new Date() - redrawStart));
	var masonryStart = new Date();
	//$('.js-masonry').data('masonry').reloadItems();
	//$container.isotope('reloadItems');
	$container.isotope('layout');
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
	try { 
		$('.ui-footer').hide();
		$('.ui-header').hide();

		var opts = {
			lines: 5, // The number of lines to draw
			length: 29, // The length of each line
			width: 18, // The line thickness
			radius: 15, // The radius of the inner circle
			corners: 1, // Corner roundness (0..1)
			rotate: 42, // The rotation offset
			direction: 1, // 1: clockwise, -1: counterclockwise
			color: '#000', // #rgb or #rrggbb or array of colors
			speed: 1.6, // Rounds per second
			trail: 64, // Afterglow percentage
			shadow: false, // Whether to render a shadow
			hwaccel: true, // Whether to use hardware acceleration
			className: 'spinner', // The CSS class to assign to the spinner
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			top: '50%', // Top position relative to parent
			left: '50%' // Left position relative to parent
		};
		var target = document.body;
		var spinner = new Spinner(opts).spin(target);

		var url = window.location.origin+'/pollroute/exportpolljson/'+window.location.pathname.split('grid/').pop();
		var array = [0, 1, 2, 3, 4];
		var options = {tooltip : false, legend : false, axis : false};
		var container = '#container';
		maggio.visualizeSet(url, container, array, options, function() {

			// initialize Isotope with Packery packing
			$container = $('#container').isotope({
				itemSelector: '.item',
				layoutMode: 'packery',
				packery: {
					columnWidth: '.grid-sizer',
					gutter: '.gutter-sizer',
					itemSelector: '.item'
				},
				getSortData: {

					// use this accursed function as follows:
					// $container.isotope({ sortBy: 'question', sortAscending: false})
					// do not use past midnight
					// do not use in the presence of demons
					// do not use and use and use
					//      until dependency
					question: function( itemElem ) {
						//console.log(sortOn);
						if(typeof sortOn !== undefined) {
							var classes = $('#'+itemElem.id+' .tumbchart').attr('class').split(/\s+/);
							if(classes.indexOf('tumbchart') !== -1) {
								classes.splice(classes.indexOf('tumbchart'), 1);
							}
							if(classes.indexOf('c3') !== -1) {
								classes.splice(classes.indexOf('c3'), 1);
							}
							//console.log(classes);
							if(classes.indexOf('question-'+sortOn) !== -1) {
								console.log('BING!');
								return (1/classes.length);
							} else {
								return 0;
							}
						}
					}
				}
			});

			// set up cached values for open/close panel
			svg = $('svg');
			items = $('.item');
			gridSizer = $('.grid-sizer');
			gutterSizer = $('.gutter-sizer');
			gridPanel = $('#gridPanel');

			//svg.parent().wrapInner('<div style="position:relative; margin:0 auto;"></div>');
			svg/*.css('position', 'absolute')*/.each(function () { $(this)[0].setAttribute('viewBox', '0 0 '+gridSizer.width()+' '+gridSizer.width() ) });
			parent = svg.parent();
			grandparent = parent.parent();
			//parent.height(grandparent.height());

			$container.width(window.innerWidth-2*parseInt($container.parent().css('padding'))-scrollbarWidth);
			$container.isotope({packery: {columnWidth: gridSizer.width()} })
			$container.isotope({packery: {gutter: gutterSizer.width()} })
			$('.big').removeClass('big');
			items.width(gridSizer.width());
			items.height(gridSizer.width());
			$container.css('padding', '0px');

			suppressPieChartInteractions();
			spinner.stop();
			$container.isotope('reloadItems');
			$container.isotope('layout');

			items.on('click', function() {
				console.log(this);
				// If this element is NOT big, do work; else, ignore the click event
				if( this !== $('.big')[0] ) {
					if($('#gridPanel').hasClass('ui-panel-open')) {
						$container.width(window.innerWidth-$('#gridPanel').width()-2*parseInt($container.parent().css('padding'))-getScrollbarWidth());
					} else {
						$container.width(window.innerWidth-2*parseInt($container.parent().css('padding'))-getScrollbarWidth());
					}
					$container.isotope({ packery: {columnWidth : gridSizer.width() } })
					if($('.big:first').length > 0) {
						$('.big:first').width(gridSizer.width());
						$('.big:first').height(gridSizer.width());
						transformer.removeInfo('#'+$('.big:first')[0].id);
						$('.big').removeClass('big');
					}
					$('.item').width(gridSizer.width());
					$('.item').height(gridSizer.width());
					//$('.item').css('margin-bottom', gutterSizer.width());
					this.classList.add('big');
					$('.big').width(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width());
					$('.big').height(masonryBig*gridSizer.width()+(masonryBig-1)*gutterSizer.width());
					$('.big').css('max-height', '');
					//transformer.resize('#'+this.id);
					console.log('HEIHEIHEI'+$('#tumb1').height());
					transformer.addChartInfo('#'+this.id);
					suppressPieChartInteractions();
					$container.isotope({packery: {columnWidth: gridSizer.width()} })
					$container.isotope({packery: {gutter: gutterSizer.width()} })
					$container.isotope('reloadItems');
					$container.isotope('layout');
				}
			});

			openPanel();
			console.log('Visualize callback complete.');
		});
	} catch (err) {
		console.warn(err);
		spinner.stop();
		alert('Oops! Something broke! :(')
	}
});