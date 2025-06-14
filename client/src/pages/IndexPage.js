import Post from "../Post";
import { useEffect, useState } from "react";

export default function IndexPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let isMounted = true;
    
        fetch('http://localhost:5000/post')
            .then(response => response.json())
            .then(data => {
                if (isMounted) {
                    setPosts(data);
                }
            })
            .catch(err => console.error("Error fetching posts:", err));
    
        return () => {
            isMounted = false;
        };
    }, []);
    

    return (
        <div className="posts-grid">
            {posts.length > 0 && posts.map(post => (
                <Post key={post._id} {...post} />
            ))}
        </div>
    );
}
