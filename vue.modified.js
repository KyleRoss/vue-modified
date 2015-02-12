/**
 * Vue Modified - Known when your v-model's have been modified
 * @version 1.0.0 (2/11/2015)
 * @author Kyle Ross (https://github.com/KyleRoss), Radovan Lozej (https://github.com/xrado)
 * @requires Vue 0.11.x
 * @license MIT (http://opensource.org/licenses/MIT)
 * 
 * This is a heavy modification of vue-validator (https://github.com/xrado/vue-validator)
 * by Radovan Lozej. I had a need for knowing if a form has changed and a way to reset
 * the modification status, so this is a gutted and improved portion without validation.
 */
;(function() {
    /*global Vue, define */
    "use strict";
    
    var install = function(Vue, options) {
        var _ = Vue.util;
        
        function iterate(data, group, fn) {
            for(var prop in data) {
                if(data.hasOwnProperty(prop)) {
                    var item = data[prop];
                    
                    if(_.isObject(item) && !item._mod) iterate(item, group, fn);
                    else if(!group || (item._mod.group && group === item._mod.group)) fn(item);
                }
            }
        }

        Vue.directive('modified', {
            priority: 901,
            isLiteral: true,
            setup: function() {
                var vm = this.vm,
                    bp = this._basePath;
                
                vm.$modifiedItems = function(group) {
                    var stack = [];
                    iterate(vm[bp], group, function(item) {
                        stack.push(item);
                    });
                    return stack;
                };
                
                vm.$modified = function(group) {
                    return vm.$modifiedItems(group).some(function(d) {
                        return d.modified;
                    });
                };
                
                vm.$touched = function(group) {
                    return vm.$modifiedItems(group).some(function(d) {
                        return d.touched;
                    });
                };
                
                vm.$resetModified = function(group) {
                    vm.$emit('resetModified', group);
                };
            },
            
            bind: function() {
                var model = this.el.getAttribute(Vue.config.prefix +'model'),
                    vm = this.vm,
                    basePath = this._basePath = Vue.config.modifiedPath || 'vmodified';

                if(!model) { // allow components to use this too
                    model = this.el.getAttribute('model');
                    this.el.removeAttribute('model');
                } else {
                    model = model.split('|')[0].trim(); // strip filters from the model
                }

                if(!vm.$modified) this.setup();
                
                if(!model) return;
                if(!vm.$get(basePath)) this.vm.$set(basePath, {});

                this._model = model = model.replace(/\$index/, this.vm.$index)
                                           .replace(/\$value/, this.vm.$value)
                                           .replace(/\$key/, this.vm.$key);
                
                var path = this._path = basePath +'.'+ model;
                
                if(!vm.$get(path)) {
                    vm.$set(path, {
                        _mod: {},
                        modified: false,
                        touched: false
                    });

                    Vue.nextTick(function() {
                        this._origVal = vm.$get(model);
                        
                        this._onReset = function(group) {
                            if(group && group !== vm.$get(path +'._mod.group')) return;
                            vm.$set(path +'.modified', false);
                            this._origVal = vm.$get(model);
                        }.bind(this);
                        vm.$on('resetModified', this._onReset);
                        
                        this._onChange = vm.$watch(model, function(val) {
                            this.vm.$set(path +'.modified', val !== this._origVal);
                            this.vm.$set(path +'.touched', true);
                        }.bind(this), true);
                    }.bind(this));
                }
                
                if(this.expression) vm.$set(path +'._mod.group', this.expression);
            },
            unbind: function() {
                if(this.vm.$get(this._path)) this.vm.$delete(this._path);
                if(typeof this._onReset === 'function') this.vm.$off('resetModified', this._onReset);
                if(typeof this._onChange === 'function') this._onChange();
            }
        });
    };
    
    if(typeof exports === "object") module.exports = install;
    else if(typeof define === "function" && define.amd) define([], function() { return install; });
    else if(window.Vue) Vue.use(install);
})();
