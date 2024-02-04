import {Buffer} from 'buffer';

if (typeof window !== 'undefined') {
  Object.assign(window, {Buffer});
}
