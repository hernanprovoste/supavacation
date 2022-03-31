import Layout from '@/components/Layout'
import Grid from '@/components/Grid'
import { prisma } from '@/lib/prisma'

// import homes from 'data.json'

export default function Home({ homes = [] }) {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>
        Top-rated places to stay
      </h1>
      <p className='text-gray-500'>
        Explore some of the best places in the world
      </p>
      <div className='mt-8'>
        <Grid homes={homes} />
      </div>
    </Layout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async () => {
  // get all homes
  const homes = await prisma.home.findMany()

  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  }
}
