import React from 'react';
import { createRoot } from 'react-dom/client';
import DoenetTest from './DoenetTest.jsx';
import {RecoilRoot} from 'recoil';

const root = createRoot(document.getElementById('root'));

root.render(
  <RecoilRoot>
    <DoenetTest />
  </RecoilRoot>
);