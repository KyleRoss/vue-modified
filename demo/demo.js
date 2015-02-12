;(function() {
    /*global Vue */
    Vue.filter('formatJSON', function(val) {
        return JSON.stringify(val, null, 4);
    });
    
    Vue.filter('bool', function(val) {
        return JSON.stringify(val, null, 4);
    });
    
    window.vm = new Vue({
        el: document.getElementById('modified-example'),
        data: {
            form: {
                firstName: '',
                lastName: '',
                email: '',
                gender: 'male',
                reference: '',
                referenceOther: '',
                agree: false
            }
        },
        components: {
            reference: {
                template: '<label for="reference-other">Please specify</label>'+
                          '<textarea rows="3" name="reference-other" id="reference-other" class="form-control" v-model="referenceOther"></textarea>'
            }
        },
        methods: {
            // Used for the demo
            isModified: function(group) {
                return this.$modified(group);
            },
            isTouched: function(group) {
                return this.$touched(group);
            },
            reset: function(e, group) {
                if(e) e.preventDefault();
                this.$resetModified(group);
            }
        }
    });
}());
