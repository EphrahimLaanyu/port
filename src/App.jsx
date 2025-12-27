import { memo } from 'react';
import Hero from './pages/Hero';
import HomePage from './pages/HomePage';


const App = () => {
  return (
    <div>
      <HomePage/>
    </div>
  );
};

export default memo(App);