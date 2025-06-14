import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function PostPage() {
    const { id } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/post/${id}`)
            .then(response => response.json())
            .then(data => setPost(data))
            .catch(err => console.error("Error fetching post:", err));
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div className="post-page">
            {post.cover && (
                <img src={`http://localhost:5000/${post.cover}`} alt={post.title} />
            )}
            <h1>{post.title}</h1>
            <p className="info">
                By <strong>{post.author.username}</strong> on {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    );
}
