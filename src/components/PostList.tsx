import React, { useState, useEffect } from "react";
import Post from "./Post";
import "../css/PostList.css";

interface User {
  id: string | number;
  name?: string;
  username?: string;
  avatar?: string;
}

interface LikeData {
  id: number;
  userId: string | number;
  username?: string;
  timestamp: string;
}

interface PostData {
  id: number;
  userId: string | number;
  username: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: LikeData[];
  commentCount: number;
  shares: number;
}

interface PostListProps {
  currentUser: User | null;
}

const PostList: React.FC<PostListProps> = ({ currentUser }) => {
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading posts from an API
    const fetchPosts = async (): Promise<void> => {
      setLoading(true);
      
      // Simulated delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockPosts: PostData[] = [
        {
          id: 1,
          userId: "user1",
          username: "Jeeva A",
          userAvatar: "https://i.pravatar.cc/150?img=1",
          content: "This course is amazing for Physical Science!",
          image: "data:image/jpeg;base64,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",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          likes: [
            { id: 1, userId: "user2", username: "John Doe", timestamp: new Date(Date.now() - 1800000).toISOString() },
            { id: 2, userId: "user3", username: "Sarah Wilson", timestamp: new Date(Date.now() - 900000).toISOString() }
          ],
          commentCount: 5,
          shares: 2
        },
        {
          id: 2,
          userId: "user2",
          username: "John Doe",
          userAvatar: "https://i.pravatar.cc/150?img=2",
          content: "Has anyone taken the new machine learning course? I'm thinking about enrolling but would love some feedback first!",
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          likes: [],
          commentCount: 3,
          shares: 0
        },
        {
          id: 3,
          userId: "user3",
          username: "Zineb Ibelhaj",
          userAvatar: "https://i.pravatar.cc/150?img=3",
          content: "Just earned my certification in data science! The journey was challenging but worth it.",
          image: "https://media.licdn.com/dms/image/sync/v2/D5627AQFeqLbnaeuGtQ/articleshare-shrink_800/articleshare-shrink_800/0/1736620536952?e=2147483647&v=beta&t=wPNFcsApbnV6vwNfzYCYzNqKvm-m2AUgjhboU_bMQBE",
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          likes: [
            { id: 3, userId: "user1", username: "Jane Smith", timestamp: new Date(Date.now() - 5400000).toISOString() }
          ],
          commentCount: 8,
          shares: 5
        }
      ];
      
      setPosts(mockPosts);
      setLoading(false);
    };
    
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="posts-loading">
        <div className="loading-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map(post => (
        <Post key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
};

export default PostList; 