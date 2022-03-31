import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { prisma } from '@/lib/prisma'
import Layout from '@/components/Layout'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import toast from 'react-hot-toast'

const ListedHome = (home = null) => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isOwner, setIsOwner] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // // Fallback version
  // if (router.isFallback) return 'Loading'

  useEffect(() => {
    const handleUser = async () => {
      if (session?.user) {
        try {
          const owner = await axios.get(`/api/homes/${home.id}/owner`)
          setIsOwner(owner?.id === session.user.id)
        } catch (error) {
          setIsOwner(false)
        }
      }
    }

    handleUser()
  }, [session?.user])

  const deleteHome = async () => {
    let toastId
    try {
      toastId = toast.loading('Deleting...')
      setDeleting(true)
      // Delete home from DB
      await axios.delete(`/api/homes/${home.id}`)
      // Redirect user
      toast.success('Successfully deleted', { id: toastId })
      router.push('/homes')
    } catch (error) {
      console.log(error)
      toast.error('Unable to delete home', { id: toastId })
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className='max-w-screen-lg mx-auto'>
        <div className='flex flex-col sm:flex-row sm:justify-between sm:space-x-4 space-y-4'>
          <div>
            <h1 className='text-2xl font-semibold truncate'>
              {home?.title ?? ''}
            </h1>
            <ol className='inline-flex items-center space-x-1 text-gray-500'>
              <li>
                <span>{home?.guests ?? 0} guests</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{home?.beds ?? 0} beds</span>
                <span aria-hidden='true'> · </span>
              </li>
              <li>
                <span>{home?.baths ?? 0} baths</span>
              </li>
            </ol>
          </div>

          {isOwner ? (
            <div className='flex items-center space-x-2'>
              <button
                type='button'
                onClick={() => router.push(`/homes/${home.id}/edit`)}
                className='px-4 py-1 border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white transition rounded-md disabled:text-gray-800 disabled:bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Edit
              </button>

              <button
                type='button'
                onClick={deleteHome}
                disabled={deleting}
                className='rounded-md border border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white focus:outline-none transition disabled:bg-rose-500 disabled:text-white disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1'
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ) : null}
        </div>

        <div className='mt-6 relative aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg shadow-md overflow-hidden'>
          {home?.image ? (
            <Image
              src={home.image}
              alt={home.title}
              layout='fill'
              objectFit='cover'
            />
          ) : null}
        </div>

        <p className='mt-8 text-lg'>{home?.description ?? ''}</p>
      </div>
    </Layout>
  )
}

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async () => {
  // Get all the homes IDS from the database
  const homes = await prisma.home.findMany({
    select: { id: true },
  })

  return {
    paths: homes.map((home) => ({
      params: { id: home.id },
    })),
    fallback: true,
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps = async ({ params }) => {
  // Get the currect home from the database
  const home = await prisma.home.findUnique({
    where: { id: params.id },
  })

  if (home) return { props: JSON.parse(JSON.stringify(home)) }

  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  }
}

export default ListedHome
