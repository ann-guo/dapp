import '../styles/globals.css'

//INTERNAL IMPORT
import {VotingProvider} from '../context/Voter'
import NavBar from '../components/NavBar/NavBar';
//57
const MyApp = ({ Component, pageProps }) => (
  <VotingProvider>
  <div> 
    
      <div>
        <Component {...pageProps} />;
      </div>
    
  </div>
  </VotingProvider>
);
export default MyApp;
