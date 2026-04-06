import { useNavigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useQuery } from '@tanstack/react-query';

const UsersList = () => {
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
            const response = await fetch(`${backendUrl}/user/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            throw new Error(err.message || 'Failed to fetch users');
        }
    };

    const {
        data:users=[],
        isLoading:loading,
        error:error
    } = useQuery({
        queryKey:["Users"],
        queryFn:fetchUsers,
        staleTime: 1000*60*5, // 5 minutes
        refetchOnWindowFocus:false
    })


    return (
        <div className="users-container">
            <h2 className="users-heading">Connect with Users</h2>
            {loading &&
                <div className="loading">
                    <HashLoader color="#007bff" />
                </div>}
            {/* {loading && <p className="loading">Loading...</p>} */}

            {error && <p className="error">Error: {error.message}</p>}

            <div className="users-grid">
                {users.map((user) => (
                    <div className="user-card" key={user._id}>

                        {/* Avatar */}
                        <div style={{ margin: 'auto' }} className="user-avatar">
                            {user.profilePic ?
                                <img className='profile-pic-circle' src={user.profilePic} /> : (user.name ? user.name.charAt(0).toUpperCase() : "U")}
                        </div>

                        {/* Info */}
                        <h3 className="user-name">{user.name || "Unknown User"}</h3>
                        <p className="user-username">@{user.username}</p>
                        <p className="user-email">{user.email}</p>

                        {/* Button */}
                        <button
                            className="view-btn"
                            onClick={() => navigate(`/user/profile/${user.username}`)}
                        >
                            View Profile →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UsersList;