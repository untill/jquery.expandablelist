// -- file start --


/* == metadata start ==


name:
jquery.expandablelist


summary:
jQuery plugin for the creation of expandable lists.


description:
This jQuery plugin dynamically hides nested list elements (ul) and shows them when a list is expanded by the user. Folding/unfolding can be controlled by keyboard and the mouse. A long click folds/unfolds entire branches. Initial unfolded branches are marked by the class "expanded" on suitable list items in the markup.


keywords:
list, expandable, foldable, jquery-plugin, ecosystem:jquery


dependencies, compatibility, example call/markup/style:
see jquery.expandablelist.html


license: MIT
Copyright (c) 2015 Till Halbach

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


to do:
- test with more browsers
- rename to foldablelist
- revamp documentation


== metadata end == */


( function( $) {

  // -- variables --
  var  defaults = {
    NS: 'jquery.expandablelist-',
    classNames: {
      expanded: 'expanded',
      contracted: 'contracted',
      childless: 'childless',
    },
    icons: {
      expanded: 'plugin/minus.svg',
      contracted: 'plugin/plus.svg',
      childless: 'plugin/disc.svg'
    },
    titles: {
      expanded: 'Show less',
      contracted: 'Show more'
    },
    alts: {
      expanded: 'Less',
      contracted: 'More'
    },
    allowedKeyCodes: {
      expanded: [ 13, 37, 38],  // return, left, up
      contracted: [ 13, 39, 40]  // return, right, down
    }
  };


  // -- function --
  $.fn.makeExpandable = function( options) {
    // alter settings according to options
    var  settings = $.extend( defaults, options);
    // handle future expand/contract events: short/long clicks and keyboard
    $( this).on( 'click keyup', 'li.expanded > img', function( event) {
      // trigger only for selected keys
      if( event.type == 'keyup') {
	var keyCode = event.keyCode || event.which;
	if( settings.allowedKeyCodes.expanded.indexOf( keyCode) < 0)
	  return false;
      }
      $( this).trigger( 'contractItem');
    } ).on( 'click keyup', 'li.contracted > img', function( event) {
      // trigger only for selected keys
      if( event.type == 'keyup') {
	var keyCode = event.keyCode || event.which;
	if( settings.allowedKeyCodes.contracted.indexOf( keyCode) < 0)
	  return false;
      }
      $( this).trigger( 'expandItem');
    } );
    // handle custom events
    $( this).on( 'contractItem', 'img', function() {
      $( this).siblings( 'ul').hide( 'fast');
      $( this).attr( 'src', settings.icons.contracted);
      $( this).attr( 'alt', settings.alts.contracted);
      $( this).attr( 'title', settings.titles.contracted);
      $( this).parent().removeClass( settings.classNames.expanded).addClass( settings.classNames.contracted);
    } ).on( 'longClick', 'li.expanded > img', function() {  // contractAllItems
      $( this).parent().find( 'li.expanded > img').add( this).trigger( { type: 'keyup', keyCode: 13 } );
    } ).on( 'expandItem', 'img', function() {
      $( this).siblings( 'ul').show( 'fast');
      $( this).attr( 'src', settings.icons.expanded);
      $( this).attr( 'alt', settings.alts.expanded);
      $( this).attr( 'title', settings.titles.expanded);
      $( this).parent().removeClass( settings.classNames.contracted).addClass( settings.classNames.expanded);
    } ).on( 'longClick', 'li.contracted > img', function() {  // expandAllItems
      $( this).parent().find( 'li.contracted > img').add( this).trigger( { type: 'keyup', keyCode: 13 } );
    } );
    // add icons to list items and hide contracted items
    // childless nodes
    $( this).find( 'li:not(:has(*))').addClass( settings.classNames.childless).prepend(
      $( '<img/>', {
	alt: '',
	src: settings.icons.childless
      } )
    );			// .prepend
    // expanded nodes
    $( this).find( 'li.'+settings.classNames.expanded).not( '.'+settings.classNames.childless).prepend(
      $( '<img/>', {
	alt: settings.alts.expanded,
	title: settings.titles.expanded,
	src: settings.icons.expanded,
	tabindex: 0
      } )
    );			// .prepend
    // contracted nodes
    $( this).find( 'li').not( '.'+settings.classNames.expanded).not( '.'+settings.classNames.childless).addClass( settings.classNames.contracted).prepend(
      $( '<img/>', {
    	alt: settings.alts.contracted,
    	title: settings.titles.contracted,
    	src: settings.icons.contracted,
    	tabindex: 0
      } )
    ).children( 'ul').hide();			// .prepend
    // enable long clicks for tree branch folding/unfolding
    $( this).find( 'li > img').mayTriggerLongClicks();
    return $( this);
  }  // $.fn.makeExpandable
  
} )( jQuery);


// -- file end --
