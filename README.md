# vanillagrid.min
A simple grid using only Vanilla JS.<br><br>

### Download Vanillagrid v1.0.x release!
https://github.com/vanilla-grid/vanillagrid.min/releases/tag/v1.0.0
### Or Use npm & webpack
Home page: https://vanilla-grid.github.io

## Why Vanillagrid?
* IIt can be applied to a wide range of environments using only Vanilla JS and ES5 syntax.
* Managing data is intuitive by getting and setting JSON data.
* You can achieve excellent performance by using predefined properties, events, and methods.
* You can manage the lifecycle of objects independently and customize more delicately through management logic.
* It is implemented to minimize the impact on or from existing css or javascript sources.
* Does not use innerHTML or eval.
* It is very lightweight with a single js file.

## Anyone can use it very easily.
### 1-1. use npm & webpack

<pre>npm i vanillagrid</pre>

<pre>
//src/index.js
import vg from 'vanillagrid';
vg.create();
</pre>

<pre>
&lt;body&gt;
	&lt;!-- logic..
	&lt;vanilla-grid id="grid"..
	 --&gt;
	&lt;script src="dist/main.js"&gt;&lt;/script&gt;
&lt;/body&gt;
</pre>

### 1-2. Or Include min.js file and use src

<pre>
&lt;script src="../Vanillangrid.min.1.0.x.js"&gt;&lt;/script&gt;
</pre>

#### ※ The dist/Vanillagrid.min.1.0.x.js file of git vanillagrid.min can be used as a header declaration.
#### ※ The dist/Vanillagrid.bundle.js file in git vanillagrid.min is used in the webpack method.
#### ※ The header declaration method through the Vanillagrid.min file automatically manages the life cycle of the vanilla grid, while the webpack method through the Vanillagrid.bundle file requires the user to manage the life cycle.

### 2. And, tag is added.

<pre>
&lt;body&gt;
&lt;!--
	The id attribute of grid and column is mandatory.
	&lt;vanilla-grid id="gridId" ...grid attributes &gt;
		&lt;v-col id="columnId01" ...column attributes &gt;&lt;/v-col&gt;
		... columns
	&lt;/vanilla-grid&gt;
--&gt;
&lt;/body&gt;
</pre>

### 3. Lastly, data load!
<pre>
 &lt;script&gt;
	const keyValues = [
		{
			columnId01 : 'value', columnId02 : 'value', //column key-value..
		},
		//...
	]
	//If do not use window variables. => const gridId = vg.get('gridId');
	gridId.load(keyValues);
 &lt;/script&gt;
</pre>

#### [Vanilla Grid has about 30 grid and column properties, about 30 customizable events, and over 240 methods. Please refer to the homepage!](https://vanilla-grid.github.io/?view=api&lang=ENG)

## Purpose of production
Vanillagrid is a solo development. It was developed for learning javascript. Therefore, 100% reliability cannot be guaranteed when using it, and there are some limitations. However, I believe it will show excellent performance. Vanillagrid started development to reduce the time required to develop a new grid each time I proceed with a personal project. It was developed with the goal of developing a grid that can be used without libraries or frameworks in any environment such as Jquery, Vue, React, etc. For this reason, this program uses only Vanilla JS. The pros and cons of Vanillagrid are as follows.

## Contact
hani son.  
hison0319@gmail.com
