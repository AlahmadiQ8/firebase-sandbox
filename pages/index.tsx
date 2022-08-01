import type { NextPage } from 'next'
import { Loader } from '../components/Loader'
import toast from 'react-hot-toast';



const Home: NextPage = () => {
  return (
    <main>
      <Loader show />
      <button onClick={() => toast.success("omgf omf ")}>Make me a toast</button>
    </main>
  )
}

export default Home
