Percent Selector
================

About
-----
Percent Selector is a handy and easy-to-use CSS3 widget to allow developers to add a sort of percent selector into their web applications with a pretty minimal effort. It makes use of JQuery 1.6 to simplify the inclusion of the widgets. Make sure to check out the [demo](http://plamoni.github.com/Percent-Selector/) for examples of the bar in action.

History
-------
The bar was originally created as part of a personal project of mine to organize meetings of a board gaming group I belong to. Players would report their "chance" of attending each week through a web application. I wanted to create a handy and visually pleasing UI element for this but was unhappy with existing offerings (especially with respect to usage on mobile devices).

Supported Platforms
-------------------
The bar has been tested on the latest versions of Chrome, Firefox, Safari, and Internet Explorer and includes "fallback" support for Internet Explorer 7 and 8. It also has been tested and functions VERY well on iPhones (iOS3 and up) and Android devices (2.1 and above). It may also work on older versions of these devices.

Technologies Used
-----------------
The Percent Selector uses CSS3 animations and gradients, along with an HTML5 canvas tag to produce the overlay. It makes use of no images, allowing it to be sized appropriately to your needs (I've tested it as small as 30px by 10px and as large as 2000px by 500px).

The use of CSS3 animations based on the "transform" property makes the performance of the widget on iPhones VERY good due to iOS's GPU acceleration of transforms and animated transforms.

Usage
-----

###Setup

Adding bar functionality to your page is as simple as linking to the included CSS and JS files (plus JQuery if needed):

	<link type="text/css" href="percentselector.css" rel="stylesheet" />
	<script type="text/javascript" src="percentselector.js"></script>

###Adding bars to your page

Once you've added these, you can create bars by simply adding a div with the "percentSelector" class to your page:
	
	<div class="percentSelector" style="width:500px;height:40px"></div>
	
That's it!

Since the default sizing for DIV tags does not really play well with the bar (there's no height), it's recommended that you use CSS to appropriately size your bars (as shown in the example).

###Optional Attributes

* 	**percent** (Example: percent="40")
	
	*Sets the initial percentage of a bar. This is useful if you want to initialize bars to a given value with server-supplied data.*

*	**step** (Example: step="5")

	*Sets the 'step' for a bar. This is VERY useful and should be used on most (if not all) bars you create. By default, bars will allow users to select based on 1% intervals. But with "step" set, you can allow your users only to select at intervals of the supplied percentage. For instance, setting 'step' to 5 will allow only 5% intervals to be selected (e.g. 0%, 5%, 10%).*
	
*	**enabled** (Example: enabled="false")

	*This simply allows you to enable/disable user interaction with the bar. Setting it to "false" will disable users' ability to change the bar's value by clicking it.*

*	**onPercentChange** (Example: onPercentChange="alert('New Percent: ' + percent)")

	*You can also add a callback in order to handle user changes to the percent.*

*	More to come?!

Demo
----
View a demo [here](http://plamoni.github.com/Percent-Selector/)