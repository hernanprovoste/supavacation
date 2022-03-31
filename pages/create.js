import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import axios from 'axios'
import { getSession } from 'next-auth/react'

const Create = () => {
  const addHome = (data) => axios.post('/api/home', data)
  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>List your home</h1>
        <p className='text-gray-500'>
          Fill out the form below to list a new home.
        </p>
        <div className='mt-8'>
          <ListingForm
            buttonText='Add home'
            redirectPath='/'
            onSubmit={addHome}
          />
        </div>
      </div>
    </Layout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async (ctx) => {
  // Check if user is authenticated
  const session = await getSession(ctx)

  // If not, redirect to the homepage
  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default Create
