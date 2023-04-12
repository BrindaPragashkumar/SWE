import React,{ useState, useEffect }  from 'react'
import httpClient from '../httpClient'
import PropTypes from 'prop-types';
import { UserShape } from "../Types"


const ChatPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await httpClient.get('//localhost:5000/@me');

        setUser(resp.data);
      } catch (error) {
        console.log('Not authenticated');
      }
    })();
  }, []);

  return (
    <div className='main-content'>
      ChatPage Hello World
    </div>
  )
}
ChatPage.propTypes = {
  user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
};

export default ChatPage