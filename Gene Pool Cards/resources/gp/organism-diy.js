useLibrary( 'diy' );
useLibrary( 'ui' );
useLibrary( 'markup' );
useLibrary( 'imageutils' );


function create( diy ) {
	// this is where the component's basic settings would be changed,
	// but we are sticking with the defaults---see the diy library
	// documentation
	
	 diy.settings.addSettingsFrom("gp/layout.settings");

	// set the default name; DIY components have support for a name
	// and comments built in---other attributes are added manually
	diy.name = 'Cold-Adapted Organism';
	diy.faceStyle = FaceStyle.PLAIN_BACK;
	diy.frontTemplateKey = "gp-cell-front-sheet";
	diy.backTemplateKey = "gp-cell-back-sheet";

	// set the default value of the custom Countdown attribute
	// by writing it into the component's private settings
	// [this is the same as writing Patch.card( diy, 'Countdown', '1' );]
	// $Countdown = '0';
	$Cost = '3 \ud83d\udd25 cells + 3 any cells';
	$Bonus = '-1 cost \ud83d\udd25 cells\n+1 draw\n+1 hand limit';
	$Kind = 'cold';
}

function createInterface( diy, editor ) {
	var nameField = textField();
	var costField = textField();
	var bonusField = textArea();
	var kindField = listControl(["cold", "heat", "water", "virus", "bacteria", "photosynthetic", "amoeba"]);

	var panel = new FixedGrid( 2 );
	panel.add( 'Name', nameField);
	panel.add( 'Cost', costField );
	panel.add( 'Bonus', bonusField );
	panel.add( 'Kind', kindField );
	panel.setTitle( 'Info' );

	var bindings = new Bindings( editor, diy );
	// Here 'Countdown' is the *name* of the setting key
	bindings.add( 'Cost', costField, [0] );
	bindings.add( 'Bonus', bonusField, [0] );
	bindings.add( 'Kind', kindField, [0] );

	// tell the DIY which control will hold the component's name
	// (the DIY has special support for a component's name and
	// no binding is required)
	diy.setNameField( nameField );
	panel.addToEditor( editor, 'Content' );
	bindings.bind();
}

var titleBox, costBox, textBox;

function createFrontPainter( diy, sheet ) {
	titleBox = markupBox(sheet);
	titleBox.setAlignment(MarkupBox.LAYOUT_CENTER | MarkupBox.LAYOUT_MIDDLE);
	let defaultStyle = titleBox.getDefaultStyle();
	defaultStyle.add(FAMILY, FAMILY_SANS_SERIF);
	defaultStyle.add(SIZE, 10);
	defaultStyle.add(WEIGHT, WEIGHT_LIGHT);
	titleBox.setTextFitting(MarkupBox.FIT_BOTH);
	
	textBox = markupBox( sheet );
	textBox.setAlignment(MarkupBox.LAYOUT_LEFT | MarkupBox.LAYOUT_MIDDLE);
	defaultStyle = textBox.getDefaultStyle();
	defaultStyle.add(FAMILY, FAMILY_SANS_SERIF);
	defaultStyle.add(SIZE, 8);
	textBox.setTextFitting(MarkupBox.FIT_BOTH);
	
	costBox = markupBox( sheet );
	costBox.setAlignment(MarkupBox.LAYOUT_CENTER | MarkupBox.LAYOUT_MIDDLE);
	defaultStyle = costBox.getDefaultStyle();
	defaultStyle.add(FAMILY, FAMILY_SANS_SERIF);
	defaultStyle.add(SIZE, 10);
	defaultStyle.add(WEIGHT, WEIGHT_HEAVY);
	costBox.setTextFitting(MarkupBox.FIT_BOTH);
}

function createBackPainter( diy, sheet ) {
	// this won't be called because the default face style
	// is a plain (unpainted) card back [FaceStyle.PLAIN_BACK]
	// in fact, we could leave this function out altogether;
	// look out for this when writing your own scripts
	// (a do-nothing function will be created to stand in
	// for any missing DIY functions, so if one of your functions
	// doesn't seem to be getting called, check the spelling
	// carefully)
}


function paintFront( g, diy, sheet ) {
	// paint the image that was specified as the face's
	// template key (we're using the default)
	sheet.paintTemplateImage( g );


	let bg = ImageUtils.get("gp/images/" + $Kind + "-organism.jpg");
	sheet.paintImage(g, bg, $$gp-cell-bg-region.region);
		
	g.setPaint( Color.BLACK );
	
	drawBox(g, $$gp-cell-title-box-region.region);
			
	titleBox.markupText = '<i>'+ replaceIcons(diy.name, 9) + '</i>\n'
	 	+ '<size 7>Cost: ' + replaceIcons($Cost, 7) + '</size>';
	
	titleBox.draw(g, $$gp-cell-title-region.region);
	
	drawBox(g, $$gp-cell-text-region.region);
		
	let bonus = "<b>Bonus:</b>\n" + $Bonus.trim() + "\n";
	bonus = replaceIcons(bonus, 8);
	textBox.markupText = bonus;
	let bonusRegion = $$gp-cell-text-region.region;
	bonusRegion.x += 12;
	bonusRegion.width -= 24;
	textBox.draw( g, bonusRegion );
}

function drawBox(g, region) {
	let {x,y, width, height} = region;
	g.setPaint( Color.WHITE );
	g.fillRect(x, y, width, height);
	g.setPaint( Color.BLACK );
	g.drawRect(x, y, width, height);
}

function drawCircle(g, region) {
	let {x,y, width, height} = region;
	g.setPaint( Color.WHITE );
	g.fillArc(x, y, width, height, 0, 360);
	g.setPaint( Color.BLACK );
	g.drawArc(x, y, width, height, 0, 360);
	g.drawArc(x+5, y+5, width-10, height-10, 0, 360);
}

function replaceIcons(text, pt) {
	let cold = "\u2744\ufe0f";
	let heat = "\ud83d\udd25";
	let water = "\ud83d\udca7";
	let photosynthetic = "\ud83c\udf3f";
	return text.replace(cold, '<image res://gp/cold-icon.png ' + pt + 'pt>')
				.replace(heat,'<image res://gp/heat-icon.png ' + pt + 'pt>')
				.replace(water,'<image res://gp/water-icon.png ' + pt + 'pt>')
				.replace(photosynthetic,'<image res://gp/photosynthetic-icon.png ' + pt + 'pt>')
				// twice because replace all (via regex) isn't working
				.replace(cold,'<image res://gp/cold-icon.png ' + pt + 'pt>')
				.replace(heat,'<image res://gp/heat-icon.png ' + pt + 'pt>')
				.replace(water,'<image res://gp/water-icon.png ' + pt + 'pt>')
				.replace(photosynthetic,'<image res://gp/photosynthetic-icon.png ' + pt + 'pt>');
}

function paintBack( g, diy, sheet ) {
	// like createBackPainter(), this won't be called because of
	// the type of card we created
}

function onClear() {
	// this us called when the user issues a Clear command;
	// you should reset all of of the card's attributes to
	// a neutral state (the name and comments are cleared for you)
    // $Countdown = '1';
    $Cost = '3 \ud83d\udd25 cells + 3 any cells';
	$Bonus = '-1 cost \ud83d\udd25 cells\n+1 draw\n+1 hand limit';
	$Kind = 'cold';
}

// These can be used to perform special processing during open/save.
// For example, you can seamlessly upgrade from a previous version
// of the script.
function onRead() {}
function onWrite() {}

// This is part of the diy library; calling it from within a
// script that defines the needed functions for a DIY component
// will create the DIY from the script and add it as a new editor;
// however, saving and loading the new component won't work correctly.
// This means you can test your script directly by running it without
// having to create a plug-in (except to make any required resources
// available).
if( sourcefile == 'Quickscript' ) {
	testDIYScript();
}