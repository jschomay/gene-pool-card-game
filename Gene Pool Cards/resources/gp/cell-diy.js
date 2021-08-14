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
	diy.name = 'Cold-Adapted Cell';
	diy.faceStyle = FaceStyle.PLAIN_BACK;
	diy.frontTemplateKey = "gp-cell-front-sheet";
	diy.backTemplateKey = "gp-cell-back-sheet";
	
	diy.bleedMargin = 9;

	// set the default value of the custom Countdown attribute
	// by writing it into the component's private settings
	// [this is the same as writing Patch.card( diy, 'Countdown', '1' );]
	// $Countdown = '0';
	$Cost = '4';
	$Bonus = '\u2744\ufe0f cells cost 1 less gene';
	$Adaptation = 'cold';
	
	let titleFontPath = "gp/fonts/Comfortaa-VariableFont_wght.ttf";
	let bodyFontPath = "gp/fonts/WorkSans-Light.ttf";
	ResourceKit.registerFontFamily(titleFontPath);
	ResourceKit.registerFontFamily(bodyFontPath);
}

const cells = [
	"cold",
	"heat",
	"water",
	"simple",
	"photosynthetic"
];

function createInterface( diy, editor ) {
	var nameField = textField();
	var costField = spinner( 0, 9 );
	var bonusField = textArea();
	var adaptationField = listControl(
		cells.concat([
			"mutation",
			"virus"
		])
	);

	var panel = new FixedGrid( 2 );
	panel.add( 'Name', nameField);
	panel.add( 'Cost', costField );
	panel.add( 'Bonus', bonusField );
	panel.add( 'Adaptation', adaptationField );
	panel.setTitle( 'Info' );

	var bindings = new Bindings( editor, diy );
	// Here 'Countdown' is the *name* of the setting key
	bindings.add( 'Cost', costField, [0] );
	bindings.add( 'Bonus', bonusField, [0] );
	bindings.add( 'Adaptation', adaptationField, [0] );

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
	titleBox.setAlignment(MarkupBox.LAYOUT_CENTER | MarkupBox.LAYOUT_BOTTOM);
	let defaultStyle = titleBox.getDefaultStyle();
	defaultStyle.add(FAMILY, "Comfortaa Regular");
	defaultStyle.add(SIZE, 14);
	defaultStyle.add(WEIGHT, WEIGHT_HEAVY);
	titleBox.setTextFitting(MarkupBox.FIT_BOTH);
		
	costBox = markupBox( sheet );
	costBox.setAlignment(MarkupBox.LAYOUT_CENTER | MarkupBox.LAYOUT_MIDDLE);
	defaultStyle = costBox.getDefaultStyle();
	defaultStyle.add(FAMILY, "Work Sans Light");
	defaultStyle.add(SIZE, 10);
	defaultStyle.add(WEIGHT, WEIGHT_LIGHT);
	costBox.setTextFitting(MarkupBox.FIT_NONE);
	
	textBox = markupBox( sheet );
	textBox.setAlignment(MarkupBox.LAYOUT_CENTER | MarkupBox.LAYOUT_MIDDLE);
	defaultStyle = textBox.getDefaultStyle();
	defaultStyle.add(FAMILY, "Work Sans Light");
	defaultStyle.add(SIZE, 9);
	defaultStyle.add(WEIGHT, WEIGHT_HEAVY);
	textBox.setTextFitting(MarkupBox.FIT_NONE);
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
	
	let isCell = cells.indexOf($Adaptation) >= 0;

	let prefix = isCell ? "cell-" : "";
	let file = prefix + $Adaptation;
	let bg = ImageUtils.get("gp/images/" + file + ".png");
	//bg = ImageUtils.get("gp/images/poker-card.png");
	sheet.paintImage(g, bg, $$gp-cell-bg-region.region);
		
	g.setPaint( Color.WHITE );
			
	titleBox.markupText =  diy.name;	
	titleBox.draw(g, $$gp-cell-title-region.region);
	
	let costText = "";
	if(isCell) costText = 'Cost: ' + $Cost + ' genes';
	if($Adaptation === "mutation") costText = "(Play immediately)";
	costBox.markupText = costText;
	costBox.draw(g, $$gp-cell-cost-region.region);
	
	if(isCell) drawIcon(sheet, g, diy.name, $Adaptation);
		
	if($Bonus.length > 0) {		
		let bonus = replaceIcons($Bonus, 7);
		textBox.markupText = bonus;
		textBox.draw( g, $$gp-cell-text-region.region );
	}
}

function drawIcon(sheet, g, name, icon) {
	let src = ImageUtils.get("gp/images/icon-" + $Adaptation + ".png");
	let iconRegion = $$gp-cell-icon-region.region;
	if(name.substr(-2) === "x2") {
		iconRegion.x -= 60;
		sheet.paintImage(g, src, iconRegion);
		iconRegion.x += 60*2;
		sheet.paintImage(g, src, iconRegion);
	} else {
		sheet.paintImage(g, src, iconRegion);
	}
}

function replaceIcons(text, pt) {
	let cold = "\u2744\ufe0f";
	let heat = "\ud83d\udd25";
	let water = "\ud83d\udca7";
	let simple = "<simple>";
	let photosynthetic = "\ud83c\udf3f";
	return text.replace(cold, '<image res://gp/images/icon-cold.png ' + pt + 'pt>')
				.replace(heat,'<image res://gp/images/icon-heat.png ' + pt + 'pt>')
				.replace(water,'<image res://gp/images/icon-water.png ' + pt + 'pt>')
				.replace(simple,'<image res://gp/images/icon-simple.png ' + pt + 'pt>')
				.replace(photosynthetic,'<image res://gp/images/icon-photosynthetic.png ' + pt + 'pt>')
								
				// repeated because replace all (via regex) isn't working
				.replace(cold,'<image res://gp/images/icon-cold.png ' + pt + 'pt>')
				.replace(heat,'<image res://gp/images/icon-heat.png ' + pt + 'pt>')
				.replace(water,'<image res://gp/images/icon-water.png ' + pt + 'pt>')
				.replace(simple,'<image res://gp/images/icon-simple.png ' + pt + 'pt>')
				.replace(photosynthetic,'<image res://gp/images/icon-photosynthetic.png ' + pt + 'pt>')
				
				// repeated because replace all (via regex) isn't working
				.replace(cold,'<image res://gp/images/icon-cold.png ' + pt + 'pt>')
				.replace(heat,'<image res://gp/images/icon-heat.png ' + pt + 'pt>')
				.replace(water,'<image res://gp/images/icon-water.png ' + pt + 'pt>')
				.replace(simple,'<image res://gp/images/icon-simple.png ' + pt + 'pt>')
				.replace(photosynthetic,'<image res://gp/images/icon-photosynthetic.png ' + pt + 'pt>');
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
    $Cost = '4';
	$Bonus = '+1 draw';
	$Adaptation = 'cold';
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