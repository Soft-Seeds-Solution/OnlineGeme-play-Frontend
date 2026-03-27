import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import BlogContext from '../../ContextApi/BlogContext'

export default function BlogDetail() {
    const { postSlug } = useParams()
    const { AllBlogs } = useContext(BlogContext)

    const [post, setPost] = useState(null)

    useEffect(() => {
        if (AllBlogs?.length) {
            const blogData = AllBlogs.find(
                (item) => item.slug === postSlug
            )
            setPost(blogData)
        }
    }, [AllBlogs, postSlug])

    if (!post) return null // or loader

    const sanitizedContent = {
        __html: DOMPurify.sanitize(post.content || '')
    }

    return (
        <div>
            <div className="home-container page-content">
                <div className="allHeaderBg">
                    <div className="allHeader-overlay d-flex align-items-center justify-content-center">
                        <h1 className="head text-center text-white animate__animated animate__zoomIn allHeaderP">
                            {post.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container blog-container">
                <div
                    className="mt-5"
                    dangerouslySetInnerHTML={sanitizedContent}
                />
            </div>
        </div>
    )
}