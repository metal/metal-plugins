'use strict';

/**
  * Debounces function execution.
  * @param {Function} fn
  * @param {Number} delay
  * @return {Function}
  */
 function debounce(fn, delay) {
   var id;
   return function() {
     var args = arguments;
     clearTimeout(id);
     id = setTimeout(function() {
       fn.apply(null, args);
     }, delay);
   };
 }

export default debounce;
