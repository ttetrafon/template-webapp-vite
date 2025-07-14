import './components/modal-dialog.js';
import './components/page-1.js';
import './components/page-2.js';
import './components/png-wrapper.js';
import './components/radio-group.js';
import './components/radio-option.js';
import './components/settings-accessibility-panel.js';
import './components/settings-general-panel.js';
import './components/tab-1.js';
import './components/tab-2.js';
import './components/website-settings.js';

import './components-library/404.js';
import './components-library/button-text-image.js';
import './components-library/input-field.js';
import './components-library/loading-circle.js';
import './components-library/selector-field.js';
import './components-library/svg-wrapper.js';

import './services-library/spinning-circle.js';

import './styles/style.css';

import state from './services-library/state.js';
import { Navigator } from './services-library/navigator.js';

const navigator = new Navigator('#app', 'dialog');
