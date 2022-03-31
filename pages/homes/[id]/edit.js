// pages/homes/[id]/edit.js
import Layout from '@/components/Layout'
import ListingForm from '@/components/ListingForm'
import { getSession } from 'next-auth/react'
import { prisma } from '@/lib/prisma'
import axios from 'axios'

const Edit = (home = null) => {
  const handleOnSubmit = (data) => {
    axios.patch(`/api/homes/${home.id}`, data)
  }

  return (
    <Layout>
      <div className='max-w-screen-sm mx-auto'>
        <h1 className='text-xl font-medium text-gray-800'>Edit your home</h1>
        <p className='text-gray-500'>
          Fill out the form below to update your home.
        </p>
        <div className='mt-8'>
          {home ? (
            <ListingForm
              initialValues={home}
              buttonText='Update home'
              redirectPath={`/homes/${home.id}`}
              onSubmit={handleOnSubmit}
            />
          ) : null}
        </div>
      </div>
    </Layout>
  )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx)

  const redirect = {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }

  // Check if the user is authenticated
  if (!session) {
    return redirect
  }

  // Retrive the authenticated user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { listedHomes: true },
  })

  // Check if authenticated user is the owner if this home
  const id = ctx.params.id
  const home = user?.listedHomes?.find((home) => home.id === id)
  if (!home) return redirect

  return {
    props: JSON.parse(JSON.stringify(home)),
  }
}

export default Edit
