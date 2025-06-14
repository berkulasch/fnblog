import { Link } from "react-router-dom";

export default function Post({ _id, title, summary, cover, author }) {
    return (
        <div className="post">
            {cover && (
                <img src={`http://localhost:5000/${cover}`} alt={title} className="post-image" />
            )}
            <div className="text">
                <h2>
                    <Link to={`/post/${_id}`}>{title}</Link>
                </h2>
                <p className="summary">{summary}</p>
                <p className="info">
                    By {author.username} | <Link to={`/post/${_id}`}>Read More &gt;&gt;</Link>
                </p>
            </div>
        </div>
    );
}
