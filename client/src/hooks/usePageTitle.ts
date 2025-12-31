import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_TITLE = 'SkillStash';

const usePageTitle = (title?: string) => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    
    // Reset title when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, location.pathname]);
};

export default usePageTitle;
