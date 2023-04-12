import React,{ useState, useEffect }  from 'react'
import httpClient from '../httpClient'
import PropTypes from 'prop-types';
import { UserShape } from "../Types"



import './Calendar.css'


import{
    Box,
    List,
    ListItem,
    ListItemText,
    Typography
} from '@mui/material'




const Calendar = () => {
    const [currentEvent , setCurrentEvent] = useState([]);
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

      const handelDataClick = (selected) => {
        const  title = prompt('please enter a new event name');
        const  calendarApi = selected.view.calendar;
        calendarApi.unselected();
        
        if (title){
            calendarApi.addEvent({
            id:`${selected.date}-${title}`,
            title,
            start:selected.startStr,
            end:selected.endStr,
            allDay:selected.allDay
        });
    
      }

    };

    const handleEventClick = (selected) =>{
        if (window.confirm(`Are you sure you want to delete this event? '${selected.event.title}'`))
        {selected.event.remove();}
    };

    

  return (
    <Box  className='main-content'>
     <header className='header'>CALENDAR</header>
      <Box justifyContent={'space-between'} >
        <Box className='Calender-Sidebar' >
          <Typography className='Events-content'>
          EVENTS
          <List>
           {currentEvent.map((event) => (
            <ListItem key = {event.id} className='ListItem'>
            <ListItemText
            primary={event.title}
            secondary={<Typography>
             
            </Typography>}/>
            </ListItem>

           )) }
          </List>
          </Typography>
        </Box>
        <Box className ='Calendar'>
         


        </Box>


    </Box>
  </Box>
  )
}

Calendar.propTypes = {
    user: PropTypes.oneOfType([UserShape, PropTypes.instanceOf(null)]),
  };
  
export default Calendar