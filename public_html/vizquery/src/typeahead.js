import Vue from "vue";
import { search } from "./api";
import { MIN_INPUT_LENGTH } from "./conf";

function parseSearch(item) {
    item.formLabel = `${item.label} - (${item.id})`;
    return item;
}

export default Vue.component('typeahead', {
    template : "#tmpl-typeahead",

    data : function() {
        return {
            suggestions : [],
            loading : false,
            item : null
        }
    },

    computed : {
        style : function() {
            var len = this.value ? (this.value.length + 1) : MIN_INPUT_LENGTH;
            len = len > MIN_INPUT_LENGTH ? len : MIN_INPUT_LENGTH;
            return { width : `${len + 1}ch` };
        }
    },

    methods : {
        update : function(value) {
            this.$emit('input', value);

            if (value.length < this.minlength) {
                return;
            }

            this.loading = true;
            search(this.type, value).then((d) => {
                this.loading = false;
                this.suggestions = d.search.map(parseSearch);
            });
        },

        setSuggestion : function(suggestion) {
            this.suggestions = [];
            this.$emit('input', suggestion.formLabel);
            this.item = suggestion;
        }
    },

    watch : {
        item : function(item) {
            this.$emit('item', item);
        }
    },

    props : {
        value : String,
        minlength : Number,
        type : String
    }
});