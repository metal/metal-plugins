'use strict';

/**
  * Debounces function execution.
  * @param {!function()} fn
  * @param {number} delay
  * @return {!function()}
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
