/**
 * Base css generation and global js logic.
 */

import './_base.scss';
import { mediaBreakpoint } from './utilities';

import enquire from '../../../node_modules/enquire.js';
import $ from 'jquery';

// Get the breakpoints set to :root by _bootstrap-overrides.scss.
const breakpoints = {};

$('html')
  .css('--breakpoints')
  .split(' ')
  .forEach(breakpoint => {
    const value = $('html').css(`--breakpoint-${breakpoint}`);
    if (value) {
      breakpoints[breakpoint] = value;
    }
  });

// Example usage of the Enquire.js module JS breakpoints.
enquire.register(mediaBreakpoint.down(breakpoints.lg), {
  match: () => {
    console.log('Screen is below Large sized.');
  },
  unmatch: () => {
    console.log('Screen is above Large sized.');
  },
});

export default {
  GLOBAL_CONSTANT: 'blerp',
  GLOBAL_BREAKPOINTS: breakpoints,
};
