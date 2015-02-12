# vue-modified
A simple directive plugin for [Vue 0.11.x](http://vuejs.org/) that lets you know when your v-models have been modified. Based off of [Vue Validator](https://github.com/xrado/vue-validator) by Radovan Lozej.

## Getting Started
With CommonJS:

    var Vue = require('vue'),
        modified = require('vue-modified');
    
    Vue.use(modified);

Standard Usage:

    <script type="text/javascript" src="vue.modified.js"></script>

## Usage
This plugin is only able to work with elements that you can use `v-model` with (input, select, textarea, etc) and components.

    <input type="text" v-model="email" v-modified>

or with a component:

    <mycomponent model="name" v-modified></mycomponent>

With components, you need to provide a special attribute called `model` with the same content you would place in any other `v-model`.

If you do not provide the `v-modified` attribute, this field will not be included in the checks and will not be reported when checking the status of the form.

### v-modified Directive
    <element v-model="MODEL_NAME" v-modified="GROUP_NAME"> <!-- With group name -->
    <element v-model="MODEL_NAME" v-modified> <!-- Without group name -->

This directive may take one argument of a group name. When a group name is provided, it gives the ability to get modified status based on group name and reset the modified status based on group.

### Exposed Methods
All exposed methods are available under the create Vue instance that have at least 1 element that contains the `v-modified` flag.

#### vm.$modified([group])
**Returns** Boolean

Whether the form has been modified. Optional `group` argument may be used to get the modified status for only the fields in that group.

    vm.$modified();
    vm.$modified('myGroup'); // by group name

#### vm.$touched([group])
**Returns** Boolean

Whether any of the fields have been touched on the form. Touching means the value has been at least changed once, even if it is reverted back to it's original value by the user. Optional `group` argument may be used to get the touched status for only the fields in the provided group.

    vm.$touched();
    vm.$touched('myGroup'); // by group name

#### vm.$resetModified([group])
**Returns** undefined

Resets the modified status of the fields on the form. When the status is reset, it will set `modified: false` under each field in `vm.vmodified` along with resetting the internal variable that stores the original value to the fields current value. This is useful if the form is saved via AJAX or an external method is used for resetting/clearing the values in the form. Optional `group` argument may be used to reset the modified status for only the fields in the provided group.

    vm.$resetModified(); // Resets the modified status for entire form
    vm.$resetModified('groupName'); // By group only

#### vm.$modifiedItems([group])
**Returns** Array

Returns a list of the items being watched by Vue Modified from `vm.vmodified`. Optional `group` argument may be used to only return items for that provided group name. If there are no items found, it will return an empty array.

    vm.$modifiedItems();
    => [...]
    
    vm.$modifiedItems('groupName'); // By group only
    => [...]

### Instance Properties
The properties that will be added to the Vue instance when at least one element has the `v-modified` attribute.

#### vm.vmodified
**Type** Object | **Alias for** `vm.$data.vmodified`

Contains the configuration and status for all the fields being watched by Vue Modified. This keypath can be changed, see configuration below.

### Configuration
The following can be globally configured for Vue Modified.

#### Vue.config.modifiedPath
**Type** String | **Default** `'vmodified'`

The base keypath name to use to store the field configuration and status under.


## License
Licensed under MIT. See LICENSE in the repository.

## Demo
You can view the demo for Vue Modified at the following link:

[]()

## Todo
* Write some tests
* Add method to reset form values
* Cleanup and performance tweaks

## Contributing
If you find any issues or want to add any new features, please feel free to do so and submit a pull request. Once tests are in place, please make sure to run the tests and that they pass before submitting the pull request.
