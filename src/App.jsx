import './App.css'
import MainContent from './MainContent'
import Container from '@mui/material/Container';

function App() {

  return (

      <div style={{width:"100vw",display:"flex", justifyContent:"center", alignItems:"center"}}>
        <Container maxWidth="xl" className='container'>
          <MainContent />
        </Container>
        
      </div>

  )
}

export default App
