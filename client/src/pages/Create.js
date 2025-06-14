import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";

export default function Create() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // New state

    const fileInputRef = useRef();

    async function createNewPost(ev) {
        ev.preventDefault();

        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        const data = new FormData();
        data.append('title', title);
        data.append('summary', summary);
        data.append('content', content);
        if (fileInputRef.current.files[0]) {
            data.append('file', fileInputRef.current.files[0]);
        }

        try {
            const response = await fetch('http://localhost:5000/post', {
                method: 'POST',
                body: data,
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Post created successfully');
                setRedirect(true);
            } else {
                const errorText = await response.text();
                console.error('Error:', errorText);
            }
        } catch (error) {
            console.error('Error during post creation:', error);
        } finally {
            setIsSubmitting(false); // Reset button state
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <form onSubmit={createNewPost}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />
            <input
                type="text"
                placeholder="Summary"
                value={summary}
                onChange={(ev) => setSummary(ev.target.value)}
            />
            <input
                type="file"
                ref={fileInputRef}
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(ev) => setContent(ev.target.value)}
            />
            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Create a Post'}
            </button>
        </form>
    );
}

