import Layout from '@/components/Layout'
import Grid from '@/components/Grid'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'

const Homes = ({ homes = [] }) => {
  return (
    <Layout>
      <h1 className='text-xl font-medium text-gray-800'>Your listings</h1>
      <p className='text-gray-500'>
        Manage your homes and update your listings
      </p>
      <div className='mt-8'>
        <Grid homes={homes} />
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

  // Get all homes from the authenticated user
  const homes = await prisma.home.findMany({
    where: { owner: { email: session.user.email } },
    orderBy: { createdAt: 'desc' },
  })

  // Pass the data to the Homes component
  return {
    props: {
      homes: JSON.parse(JSON.stringify(homes)),
    },
  }
}

export default Homes
