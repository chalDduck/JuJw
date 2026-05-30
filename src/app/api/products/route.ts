
import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const category = url.searchParams.get('category') ?? undefined
  const featured = url.searchParams.get('featured')
  const published = url.searchParams.get('published')

  const products = await getProducts({
    category,
    featured: featured === null ? undefined : featured === 'true',
    published: published === null ? true : published === 'true',
  })

  return NextResponse.json({ products })
}
